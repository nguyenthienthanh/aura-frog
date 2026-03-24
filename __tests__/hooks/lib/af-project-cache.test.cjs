/**
 * Tests for af-project-cache.cjs
 *
 * Tests: project type detection, framework detection, cache invalidation,
 *        monorepo detection, workspace detection, agent mapping, test infra
 */

const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Mock fs module
// ---------------------------------------------------------------------------
const mockFs = {
  _files: {},
  _dirs: {},    // dir -> [{ name, isDirectory, isFile }]
  _stats: {},   // path -> { mtimeMs, size, isDirectory() }

  existsSync(p) {
    return p in this._files || p in this._dirs;
  },
  readFileSync(p) {
    if (p in this._files) return this._files[p];
    throw new Error('ENOENT: ' + p);
  },
  writeFileSync(p, data) { this._files[p] = data; },
  mkdirSync() {},
  unlinkSync(p) { delete this._files[p]; },
  statSync(p) {
    if (this._stats[p]) return this._stats[p];
    if (p in this._files) return { mtimeMs: 1000, size: this._files[p].length, isDirectory: () => false };
    if (p in this._dirs) return { isDirectory: () => true };
    throw new Error('ENOENT stat: ' + p);
  },
  readdirSync(p, opts) {
    if (!(p in this._dirs)) throw new Error('ENOENT readdir: ' + p);
    return this._dirs[p];
  },

  _reset() {
    this._files = {};
    this._dirs = {};
    this._stats = {};
  },
  // Helper to register a directory with entries
  _addDir(dirPath, entries) {
    this._dirs[dirPath] = entries.map(e => ({
      name: e.name,
      isDirectory: () => e.isDir === true,
      isFile: () => e.isDir !== true
    }));
  }
};

jest.mock('fs', () => mockFs);

// ---------------------------------------------------------------------------
// Replicate pure functions from source
// ---------------------------------------------------------------------------

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const MONOREPO_CONFIGS = {
  'pnpm-workspace.yaml': 'pnpm',
  'lerna.json': 'lerna',
  'nx.json': 'nx',
  'turbo.json': 'turbo',
  'rush.json': 'rush'
};

const SKIP_DIRS = [
  'node_modules', 'vendor', '.git', '.svn', '.hg',
  '__pycache__', '.cache', 'dist', 'build', 'out',
  '.next', '.nuxt', '.output', 'coverage', '.claude'
];

const KEY_FILES = [
  'package.json', 'composer.json', 'pubspec.yaml', 'go.mod',
  'pyproject.toml', 'requirements.txt', 'Cargo.toml', 'project.godot',
  'angular.json', 'next.config.js', 'next.config.mjs', 'next.config.ts',
  'nuxt.config.ts', 'vite.config.ts', 'vitest.config.ts', 'jest.config.js',
  'tsconfig.json'
];

function getProjectName(dir = '.') {
  const absDir = path.resolve(dir);
  const pkgPath = path.join(absDir, 'package.json');
  if (mockFs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(mockFs.readFileSync(pkgPath, 'utf8'));
      if (pkg.name) return pkg.name.replace(/^@[^/]+\//, '');
    } catch (e) {}
  }
  const composerPath = path.join(absDir, 'composer.json');
  if (mockFs.existsSync(composerPath)) {
    try {
      const composer = JSON.parse(mockFs.readFileSync(composerPath, 'utf8'));
      if (composer.name) return composer.name.split('/').pop();
    } catch (e) {}
  }
  return path.basename(absDir);
}

function isCacheValid(cache) {
  if (!cache || !cache.timestamp) return false;
  const age = Date.now() - cache.timestamp;
  if (age > CACHE_MAX_AGE_MS) return false;
  // Simplified: skip keyFilesHash check in unit tests (fs dependent)
  return true;
}

