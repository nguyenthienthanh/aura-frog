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
const path = require('path');

// Default blocked patterns
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
  'bin',    // Go
  'obj',    // .NET
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
  const normalized = targetPath.replace(/\\/g, '/');
  return patterns.some(pattern => {
    const regex = new RegExp(`(^|/)${pattern}(/|$)`, 'i');
    return regex.test(normalized);
  });
}

/**
 * Check if command is an allowed build command
 */
function isAllowedBuildCommand(command) {
  return ALLOWED_COMMANDS.some(allowed => command.includes(allowed));
}

try {
  // Read hook input from stdin
  const input = fs.readFileSync(0, 'utf-8').trim();
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
    // Allow build commands
    if (isAllowedBuildCommand(command)) {
      process.exit(0);
    }

    // Block directory access commands
    const accessPatterns = ['cd ', 'ls ', 'cat ', 'head ', 'tail ', 'find ', 'grep '];
    const isAccessCommand = accessPatterns.some(p => command.includes(p));

    if (isAccessCommand) {
      for (const pattern of allPatterns) {
        if (command.includes(pattern)) {
          console.error(`⛔ Blocked: command accesses ${pattern}`);
          process.exit(2);
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

  // Allow the command
  process.exit(0);

} catch (error) {
  // On error, allow (fail open for safety)
  console.error('scout-block error:', error.message);
  process.exit(0);
}
