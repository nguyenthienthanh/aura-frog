#!/usr/bin/env node
/**
 * security-critical-warn.cjs - Tiered security warnings for sensitive files
 *
 * PreToolUse hook on Write|Edit.
 * Provides graduated warnings based on file sensitivity level.
 *
 * Exit codes:
 * - 0: Continue (with optional stderr warning)
 */

const fs = require('fs');
const path = require('path');

// Tiered file sensitivity patterns
const TIERS = {
  CRITICAL: {
    icon: '🔴',
    label: 'CRITICAL',
    patterns: [
      /\.env(\.|$)/,
      /credentials\.(json|yaml|yml|toml)/i,
      /\.aws\/config/,
      /\.ssh\//,
      /secrets?\.(json|yaml|yml|toml)/i,
      /service[_-]?account.*\.json/i,
      /\.pem$/,
      /\.key$/,
    ],
    message: 'This file likely contains secrets. Verify it is NOT committed to git.',
  },
  HIGH: {
    icon: '🟠',
    label: 'HIGH',
    patterns: [
      /\/auth\//i,
      /\/authentication\//i,
      /\/authorization\//i,
      /\/payment/i,
      /\/billing/i,
      /\/crypto/i,
      /\/security\//i,
      /\/middleware\/auth/i,
      /\/session/i,
      /password/i,
      /oauth/i,
      /jwt/i,
      /token.*handler/i,
    ],
    message: 'Security-critical code. Consider human review before merging.',
  },
  MEDIUM: {
    icon: '🟡',
    label: 'MEDIUM',
    patterns: [
      /config\.(js|ts|json|yaml|yml)/i,
      /settings\.(py|rb|php)/i,
      /database\.(js|ts|py|php)/i,
      /\.config\.(js|ts|mjs|cjs)/i,
      /cors/i,
      /helmet/i,
      /csrf/i,
      /rate[_-]?limit/i,
    ],
    message: 'Config file with potential security implications.',
  },
};

try {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) process.exit(0);

  const data = JSON.parse(input);
  const filePath = (data.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  const normalized = filePath.replace(/\\/g, '/').toLowerCase();

  for (const [tier, config] of Object.entries(TIERS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalized)) {
        console.error(`${config.icon} [${config.label}] ${config.message}`);
        console.error(`   File: ${path.basename(filePath)}`);
        process.exit(0); // Warn but don't block
      }
    }
  }

  process.exit(0);

} catch (error) {
  process.exit(0); // Fail open
}
