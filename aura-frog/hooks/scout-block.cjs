#!/usr/bin/env node

/**
 * scout-block.cjs - Block scanning of large/irrelevant directories
 *
 * Prevents wasteful token usage by blocking access to:
 * - node_modules, __pycache__, .git, dist, build, vendor
 * - Custom patterns from .afignore
 *
 * Exit codes:
 * - 0: Command allowed
 * - 2: Command blocked
 */

const fs = require('fs');
const { readStdinSafely } = require('./lib/safe-stdin.cjs');
const path = require('path');

// Default blocked patterns.
// Note: `bin` and `obj` are NOT included by default — they collide with
// legitimate Node `bin/` entrypoints, Go cmd/, and committed compiled assets.
// Projects that want them blocked can add them in `.afignore`.
const DEFAULT_BLOCKED = [
  'node_modules',
  '__pycache__',
  '.git',
  'dist',
  'build',
  'vendor',
  '.next',
  '.nuxt',
  'coverage',
  '.cache',
  '.turbo',
  'target', // Rust
];

// Build commands that should be allowed
const ALLOWED_COMMANDS = [
  'npm build',
  'npm run build',
  'yarn build',
  'pnpm build',
  'npx build',
  'go build',
  'cargo build',
  'dotnet build',
];

/**
 * Load custom patterns from .afignore
 */
function loadCustomPatterns(projectRoot) {
  const ignoreFile = path.join(projectRoot, '.afignore');
  if (fs.existsSync(ignoreFile)) {
    return fs.readFileSync(ignoreFile, 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }
  return [];
}

/**
 * Check if a path contains blocked directories
 */
function isBlocked(targetPath, patterns) {
  const normalized = targetPath.replace(/\\/g, '/').toLowerCase();
  const segments = normalized.split('/');
  return patterns.some(pattern => {
    const lowerPattern = pattern.toLowerCase();
    return segments.some(segment => segment === lowerPattern);
  });
}

/**
 * Check if command is an allowed build command
 */
function isAllowedBuildCommand(command) {
  return ALLOWED_COMMANDS.some(allowed => command.includes(allowed));
}

function main() {
  try {
    // Read hook input from stdin
    const input = readStdinSafely();
    if (!input) {
      process.exit(0); // Allow if no input
    }

    const data = JSON.parse(input);
    const toolInput = data.tool_input || {};

    // Get project root (current working directory)
    const projectRoot = process.cwd();

    // Load patterns
    const customPatterns = loadCustomPatterns(projectRoot);
    const allPatterns = [...DEFAULT_BLOCKED, ...customPatterns];

    // Check file_path parameter (Read, Write, Edit tools)
    const filePath = toolInput.file_path || toolInput.path || '';
    if (filePath && isBlocked(filePath, allPatterns)) {
      console.error(`⛔ Blocked: ${filePath} (contains blocked directory)`);
      process.exit(2);
    }

    // Check command parameter (Bash tool)
    const command = toolInput.command || '';
    if (command) {
      if (isAllowedBuildCommand(command)) {
        process.exit(0);
      }
      const firstLine = command.split('\n')[0];
      const accessPatterns = ['cd ', 'ls ', 'cat ', 'head ', 'tail ', 'find ', 'grep '];
      const isAccessCommand = accessPatterns.some(p => firstLine.includes(p));
      if (isAccessCommand) {
        const tokens = firstLine.split(/\s+/);
        for (const token of tokens) {
          if (token.includes('/') || token.includes('\\')) {
            if (token.startsWith('/usr/') || token.startsWith('/opt/') || token.startsWith('/etc/') || token.startsWith('/tmp/')) {
              continue;
            }
            if (isBlocked(token, allPatterns)) {
              const matched = allPatterns.find(p => {
                const segments = token.replace(/\\/g, '/').toLowerCase().split('/');
                return segments.some(s => s === p.toLowerCase());
              });
              console.error(`⛔ Blocked: command accesses ${matched}`);
              process.exit(2);
            }
          }
        }
      }
    }

    // Check pattern parameter (Glob, Grep tools)
    const pattern = toolInput.pattern || '';
    if (pattern && isBlocked(pattern, allPatterns)) {
      console.error(`⛔ Blocked: pattern ${pattern} (contains blocked directory)`);
      process.exit(2);
    }
    process.exit(0);
  } catch (error) {
    console.error('scout-block error:', error.message);
    process.exit(0);
  }
}

// Run main only when invoked as a script; export pure fns when require()'d.
if (require.main === module) {
  main();
} else {
  module.exports = {
    DEFAULT_BLOCKED,
    ALLOWED_COMMANDS,
    isBlocked,
    isAllowedBuildCommand,
    loadCustomPatterns,
  };
}
