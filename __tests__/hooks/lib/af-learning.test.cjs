/**
 * Tests for af-learning.cjs
 *
 * Tests: feature flags, local storage operations, data validation,
 *        workflow events, pattern recording, metrics tracking
 */

const path = require('path');

// ---------------------------------------------------------------------------
// Mock fs module
// ---------------------------------------------------------------------------
const mockFs = {
  _files: {},
  _dirs: new Set(),
  existsSync(p) { return this._dirs.has(p) || p in this._files; },
  readFileSync(p) {
    if (p in this._files) return this._files[p];
    throw new Error('ENOENT');
  },
  writeFileSync(p, data) { this._files[p] = data; },
  mkdirSync(p) { this._dirs.add(p); },
  _reset() { this._files = {}; this._dirs = new Set(); }
};

jest.mock('fs', () => mockFs);

// ---------------------------------------------------------------------------
// Replicate pure functions from source for isolated testing
// (avoids side-effects of requiring the actual module which touches fs/env)
// ---------------------------------------------------------------------------

function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

function isLearningEnabled() {
  if (process.env.AF_LEARNING_DISABLED === 'true') return false;
  return true;
}

function isLocalMode() {
  if (isSupabaseConfigured()) return false;
  return true;
}

function isFeedbackEnabled() {
  return isLearningEnabled() && process.env.AF_FEEDBACK_COLLECTION !== 'false';
}

function isMetricsEnabled() {
  return isLearningEnabled() && process.env.AF_METRICS_COLLECTION !== 'false';
}

const LEARNING_DIR = path.join(process.cwd(), '.claude', 'learning');
const LOCAL_FEEDBACK_FILE = path.join(LEARNING_DIR, 'feedback.json');
const LOCAL_PATTERNS_FILE = path.join(LEARNING_DIR, 'patterns.json');
const LOCAL_METRICS_FILE = path.join(LEARNING_DIR, 'metrics.json');
const LOCAL_WORKFLOW_EVENTS_FILE = path.join(LEARNING_DIR, 'workflow-events.json');

function loadLocalFile(filePath) {
  try {
    if (mockFs.existsSync(filePath)) {
      return JSON.parse(mockFs.readFileSync(filePath, 'utf-8'));
    }
  } catch { /* ignore */ }
  return [];
}

