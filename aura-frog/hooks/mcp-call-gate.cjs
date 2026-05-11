#!/usr/bin/env node
/**
 * Aura Frog — MCP Call Gate
 *
 * Fires: PreToolUse (mcp__.*)
 * Purpose: Per-agent allowlist + rate limit + audit logging for MCP calls.
 *          Blocks calls violating the allowlist or hitting hard rate limits.
 *
 * Behavior:
 *   - Resolve calling agent from CLAUDE_AGENT_NAME env (or fall back to "main")
 *   - Read allowlist from agent's frontmatter `mcp_servers:` field
 *     (default: all MCPs allowed — backward-compat)
 *   - Block calls to disallowed MCPs (exit 2)
 *   - Track per-MCP rate counters; warn at 80% (soft); block at 100% (hard)
 *   - Run `scripts/security/sanitize-mcp-input.sh` on input before audit append
 *   - Append sanitized entry to .aura/security/mcp-audit.jsonl
 *
 * Configuration:
 *   AF_MCP_AUDIT_DISABLED=true     — skip audit (still enforce allowlist + rate limits)
 *   AF_MCP_AUDIT_RETENTION_DAYS=30 — pruning happens via session-start sweep, not here
 *   plugin.json#mcp_rate_limits     — per-MCP overrides
 *
 * Exit codes:
 *   0 — pass (call proceeds; audit appended)
 *   2 — BLOCK (allowlist violation OR hard rate limit hit)
 *
 * @version 1.0.0 (v3.7.0-rc.1)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const SANITIZER = path.join(PLUGIN_ROOT, 'scripts', 'security', 'sanitize-mcp-input.sh');
const PLUGIN_JSON = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
const AGENTS_DIR = path.join(PLUGIN_ROOT, 'agents');

const AUDIT_FILE = path.join(process.cwd(), '.aura', 'security', 'mcp-audit.jsonl');
const COUNTER_FILE = path.join(process.cwd(), '.claude', 'logs', '.mcp-rate-counter.json');

const DEFAULT_LIMITS = { max_calls_per_minute: 30, max_calls_per_session: 200 };
const HARD_BLOCK_LIMIT = 1.0;
const SOFT_WARN_LIMIT = 0.8;

function safeExit(code = 0) { process.exit(code); }

const toolName = process.env.CLAUDE_TOOL_NAME || '';
if (!toolName.startsWith('mcp__')) safeExit(0);

// Parse mcp__plugin_<plugin>_<server>__<method> or mcp__<server>__<method>.
// Server names MAY contain single underscores (e.g. "my_server"). Method names
// MAY contain double underscores; we anchor on the LAST literal "__" as the
// server↔method separator, then peel the plugin prefix from the head.
function parseMcpToolName(name) {
  const stripped = name.replace(/^mcp__/, '');
  const sepIndex = stripped.lastIndexOf('__');
  if (sepIndex <= 0) return null;
  const head = stripped.slice(0, sepIndex);
  const method = stripped.slice(sepIndex + 2);
  if (!method) return null;

  // Plugin-prefixed form: "plugin_<plugin>_<server>"
  // The plugin token cannot contain an underscore in Claude Code conventions,
  // so we strip exactly one token after "plugin_" to get the plugin id; the
  // rest is the server name (which may legally contain underscores).
  const pluginMatch = head.match(/^plugin_([^_]+)_(.+)$/);
  if (pluginMatch) return { server: pluginMatch[2], method };
  return { server: head, method };
}

const parsed = parseMcpToolName(toolName);
if (!parsed) safeExit(0);

// Resolve calling agent — Claude Code passes this via env when an agent is active
const agentName = process.env.CLAUDE_AGENT_NAME || 'main';

// Look up allowlist from agent file
function getAllowlist(agentId) {
  if (agentId === 'main' || !agentId) return null; // null = default = all allowed
  const candidatePaths = [
    path.join(AGENTS_DIR, `${agentId}.md`),
    path.join(AGENTS_DIR, 'reference', `${agentId}.md`),
    path.join(AGENTS_DIR, `${agentId.replace(/^aura-frog:/, '')}.md`),
  ];
  for (const p of candidatePaths) {
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    const m = content.match(/^mcp_servers:\s*\[([^\]]*)\]/m);
    if (m) return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  return null; // not declared → default all allowed (backward-compat)
}

// Look up rate limit from plugin.json
function getRateLimits(server) {
  try {
    const pkg = JSON.parse(fs.readFileSync(PLUGIN_JSON, 'utf8'));
    const limits = pkg.mcp_rate_limits || {};
    return limits[server] || limits.default || DEFAULT_LIMITS;
  } catch {
    return DEFAULT_LIMITS;
  }
}

// Counter management
function getCounters() {
  try { return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8')); }
  catch { return { session_start: Date.now(), per_server: {} }; }
}

function saveCounters(c) {
  try {
    fs.mkdirSync(path.dirname(COUNTER_FILE), { recursive: true });
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(c, null, 2));
  } catch {/* best-effort */}
}

