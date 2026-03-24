# Dependency Management Rules

**Category:** Code Quality
**Priority:** High
**Version:** 1.0.0
**Applies To:** All projects

---

## Overview

Guidelines for managing dependencies safely and efficiently.

---

## 1. Dependency Categories

| Type | Location | Example |
|------|----------|---------|
| Production | dependencies | react, express |
| Development | devDependencies | jest, eslint |
| Peer | peerDependencies | Plugin requirements |
| Optional | optionalDependencies | Platform-specific |

```json
{
  "dependencies": {
    "react": "^18.2.0"     // Production - shipped to users
  },
  "devDependencies": {
    "jest": "^29.0.0"      // Development only
  }
}
```

---

## 2. Version Pinning Strategy

| Symbol | Meaning | Example | Risk |
|--------|---------|---------|------|
| None | Exact | `1.2.3` | None |
| `~` | Patch | `~1.2.3` → `1.2.x` | Low |
| `^` | Minor | `^1.2.3` → `1.x.x` | Medium |
| `*` | Any | `*` | High |

### Recommendations
```json
{
  "dependencies": {
    "react": "^18.2.0",      // ^Minor for stable libs
    "some-lib": "~2.1.0",    // ~Patch for less stable
    "critical-dep": "1.2.3"  // Exact for critical deps
  }
}
```

---

## 3. Lock Files

| Manager | Lock File | Action |
|---------|-----------|--------|
| npm | package-lock.json | Commit |
| yarn | yarn.lock | Commit |
| pnpm | pnpm-lock.yaml | Commit |

**Always commit lock files** - ensures reproducible builds.

```bash
# Use lock file in CI
npm ci          # npm
yarn --frozen-lockfile  # yarn
pnpm install --frozen-lockfile  # pnpm
```

---

## 4. Adding Dependencies

### Before Adding
```
1. Do we really need it?
2. Is it actively maintained?
3. What's the bundle size impact?
4. Are there security vulnerabilities?
5. What's the license?
```

### Evaluation Checklist
| Check | Pass Criteria |
|-------|---------------|
| Stars | >1000 (for core deps) |
| Last commit | <6 months |
| Open issues | Reasonable ratio |
| Bundle size | Justified for use case |
| License | MIT, Apache, BSD |

### Commands
```bash
# Check size before adding
npx bundlephobia <package>

# Check for vulnerabilities
npm audit

# Check outdated
npm outdated
```

---

## 5. Updating Dependencies

### Update Strategy
| Type | Frequency | Approach |
|------|-----------|----------|
| Security | Immediate | Patch ASAP |
| Patch | Weekly | Auto-merge |
| Minor | Monthly | Test first |
| Major | Quarterly | Plan migration |

### Safe Update Process
```bash
# 1. Check what's outdated
npm outdated

# 2. Update one at a time (majors)
npm install package@latest

# 3. Run tests
npm test

# 4. Commit separately
git commit -m "chore: update package to vX.Y.Z"
```

---

## 6. Security

### Audit Regularly
```bash
# Check vulnerabilities
npm audit

# Fix automatically (safe)
npm audit fix

# Fix breaking changes (careful)
npm audit fix --force
```

### Dependabot / Renovate
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
```

---

## 7. Bundle Size

### Monitor Size
```bash
# Analyze bundle
npx webpack-bundle-analyzer

# Check package size
npx bundlephobia lodash
```

### Optimization
```typescript
// ❌ Bad: Import entire library
import _ from 'lodash'
_.pick(obj, ['a', 'b'])

// ✅ Good: Import only what needed
import pick from 'lodash/pick'
pick(obj, ['a', 'b'])
```

---

## 8. Avoid These

| Pattern | Problem | Solution |
|---------|---------|----------|
| `*` version | Unpredictable | Use semver |
| No lock file | Different installs | Commit lock file |
| Outdated deps | Security risks | Update regularly |
| Unused deps | Bloat | Remove them |
| Duplicate deps | Bundle size | Dedupe |

### Find Unused
```bash
npx depcheck
```

### Dedupe
```bash
npm dedupe
```

---

## 9. Dependency Checklist

### Adding
- [ ] Necessity confirmed
- [ ] Actively maintained
- [ ] Acceptable bundle size
- [ ] No security vulnerabilities
- [ ] Compatible license
- [ ] Correct category (dep vs devDep)

### Maintaining
- [ ] Lock file committed
- [ ] Security audits passing
- [ ] No outdated critical deps
- [ ] Unused deps removed
- [ ] Bundle size monitored

---

## Best Practices

### Do's
- Commit lock files
- Audit regularly
- Update incrementally
- Check bundle impact
- Use exact versions for critical deps

### Don'ts
- Use `*` versions
- Ignore security warnings
- Update all at once
- Skip testing after updates
- Add unnecessary deps

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
