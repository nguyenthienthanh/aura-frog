#!/usr/bin/env node
/**
 * SessionStart Hook - Check for plugin updates (async, non-blocking)
 *
 * Checks GitHub releases API for latest version, warns if outdated.
 * Runs at most once per day (caches last check timestamp).
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CACHE_FILE = path.join(process.env.HOME || '', '.claude', 'af-update-cache.json');
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const REPO = 'nguyenthienthanh/aura-frog';

function getCurrentVersion() {
  try {
    const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || '';
    const pluginJson = path.join(pluginRoot, '.claude-plugin', 'plugin.json');
    if (fs.existsSync(pluginJson)) {
      const data = JSON.parse(fs.readFileSync(pluginJson, 'utf8'));
      return data.version || '0.0.0';
    }
  } catch { /* plugin.json read failed - non-blocking */ }
  return '0.0.0';
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch { /* cache read failed - non-blocking */ }
  return {};
}

function writeCache(data) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
  } catch { /* cache write failed - non-blocking */ }
}

function shouldCheck() {
  const cache = readCache();
  if (!cache.lastCheck) return true;
  return (Date.now() - cache.lastCheck) > CHECK_INTERVAL_MS;
}

function compareVersions(current, latest) {
  const c = current.replace(/^v/, '').split('.').map(Number);
  const l = latest.replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((l[i] || 0) > (c[i] || 0)) return true;
    if ((l[i] || 0) < (c[i] || 0)) return false;
  }
  return false;
}

function checkForUpdate() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/releases/latest`,
      headers: { 'User-Agent': 'aura-frog-update-check' },
      timeout: 5000,
    };

    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const release = JSON.parse(data);
          resolve(release.tag_name || null);
        } catch { resolve(null); }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  if (!shouldCheck()) {
    process.exit(0);
    return;
  }

  const currentVersion = getCurrentVersion();
  const latestTag = await checkForUpdate();

  // Update cache regardless of result
  writeCache({ lastCheck: Date.now(), latestTag, currentVersion });

  if (latestTag && compareVersions(currentVersion, latestTag)) {
    const currentMajor = parseInt(currentVersion.replace(/^v/, '').split('.')[0]);
    const latestMajor = parseInt(latestTag.replace(/^v/, '').split('.')[0]);
    const isMajor = latestMajor > currentMajor;

    const lines = [
      `🐸 Aura Frog update available: ${currentVersion} → ${latestTag}`,
    ];
    if (isMajor) {
      lines.push(`⚠️  Major version — may include breaking changes`);
      lines.push(`   Read release notes BEFORE updating: https://github.com/${REPO}/releases/tag/${latestTag}`);
    }
    lines.push('', 'Update: /plugin marketplace update aurafrog');

    const result = { systemMessage: lines.join('\n') };
    console.log(JSON.stringify(result));
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