function incrementCounter(server) {
  const c = getCounters();
  if (!c.per_server[server]) c.per_server[server] = { session: 0, last_minute: [] };
  const now = Date.now();
  c.per_server[server].session += 1;
  c.per_server[server].last_minute = (c.per_server[server].last_minute || []).filter(ts => (now - ts) < 60000);
  c.per_server[server].last_minute.push(now);
  saveCounters(c);
  return c.per_server[server];
}

// Allowlist check
const allowlist = getAllowlist(agentName);
if (allowlist !== null && !allowlist.includes(parsed.server)) {
  appendAudit({ blocked: true, reason: 'allowlist_violation' });
  process.stderr.write(
    `[mcp-call-gate] BLOCKED: agent="${agentName}" not in allowlist for MCP "${parsed.server}"\n` +
    `  declared allowlist: [${allowlist.join(', ') || 'empty'}]\n` +
    `  edit aura-frog/agents/${agentName}.md frontmatter mcp_servers: to allow\n`
  );
  safeExit(2);
}

// Rate limit check
const limits = getRateLimits(parsed.server);
const counter = incrementCounter(parsed.server);

const minuteUsage = counter.last_minute.length / limits.max_calls_per_minute;
const sessionUsage = counter.session / limits.max_calls_per_session;
const usage = Math.max(minuteUsage, sessionUsage);

if (usage >= HARD_BLOCK_LIMIT) {
  appendAudit({ blocked: true, reason: 'rate_limit_hard' });
  process.stderr.write(
    `[mcp-call-gate] BLOCKED: rate limit hit for "${parsed.server}"\n` +
    `  per-minute: ${counter.last_minute.length}/${limits.max_calls_per_minute}\n` +
    `  per-session: ${counter.session}/${limits.max_calls_per_session}\n` +
    `  to override: /aura-frog:mcp reset-limits --mcp ${parsed.server}\n`
  );
  safeExit(2);
}

if (usage >= SOFT_WARN_LIMIT) {
  process.stderr.write(
    `[mcp-call-gate] WARN: ${Math.round(usage * 100)}% of rate limit for "${parsed.server}" — slow down\n`
  );
}

appendAudit({ blocked: false });
safeExit(0);

// ---------- audit appender ----------

function appendAudit(extra) {
  if (process.env.AF_MCP_AUDIT_DISABLED === 'true') return;

  const argsRaw = process.env.CLAUDE_TOOL_ARGS || '{}';
  let sanitizedInput = argsRaw;
  if (fs.existsSync(SANITIZER)) {
    const result = spawnSync('bash', [SANITIZER], {
      input: argsRaw,
      encoding: 'utf-8',
      timeout: 1000,
    });
    if (result.stdout) sanitizedInput = result.stdout.trim();
  }

  let parsedInput;
  try { parsedInput = JSON.parse(sanitizedInput); }
  catch { parsedInput = { _raw: sanitizedInput.slice(0, 256) }; }

  const entry = {
    ts: new Date().toISOString(),
    agent: agentName,
    mcp: parsed.server,
    method: parsed.method,
    input: parsedInput,
    success: !extra.blocked,
    BLOCKED: extra.blocked || false,
    reason: extra.reason || null,
  };

  try {
    fs.mkdirSync(path.dirname(AUDIT_FILE), { recursive: true });
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + '\n');
  } catch {/* best-effort */}
}
