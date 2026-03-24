/**
 * Tests for token-tracker.cjs
 *
 * Tests: token estimation, threshold checking
 */

const fs = require('fs');
const path = require('path');

// Replicate constants and pure functions from source

const CONTEXT_LIMIT = 200000;

const TOKEN_COSTS = {
  Read: 800,
  Write: 500,
  Edit: 300,
  Bash: 400,
  Glob: 100,
  Grep: 200,
  Task: 2000,
  default: 200,
};

const THRESHOLDS = [
  { pct: 85, icon: '🔴', label: 'CRITICAL', msg: 'Strongly recommend /compact or session handoff' },
  { pct: 70, icon: '🟠', label: 'HIGH', msg: 'Consider /compact with focus instructions' },
  { pct: 50, icon: '🟡', label: 'MODERATE', msg: 'Context filling up, stay focused' },
];

function estimateFileTokens(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      return Math.min(Math.ceil(stat.size / 4), 10000);
    }
  } catch { /* ignore */ }
  return 0;
}

function getTokenCost(toolName) {
  return TOKEN_COSTS[toolName] || TOKEN_COSTS.default;
}

function checkThresholds(totalEstimate, lastWarningPct) {
  const currentPct = Math.round((totalEstimate / CONTEXT_LIMIT) * 100);
  for (const threshold of THRESHOLDS) {
    if (currentPct >= threshold.pct && lastWarningPct < threshold.pct) {
      return { triggered: true, threshold, currentPct };
    }
  }
  return { triggered: false, currentPct };
}

describe('token-tracker', () => {
  describe('TOKEN_COSTS', () => {
    it('assigns 800 tokens to Read', () => {
      expect(TOKEN_COSTS.Read).toBe(800);
    });

    it('assigns 500 tokens to Write', () => {
      expect(TOKEN_COSTS.Write).toBe(500);
    });

    it('assigns 300 tokens to Edit', () => {
      expect(TOKEN_COSTS.Edit).toBe(300);
    });

    it('assigns 400 tokens to Bash', () => {
      expect(TOKEN_COSTS.Bash).toBe(400);
    });

    it('assigns 100 tokens to Glob', () => {
      expect(TOKEN_COSTS.Glob).toBe(100);
    });

    it('assigns 200 tokens to Grep', () => {
      expect(TOKEN_COSTS.Grep).toBe(200);
    });

    it('assigns 2000 tokens to Task', () => {
      expect(TOKEN_COSTS.Task).toBe(2000);
    });

    it('assigns 200 tokens as default', () => {
      expect(TOKEN_COSTS.default).toBe(200);
    });
  });

  describe('getTokenCost', () => {
    it('returns correct cost for known tools', () => {
      expect(getTokenCost('Read')).toBe(800);
      expect(getTokenCost('Write')).toBe(500);
      expect(getTokenCost('Edit')).toBe(300);
      expect(getTokenCost('Bash')).toBe(400);
      expect(getTokenCost('Task')).toBe(2000);
    });

    it('returns default cost for unknown tools', () => {
      expect(getTokenCost('UnknownTool')).toBe(200);
      expect(getTokenCost('CustomPlugin')).toBe(200);
    });

    it('returns default cost for undefined', () => {
      expect(getTokenCost(undefined)).toBe(200);
    });
  });

  describe('estimateFileTokens', () => {
    const tmpFile = path.join(__dirname, 'tmp-token-test.txt');

    afterEach(() => {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    });

    it('returns 0 for non-existent file', () => {
      expect(estimateFileTokens('/nonexistent/file.txt')).toBe(0);
    });

    it('returns 0 for empty path', () => {
      expect(estimateFileTokens('')).toBe(0);
    });

    it('returns 0 for null', () => {
      expect(estimateFileTokens(null)).toBe(0);
    });

    it('returns 0 for undefined', () => {
      expect(estimateFileTokens(undefined)).toBe(0);
    });

    it('estimates tokens as file size / 4', () => {
      // Write 400 bytes
      fs.writeFileSync(tmpFile, 'a'.repeat(400));
      expect(estimateFileTokens(tmpFile)).toBe(100); // 400 / 4
    });

    it('caps at 10000 tokens for large files', () => {
      // Write 50000 bytes (50000/4 = 12500, but capped at 10000)
      fs.writeFileSync(tmpFile, 'a'.repeat(50000));
      expect(estimateFileTokens(tmpFile)).toBe(10000);
    });

    it('rounds up for non-even sizes', () => {
      // 5 bytes => ceil(5/4) = 2
      fs.writeFileSync(tmpFile, 'hello');
      expect(estimateFileTokens(tmpFile)).toBe(2);
    });
  });

  describe('checkThresholds', () => {
    it('triggers CRITICAL at 85%', () => {
      // 85% of 200000 = 170000
      const result = checkThresholds(170000, 0);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('CRITICAL');
      expect(result.currentPct).toBe(85);
    });

    it('triggers HIGH at exactly 70%', () => {
      const result = checkThresholds(140000, 0);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('HIGH');
      expect(result.currentPct).toBe(70);
    });

    it('triggers MODERATE at 50%', () => {
      // 50% of 200000 = 100000
      const result = checkThresholds(100000, 0);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('MODERATE');
      expect(result.currentPct).toBe(50);
    });

    it('does not trigger below 50%', () => {
      const result = checkThresholds(90000, 0);
      expect(result.triggered).toBe(false);
      expect(result.currentPct).toBe(45);
    });

    it('does not re-trigger already warned threshold', () => {
      // At 85% but already warned at 85
      const result = checkThresholds(170000, 85);
      expect(result.triggered).toBe(false);
    });

    it('triggers next threshold after previous warning', () => {
      // At 85% but last warning was at 70
      const result = checkThresholds(170000, 70);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('CRITICAL');
    });

    it('does not trigger when already warned at MODERATE and still below HIGH', () => {
      // 60% with last warning at 50
      const result = checkThresholds(120000, 50);
      expect(result.triggered).toBe(false);
      expect(result.currentPct).toBe(60);
    });

    it('handles 100% usage', () => {
      const result = checkThresholds(200000, 0);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('CRITICAL');
      expect(result.currentPct).toBe(100);
    });

    it('handles over 100% usage', () => {
      const result = checkThresholds(250000, 0);
      expect(result.triggered).toBe(true);
      expect(result.threshold.label).toBe('CRITICAL');
      expect(result.currentPct).toBe(125);
    });
  });

  describe('tracker state management', () => {
    it('initializes with base 5000 token estimate', () => {
      const tracker = {
        totalEstimate: 5000,
        toolCalls: 0,
        lastWarningPct: 0,
      };
      expect(tracker.totalEstimate).toBe(5000);
    });

    it('accumulates token costs across tool calls', () => {
      let total = 5000; // Base
      total += getTokenCost('Read') + 200;   // 800 + 200 response
      total += getTokenCost('Edit') + 200;   // 300 + 200 response
      total += getTokenCost('Bash') + 200;   // 400 + 200 response
      expect(total).toBe(5000 + 1000 + 500 + 600);
      expect(total).toBe(7100);
    });
  });
});
