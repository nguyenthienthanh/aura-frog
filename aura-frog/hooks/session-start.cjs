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
  writeSessionState,
  writeEnv
} = require('./lib/af-config-utils.cjs');

const { loadMemory } = require('./lib/af-memory-loader.cjs');

// Session cache config
const SESSION_CACHE_FILE = path.join(process.cwd(), '.claude', 'cache', 'session-start-cache.json');
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
      const stdin = fs.readFileSync(0, 'utf-8').trim();
      if (stdin) data = JSON.parse(stdin);
    } catch (e) { /* ignore stdin errors */ }

    const envFile = process.env.CLAUDE_ENV_FILE;
    const source = data.source || 'unknown';
    const sessionId = data.session_id || process.ppid?.toString() || null;

    // Fast path: use cached session if valid (skips all detection)
    const cached = getValidCache();
    if (cached && envFile && source !== 'init') {
      // Apply cached env vars
      for (const [key, value] of Object.entries(cached.envVars || {})) {
        if (value) writeEnv(envFile, key, value);
      }
      console.log(`🐸 Session ${source} (cached). ${cached.contextSummary || ''}`);
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

    // Check if statusLine is configured — one-time hint
    const statusHintFile = path.join(process.cwd(), '.claude', 'cache', 'statusline-hint-shown');
    if (!fs.existsSync(statusHintFile)) {
      try {
        // Check project settings for statusLine
        const settingsPath = path.join(process.cwd(), '.claude', 'settings.local.json');
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

    // Show user assertions if configured
    if (config.assertions?.length > 0) {
      console.log('\nUser Assertions:');
      config.assertions.forEach((assertion, i) => {
        console.log(`  ${i + 1}. ${assertion}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error(`🐸 SessionStart hook error: ${error.message}`);
    process.exit(0); // Non-blocking
  }
}

main();
