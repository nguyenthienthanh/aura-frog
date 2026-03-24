#!/usr/bin/env node
/**
 * auto-test-runner.cjs - Auto-run tests after implementation changes
 *
 * PostToolUse hook on Write|Edit. Runs async.
 * Only activates during TDD phases (2-Test RED, 3-Build GREEN, 4-Refactor).
 * Detects test runner from project config and runs related tests.
 *
 * Exit codes:
 * - 0: Always (non-blocking, async)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { readSessionState } = require('./lib/af-config-utils.cjs');

// TDD phases where auto-testing is relevant
const TDD_PHASES = ['2', '3', '4'];

// Max test execution time (30 seconds)
const TEST_TIMEOUT = 30000;

/**
 * Detect test runner from project files
 */
function detectTestRunner() {
  // Node.js projects
  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const scripts = pkg.scripts || {};
      const devDeps = { ...(pkg.devDependencies || {}), ...(pkg.dependencies || {}) };

      if (devDeps.vitest || scripts.test?.includes('vitest')) return { cmd: 'npx vitest run', name: 'vitest' };
      if (devDeps.jest || scripts.test?.includes('jest')) return { cmd: 'npx jest --passWithNoTests', name: 'jest' };
      if (scripts.test) return { cmd: 'npm test', name: 'npm test' };
    } catch { /* malformed data - skip silently, fall through to other detectors */ }
  }

  // Python projects
  if (fs.existsSync('pyproject.toml') || fs.existsSync('setup.py')) {
    if (fs.existsSync('pyproject.toml')) {
      try {
        const content = fs.readFileSync('pyproject.toml', 'utf-8');
        if (content.includes('pytest')) return { cmd: 'python -m pytest -x -q', name: 'pytest' };
      } catch { /* malformed data - skip silently, fall through to default pytest */ }
    }
    return { cmd: 'python -m pytest -x -q', name: 'pytest' };
  }

  // Go projects
  if (fs.existsSync('go.mod')) return { cmd: 'go test ./...', name: 'go test' };

  // Rust projects
  if (fs.existsSync('Cargo.toml')) return { cmd: 'cargo test', name: 'cargo test' };

  // PHP projects
  if (fs.existsSync('phpunit.xml') || fs.existsSync('phpunit.xml.dist')) {
    return { cmd: 'php vendor/bin/phpunit', name: 'phpunit' };
  }
  if (fs.existsSync('artisan')) return { cmd: 'php artisan test', name: 'artisan test' };

  return null;
}

/**
 * Check if the changed file is test-relevant
 */
function isTestRelevant(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const codeExts = new Set(['.js', '.ts', '.tsx', '.jsx', '.py', '.go', '.rs', '.php', '.rb', '.vue', '.svelte']);
  return codeExts.has(ext);
}

try {
  const filePath = process.env.CLAUDE_FILE_PATHS || '';
  if (!filePath || !isTestRelevant(filePath)) process.exit(0);

  // Check if we're in a TDD phase
  const sessionId = process.ppid?.toString();
  const state = readSessionState(sessionId);
  const currentPhase = state?.phase || process.env.AF_CURRENT_PHASE;

  // In TDD phase: always run. Outside workflow: only if editing a test file
  const inTddPhase = currentPhase && TDD_PHASES.includes(currentPhase);
  const isTestFile = /\.(test|spec|_test)\.[^.]+$/.test(filePath) || /\/__tests__\//.test(filePath);
  if (!inTddPhase && !isTestFile) {
    process.exit(0);
  }

  const runner = detectTestRunner();
  if (!runner) process.exit(0);

  // Run tests
  try {
    const result = execSync(runner.cmd, {
      timeout: TEST_TIMEOUT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Extract summary line
    const lines = result.trim().split('\n');
    const summary = lines.slice(-3).join(' | ');
    console.error(`✅ Auto-test (${runner.name}): ${summary.substring(0, 120)}`);
  } catch (err) {
    const stderr = err.stderr || '';
    const stdout = err.stdout || '';
    const output = (stderr + stdout).trim().split('\n');
    const summary = output.slice(-3).join(' | ');
    console.error(`❌ Auto-test (${runner.name}): Tests failing`);
    console.error(`   ${summary.substring(0, 150)}`);
  }

  process.exit(0);

} catch (error) {
  process.exit(0); // Fail open
}
