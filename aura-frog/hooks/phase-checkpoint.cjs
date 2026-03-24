#!/usr/bin/env node
/**
 * PreToolUse Hook - Auto git checkpoint before phase transitions
 *
 * Creates a checkpoint commit before entering Phase 2/3/4 so that
 * each phase can be rolled back independently.
 *
 * Trigger: Detects phase transition in workflow state
 * Exit: 0 (non-blocking — checkpoint is best-effort)
 *
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { readSessionState } = require('./lib/af-config-utils.cjs');

function getWorkflowState() {
  try {
    const sessionId = process.ppid?.toString();
    return readSessionState(sessionId) || {};
  } catch { /* session state unavailable - non-blocking */ }
  return {};
}

function hasUncommittedChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8', timeout: 5000 });
    return status.trim().length > 0;
  } catch { /* git not available - non-blocking */ }
  return false;
}

function createCheckpoint(phase) {
  try {
    if (!hasUncommittedChanges()) return;

    // Stage all changes
    execSync('git add -A', { timeout: 10000 });

    // Create checkpoint commit
    const message = `[aura-frog] checkpoint: pre-phase-${phase}`;
    execSync(`git commit -m "${message}" --no-verify`, { timeout: 10000 });

    const result = {
      systemMessage: `📌 Checkpoint created: pre-phase-${phase}`
    };
    console.log(JSON.stringify(result));
  } catch (e) {
    // Checkpoint failed — non-blocking, don't stop the workflow
    if (process.env.AF_DEBUG === 'true') {
      console.error(`[af-debug] Checkpoint failed: ${e.message}`);
    }
  }
}

function getCacheFile() {
  const cacheDir = path.join(process.env.HOME || '/tmp', '.claude');
  return path.join(cacheDir, 'af-phase-checkpoint-cache.json');
}

function readCache() {
  try {
    if (fs.existsSync(getCacheFile())) {
      return JSON.parse(fs.readFileSync(getCacheFile(), 'utf8'));
    }
  } catch { /* cache read failed - non-blocking */ }
  return {};
}

function writeCache(data) {
  try {
    const dir = path.dirname(getCacheFile());
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(getCacheFile(), JSON.stringify(data));
  } catch { /* cache write failed - non-blocking */ }
}

function main() {
  // Only checkpoint if enabled
  if (process.env.AF_CHECKPOINT === 'false') {
    process.exit(0);
    return;
  }

  const state = getWorkflowState();
  const currentPhase = state.phase;

  // Only checkpoint before phases 2, 3, 4
  if (!currentPhase || !['2', '3', '4'].includes(String(currentPhase))) {
    process.exit(0);
    return;
  }

  // Prevent duplicate checkpoints for same phase
  const cache = readCache();
  const workflowId = state.workflowId || 'unknown';
  const cacheKey = `${workflowId}-phase-${currentPhase}`;

  if (cache[cacheKey]) {
    process.exit(0);
    return;
  }

  createCheckpoint(currentPhase);

  // Mark as checkpointed
  cache[cacheKey] = Date.now();
  writeCache(cache);

  process.exit(0);
}

main();
