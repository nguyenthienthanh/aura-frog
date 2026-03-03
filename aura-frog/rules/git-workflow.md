# Git Workflow Rules

**Category:** Version Control  
**Priority:** High  
**Enforcement:** Pre-commit hooks + Code Review

---

## Branch Naming

### Pattern
```
<type>/<ticket>-<short-description>
```

### Types
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

### Examples
```bash
feature/PROJPH-1234-add-social-sharing
bugfix/PROJMY-5678-fix-login-crash
refactor/PROJID-9012-split-large-component
```

### Rules
- ✅ Include ticket number
- ✅ Use lowercase
- ✅ Use hyphens (not underscores)
- ❌ No special characters

---

## Commit & Push Confirmation (CRITICAL)

**NEVER auto-commit or auto-push.** Always follow this sequence:

1. Show `git diff --stat` (files to be committed)
2. Show the proposed commit message
3. Ask: "Ready to commit? Please confirm."
4. **Wait for explicit user confirmation** before running `git commit`
5. After commit, ask before `git push` separately

This applies to ALL commits — workflow phases, bug fixes, documentation updates. No exceptions.

---

## Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `test` - Adding tests
- `docs` - Documentation
- `style` - Formatting
- `chore` - Maintenance

### Examples
```bash
feat(social): add Instagram sharing

- Implemented Instagram API integration
- Added image upload functionality
- Created share modal UI

PROJPH-1234

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

```bash
fix(auth): resolve token refresh issue

Fixed race condition in token refresh logic

Fixes PROJMY-5678
```

---

## Pull Request Guidelines

### Title Format
```
[TICKET] Type: Brief description
```

### Examples
```
[PROJPH-1234] Feature: Add social media sharing
[PROJMY-5678] Fix: Resolve login crash on iOS
```

### PR Description Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots
[Add screenshots/videos if UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests passing
- [ ] Documentation updated
```

---

## Protected Branches

### `main` / `master`
- ❌ No direct pushes
- ✅ Requires PR + approval
- ✅ All tests must pass
- ❌ No force push

### `develop`
- ❌ No direct pushes
- ✅ Requires PR + approval
- ✅ All tests must pass

---

## Merge Strategy

### Squash and Merge (Preferred)
- Keeps history clean
- One commit per PR
- Preserves PR context

### Merge Commit
- For feature branches with meaningful commits
- Preserves full history

### Rebase
- For personal feature branches
- Keep main/develop clean

---

## Code Review Requirements

### Reviewer Assignment

**By Component/Platform:**
- Frontend: Frontend Lead
- Backend: Backend Lead
- Mobile: Mobile Lead
- QA: QA Lead
- Design: Design Lead

**By Region (if multi-region):**
- Region A: Regional Lead A
- Region B: Regional Lead B
- Region C: Regional Lead C

**Note:** Configure actual reviewers in `.claude/project-contexts/[your-project]/team.md`

### Review Checklist
- [ ] Code quality
- [ ] Tests coverage
- [ ] Documentation
- [ ] No console.logs
- [ ] Naming conventions
- [ ] Performance considerations

---

## Forbidden Actions

### ❌ Never Do:
- Force push to `main`/`develop`
- Commit directly to protected branches
- Merge without approval
- Skip CI/CD checks
- Commit secrets/credentials
- Use `--no-verify`

---

## Best Practices

### Do's ✅
- ✅ Commit often with meaningful messages
- ✅ Keep commits atomic
- ✅ Write descriptive PR descriptions
- ✅ Request reviews from right people
- ✅ Address review comments
- ✅ Keep branches up to date

### Don'ts ❌
- ❌ Commit WIP code to shared branches
- ❌ Mix multiple concerns in one commit
- ❌ Write vague commit messages
- ❌ Ignore CI failures
- ❌ Merge stale branches

---

**Applied in:** Phase 5b (Implementation), Phase 6 (Code Review), Phase 8 (Documentation)

