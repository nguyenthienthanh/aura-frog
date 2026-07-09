#!/usr/bin/env node
/**
 * Aura Frog - SessionStart Hook
 *
 * Fires: Once per session (startup, resume, clear, compact)
 * Purpose: Load config, detect project info, inject env vars, output context
 *
 * Injected Environment Variables:
 *   AF_SESSION_ID        - Current session identifier
 *   AF_PROJECT_TYPE      - monorepo | library | single-repo
 *   AF_PACKAGE_MANAGER   - npm | pnpm | yarn | bun | composer | poetry | go | cargo
 *   AF_FRAMEWORK         - nextjs | react | vue | laravel | django | etc.
 *   AF_ACTIVE_PLAN       - Explicitly active plan path (directive)
 *   AF_SUGGESTED_PLAN    - Branch-matched plan path (hint only)
 *   AF_REPORTS_PATH      - Where to save reports
 *   AF_PLANS_PATH        - Plans directory
 *   AF_WORKFLOWS_PATH    - Workflows directory
 *   AF_GIT_BRANCH        - Current git branch
 *   AF_GIT_URL           - Git remote URL
 *   AF_NODE_VERSION      - Node.js version
 *   AF_PYTHON_VERSION    - Python version (if available)
 *   AF_PHP_VERSION       - PHP version (if available)
 *   AF_GO_VERSION        - Go version (if available)
 *   AF_GODOT_VERSION     - Godot version (if available, detected from project.godot)
 *   AF_OS_PLATFORM       - darwin | linux | win32
 *   AF_USER              - Current username
 *   AF_TIMEZONE          - System timezone
 *   AF_PLAN_NAMING       - Plan naming format
 *   AF_PLAN_DATE_FORMAT  - Date format for plans
 *   AF_PROJECT_ROOT      - Absolute path to project root
 *   AF_MEMORY_LOADED     - Whether memory was loaded (true/false)
 *   AF_MEMORY_COUNT      - Number of memory items loaded
 *   AF_MEMORY_ERROR      - Error message if memory loading failed
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 *
 * @version 1.1.0
 */

const fs = require('fs');
const { readStdinSafely } = require('./lib/safe-stdin.cjs');
const os = require('os');
const path = require('path');

const {
  loadConfig,
  detectProjectType,
  detectPackageManager,
  detectFramework,
  getNodeVersion,
  getPythonVersion,
  getPhpVersion,
  getGoVersion,
  getGodotVersion,
  getGitBranch,
  getGitRemoteUrl,
  resolvePlanPath,
  getReportsPath,
  resolveSessionId,
  writeSessionState,
  writeEnv
} = require('./lib/af-config-utils.cjs');

const { loadMemory } = require('./lib/af-memory-loader.cjs');

// Session cache config

const { findProjectRoot } = require('./lib/hook-runtime.cjs');
const SESSION_CACHE_FILE = path.join(findProjectRoot(), '.claude', 'cache', 'session-start-cache.json');
const SESSION_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const ENVRC_PATH = path.join(process.cwd(), '.envrc');

/**
 * Check if session cache is valid
 */
function getValidCache() {
  try {
    if (!fs.existsSync(SESSION_CACHE_FILE)) return null;

    const cache = JSON.parse(fs.readFileSync(SESSION_CACHE_FILE, 'utf-8'));
    const age = Date.now() - (cache.cachedAt || 0);

    // TTL expired
    if (age > SESSION_CACHE_TTL) return null;

    // .envrc changed since cache
    if (fs.existsSync(ENVRC_PATH)) {
      const envrcMtime = fs.statSync(ENVRC_PATH).mtimeMs;
      if (envrcMtime > (cache.cachedAt || 0)) return null;
    }

    return cache;
  } catch { return null; }
}

/**
 * Save session cache
 */