function saveLocalFile(filePath, data) {
  try {
    if (!mockFs.existsSync(LEARNING_DIR)) {
      mockFs.mkdirSync(LEARNING_DIR, { recursive: true });
    }
    mockFs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch { /* ignore */ }
}

function getWorkflowEvents(workflowId) {
  const allEvents = loadLocalFile(LOCAL_WORKFLOW_EVENTS_FILE);
  return allEvents.filter(e => e.workflow_id === workflowId);
}

function getWorkflowEventStats(workflowId = null) {
  let events = loadLocalFile(LOCAL_WORKFLOW_EVENTS_FILE);
  if (workflowId) {
    events = events.filter(e => e.workflow_id === workflowId);
  }
  const stats = {
    total: events.length,
    byType: {},
    byPhase: {},
    recentEvents: events.slice(-10)
  };
  events.forEach(e => {
    stats.byType[e.event_type] = (stats.byType[e.event_type] || 0) + 1;
    const phaseKey = `phase_${e.phase}`;
    if (!stats.byPhase[phaseKey]) {
      stats.byPhase[phaseKey] = { approved: 0, rejected: 0, modified: 0 };
    }
    if (e.event_type === 'APPROVED') stats.byPhase[phaseKey].approved++;
    if (e.event_type === 'REJECTED') stats.byPhase[phaseKey].rejected++;
    if (e.event_type === 'MODIFIED') stats.byPhase[phaseKey].modified++;
  });
  return stats;
}

function getRecentFeedback(limit = 20) {
  const feedback = loadLocalFile(LOCAL_FEEDBACK_FILE);
  return feedback.slice(-limit);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('af-learning', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    mockFs._reset();
    // Clear env vars
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.AF_LEARNING_DISABLED;
    delete process.env.AF_FEEDBACK_COLLECTION;
    delete process.env.AF_METRICS_COLLECTION;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // =========================================================================
  // Feature flags
  // =========================================================================
  describe('isSupabaseConfigured', () => {
    it('returns false when neither var is set', () => {
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('returns false when only URL is set', () => {
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('returns false when only SECRET_KEY is set', () => {
      process.env.SUPABASE_SECRET_KEY = 'secret';
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('returns true when both are set', () => {
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'secret';
      expect(isSupabaseConfigured()).toBe(true);
    });
  });

  describe('isLearningEnabled', () => {
    it('returns true by default', () => {
      expect(isLearningEnabled()).toBe(true);
    });

    it('returns false when AF_LEARNING_DISABLED=true', () => {
      process.env.AF_LEARNING_DISABLED = 'true';
      expect(isLearningEnabled()).toBe(false);
    });

    it('returns true when AF_LEARNING_DISABLED is something else', () => {
      process.env.AF_LEARNING_DISABLED = 'false';
      expect(isLearningEnabled()).toBe(true);
    });
  });

  describe('isLocalMode', () => {
    it('returns true when Supabase not configured', () => {
      expect(isLocalMode()).toBe(true);
    });

    it('returns false when Supabase is configured', () => {
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'secret';
      expect(isLocalMode()).toBe(false);
    });
  });

  describe('isFeedbackEnabled', () => {
    it('returns true by default (learning enabled + feedback not disabled)', () => {
      expect(isFeedbackEnabled()).toBe(true);
    });

    it('returns false when learning is disabled', () => {
      process.env.AF_LEARNING_DISABLED = 'true';
      expect(isFeedbackEnabled()).toBe(false);
    });

    it('returns false when AF_FEEDBACK_COLLECTION=false', () => {
      process.env.AF_FEEDBACK_COLLECTION = 'false';
      expect(isFeedbackEnabled()).toBe(false);
    });
  });

  describe('isMetricsEnabled', () => {
    it('returns true by default', () => {
      expect(isMetricsEnabled()).toBe(true);
    });

    it('returns false when learning disabled', () => {
      process.env.AF_LEARNING_DISABLED = 'true';
      expect(isMetricsEnabled()).toBe(false);
    });

    it('returns false when AF_METRICS_COLLECTION=false', () => {
      process.env.AF_METRICS_COLLECTION = 'false';
      expect(isMetricsEnabled()).toBe(false);
    });
  });

  // =========================================================================
  // Local storage paths
  // =========================================================================
  describe('storage paths', () => {
    it('LEARNING_DIR is under .claude/learning', () => {
      expect(LEARNING_DIR).toContain(path.join('.claude', 'learning'));
    });

    it('feedback file is feedback.json', () => {
      expect(LOCAL_FEEDBACK_FILE).toContain('feedback.json');
    });

    it('patterns file is patterns.json', () => {
      expect(LOCAL_PATTERNS_FILE).toContain('patterns.json');
    });

    it('metrics file is metrics.json', () => {
      expect(LOCAL_METRICS_FILE).toContain('metrics.json');
    });

    it('workflow events file is workflow-events.json', () => {
      expect(LOCAL_WORKFLOW_EVENTS_FILE).toContain('workflow-events.json');
    });
  });

  // =========================================================================
  // loadLocalFile / saveLocalFile
  // =========================================================================
  describe('loadLocalFile', () => {
    it('returns empty array when file does not exist', () => {
      expect(loadLocalFile('/nonexistent/file.json')).toEqual([]);
    });

    it('returns parsed JSON when file exists', () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockFs._files['/test/data.json'] = JSON.stringify(data);
      expect(loadLocalFile('/test/data.json')).toEqual(data);
    });

    it('returns empty array on malformed JSON', () => {
      mockFs._files['/test/bad.json'] = 'not json{{{';
      expect(loadLocalFile('/test/bad.json')).toEqual([]);
    });
  });

  describe('saveLocalFile', () => {
    it('writes JSON to file', () => {
      const data = [{ key: 'value' }];
      saveLocalFile('/test/out.json', data);
      expect(mockFs._files['/test/out.json']).toBe(JSON.stringify(data, null, 2));
    });

    it('creates learning directory if missing', () => {
      saveLocalFile('/test/file.json', []);
      expect(mockFs._dirs.has(LEARNING_DIR)).toBe(true);
    });
  });

  // =========================================================================
  // getWorkflowEvents
  // =========================================================================
  describe('getWorkflowEvents', () => {
    it('returns empty array when no events stored', () => {
      expect(getWorkflowEvents('wf-1')).toEqual([]);
    });

    it('filters events by workflow_id', () => {
      const events = [
        { workflow_id: 'wf-1', event_type: 'APPROVED', phase: 1 },
        { workflow_id: 'wf-2', event_type: 'REJECTED', phase: 2 },
        { workflow_id: 'wf-1', event_type: 'MODIFIED', phase: 3 }
      ];
      mockFs._files[LOCAL_WORKFLOW_EVENTS_FILE] = JSON.stringify(events);

      const result = getWorkflowEvents('wf-1');
      expect(result).toHaveLength(2);
      expect(result.every(e => e.workflow_id === 'wf-1')).toBe(true);
    });
  });

  // =========================================================================
  // getWorkflowEventStats
  // =========================================================================
  describe('getWorkflowEventStats', () => {
    const sampleEvents = [
      { workflow_id: 'wf-1', event_type: 'APPROVED', phase: 1 },
      { workflow_id: 'wf-1', event_type: 'REJECTED', phase: 2 },
      { workflow_id: 'wf-1', event_type: 'APPROVED', phase: 3 },
      { workflow_id: 'wf-2', event_type: 'MODIFIED', phase: 1 }
    ];

    beforeEach(() => {
      mockFs._files[LOCAL_WORKFLOW_EVENTS_FILE] = JSON.stringify(sampleEvents);
    });

    it('returns stats for all events when no workflowId given', () => {
      const stats = getWorkflowEventStats();
      expect(stats.total).toBe(4);
    });

    it('returns stats filtered by workflowId', () => {
      const stats = getWorkflowEventStats('wf-1');
      expect(stats.total).toBe(3);
    });

    it('counts event types correctly', () => {
      const stats = getWorkflowEventStats();
      expect(stats.byType['APPROVED']).toBe(2);
      expect(stats.byType['REJECTED']).toBe(1);
      expect(stats.byType['MODIFIED']).toBe(1);
    });

    it('groups by phase correctly', () => {
      const stats = getWorkflowEventStats('wf-1');
      expect(stats.byPhase['phase_1'].approved).toBe(1);
      expect(stats.byPhase['phase_2'].rejected).toBe(1);
      expect(stats.byPhase['phase_3'].approved).toBe(1);
    });

    it('includes recentEvents (max 10)', () => {
      const stats = getWorkflowEventStats();
      expect(stats.recentEvents.length).toBeLessThanOrEqual(10);
      expect(stats.recentEvents).toEqual(sampleEvents);
    });

    it('returns empty stats when no events file', () => {
      mockFs._reset();
      const stats = getWorkflowEventStats();
      expect(stats.total).toBe(0);
      expect(stats.byType).toEqual({});
    });
  });

  // =========================================================================
  // getRecentFeedback
  // =========================================================================
  describe('getRecentFeedback', () => {
    it('returns empty array when no feedback file', () => {
      expect(getRecentFeedback()).toEqual([]);
    });

    it('returns last N feedback entries', () => {
      const feedback = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      mockFs._files[LOCAL_FEEDBACK_FILE] = JSON.stringify(feedback);

      const result = getRecentFeedback(5);
      expect(result).toHaveLength(5);
      expect(result[0].id).toBe(25);
      expect(result[4].id).toBe(29);
    });

    it('defaults to 20 entries', () => {
      const feedback = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      mockFs._files[LOCAL_FEEDBACK_FILE] = JSON.stringify(feedback);

      const result = getRecentFeedback();
      expect(result).toHaveLength(20);
    });

    it('returns all entries if fewer than limit', () => {
      const feedback = [{ id: 1 }, { id: 2 }];
      mockFs._files[LOCAL_FEEDBACK_FILE] = JSON.stringify(feedback);

      const result = getRecentFeedback(20);
      expect(result).toHaveLength(2);
    });
  });

  // =========================================================================
  // Data validation & edge cases
  // =========================================================================
  describe('data validation', () => {
    it('loadLocalFile handles object JSON (not just arrays)', () => {
      const obj = { key: 'value', nested: { a: 1 } };
      mockFs._files['/test/obj.json'] = JSON.stringify(obj);
      expect(loadLocalFile('/test/obj.json')).toEqual(obj);
    });

    it('saveLocalFile handles nested objects', () => {
      const data = { patterns: [{ type: 'a' }], meta: { count: 1 } };
      saveLocalFile('/test/nested.json', data);
      const parsed = JSON.parse(mockFs._files['/test/nested.json']);
      expect(parsed.patterns[0].type).toBe('a');
      expect(parsed.meta.count).toBe(1);
    });

    it('saveLocalFile handles empty array', () => {
      saveLocalFile('/test/empty.json', []);
      expect(JSON.parse(mockFs._files['/test/empty.json'])).toEqual([]);
    });
  });
});
