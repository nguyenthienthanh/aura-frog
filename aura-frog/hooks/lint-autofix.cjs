#!/usr/bin/env node
/**
 * Aura Frog - Lint Auto-Fix Hook
 *
 * Fires: PostToolUse (after Write|Edit)
 * Purpose: Automatically run linters/formatters after file changes
 *
 * Supported:
 * - ESLint (.js, .jsx, .ts, .tsx, .vue)
 * - Prettier (all supported files)
 * - PHP CS Fixer (.php)
 * - Black/Ruff (.py)
 * - Go fmt (.go)
 * - Rubocop (.rb)
 * - rustfmt (.rs)
 *
 * Exit Codes:
 *   0 - Success (non-blocking)
 *
 * @version 1.0.0
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// File extension to linter mapping
const LINTER_MAP = {
  // JavaScript/TypeScript
  '.js': ['eslint', 'prettier'],
  '.jsx': ['eslint', 'prettier'],
  '.ts': ['eslint', 'prettier'],
  '.tsx': ['eslint', 'prettier'],
  '.mjs': ['eslint', 'prettier'],
  '.cjs': ['eslint', 'prettier'],
  '.vue': ['eslint', 'prettier'],
  '.svelte': ['eslint', 'prettier'],

  // CSS/Styling
  '.css': ['prettier', 'stylelint'],
  '.scss': ['prettier', 'stylelint'],
  '.less': ['prettier', 'stylelint'],

  // Web
  '.html': ['prettier'],
  '.json': ['prettier'],
  '.md': ['prettier'],
  '.yaml': ['prettier'],
  '.yml': ['prettier'],

  // PHP
  '.php': ['php-cs-fixer', 'pint'],

  // Python
  '.py': ['ruff', 'black'],

  // Go
  '.go': ['gofmt', 'goimports'],

  // Ruby
  '.rb': ['rubocop'],

  // Rust
  '.rs': ['rustfmt'],

  // Dart/Flutter
  '.dart': ['dart-format'],
};

// Linter commands with auto-fix flags
const LINTER_COMMANDS = {
  // JS/TS
  'eslint': {
    check: 'npx eslint --max-warnings 0',
    fix: 'npx eslint --fix',
    configFiles: ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', 'eslint.config.js', 'eslint.config.mjs'],
  },
  'prettier': {
    check: 'npx prettier --check',
    fix: 'npx prettier --write',
    configFiles: ['.prettierrc', '.prettierrc.js', '.prettierrc.json', 'prettier.config.js'],
  },
  'stylelint': {
    check: 'npx stylelint',
    fix: 'npx stylelint --fix',
    configFiles: ['.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', 'stylelint.config.js'],
  },

  // PHP
  'php-cs-fixer': {
    check: 'vendor/bin/php-cs-fixer fix --dry-run --diff',
    fix: 'vendor/bin/php-cs-fixer fix',
    configFiles: ['.php-cs-fixer.php', '.php-cs-fixer.dist.php', '.php_cs'],
  },
  'pint': {
    check: 'vendor/bin/pint --test',
    fix: 'vendor/bin/pint',
    configFiles: ['pint.json'],
  },

  // Python
  'ruff': {
    check: 'ruff check',
    fix: 'ruff check --fix',
    configFiles: ['ruff.toml', 'pyproject.toml'],
  },
  'black': {
    check: 'black --check',
    fix: 'black',
    configFiles: ['pyproject.toml'],
  },

  // Go
  'gofmt': {
    check: 'gofmt -l',
    fix: 'gofmt -w',
    configFiles: [],
  },
  'goimports': {
    check: 'goimports -l',
    fix: 'goimports -w',
    configFiles: [],
  },

  // Ruby
  'rubocop': {
    check: 'rubocop',
    fix: 'rubocop -A',
    configFiles: ['.rubocop.yml'],
  },

  // Rust
  'rustfmt': {
    check: 'rustfmt --check',
    fix: 'rustfmt',
    configFiles: ['rustfmt.toml', '.rustfmt.toml'],
  },

  // Dart
  'dart-format': {
    check: 'dart format --set-exit-if-changed',
    fix: 'dart format',
    configFiles: [],
  },
};

/**
 * Check if a linter is available in the project
 */
