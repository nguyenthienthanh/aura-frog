/**
 * P0-3 (TASK-00037) — check-path-safety.sh traversal + sibling-prefix fix.
 *
 * Two holes the audit verified:
 *   1. The candidate path was NOT canonicalized, so `..` segments dodged the
 *      two-`../` traversal regex.
 *   2. The allow-check compared against `"$REPO_ROOT"*` (no trailing slash),
 *      whitelisting siblings like `${REPO_ROOT}-evil`.
 *
 * Tests run the script with HOME overridden to a fixture subdir so the broad
 * `$HOME/*` sandbox does not mask the repo-prefix logic, and with the fixture
 * placed OUTSIDE /tmp + /var/tmp (under the project dir) so those hardcoded
 * sandboxes don't mask it either.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRIPT = path.join(process.cwd(), 'aura-frog', 'scripts', 'preflight', 'check-path-safety.sh');

let base, repo, fakeHome;

function run(target) {
  return spawnSync('bash', [SCRIPT, target], {
    cwd: repo,
    env: { ...process.env, HOME: fakeHome },
    encoding: 'utf8',
  });
}

beforeAll(() => {
  base = fs.mkdtempSync(path.join(process.cwd(), '.pathsafety-'));
  repo = path.join(base, 'repo');
  fs.mkdirSync(path.join(repo, 'src'), { recursive: true });
  fs.mkdirSync(path.join(base, 'repo-evil'), { recursive: true });
  fakeHome = path.join(base, 'nohome');
  fs.mkdirSync(fakeHome);
});

afterAll(() => {
  try { fs.rmSync(base, { recursive: true, force: true }); } catch {}
});

describe('check-path-safety — P0-3', () => {
  it('rejects a sibling dir sharing the repo prefix', () => {
    // ${base}/repo-evil/secret.txt string-prefix-matches ${base}/repo today → exit 0 (hole).
    const r = run(path.join(base, 'repo-evil', 'secret.txt'));
    expect(r.status).not.toBe(0);
  });

  it('rejects a single-level ../ that canonically escapes the repo', () => {
    const r = run('src/../../repo-evil/secret.txt');
    expect(r.status).not.toBe(0);
  });

  it('allows a legitimate in-repo path (no fail-open regression)', () => {
    const r = run(path.join(repo, 'src', 'a.txt'));
    expect(r.status).toBe(0);
  });

  it('allows a legitimate relative in-repo path', () => {
    const r = run('src/a.txt');
    expect(r.status).toBe(0);
  });

  it('still blocks absolute system paths', () => {
    const r = run('/etc/passwd');
    expect(r.status).toBe(2);
  });
});