function saveSessionCache(data) {
  try {
    const cacheDir = path.dirname(SESSION_CACHE_FILE);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(SESSION_CACHE_FILE, JSON.stringify({ ...data, cachedAt: Date.now() }, null, 2));
  } catch { /* non-blocking */ }
}

/**
 * Emit a one-line banner when the persisted project-context cache is stale
 * (FEAT-008 / STORY-0013). Best-effort + non-blocking: any failure is swallowed
 * so it can never break session start. Disable with
 * AF_CONTEXT_STALE_BANNER_DISABLED=true.
 */
function emitContextStalenessBanner() {
  if (process.env.AF_CONTEXT_STALE_BANNER_DISABLED === 'true') return;
  try {
    // Prefer the durable snapshot (FEAT-008 / STORY-0014): if a fresh snapshot
    // exists, the session can reuse it instead of re-scanning the codebase.
    try {
      const snap = require('../scripts/context-snapshot.cjs');
      const meta = snap.readSnapshotMeta('.');
      if (meta) {
        if (snap.isSnapshotFresh('.')) {
          const at = (meta.gitHead || 'no-git').substring(0, 12);
          console.log(`📸 Project context snapshot is FRESH (git ${at}) — reuse it, no re-scan needed: ${snap.getSnapshotPath('.')}`);
        } else {
          console.log('📸 Project context snapshot is STALE — refresh with: node aura-frog/scripts/context-snapshot.cjs');
        }
        return; // snapshot verdict supersedes the raw-detection check
      }
    } catch { /* snapshot module optional — fall through to detection-cache check */ }

    const cache = require('./lib/af-project-cache.cjs');
    const detectionPath = cache.getDetectionPath();
    if (!fs.existsSync(detectionPath)) return; // nothing persisted yet — nothing to flag
    const raw = JSON.parse(fs.readFileSync(detectionPath, 'utf-8'));
    const s = cache.getCacheStaleness(raw, '.');
    if (s.stale && s.reason) {
      console.log(`🐸 Project context cache is stale (${s.reason}) — will rebuild on next scan. Run /project refresh to force now.`);
    }
  } catch { /* non-blocking */ }
}

/**
 * Build context summary for output (compact, single line)
 */
function buildContextOutput(config, detections, resolved, memoryResult) {
  const parts = [];

  // Project info
  if (detections.type) parts.push(`Type: ${detections.type}`);
  if (detections.pm) parts.push(`PM: ${detections.pm}`);
  if (detections.framework) parts.push(`Framework: ${detections.framework}`);

  // Plan status
  if (resolved.path) {
    if (resolved.resolvedBy === 'session') {
      parts.push(`Plan: ${path.basename(resolved.path)}`);
    } else if (resolved.resolvedBy === 'branch') {
      parts.push(`Suggested: ${path.basename(resolved.path)}`);
    }
  }

  // Memory status
  if (memoryResult?.loaded) {
    const cached = memoryResult.cached ? ' (cached)' : '';
    parts.push(`Memory: ${memoryResult.count} items${cached}`);
  }

  return parts.join(' | ');
}

/**
 * Main hook execution
 */