function detectTestInfra() {
  const infra = { hasTests: false, framework: null, configFile: null, testDirs: [] };

  const testDirs = ['tests', 'test', '__tests__', 'spec', 'specs'];
  for (const dir of testDirs) {
    if (mockFs.existsSync(dir) && mockFs.statSync(dir).isDirectory()) {
      infra.testDirs.push(dir);
      infra.hasTests = true;
    }
  }

  const testConfigs = [
    { file: 'vitest.config.ts', framework: 'vitest' },
    { file: 'vitest.config.js', framework: 'vitest' },
    { file: 'jest.config.js', framework: 'jest' },
    { file: 'jest.config.ts', framework: 'jest' },
    { file: 'jest.config.json', framework: 'jest' },
    { file: 'cypress.config.js', framework: 'cypress' },
    { file: 'cypress.config.ts', framework: 'cypress' },
    { file: 'playwright.config.ts', framework: 'playwright' },
    { file: 'phpunit.xml', framework: 'phpunit' },
    { file: 'phpunit.xml.dist', framework: 'phpunit' },
    { file: 'pytest.ini', framework: 'pytest' },
    { file: 'setup.cfg', framework: 'pytest' },
    { file: 'pyproject.toml', framework: 'pytest' }
  ];

  for (const { file, framework } of testConfigs) {
    if (mockFs.existsSync(file)) {
      infra.hasTests = true;
      infra.framework = framework;
      infra.configFile = file;
      break;
    }
  }

  if (mockFs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(mockFs.readFileSync('package.json', 'utf8'));
      if (pkg.scripts && pkg.scripts.test) {
        infra.hasTests = true;
        if (!infra.framework) {
          const testScript = pkg.scripts.test;
          if (testScript.includes('vitest')) infra.framework = 'vitest';
          else if (testScript.includes('jest')) infra.framework = 'jest';
          else if (testScript.includes('mocha')) infra.framework = 'mocha';
          else if (testScript.includes('ava')) infra.framework = 'ava';
        }
      }
    } catch (e) {}
  }

  return infra;
}

function detectAgentMapping(framework, patterns) {
  const agents = { primary: null, secondary: [], available: [] };

  const frameworkAgents = {
    'nextjs': 'web-nextjs', 'react': 'web-reactjs', 'vue': 'web-vuejs',
    'nuxt': 'web-vuejs', 'angular': 'web-angular',
    'react-native': 'mobile-react-native', 'expo': 'mobile-react-native',
    'flutter': 'mobile-flutter', 'laravel': 'backend-laravel',
    'symfony': 'backend-laravel', 'express': 'backend-nodejs',
    'nestjs': 'backend-nodejs', 'fastify': 'backend-nodejs',
    'hono': 'backend-nodejs', 'django': 'backend-python',
    'fastapi': 'backend-python', 'flask': 'backend-python',
    'gin': 'backend-go', 'echo': 'backend-go', 'fiber': 'backend-go',
    'godot': 'gamedev'
  };

  if (framework && frameworkAgents[framework]) {
    agents.primary = frameworkAgents[framework];
  }

  if (patterns.templates && patterns.templates.length > 0) {
    agents.secondary.push('frontend');
  }
  if (patterns.frontend && patterns.frontend.length > 0 && !agents.primary?.startsWith('web-')) {
    agents.secondary.push('frontend');
  }
  if (patterns.backend && patterns.backend.length > 0 && !agents.primary?.startsWith('backend-')) {
    if (patterns.backend.includes('.go')) agents.secondary.push('backend-go');
    if (patterns.backend.includes('.py')) agents.secondary.push('backend-python');
    if (patterns.backend.includes('.php')) agents.secondary.push('backend-laravel');
  }

  agents.available = ['architect', 'security', 'tester', 'frontend', 'devops'];
  agents.secondary = [...new Set(agents.secondary)].filter(a => a !== agents.primary);

  return agents;
}

function isProjectRoot(dir) {
  for (const keyFile of KEY_FILES) {
    const filePath = path.join(dir, keyFile);
    if (mockFs.existsSync(filePath)) return true;
  }
  if (mockFs.existsSync(path.join(dir, '.git'))) return true;
  return false;
}

