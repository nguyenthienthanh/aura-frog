#!/usr/bin/env node
/**
 * Aura Frog — JIRA Auto-Fetch
 *
 * Fires: UserPromptSubmit (async)
 * Purpose: Detect JIRA ticket patterns ([A-Z]{2,}-[0-9]+) in user prompts and
 *          fetch ticket data via scripts/jira-fetch.sh. Caches per-project at
 *          .claude/logs/jira/{TICKET_ID}.json with 24h TTL. Surfaces a 1-line
 *          summary per ticket to stderr (Claude reads stderr; user usually doesn't).
 *
 * Behavior:
 *   - Silent if no [A-Z]{2,}-[0-9]+ tokens in prompt
 *   - Silent if JIRA env not configured (one-time hint per session via flag file)
 *   - Cap: 3 unique tickets per prompt (anti-fatigue)
 *   - Cache 24h TTL per ticket
 *   - Optional JIRA_PROJECT_PREFIXES env (comma-separated allowlist) to filter
 *     out false positives like UTF-8, RFC-123, HTTP-200
 *
 * Why this hook exists:
 *   Prior to v3.7.0-alpha.4, the jira-fetch.sh script was unwired — users had
 *   to invoke it manually. Hook docs (pre-phase.md, post-phase.md) referenced
 *   state.context.jira_ticket as if auto-populated, but nothing populated it.
 *
 * Exit codes:
 *   0 — always (non-blocking; this is informational context, not a guard)
 *
 * @version 1.0.0 (v3.7.0-alpha.4)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PROJECT_CACHE_DIR = path.join(process.cwd(), '.claude', 'logs', 'jira');
const SESSION_HINT_FLAG = path.join(process.cwd(), '.claude', 'logs', '.jira-env-hint-shown');

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_TICKETS_PER_PROMPT = 3;
const TICKET_PATTERN = /\b([A-Z]{2,10})-(\d{1,6})\b/g;

function safeExit(code = 0) { process.exit(code); }

function readPrompt() {
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf-8').trim();
  } catch {/* no stdin */}
  if (input) {
    try {
      const data = JSON.parse(input);
      return data.prompt || data.user_prompt || '';
    } catch {
      return input;
    }
  }
  return process.env.CLAUDE_USER_PROMPT || '';
}

function extractTickets(prompt) {
  const found = new Set();
  let m;
  TICKET_PATTERN.lastIndex = 0;
  while ((m = TICKET_PATTERN.exec(prompt)) !== null) {
    found.add(`${m[1]}-${m[2]}`);
  }
  return Array.from(found);
}

function applyProjectAllowlist(tickets) {
  const raw = process.env.JIRA_PROJECT_PREFIXES;
  if (!raw) return tickets;
  const allowed = new Set(raw.split(',').map(s => s.trim().toUpperCase()).filter(Boolean));
  if (allowed.size === 0) return tickets;
  return tickets.filter(t => allowed.has(t.split('-')[0]));
}

function envConfigured() {
  return Boolean(process.env.JIRA_BASE_URL && process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN);
}

function cachePath(ticketId) {
  return path.join(PROJECT_CACHE_DIR, `${ticketId}.json`);
}

function cacheFresh(ticketId) {
  const p = cachePath(ticketId);
  if (!fs.existsSync(p)) return false;
  try {
    const stat = fs.statSync(p);
    return (Date.now() - stat.mtimeMs) < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

function fetchTicket(ticketId) {
  const baseUrl = process.env.JIRA_BASE_URL.replace(/\/$/, '');
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
  const url = `${baseUrl}/rest/api/3/issue/${ticketId}?fields=summary,description,status,priority,assignee,reporter,labels,components,fixVersions,parent,subtasks,issuelinks,comment,issuetype,created,updated`;
  try {
    const out = execFileSync('curl', [
      '-sf', '--max-time', '10',
      '-H', `Authorization: Basic ${auth}`,
      '-H', 'Accept: application/json',
      url,
    ], { encoding: 'utf-8', timeout: 12000 });
    JSON.parse(out);
    return out;
  } catch (err) {
    const safe = String(err.code || err.status || err.signal || 'failed');
    process.stderr.write(`[jira-auto-fetch] WARN: fetch failed for ${ticketId} (${safe})\n`);
    return null;
  }
}

function readCachedSummary(ticketId) {
  try {
    const raw = fs.readFileSync(cachePath(ticketId), 'utf-8');
    const data = JSON.parse(raw);
    const summary = data?.fields?.summary || data.summary || '';
    const status = data?.fields?.status?.name || data.status || '';
    return { summary, status };
  } catch {
    return { summary: '', status: '' };
  }
}

function writeCacheFromFetch(ticketId, rawJsonString) {
  if (!fs.existsSync(PROJECT_CACHE_DIR)) fs.mkdirSync(PROJECT_CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath(ticketId), rawJsonString);
}

function showEnvHintOnce() {
  try {
    if (fs.existsSync(SESSION_HINT_FLAG)) return;
    fs.mkdirSync(path.dirname(SESSION_HINT_FLAG), { recursive: true });
    fs.writeFileSync(SESSION_HINT_FLAG, new Date().toISOString());
    process.stderr.write(
      `[jira-auto-fetch] Detected ticket pattern but JIRA env not set.\n` +
      `  To enable auto-fetch: export JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN in .envrc\n` +
      `  See aura-frog/.envrc.template for the full list.\n`
    );
  } catch {/* best-effort */}
}

function main() {
  const prompt = readPrompt();
  if (!prompt) safeExit(0);

  const tickets = applyProjectAllowlist(extractTickets(prompt));
  if (tickets.length === 0) safeExit(0);

  const limited = tickets.slice(0, MAX_TICKETS_PER_PROMPT);

  if (!envConfigured()) {
    showEnvHintOnce();
    safeExit(0);
  }

  const lines = [];
  for (const ticketId of limited) {
    if (!cacheFresh(ticketId)) {
      const out = fetchTicket(ticketId);
      if (out) writeCacheFromFetch(ticketId, out);
    }
    const { summary, status } = readCachedSummary(ticketId);
    if (summary) {
      lines.push(`  ${ticketId} [${status || '?'}] ${summary.slice(0, 120)}`);
    } else {
      lines.push(`  ${ticketId} (fetch failed or empty cache)`);
    }
  }

  if (tickets.length > MAX_TICKETS_PER_PROMPT) {
    lines.push(`  ... ${tickets.length - MAX_TICKETS_PER_PROMPT} more ticket(s) detected; cap at ${MAX_TICKETS_PER_PROMPT}/prompt`);
  }

  process.stderr.write(`[jira-auto-fetch | trust:file]\n${lines.join('\n')}\n`);
  safeExit(0);
}

main();