async function main() {
  try {
    // Read stdin for session data
    let data = {};
    try {
      const stdin = readStdinSafely();
      if (stdin) data = JSON.parse(stdin);
    } catch (e) { /* ignore stdin errors */ }

    const envFile = process.env.CLAUDE_ENV_FILE;
    const source = data.source || 'unknown';
    // Canonical key shared with every reader hook (ppid / AF_SESSION_ID) — NOT
    // data.session_id, which readers never see and which desynced this writer.
    const sessionId = resolveSessionId();

    // One-shot legacy migration: .aura/plans → .claude/plans (v3.7.3+).
    // Fires when only the legacy dir exists and AF_PLANS_DIR is unset.
    // Runs BEFORE any other hook reads plan state so downstream consumers
    // always see the canonical path. Loud notice; safe no-op otherwise.
    try {
      const { migrateLegacyPlansDir } = require('./lib/plans-dir.cjs');
      const migration = migrateLegacyPlansDir();
      if (migration.migrated) {
        console.log(`🐸 Migrated legacy .aura/plans → .claude/plans (v3.7.3 schema). Source: ${migration.from}`);
      } else if (migration.error) {
        console.log(`⚠️  Legacy .aura/plans migration failed: ${migration.error}. Run manually: mv .aura/plans .claude/plans`);
      }
    } catch { /* non-blocking */ }

    // Fast path: use cached session if valid (skips all detection)
    const cached = getValidCache();
    if (cached && envFile && source !== 'init') {
      // Apply cached env vars
      for (const [key, value] of Object.entries(cached.envVars || {})) {
        if (value) writeEnv(envFile, key, value);
      }
      console.log(`🐸 Session ${source} (cached). ${cached.contextSummary || ''}`);
      // Emit plugin prefix banner on cached fast-path too
      try {
        const pluginJsonPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');
        if (fs.existsSync(pluginJsonPath)) {
          const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
          const pluginPrefix = pluginData.name || 'aura-frog';
          console.log(`🔌 plugin-prefix: ${pluginPrefix} (use as subagent_type prefix: \`${pluginPrefix}:<agent-id>\` — see rules/core/agent-namespacing.md)`);
        }
      } catch {/* best-effort */}
      emitContextStalenessBanner();
      process.exit(0);
    }

    // Load cascading config
    const config = loadConfig();

    // Detect project info
    const detections = {
      type: detectProjectType(config.project?.type),
      pm: detectPackageManager(config.project?.packageManager),
      framework: detectFramework(config.project?.framework)
    };

    // Resolve plan path
    const resolved = resolvePlanPath(sessionId, config);

    // Save session state (only persist explicitly active plans)
    if (sessionId) {
      writeSessionState(sessionId, {
        sessionOrigin: process.cwd(),
        activePlan: resolved.resolvedBy === 'session' ? resolved.path : null,
        suggestedPlan: resolved.resolvedBy === 'branch' ? resolved.path : null,
        projectType: detections.type,
        packageManager: detections.pm,
        framework: detections.framework,
        timestamp: Date.now(),
        source
      });
    }

    // Calculate reports path
    const reportsPath = getReportsPath(resolved.path, resolved.resolvedBy, config);

    // Load memory from Supabase (non-blocking)
    let memoryResult = { loaded: false, count: 0, error: null };
    try {
      memoryResult = await loadMemory();
    } catch (e) {
      memoryResult.error = e.message;
    }

    // Collect static environment info
    const staticEnv = {
      nodeVersion: getNodeVersion(),
      pythonVersion: getPythonVersion(),
      phpVersion: getPhpVersion(),
      goVersion: getGoVersion(),
      godotVersion: getGodotVersion(),
      osPlatform: process.platform,
      gitBranch: getGitBranch(),
      gitUrl: getGitRemoteUrl(),
      user: process.env.USER || process.env.USERNAME || process.env.LOGNAME || os.userInfo().username,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      projectRoot: process.cwd()
    };

    // Write environment variables
    if (envFile) {
      // Session & project info
      writeEnv(envFile, 'AF_SESSION_ID', sessionId || '');
      writeEnv(envFile, 'AF_PROJECT_TYPE', detections.type || '');
      writeEnv(envFile, 'AF_PACKAGE_MANAGER', detections.pm || '');
      writeEnv(envFile, 'AF_FRAMEWORK', detections.framework || '');
      writeEnv(envFile, 'AF_PROJECT_ROOT', staticEnv.projectRoot);

      // Plan resolution
      writeEnv(envFile, 'AF_ACTIVE_PLAN', resolved.resolvedBy === 'session' ? resolved.path : '');
      writeEnv(envFile, 'AF_SUGGESTED_PLAN', resolved.resolvedBy === 'branch' ? resolved.path : '');
      writeEnv(envFile, 'AF_REPORTS_PATH', reportsPath);

      // Paths
      writeEnv(envFile, 'AF_PLANS_PATH', config.paths?.plans || 'plans');
      writeEnv(envFile, 'AF_WORKFLOWS_PATH', config.paths?.workflows || '.claude/logs/runs');

      // Plan config
      writeEnv(envFile, 'AF_PLAN_NAMING', config.plan?.namingFormat || '{date}-{slug}');
      writeEnv(envFile, 'AF_PLAN_DATE_FORMAT', config.plan?.dateFormat || 'YYMMDD');
      if (config.plan?.issuePrefix) {
        writeEnv(envFile, 'AF_PLAN_ISSUE_PREFIX', config.plan.issuePrefix);
      }

      // Git info
      writeEnv(envFile, 'AF_GIT_BRANCH', staticEnv.gitBranch || '');
      writeEnv(envFile, 'AF_GIT_URL', staticEnv.gitUrl || '');

      // Runtime versions
      writeEnv(envFile, 'AF_NODE_VERSION', staticEnv.nodeVersion || '');
      if (staticEnv.pythonVersion) writeEnv(envFile, 'AF_PYTHON_VERSION', staticEnv.pythonVersion);
      if (staticEnv.phpVersion) writeEnv(envFile, 'AF_PHP_VERSION', staticEnv.phpVersion);
      if (staticEnv.goVersion) writeEnv(envFile, 'AF_GO_VERSION', staticEnv.goVersion);
      if (staticEnv.godotVersion) writeEnv(envFile, 'AF_GODOT_VERSION', staticEnv.godotVersion);

      // System info
      writeEnv(envFile, 'AF_OS_PLATFORM', staticEnv.osPlatform);
      writeEnv(envFile, 'AF_USER', staticEnv.user);
      writeEnv(envFile, 'AF_TIMEZONE', staticEnv.timezone);

      // Locale config
      if (config.locale?.responseLanguage) {
        writeEnv(envFile, 'AF_RESPONSE_LANGUAGE', config.locale.responseLanguage);
      }

      // Memory status
      writeEnv(envFile, 'AF_MEMORY_LOADED', memoryResult.loaded ? 'true' : 'false');
      writeEnv(envFile, 'AF_MEMORY_COUNT', memoryResult.count.toString());
      if (memoryResult.error) {
        writeEnv(envFile, 'AF_MEMORY_ERROR', memoryResult.error);
      }
    }

    // Output context summary
    const contextSummary = buildContextOutput(config, detections, resolved, memoryResult);

    // Save session cache for fast path on next startup
    const envVars = {
      AF_SESSION_ID: sessionId || '',
      AF_PROJECT_TYPE: detections.type || '',
      AF_PACKAGE_MANAGER: detections.pm || '',
      AF_FRAMEWORK: detections.framework || '',
      AF_PROJECT_ROOT: staticEnv.projectRoot,
      AF_ACTIVE_PLAN: resolved.resolvedBy === 'session' ? resolved.path : '',
      AF_SUGGESTED_PLAN: resolved.resolvedBy === 'branch' ? resolved.path : '',
      AF_REPORTS_PATH: reportsPath,
      AF_PLANS_PATH: config.paths?.plans || 'plans',
      AF_WORKFLOWS_PATH: config.paths?.workflows || '.claude/logs/runs',
      AF_GIT_BRANCH: staticEnv.gitBranch || '',
      AF_GIT_URL: staticEnv.gitUrl || '',
      AF_NODE_VERSION: staticEnv.nodeVersion || '',
      AF_OS_PLATFORM: staticEnv.osPlatform,
      AF_USER: staticEnv.user,
      AF_TIMEZONE: staticEnv.timezone,
      AF_MEMORY_LOADED: memoryResult.loaded ? 'true' : 'false',
      AF_MEMORY_COUNT: memoryResult.count.toString()
    };
    if (staticEnv.pythonVersion) envVars.AF_PYTHON_VERSION = staticEnv.pythonVersion;
    if (staticEnv.phpVersion) envVars.AF_PHP_VERSION = staticEnv.phpVersion;
    if (staticEnv.goVersion) envVars.AF_GO_VERSION = staticEnv.goVersion;
    if (staticEnv.godotVersion) envVars.AF_GODOT_VERSION = staticEnv.godotVersion;
    if (config.locale?.responseLanguage) envVars.AF_RESPONSE_LANGUAGE = config.locale.responseLanguage;

    saveSessionCache({
      envVars,
      contextSummary: contextSummary || '',
      agent: 'ready',
      phase: '-'
    });

    if (contextSummary) {
      console.log(`🐸 Session ${source}. ${contextSummary}`);
    } else {
      console.log(`🐸 Session ${source}.`);
    }

    // Emit plugin prefix banner — single source of truth for Agent tool dispatch.
    // Skills/rules MUST use this prefix when invoking plugin agents (not the
    // hardcoded string "aura-frog"). See rules/core/agent-namespacing.md.
    try {
      const pluginJsonPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');
      if (fs.existsSync(pluginJsonPath)) {
        const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
        const pluginPrefix = pluginData.name || 'aura-frog';
        console.log(`🔌 plugin-prefix: ${pluginPrefix} (use as subagent_type prefix: \`${pluginPrefix}:<agent-id>\` — see rules/core/agent-namespacing.md)`);
      }
    } catch {/* best-effort; silent on failure */}

    emitContextStalenessBanner();

    // Check if statusLine is configured — one-time hint
    const statusHintFile = path.join(findProjectRoot(), '.claude', 'cache', 'statusline-hint-shown');
    if (!fs.existsSync(statusHintFile)) {
      try {
        // Check project settings for statusLine
        const settingsPath = path.join(findProjectRoot(), '.claude', 'settings.local.json');
        let hasStatusLine = false;
        if (fs.existsSync(settingsPath)) {
          const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
          hasStatusLine = !!settings.statusLine;
        }
        if (!hasStatusLine) {
          console.log('💡 Tip: Enable Aura Frog status line for always-visible agent/phase info (0 tokens). Run: project:sync-settings');
        }
        // Mark hint as shown
        const hintDir = path.dirname(statusHintFile);
        if (!fs.existsSync(hintDir)) fs.mkdirSync(hintDir, { recursive: true });
        fs.writeFileSync(statusHintFile, Date.now().toString());
      } catch { /* non-blocking */ }
    }

    // Detect stale ~/.claude/statusline-command.sh shim (pre-v3.7.3 layout).
    // Older installs hard-coded `│ P{phase} │` with AF_PHASE="-", which renders
    // a literal `P-` when no run is active. The plugin now ships the corrected
    // shim at aura-frog/scripts/statusline-shim.sh. We don't auto-write to the
    // user's home dir — print a one-time copyable command instead.
    try {
      const home = process.env.HOME || process.env.USERPROFILE;
      if (home) {
        const userShim = path.join(home, '.claude', 'statusline-command.sh');
        const staleHintFile = path.join(findProjectRoot(), '.claude', 'cache', 'statusline-stale-shim-hint-shown');
        if (fs.existsSync(userShim) && !fs.existsSync(staleHintFile)) {
          const shimContent = fs.readFileSync(userShim, 'utf-8');
          // Stale markers: hard-coded `│ P%s │` printf, or AF_PHASE="-" default.
          const isStale = /\|\s*P%s\s*\|/.test(shimContent) || /AF_PHASE\s*=\s*"-"/.test(shimContent);
          if (isStale) {
            const pluginShim = path.join(home, '.claude', 'plugins', 'marketplaces', 'aurafrog', 'aura-frog', 'scripts', 'statusline-shim.sh');
            console.log('⚠️  Detected stale ~/.claude/statusline-command.sh (renders `P-` instead of mode/step/agent).');
            console.log(`   Fix:  cp '${pluginShim}' '${userShim}' && chmod +x '${userShim}'`);
            console.log('   Or point settings.json directly at the plugin: see aura-frog/settings.example.json');
            try {
              const hintDir = path.dirname(staleHintFile);
              if (!fs.existsSync(hintDir)) fs.mkdirSync(hintDir, { recursive: true });
              fs.writeFileSync(staleHintFile, Date.now().toString());
            } catch { /* non-blocking */ }
          }
        }
      }
    } catch { /* non-blocking */ }

    // Show user assertions if configured
    if (config.assertions?.length > 0) {
      console.log('\nUser Assertions:');
      config.assertions.forEach((assertion, i) => {
        console.log(`  ${i + 1}. ${assertion}`);
      });
    }

    // Retention sweep — prune audit/trace JSONL entries older than
    // AF_AUDIT_RETENTION_DAYS (default 30). Async (fire and forget).
    try { sweepRetention(); } catch { /* non-blocking */ }

    process.exit(0);
  } catch (error) {
    console.error(`🐸 SessionStart hook error: ${error.message}`);
    process.exit(0); // Non-blocking
  }
}

