/**
 * Tests for aura-frog/hooks/scout-block.cjs
 *
 * Imports pure functions directly from the production hook — NO re-declaration.
 * Coverage reports under `npx jest --coverage` reflect real source touched.
 */

const fs = require('fs');
const path = require('path');

const {
  DEFAULT_BLOCKED,
  isBlocked,
  isAllowedBuildCommand,
  loadCustomPatterns,
} = require('../../aura-frog/hooks/scout-block.cjs');

describe('scout-block', () => {
  describe('isBlocked', () => {
    it('blocks path containing node_modules', () => {
      expect(isBlocked('/project/node_modules/lodash/index.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing .git', () => {
      expect(isBlocked('/project/.git/config', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing dist', () => {
      expect(isBlocked('/project/dist/bundle.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing build', () => {
      expect(isBlocked('/project/build/output.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing __pycache__', () => {
      expect(isBlocked('/project/__pycache__/module.pyc', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing vendor', () => {
      expect(isBlocked('/project/vendor/package/file.php', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing .next', () => {
      expect(isBlocked('/project/.next/static/chunk.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing .nuxt', () => {
      expect(isBlocked('/project/.nuxt/dist/server.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing coverage', () => {
      expect(isBlocked('/project/coverage/lcov-report/index.html', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing .cache', () => {
      expect(isBlocked('/project/.cache/data.json', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing .turbo', () => {
      expect(isBlocked('/project/.turbo/cache/hash', DEFAULT_BLOCKED)).toBe(true);
    });

    it('blocks path containing target (Rust)', () => {
      expect(isBlocked('/project/target/debug/binary', DEFAULT_BLOCKED)).toBe(true);
    });

    // Reflects current behavior: bin/ and obj/ are NOT in DEFAULT_BLOCKED anymore
    // (they collided with Node bin/ entrypoints, Go cmd/, committed binaries).
    // Projects that want them blocked add to .afignore.
    it('does NOT block path containing bin by default (Node/Go bin/ collide)', () => {
      expect(isBlocked('/project/bin/server', DEFAULT_BLOCKED)).toBe(false);
    });

    it('does NOT block path containing obj by default', () => {
      expect(isBlocked('/project/obj/Debug/net6.0/app.dll', DEFAULT_BLOCKED)).toBe(false);
    });

    it('blocks bin when added via custom patterns', () => {
      expect(isBlocked('/project/bin/server', [...DEFAULT_BLOCKED, 'bin'])).toBe(true);
    });

    it('allows normal source paths', () => {
      expect(isBlocked('/project/src/index.js', DEFAULT_BLOCKED)).toBe(false);
    });

    it('allows paths with similar but non-matching names', () => {
      expect(isBlocked('/project/src/distribution/main.js', DEFAULT_BLOCKED)).toBe(false);
    });

    it('is case insensitive', () => {
      expect(isBlocked('/project/Node_Modules/pkg/index.js', DEFAULT_BLOCKED)).toBe(true);
      expect(isBlocked('/project/DIST/bundle.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('handles Windows-style backslash paths', () => {
      expect(isBlocked('C:\\project\\node_modules\\pkg\\index.js', DEFAULT_BLOCKED)).toBe(true);
    });

    it('matches exact segments only', () => {
      expect(isBlocked('/project/builder/output.js', DEFAULT_BLOCKED)).toBe(false);
    });

    it('blocks with custom patterns', () => {
      const customPatterns = [...DEFAULT_BLOCKED, 'my_custom_dir'];
      expect(isBlocked('/project/my_custom_dir/file.txt', customPatterns)).toBe(true);
    });

    it('allows empty path', () => {
      expect(isBlocked('', DEFAULT_BLOCKED)).toBe(false);
    });
  });

  describe('isAllowedBuildCommand', () => {
    it('allows "npm build"', () => {
      expect(isAllowedBuildCommand('npm build')).toBe(true);
    });

    it('allows "npm run build"', () => {
      expect(isAllowedBuildCommand('npm run build')).toBe(true);
    });

    it('allows "yarn build"', () => {
      expect(isAllowedBuildCommand('yarn build')).toBe(true);
    });

    it('allows "pnpm build"', () => {
      expect(isAllowedBuildCommand('pnpm build')).toBe(true);
    });

    it('allows "npx build"', () => {
      expect(isAllowedBuildCommand('npx build')).toBe(true);
    });

    it('allows "go build"', () => {
      expect(isAllowedBuildCommand('go build ./...')).toBe(true);
    });

    it('allows "cargo build"', () => {
      expect(isAllowedBuildCommand('cargo build --release')).toBe(true);
    });

    it('allows "dotnet build"', () => {
      expect(isAllowedBuildCommand('dotnet build MyProject.csproj')).toBe(true);
    });

    it('blocks non-build commands', () => {
      expect(isAllowedBuildCommand('rm -rf /')).toBe(false);
    });

    it('blocks commands that partially match', () => {
      // 'echo build' contains substring 'build' but not any ALLOWED entry verbatim.
      expect(isAllowedBuildCommand('echo build')).toBe(false);
    });
  });

  describe('loadCustomPatterns', () => {
    const tmpDir = path.join(__dirname, 'tmp-scout-test');

    beforeEach(() => {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    });

    afterEach(() => {
      const ignoreFile = path.join(tmpDir, '.afignore');
      if (fs.existsSync(ignoreFile)) fs.unlinkSync(ignoreFile);
      if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir);
    });

    it('returns empty array when .afignore does not exist', () => {
      expect(loadCustomPatterns(tmpDir)).toEqual([]);
    });

    it('loads patterns from .afignore', () => {
      fs.writeFileSync(path.join(tmpDir, '.afignore'), 'custom_dir\nanother_dir\n');
      expect(loadCustomPatterns(tmpDir)).toEqual(['custom_dir', 'another_dir']);
    });

    it('ignores comment lines', () => {
      fs.writeFileSync(path.join(tmpDir, '.afignore'), '# comment\ncustom_dir\n# another comment\n');
      expect(loadCustomPatterns(tmpDir)).toEqual(['custom_dir']);
    });

    it('ignores empty lines', () => {
      fs.writeFileSync(path.join(tmpDir, '.afignore'), 'dir1\n\n\ndir2\n');
      expect(loadCustomPatterns(tmpDir)).toEqual(['dir1', 'dir2']);
    });

    it('trims whitespace', () => {
      fs.writeFileSync(path.join(tmpDir, '.afignore'), '  dir1  \n  dir2  \n');
      expect(loadCustomPatterns(tmpDir)).toEqual(['dir1', 'dir2']);
    });
  });
});