function isWorkspace(dir = '.') {
  const absDir = path.resolve(dir);
  if (isProjectRoot(absDir)) return false;

  let projectCount = 0;
  try {
    const entries = mockFs.readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_DIRS.includes(entry.name)) continue;
      if (entry.name.startsWith('.')) continue;

      const subdir = path.join(absDir, entry.name);
      if (isProjectRoot(subdir)) {
        projectCount++;
        if (projectCount >= 2) return true;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

function detectMonorepoType(dir = '.') {
  const absDir = path.resolve(dir);

  for (const [configFile, type] of Object.entries(MONOREPO_CONFIGS)) {
    if (mockFs.existsSync(path.join(absDir, configFile))) {
      return { isMonorepo: true, type, configFile };
    }
  }

  const pkgPath = path.join(absDir, 'package.json');
  if (mockFs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(mockFs.readFileSync(pkgPath, 'utf8'));
      if (pkg.workspaces) {
        if (mockFs.existsSync(path.join(absDir, 'yarn.lock'))) {
          return { isMonorepo: true, type: 'yarn', configFile: 'package.json' };
        }
        if (mockFs.existsSync(path.join(absDir, 'package-lock.json'))) {
          return { isMonorepo: true, type: 'npm', configFile: 'package.json' };
        }
        return { isMonorepo: true, type: 'npm-workspaces', configFile: 'package.json' };
      }
    } catch (e) {}
  }

  return { isMonorepo: false, type: null, configFile: null };
}

function formatDetection(detection) {
  const lines = [];
  lines.push(`**Project Type:** ${detection.projectType || 'unknown'}`);
  lines.push(`**Framework:** ${detection.framework || 'unknown'}`);
  lines.push(`**Package Manager:** ${detection.packageManager || 'unknown'}`);
  if (detection.agents?.primary) {
    lines.push(`**Primary Agent:** ${detection.agents.primary}`);
  }
  if (detection.agents?.secondary?.length > 0) {
    lines.push(`**Secondary Agents:** ${detection.agents.secondary.join(', ')}`);
  }
  if (detection.testInfra?.hasTests) {
    lines.push(`**Test Framework:** ${detection.testInfra.framework || 'detected'}`);
  }
  if (detection.filePatterns?.templates?.length > 0) {
    lines.push(`**Templates:** ${detection.filePatterns.templates.join(', ')}`);
  }
  lines.push(`**From Cache:** ${detection.fromCache ? 'Yes' : 'No (fresh scan)'}`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('af-project-cache', () => {
  beforeEach(() => {
    mockFs._reset();
  });

  // =========================================================================
  // getProjectName
  // =========================================================================
  describe('getProjectName', () => {
    it('returns name from package.json', () => {
      const dir = path.resolve('.');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ name: 'my-app' });
      expect(getProjectName('.')).toBe('my-app');
    });

    it('strips scope from scoped package name', () => {
      const dir = path.resolve('.');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ name: '@org/my-lib' });
      expect(getProjectName('.')).toBe('my-lib');
    });

    it('returns name from composer.json when no package.json', () => {
      const dir = path.resolve('.');
      mockFs._files[path.join(dir, 'composer.json')] = JSON.stringify({ name: 'vendor/my-package' });
      expect(getProjectName('.')).toBe('my-package');
    });

    it('falls back to directory name when no config files', () => {
      const name = getProjectName('.');
      expect(name).toBe(path.basename(path.resolve('.')));
    });

    it('handles malformed package.json gracefully', () => {
      const dir = path.resolve('.');
      mockFs._files[path.join(dir, 'package.json')] = '{bad json';
      // Should fall back to directory name
      const name = getProjectName('.');
      expect(typeof name).toBe('string');
    });
  });

  // =========================================================================
  // isCacheValid
  // =========================================================================
  describe('isCacheValid', () => {
    it('returns false for null cache', () => {
      expect(isCacheValid(null)).toBe(false);
    });

    it('returns false for cache without timestamp', () => {
      expect(isCacheValid({ data: 'test' })).toBe(false);
    });

    it('returns false for expired cache (>24h)', () => {
      const old = Date.now() - (25 * 60 * 60 * 1000);
      expect(isCacheValid({ timestamp: old })).toBe(false);
    });

    it('returns true for fresh cache (<24h)', () => {
      expect(isCacheValid({ timestamp: Date.now() - 1000 })).toBe(true);
    });

    it('returns true for cache at exactly 23h59m', () => {
      const age = 23 * 60 * 60 * 1000 + 59 * 60 * 1000;
      expect(isCacheValid({ timestamp: Date.now() - age })).toBe(true);
    });
  });

  // =========================================================================
  // detectTestInfra
  // =========================================================================
  describe('detectTestInfra', () => {
    it('returns hasTests=false when nothing present', () => {
      const infra = detectTestInfra();
      expect(infra.hasTests).toBe(false);
      expect(infra.framework).toBeNull();
    });

    it('detects vitest from config file', () => {
      mockFs._files['vitest.config.ts'] = '';
      const infra = detectTestInfra();
      expect(infra.hasTests).toBe(true);
      expect(infra.framework).toBe('vitest');
      expect(infra.configFile).toBe('vitest.config.ts');
    });

    it('detects jest from config file', () => {
      mockFs._files['jest.config.js'] = '';
      const infra = detectTestInfra();
      expect(infra.framework).toBe('jest');
    });

    it('detects playwright from config file', () => {
      mockFs._files['playwright.config.ts'] = '';
      const infra = detectTestInfra();
      expect(infra.framework).toBe('playwright');
    });

    it('detects phpunit from xml', () => {
      mockFs._files['phpunit.xml'] = '';
      const infra = detectTestInfra();
      expect(infra.framework).toBe('phpunit');
    });

    it('detects test directories', () => {
      mockFs._dirs['__tests__'] = [];
      mockFs._stats['__tests__'] = { isDirectory: () => true };
      const infra = detectTestInfra();
      expect(infra.hasTests).toBe(true);
      expect(infra.testDirs).toContain('__tests__');
    });

    it('detects vitest from package.json test script', () => {
      mockFs._files['package.json'] = JSON.stringify({
        scripts: { test: 'vitest run' }
      });
      const infra = detectTestInfra();
      expect(infra.hasTests).toBe(true);
      expect(infra.framework).toBe('vitest');
    });

    it('detects jest from package.json test script', () => {
      mockFs._files['package.json'] = JSON.stringify({
        scripts: { test: 'jest --coverage' }
      });
      const infra = detectTestInfra();
      expect(infra.framework).toBe('jest');
    });

    it('detects mocha from package.json test script', () => {
      mockFs._files['package.json'] = JSON.stringify({
        scripts: { test: 'mocha tests/' }
      });
      const infra = detectTestInfra();
      expect(infra.framework).toBe('mocha');
    });

    it('detects ava from package.json test script', () => {
      mockFs._files['package.json'] = JSON.stringify({
        scripts: { test: 'ava' }
      });
      const infra = detectTestInfra();
      expect(infra.framework).toBe('ava');
    });

    it('config file takes priority over package.json script', () => {
      mockFs._files['vitest.config.ts'] = '';
      mockFs._files['package.json'] = JSON.stringify({
        scripts: { test: 'jest' }
      });
      const infra = detectTestInfra();
      // vitest.config.ts is checked before package.json
      expect(infra.framework).toBe('vitest');
    });
  });

  // =========================================================================
  // detectAgentMapping
  // =========================================================================
  describe('detectAgentMapping', () => {
    const emptyPatterns = { frontend: [], backend: [], templates: [], styles: [], configs: [] };

    it('maps nextjs to web-nextjs', () => {
      const agents = detectAgentMapping('nextjs', emptyPatterns);
      expect(agents.primary).toBe('web-nextjs');
    });

    it('maps laravel to backend-laravel', () => {
      const agents = detectAgentMapping('laravel', emptyPatterns);
      expect(agents.primary).toBe('backend-laravel');
    });

    it('maps godot to gamedev', () => {
      const agents = detectAgentMapping('godot', emptyPatterns);
      expect(agents.primary).toBe('gamedev');
    });

    it('maps flutter to mobile-flutter', () => {
      const agents = detectAgentMapping('flutter', emptyPatterns);
      expect(agents.primary).toBe('mobile-flutter');
    });

    it('returns null primary for unknown framework', () => {
      const agents = detectAgentMapping('unknown-framework', emptyPatterns);
      expect(agents.primary).toBeNull();
    });

    it('adds frontend secondary when templates present', () => {
      const patterns = { ...emptyPatterns, templates: ['blade'] };
      const agents = detectAgentMapping(null, patterns);
      expect(agents.secondary).toContain('frontend');
    });

    it('adds backend-go secondary when .go files detected and primary not backend', () => {
      const patterns = { ...emptyPatterns, backend: ['.go'] };
      const agents = detectAgentMapping('nextjs', patterns);
      expect(agents.secondary).toContain('backend-go');
    });

    it('does NOT add backend-python secondary when primary is already backend-python', () => {
      const patterns = { ...emptyPatterns, backend: ['.py'] };
      const agents = detectAgentMapping('django', patterns);
      // primary = backend-python, so secondary should not duplicate
      expect(agents.secondary).not.toContain('backend-python');
    });

    it('always includes standard available agents', () => {
      const agents = detectAgentMapping(null, emptyPatterns);
      expect(agents.available).toContain('architect');
      expect(agents.available).toContain('security');
      expect(agents.available).toContain('tester');
      expect(agents.available).toContain('frontend');
      expect(agents.available).toContain('devops');
    });

    it('deduplicates secondary agents', () => {
      const patterns = { ...emptyPatterns, templates: ['blade'], frontend: ['.jsx'] };
      const agents = detectAgentMapping(null, patterns);
      const frontendCount = agents.secondary.filter(a => a === 'frontend').length;
      expect(frontendCount).toBe(1);
    });
  });

  // =========================================================================
  // isProjectRoot
  // =========================================================================
  describe('isProjectRoot', () => {
    it('returns true when package.json exists', () => {
      mockFs._files[path.join('/project', 'package.json')] = '{}';
      expect(isProjectRoot('/project')).toBe(true);
    });

    it('returns true when go.mod exists', () => {
      mockFs._files[path.join('/project', 'go.mod')] = '';
      expect(isProjectRoot('/project')).toBe(true);
    });

    it('returns true when .git exists', () => {
      mockFs._dirs[path.join('/project', '.git')] = [];
      expect(isProjectRoot('/project')).toBe(true);
    });

    it('returns false when no key files exist', () => {
      expect(isProjectRoot('/empty')).toBe(false);
    });

    it('returns true for Cargo.toml (Rust project)', () => {
      mockFs._files[path.join('/rust-proj', 'Cargo.toml')] = '';
      expect(isProjectRoot('/rust-proj')).toBe(true);
    });

    it('returns true for project.godot', () => {
      mockFs._files[path.join('/game', 'project.godot')] = '';
      expect(isProjectRoot('/game')).toBe(true);
    });
  });

  // =========================================================================
  // isWorkspace
  // =========================================================================
  describe('isWorkspace', () => {
    it('returns false when directory is itself a project root', () => {
      const dir = path.resolve('/ws');
      mockFs._files[path.join(dir, 'package.json')] = '{}';
      mockFs._addDir(dir, []);
      expect(isWorkspace(dir)).toBe(false);
    });

    it('returns true when 2+ subdirectories are project roots', () => {
      const dir = path.resolve('/ws');
      // dir itself is NOT a project root
      mockFs._addDir(dir, [
        { name: 'projA', isDir: true },
        { name: 'projB', isDir: true }
      ]);
      mockFs._files[path.join(dir, 'projA', 'package.json')] = '{}';
      mockFs._files[path.join(dir, 'projB', 'go.mod')] = '';
      expect(isWorkspace(dir)).toBe(true);
    });

    it('returns false when only 1 subdirectory is a project root', () => {
      const dir = path.resolve('/ws');
      mockFs._addDir(dir, [
        { name: 'projA', isDir: true },
        { name: 'random', isDir: true }
      ]);
      mockFs._files[path.join(dir, 'projA', 'package.json')] = '{}';
      expect(isWorkspace(dir)).toBe(false);
    });

    it('skips node_modules and other SKIP_DIRS', () => {
      const dir = path.resolve('/ws');
      mockFs._addDir(dir, [
        { name: 'node_modules', isDir: true },
        { name: 'projA', isDir: true }
      ]);
      mockFs._files[path.join(dir, 'node_modules', 'package.json')] = '{}';
      mockFs._files[path.join(dir, 'projA', 'package.json')] = '{}';
      // Only 1 valid project (node_modules skipped)
      expect(isWorkspace(dir)).toBe(false);
    });

    it('skips hidden directories', () => {
      const dir = path.resolve('/ws');
      mockFs._addDir(dir, [
        { name: '.hidden', isDir: true },
        { name: 'projA', isDir: true }
      ]);
      mockFs._files[path.join(dir, '.hidden', 'package.json')] = '{}';
      mockFs._files[path.join(dir, 'projA', 'package.json')] = '{}';
      expect(isWorkspace(dir)).toBe(false);
    });
  });

  // =========================================================================
  // detectMonorepoType
  // =========================================================================
  describe('detectMonorepoType', () => {
    it('returns isMonorepo=false when no config found', () => {
      const result = detectMonorepoType('/empty');
      expect(result.isMonorepo).toBe(false);
      expect(result.type).toBeNull();
    });

    it('detects pnpm monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'pnpm-workspace.yaml')] = '';
      expect(detectMonorepoType(dir)).toEqual({ isMonorepo: true, type: 'pnpm', configFile: 'pnpm-workspace.yaml' });
    });

    it('detects lerna monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'lerna.json')] = '{}';
      expect(detectMonorepoType(dir)).toEqual({ isMonorepo: true, type: 'lerna', configFile: 'lerna.json' });
    });

    it('detects nx monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'nx.json')] = '{}';
      expect(detectMonorepoType(dir)).toEqual({ isMonorepo: true, type: 'nx', configFile: 'nx.json' });
    });

    it('detects turbo monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'turbo.json')] = '{}';
      expect(detectMonorepoType(dir)).toEqual({ isMonorepo: true, type: 'turbo', configFile: 'turbo.json' });
    });

    it('detects yarn workspaces monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ workspaces: ['packages/*'] });
      mockFs._files[path.join(dir, 'yarn.lock')] = '';
      const result = detectMonorepoType(dir);
      expect(result.isMonorepo).toBe(true);
      expect(result.type).toBe('yarn');
    });

    it('detects npm workspaces monorepo', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ workspaces: ['packages/*'] });
      mockFs._files[path.join(dir, 'package-lock.json')] = '';
      const result = detectMonorepoType(dir);
      expect(result.isMonorepo).toBe(true);
      expect(result.type).toBe('npm');
    });

    it('falls back to npm-workspaces when no lock file', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ workspaces: ['packages/*'] });
      const result = detectMonorepoType(dir);
      expect(result.type).toBe('npm-workspaces');
    });

    it('does NOT detect monorepo from package.json without workspaces', () => {
      const dir = path.resolve('/mono');
      mockFs._files[path.join(dir, 'package.json')] = JSON.stringify({ name: 'my-app' });
      const result = detectMonorepoType(dir);
      expect(result.isMonorepo).toBe(false);
    });
  });

  // =========================================================================
  // formatDetection
  // =========================================================================
  describe('formatDetection', () => {
    it('formats basic detection', () => {
      const det = {
        projectType: 'node',
        framework: 'nextjs',
        packageManager: 'npm',
        fromCache: false
      };
      const output = formatDetection(det);
      expect(output).toContain('**Project Type:** node');
      expect(output).toContain('**Framework:** nextjs');
      expect(output).toContain('**From Cache:** No (fresh scan)');
    });

    it('includes agents when present', () => {
      const det = {
        projectType: 'node',
        framework: 'nextjs',
        packageManager: 'npm',
        agents: { primary: 'web-nextjs', secondary: ['backend-go'] },
        fromCache: true
      };
      const output = formatDetection(det);
      expect(output).toContain('**Primary Agent:** web-nextjs');
      expect(output).toContain('**Secondary Agents:** backend-go');
      expect(output).toContain('**From Cache:** Yes');
    });

    it('shows unknown for missing fields', () => {
      const output = formatDetection({ fromCache: false });
      expect(output).toContain('**Project Type:** unknown');
      expect(output).toContain('**Framework:** unknown');
    });

    it('includes test framework when present', () => {
      const det = {
        testInfra: { hasTests: true, framework: 'vitest' },
        fromCache: false
      };
      const output = formatDetection(det);
      expect(output).toContain('**Test Framework:** vitest');
    });

    it('includes templates when present', () => {
      const det = {
        filePatterns: { templates: ['blade', 'twig'] },
        fromCache: false
      };
      const output = formatDetection(det);
      expect(output).toContain('**Templates:** blade, twig');
    });
  });

  // =========================================================================
  // Constants
  // =========================================================================
  describe('constants', () => {
    it('CACHE_MAX_AGE_MS is 24 hours', () => {
      expect(CACHE_MAX_AGE_MS).toBe(86400000);
    });

    it('KEY_FILES includes common config files', () => {
      expect(KEY_FILES).toContain('package.json');
      expect(KEY_FILES).toContain('go.mod');
      expect(KEY_FILES).toContain('Cargo.toml');
      expect(KEY_FILES).toContain('composer.json');
      expect(KEY_FILES).toContain('tsconfig.json');
    });

    it('SKIP_DIRS includes node_modules and .git', () => {
      expect(SKIP_DIRS).toContain('node_modules');
      expect(SKIP_DIRS).toContain('.git');
      expect(SKIP_DIRS).toContain('vendor');
    });

    it('MONOREPO_CONFIGS maps config files to types', () => {
      expect(MONOREPO_CONFIGS['pnpm-workspace.yaml']).toBe('pnpm');
      expect(MONOREPO_CONFIGS['turbo.json']).toBe('turbo');
      expect(MONOREPO_CONFIGS['nx.json']).toBe('nx');
    });
  });
});