/**
 * Prune append-only JSONL stores (mcp-audit, plan traces, metrics sessions) to
 * keep them from growing unbounded. Filters in-place by parsing each line's
 * `ts` field (ISO-8601) and dropping entries older than the retention window.
 * Drops the entire file if every line is expired.
 *
 * Disable: AF_AUDIT_RETENTION_DAYS=0 keeps everything.
 * Tune:    AF_AUDIT_RETENTION_DAYS=N (default 30).
 */
function sweepRetention() {
  const retentionDays = parseInt(process.env.AF_AUDIT_RETENTION_DAYS || '30', 10);
  if (!retentionDays || retentionDays <= 0) return;
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  const resolvePlansDir = require('./lib/plans-dir.cjs');
  const plansDir = resolvePlansDir();
  const targets = [
    // MCP audit lives under .aura/security/ by design (security domain stays
    // separate from plans). Plan traces follow the v3.7.3 .claude/plans path,
    // with legacy .aura/plans honored via the resolver.
    path.join(findProjectRoot(), '.aura', 'security', 'mcp-audit.jsonl'),
    ...listFiles(path.join(plansDir, 'traces')),
    ...listFiles(path.join(findProjectRoot(), '.claude', 'metrics', 'sessions')),
  ];

  for (const file of targets) {
    pruneJsonlByTimestamp(file, cutoff);
  }
}

function listFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.jsonl') || f.endsWith('.json'))
      .map(f => path.join(dir, f));
  } catch {
    return [];
  }
}

function pruneJsonlByTimestamp(file, cutoffMs) {
  try {
    if (!fs.existsSync(file)) return;
    const stat = fs.statSync(file);
    // Cheap pre-check: if mtime is recent, nothing has aged out since last sweep.
    if (stat.mtimeMs > cutoffMs && stat.size < 1024 * 1024) return;

    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const kept = [];
    let dropped = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      let ts;
      try {
        const obj = JSON.parse(line);
        ts = obj.ts || obj.timestamp || obj.lastUpdated;
      } catch {
        // Malformed line — keep it (don't silently destroy unparseable data).
        kept.push(line);
        continue;
      }
      const ms = ts ? Date.parse(ts) : NaN;
      if (Number.isFinite(ms) && ms < cutoffMs) {
        dropped++;
      } else {
        kept.push(line);
      }
    }
    if (dropped === 0) return;

    if (kept.length === 0) {
      fs.unlinkSync(file);
    } else {
      // Atomic write — never half-replace a JSONL store.
      const tmp = `${file}.tmp-${process.pid}`;
      fs.writeFileSync(tmp, kept.join('\n') + '\n');
      fs.renameSync(tmp, file);
    }
  } catch { /* best-effort; never block startup */ }
}

main();
