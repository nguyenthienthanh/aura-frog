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
 *   AF_OS_PLATFORM       - darwin | linux | win32
 *   AF_USER              - Current username
 *   AF_TIMEZONE          - System timezone
 *   AF_PLAN_NAMING       - Plan naming format
 *   AF_PLAN_DATE_FORMAT  - Date format for plans
 *   AF_PROJECT_ROOT      - Absolute path to project root
 *
 * Exit Codes:
 *   0 - Success (non-blocking, allows continuation)
 *
 * @version 1.0.0
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
  getGitBranch,
  getGitRemoteUrl,
  resolvePlanPath,
  getReportsPath,
  writeSessionState,
  writeEnv
} = require('./lib/af-config-utils.cjs');

/**
 * Build context summary for output (compact, single line)
 */
function buildContextOutput(config, detections, resolved) {
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

    // Collect static environment info
    const staticEnv = {
      nodeVersion: getNodeVersion(),
      pythonVersion: getPythonVersion(),
      phpVersion: getPhpVersion(),
      goVersion: getGoVersion(),
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
      writeEnv(envFile, 'AF_WORKFLOWS_PATH', config.paths?.workflows || '.claude/logs/workflows');

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

      // System info
      writeEnv(envFile, 'AF_OS_PLATFORM', staticEnv.osPlatform);
      writeEnv(envFile, 'AF_USER', staticEnv.user);
      writeEnv(envFile, 'AF_TIMEZONE', staticEnv.timezone);

      // Locale config
      if (config.locale?.responseLanguage) {
        writeEnv(envFile, 'AF_RESPONSE_LANGUAGE', config.locale.responseLanguage);
      }
    }

    // Output context summary
    const contextSummary = buildContextOutput(config, detections, resolved);
    if (contextSummary) {
      console.log(`🐸 Session ${source}. ${contextSummary}`);
    } else {
      console.log(`🐸 Session ${source}.`);
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
