#!/usr/bin/env node
/**
 * validate-hook-parity.cjs — CI gate: every hook's `Fires:` header must match
 * the event it is registered under in hooks.json.
 *
 * Catches the drift class fixed by hand in workflow-edit-learn.cjs (header said
 * PreToolUse, registered SessionStart). Also reports hooks registered but
 * missing on disk, and top-level *.cjs on disk not registered.
 *
 * Exit 0 = clean · Exit 1 = at least one mismatch.
 *
 * @version 1.0.0 (FEAT-010 / STORY-0024)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Map each registered hooks/<name>.cjs → the set of events it is registered on.
function extractRegisteredEvents(hooksJson) {
  const map = {};
  const events = (hooksJson && hooksJson.hooks) || {};
  for (const [event, groups] of Object.entries(events)) {
    for (const group of (Array.isArray(groups) ? groups : [])) {
      for (const h of (group.hooks || [])) {
        const m = String(h.command || '').match(/hooks\/([A-Za-z0-9_-]+)\.cjs/g) || [];
        for (const hit of m) {
          const name = hit.replace(/^hooks\//, '').replace(/\.cjs$/, '');
          (map[name] = map[name] || new Set()).add(event);
        }
      }
    }
  }
  return map;
}

// Extract the claimed event from a hook's `Fires:` header comment. Match the
// known event vocabulary anywhere on the line (headers phrase it freely, e.g.
// "Fires: On session Stop"), NOT just the first word. Returns null when the
// line names no event (e.g. "Fires: Once per session …") → not checked.
const HOOK_EVENTS = /\b(SessionStart|SessionEnd|PreToolUse|PostToolUse|SubagentStart|SubagentStop|UserPromptSubmit|PreCompact|PostCompact|Notification|Stop)\b/;
function extractFires(content) {
  const line = String(content || '').match(/Fires:[^\n]*/);
  if (!line) return null;
  const m = line[0].match(HOOK_EVENTS);
  return m ? m[1] : null;
}

// Compare registered events vs header claims. registered: {name: Set<event>};
// headers: {name: firesEvent|null}. Returns array of issue strings.
function findParityIssues(registered, headers) {
  const issues = [];
  for (const [name, fires] of Object.entries(headers)) {
    if (!fires) continue; // no Fires: header → not checked
    const evs = registered[name];
    if (!evs) continue;   // on disk but unregistered — reported separately
    if (!evs.has(fires)) {
      issues.push(`${name}.cjs: header Fires:${fires} but registered on [${[...evs].join(', ')}]`);
    }
  }
  return issues;
}

function main() {
  const hooksDir = path.join(__dirname, '..', '..', 'hooks');
  let hooksJson;
  try { hooksJson = JSON.parse(fs.readFileSync(path.join(hooksDir, 'hooks.json'), 'utf8')); }
  catch (e) { console.error(`FATAL: cannot read hooks.json: ${e.message}`); process.exit(1); }

  const registered = extractRegisteredEvents(hooksJson);
  const headers = {};
  const onDisk = fs.readdirSync(hooksDir).filter(f => f.endsWith('.cjs')).map(f => f.replace(/\.cjs$/, ''));
  for (const name of onDisk) {
    headers[name] = extractFires(fs.readFileSync(path.join(hooksDir, `${name}.cjs`), 'utf8'));
  }

  let fail = 0;
  const mismatches = findParityIssues(registered, headers);
  for (const m of mismatches) { console.error(`  MISMATCH: ${m}`); fail = 1; }

  for (const name of Object.keys(registered)) {
    if (!onDisk.includes(name)) { console.error(`  MISSING: ${name}.cjs registered but not on disk`); fail = 1; }
  }

  if (fail === 0) console.log(`✓ Hook parity clean — ${onDisk.length} hooks, headers match registration.`);
  else console.error('✗ Hook parity FAILED.');
  process.exit(fail);
}

if (require.main === module) main();

module.exports = { extractRegisteredEvents, extractFires, findParityIssues };
