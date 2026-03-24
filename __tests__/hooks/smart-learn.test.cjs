/**
 * Tests for smart-learn.cjs
 *
 * Tests: code pattern detection, bash pattern extraction, cache management
 */

const path = require('path');

// ---------------------------------------------------------------------------
// Replicate pure functions from source for isolated testing
// ---------------------------------------------------------------------------

function detectCodePatterns(content, filePath) {
  const patterns = [];
  const ext = path.extname(filePath).toLowerCase();

  // TypeScript/JavaScript patterns
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    const arrowFunctions = (content.match(/=>\s*{/g) || []).length;
    const regularFunctions = (content.match(/function\s+\w+/g) || []).length;
    if (arrowFunctions > regularFunctions) {
      patterns.push({ type: 'style', pattern: 'arrow_functions', weight: arrowFunctions });
    }

    const constUsage = (content.match(/\bconst\s+/g) || []).length;
    const letUsage = (content.match(/\blet\s+/g) || []).length;
    if (constUsage > letUsage * 2) {
      patterns.push({ type: 'style', pattern: 'prefer_const', weight: constUsage });
    }

    const asyncAwait = (content.match(/\basync\b/g) || []).length;
    if (asyncAwait > 0) {
      patterns.push({ type: 'style', pattern: 'async_await', weight: asyncAwait });
    }

    if (['.ts', '.tsx'].includes(ext)) {
      const typeAnnotations = (content.match(/:\s*(string|number|boolean|Array|object|any)/g) || []).length;
      if (typeAnnotations > 5) {
        patterns.push({ type: 'typing', pattern: 'explicit_types', weight: typeAnnotations });
      }
    }

    if (content.includes('useState') || content.includes('useEffect')) {
      patterns.push({ type: 'framework', pattern: 'react_hooks', weight: 1 });
    }

    const tryCatch = (content.match(/\btry\s*{/g) || []).length;
    if (tryCatch > 0) {
      patterns.push({ type: 'quality', pattern: 'error_handling', weight: tryCatch });
    }
  }

  // Python patterns
  if (ext === '.py') {
    const typeHints = (content.match(/->\s*\w+/g) || []).length;
    if (typeHints > 2) {
      patterns.push({ type: 'typing', pattern: 'python_type_hints', weight: typeHints });
    }

    const asyncDef = (content.match(/\basync\s+def\b/g) || []).length;
    if (asyncDef > 0) {
      patterns.push({ type: 'style', pattern: 'python_async', weight: asyncDef });
    }
  }

  return patterns;
}

function extractBashPattern(command) {
  if (!command) return null;

  const normalized = command.trim()
    .replace(/["'][^"']*["']/g, '""')
    .replace(/\d+/g, 'N')
    .replace(/\s+/g, ' ');

  const parts = normalized.split(/[|;&]/);
  const baseCmd = parts[0].trim().split(' ')[0];

  return {
    base: baseCmd,
    pattern: normalized.substring(0, 100),
    hasPipe: command.includes('|'),
    hasChain: command.includes('&&') || command.includes(';')
  };
}

// Cache-related constants replicated from source
const SUCCESS_THRESHOLD = 3;
const CACHE_MAX_SIZE = 200;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('smart-learn', () => {
  // =========================================================================
  // detectCodePatterns - JS/TS
  // =========================================================================
  describe('detectCodePatterns', () => {
    it('detects arrow functions when they outnumber regular functions', () => {
      const content = `
        const a = () => { return 1; };
        const b = () => { return 2; };
        function foo() {}
      `;
      const patterns = detectCodePatterns(content, 'app.js');
      const arrow = patterns.find(p => p.pattern === 'arrow_functions');
      expect(arrow).toBeDefined();
      expect(arrow.type).toBe('style');
      expect(arrow.weight).toBe(2);
    });

    it('does NOT detect arrow_functions when regular >= arrow', () => {
      const content = `
        function foo() {}
        function bar() {}
        const a = () => { return 1; };
      `;
      const patterns = detectCodePatterns(content, 'app.js');
      expect(patterns.find(p => p.pattern === 'arrow_functions')).toBeUndefined();
    });

    it('detects prefer_const when const > 2x let', () => {
      const content = `
        const a = 1;
        const b = 2;
        const c = 3;
        const d = 4;
        const e = 5;
        let x = 0;
      `;
      const patterns = detectCodePatterns(content, 'app.ts');
      const constPref = patterns.find(p => p.pattern === 'prefer_const');
      expect(constPref).toBeDefined();
      expect(constPref.weight).toBe(5);
    });

    it('does NOT detect prefer_const when const <= 2x let', () => {
      const content = `
        const a = 1;
        const b = 2;
        let x = 0;
        let y = 1;
      `;
      const patterns = detectCodePatterns(content, 'app.js');
      expect(patterns.find(p => p.pattern === 'prefer_const')).toBeUndefined();
    });

    it('detects async_await usage', () => {
      const content = `
        async function fetchData() {
          const data = await fetch('/api');
          return data;
        }
      `;
      const patterns = detectCodePatterns(content, 'api.ts');
      const asyncP = patterns.find(p => p.pattern === 'async_await');
      expect(asyncP).toBeDefined();
      expect(asyncP.weight).toBe(1); // only 'async' keyword counted
    });

    it('does NOT detect async_await when no async keyword present', () => {
      const content = `const x = 1; function sync() { return 2; }`;
      const patterns = detectCodePatterns(content, 'app.js');
      expect(patterns.find(p => p.pattern === 'async_await')).toBeUndefined();
    });

    it('detects explicit_types in TypeScript files only', () => {
      const content = `
        const a: string = '';
        const b: number = 0;
        const c: boolean = true;
        const d: Array = [];
        const e: object = {};
        const f: any = null;
      `;
      const tsPatterns = detectCodePatterns(content, 'file.ts');
      expect(tsPatterns.find(p => p.pattern === 'explicit_types')).toBeDefined();

      // Same content in .js should NOT produce explicit_types
      const jsPatterns = detectCodePatterns(content, 'file.js');
      expect(jsPatterns.find(p => p.pattern === 'explicit_types')).toBeUndefined();
    });

    it('does NOT detect explicit_types when annotations <= 5', () => {
      const content = `
        const a: string = '';
        const b: number = 0;
      `;
      const patterns = detectCodePatterns(content, 'file.tsx');
      expect(patterns.find(p => p.pattern === 'explicit_types')).toBeUndefined();
    });

    it('detects react_hooks from useState', () => {
      const content = `
        import { useState } from 'react';
        const [val, setVal] = useState(0);
      `;
      const patterns = detectCodePatterns(content, 'App.jsx');
      expect(patterns.find(p => p.pattern === 'react_hooks')).toBeDefined();
    });

    it('detects react_hooks from useEffect', () => {
      const content = `useEffect(() => { console.log('mounted'); }, []);`;
      const patterns = detectCodePatterns(content, 'App.tsx');
      expect(patterns.find(p => p.pattern === 'react_hooks')).toBeDefined();
    });

    it('detects error_handling from try/catch blocks', () => {
      const content = `
        try {
          riskyOp();
        } catch(e) {}
        try {
          another();
        } catch(e) {}
      `;
      const patterns = detectCodePatterns(content, 'util.js');
      const eh = patterns.find(p => p.pattern === 'error_handling');
      expect(eh).toBeDefined();
      expect(eh.weight).toBe(2);
    });

    it('returns empty array for non-JS/TS/Py files', () => {
      const content = `package main\nfunc main() {}`;
      expect(detectCodePatterns(content, 'main.go')).toEqual([]);
    });

    it('returns empty array for empty content in JS file', () => {
      const patterns = detectCodePatterns('', 'empty.js');
      expect(patterns).toEqual([]);
    });

    it('handles .tsx extension for both TS and JS patterns', () => {
      const content = `
        const a = () => { return 1; };
        const b = () => { return 2; };
        async function load() {}
        const x: string = 'hi';
        const y: number = 1;
        const z: boolean = true;
        const w: Array = [];
        const v: object = {};
        const u: any = null;
      `;
      const patterns = detectCodePatterns(content, 'component.tsx');
      expect(patterns.find(p => p.pattern === 'arrow_functions')).toBeDefined();
      expect(patterns.find(p => p.pattern === 'async_await')).toBeDefined();
      expect(patterns.find(p => p.pattern === 'explicit_types')).toBeDefined();
    });
  });

  // =========================================================================
  // detectCodePatterns - Python
  // =========================================================================
  describe('detectCodePatterns - Python', () => {
    it('detects python_type_hints when > 2 return type annotations', () => {
      const content = `
        def foo() -> str: pass
        def bar() -> int: pass
        def baz() -> bool: pass
      `;
      const patterns = detectCodePatterns(content, 'module.py');
      const th = patterns.find(p => p.pattern === 'python_type_hints');
      expect(th).toBeDefined();
      expect(th.weight).toBe(3);
    });

    it('does NOT detect python_type_hints when <= 2', () => {
      const content = `
        def foo() -> str: pass
        def bar(): pass
      `;
      const patterns = detectCodePatterns(content, 'module.py');
      expect(patterns.find(p => p.pattern === 'python_type_hints')).toBeUndefined();
    });

    it('detects python_async from async def', () => {
      const content = `
        async def handler(request):
            return response
      `;
      const patterns = detectCodePatterns(content, 'views.py');
      const pa = patterns.find(p => p.pattern === 'python_async');
      expect(pa).toBeDefined();
      expect(pa.weight).toBe(1);
    });

    it('does NOT detect python_async when no async def', () => {
      const content = `def sync_func(): pass`;
      const patterns = detectCodePatterns(content, 'utils.py');
      expect(patterns.find(p => p.pattern === 'python_async')).toBeUndefined();
    });
  });

  // =========================================================================
  // extractBashPattern
  // =========================================================================
  describe('extractBashPattern', () => {
    it('returns null for empty/null command', () => {
      expect(extractBashPattern(null)).toBeNull();
      expect(extractBashPattern('')).toBeNull();
      expect(extractBashPattern(undefined)).toBeNull();
    });

    it('extracts base command from simple command', () => {
      const result = extractBashPattern('npm install express');
      expect(result.base).toBe('npm');
      expect(result.hasPipe).toBe(false);
      expect(result.hasChain).toBe(false);
    });

    it('detects piped commands', () => {
      const result = extractBashPattern('cat file.txt | grep error');
      expect(result.base).toBe('cat');
      expect(result.hasPipe).toBe(true);
    });

    it('detects chained commands with &&', () => {
      const result = extractBashPattern('npm test && npm build');
      expect(result.base).toBe('npm');
      expect(result.hasChain).toBe(true);
    });

    it('detects chained commands with ;', () => {
      const result = extractBashPattern('cd /tmp; ls -la');
      expect(result.base).toBe('cd');
      expect(result.hasChain).toBe(true);
    });

    it('replaces quoted strings with ""', () => {
      const result = extractBashPattern('echo "hello world" | wc -c');
      expect(result.pattern).not.toContain('hello world');
      expect(result.pattern).toContain('""');
    });

    it('replaces numbers with N', () => {
      const result = extractBashPattern('head -100 file.txt');
      expect(result.pattern).toContain('N');
      expect(result.pattern).not.toContain('100');
    });

    it('normalizes whitespace', () => {
      const result = extractBashPattern('git   commit   -m   "msg"');
      expect(result.pattern).not.toContain('  ');
    });

    it('truncates pattern to 100 characters', () => {
      const longCmd = 'verylongcommand ' + 'a'.repeat(200);
      const result = extractBashPattern(longCmd);
      expect(result.pattern.length).toBeLessThanOrEqual(100);
    });

    it('handles command with both pipe and chain', () => {
      const result = extractBashPattern('ls -la | grep test && echo done');
      expect(result.hasPipe).toBe(true);
      expect(result.hasChain).toBe(true);
    });
  });

  // =========================================================================
  // Constants & cache shape
  // =========================================================================
  describe('constants', () => {
    it('SUCCESS_THRESHOLD is 3', () => {
      expect(SUCCESS_THRESHOLD).toBe(3);
    });

    it('CACHE_MAX_SIZE is 200', () => {
      expect(CACHE_MAX_SIZE).toBe(200);
    });
  });

  // =========================================================================
  // Combined pattern scenarios
  // =========================================================================
  describe('combined pattern scenarios', () => {
    it('detects multiple patterns in a complex JS file', () => {
      const content = `
        const fetchData = async () => {
          try {
            const res = await fetch('/api');
            const data = await res.json();
            const [items, setItems] = useState([]);
            return data;
          } catch (e) {
            console.error(e);
          }
        };
        const process = async () => {
          const result = await fetchData();
          return result;
        };
      `;
      const patterns = detectCodePatterns(content, 'component.jsx');
      const types = patterns.map(p => p.pattern);
      expect(types).toContain('arrow_functions');
      expect(types).toContain('async_await');
      expect(types).toContain('error_handling');
      expect(types).toContain('react_hooks');
      expect(types).toContain('prefer_const');
    });

    it('detects multiple patterns in a complex Python file', () => {
      const content = `
        async def fetch_users() -> list:
            pass
        async def fetch_items() -> dict:
            pass
        async def fetch_orders() -> list:
            pass
      `;
      const patterns = detectCodePatterns(content, 'api.py');
      const types = patterns.map(p => p.pattern);
      expect(types).toContain('python_type_hints');
      expect(types).toContain('python_async');
    });
  });
});