function isLinterAvailable(linter) {
  const config = LINTER_COMMANDS[linter];
  if (!config) return false;

  // Check for config files
  if (config.configFiles.length > 0) {
    const hasConfig = config.configFiles.some(file => {
      return fs.existsSync(path.join(process.cwd(), file));
    });
    if (hasConfig) return true;
  }

  // Check package.json for JS tools
  if (['eslint', 'prettier', 'stylelint'].includes(linter)) {
    try {
      const pkgPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        return linter in deps;
      }
    } catch { /* ignore */ }
  }

  // Check composer.json for PHP tools
  if (['php-cs-fixer', 'pint'].includes(linter)) {
    try {
      const composerPath = path.join(process.cwd(), 'composer.json');
      if (fs.existsSync(composerPath)) {
        const composer = JSON.parse(fs.readFileSync(composerPath, 'utf-8'));
        const deps = { ...composer.require, ...composer['require-dev'] };
        const pkgName = linter === 'pint' ? 'laravel/pint' : 'friendsofphp/php-cs-fixer';
        return pkgName in deps;
      }
    } catch { /* ignore */ }
  }

  // For system tools, check if command exists
  if (['gofmt', 'goimports', 'rubocop', 'rustfmt', 'dart-format', 'ruff', 'black'].includes(linter)) {
    try {
      execSync(`which ${linter.replace('-format', ' format').split(' ')[0]}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Run linter with auto-fix
 */
function runLinter(linter, filePath) {
  const config = LINTER_COMMANDS[linter];
  if (!config) return { success: true, skipped: true };

  try {
    const fixCmd = `${config.fix} "${filePath}"`;
    const result = spawnSync('sh', ['-c', fixCmd], {
      cwd: process.cwd(),
      timeout: 30000,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (result.status === 0) {
      return { success: true, fixed: true, linter };
    } else {
      return {
        success: false,
        linter,
        error: result.stderr || result.stdout,
      };
    }
  } catch (error) {
    return { success: false, linter, error: error.message };
  }
}

/**
 * Get available linters for a file
 */
function getAvailableLinters(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const potentialLinters = LINTER_MAP[ext] || [];

  return potentialLinters.filter(linter => isLinterAvailable(linter));
}

/**
 * Main hook execution
 */
async function main() {
  // Check if auto-fix is enabled (default: true)
  if (process.env.AF_LINT_AUTOFIX === 'false') {
    process.exit(0);
  }

  try {
    const filePath = process.env.CLAUDE_FILE_PATHS;

    if (!filePath) {
      process.exit(0);
    }

    // Skip non-existent files
    if (!fs.existsSync(filePath)) {
      process.exit(0);
    }

    // Skip certain directories
    const skipDirs = ['node_modules', 'vendor', 'dist', 'build', '.git', '__pycache__'];
    if (skipDirs.some(dir => filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`))) {
      process.exit(0);
    }

    // Get available linters
    const linters = getAvailableLinters(filePath);

    if (linters.length === 0) {
      process.exit(0);
    }

    // Run linters
    const results = [];
    for (const linter of linters) {
      const result = runLinter(linter, filePath);
      if (!result.skipped) {
        results.push(result);
      }
    }

    // Report results
    const fixed = results.filter(r => r.fixed);
    const failed = results.filter(r => !r.success && !r.fixed);

    if (fixed.length > 0) {
      const linterNames = fixed.map(r => r.linter).join(', ');
      console.log(`🔧 Auto-fixed: ${linterNames}`);
    }

    if (failed.length > 0) {
      for (const f of failed) {
        console.error(`⚠️ ${f.linter} issues: ${(f.error || '').substring(0, 100)}`);
      }
    }

    process.exit(0);
  } catch (error) {
    // Non-blocking
    process.exit(0);
  }
}

module.exports = { getAvailableLinters, isLinterAvailable, runLinter };

if (require.main === module) {
  main();
}
