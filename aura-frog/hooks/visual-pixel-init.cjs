/**
 * visual-pixel-init.cjs
 *
 * SessionStart hook that detects .claude/visual/ folder and injects
 * visual testing context for pixel-perfect testing.
 *
 * Version: 1.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if visual testing is configured in the project
 */
function detectVisualTesting(projectPath) {
  const visualPath = path.join(projectPath, '.claude', 'visual');
  const configPath = path.join(visualPath, 'config.json');

  return {
    exists: fs.existsSync(visualPath),
    hasConfig: fs.existsSync(configPath),
    configPath,
    visualPath
  };
}

/**
 * Load visual testing configuration
 */
function loadConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Count spec files
 */
function countSpecs(visualPath) {
  const specPath = path.join(visualPath, 'spec');
  if (!fs.existsSync(specPath)) return 0;

  try {
    const files = fs.readdirSync(specPath);
    return files.filter(f => f.endsWith('.spec.json')).length;
  } catch (error) {
    return 0;
  }
}

/**
 * Count baseline snapshots
 */
function countBaselines(visualPath) {
  const baselinePath = path.join(visualPath, 'snapshots', 'baseline');
  if (!fs.existsSync(baselinePath)) return 0;

  try {
    const files = fs.readdirSync(baselinePath);
    return files.filter(f => f.endsWith('.png')).length;
  } catch (error) {
    return 0;
  }
}

/**
 * Main hook function
 */
function main() {
  // Get project path from environment or current directory
  const projectPath = process.env.CLAUDE_PROJECT_PATH || process.cwd();

  // Detect visual testing
  const detection = detectVisualTesting(projectPath);

  if (!detection.exists) {
    // Visual testing not configured - exit silently
    process.exit(0);
  }

  // Set environment variable for other hooks/skills
  process.env.AF_VISUAL_TESTING = 'true';
  process.env.AF_VISUAL_PATH = detection.visualPath;

  // Load config if available
  let config = null;
  if (detection.hasConfig) {
    config = loadConfig(detection.configPath);
    if (config) {
      process.env.AF_VISUAL_WEB_THRESHOLD = config.thresholds?.web?.toString() || '0.5';
      process.env.AF_VISUAL_PDF_THRESHOLD = config.thresholds?.pdf?.toString() || '1.0';
      process.env.AF_VISUAL_MAX_ATTEMPTS = config.maxAttempts?.toString() || '5';
    }
  }

  // Count specs and baselines
  const specCount = countSpecs(detection.visualPath);
  const baselineCount = countBaselines(detection.visualPath);

  // Build status message
  const parts = [];
  parts.push('Visual Testing: enabled');

  if (config) {
    parts.push(`Thresholds: web ${config.thresholds?.web || 0.5}% / pdf ${config.thresholds?.pdf || 1.0}%`);
  }

  if (specCount > 0) {
    parts.push(`Specs: ${specCount}`);
  }

  if (baselineCount > 0) {
    parts.push(`Baselines: ${baselineCount}`);
  }

  // Output status to stderr (displayed to user)
  console.error(`🎨 ${parts.join(' | ')}`);

  // Exit with success
  process.exit(0);
}

// Run
main();
