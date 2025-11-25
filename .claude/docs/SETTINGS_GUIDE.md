# CCPM Auto-Approval Settings Guide

**Purpose:** Configure which commands Claude Code can run without asking permission every time.

---

## 📁 Files

- `.claude/settings.example.json` - Template with examples
- `.claude/settings.local.json` - Your actual settings (git-ignored)

---

## 🚀 Quick Setup

### 1. Copy Template

```bash
cp .claude/settings.example.json .claude/settings.local.json
```

### 2. Update Paths

Replace generic paths with your absolute project path:

**Before:**
```json
"Bash(bash **/.claude/scripts/**/*.sh:*)"
```

**After:**
```json
"Bash(bash /Users/yourname/projects/your-project/.claude/scripts/**/*.sh:*)"
```

### 3. Customize Commands

Add your frequently used commands to the `allow` list.

---

## 📋 Permission Lists

### `allow` - Auto-approve without prompt

**What to include:**
- ✅ Read-only operations (`ls`, `cat`, `grep`)
- ✅ Linting & formatting (`prettier`, `eslint`)
- ✅ Type checking (`tsc --noEmit`)
- ✅ Running tests (`jest`, `vitest`)
- ✅ Build commands (`yarn build`)
- ✅ CCPM scripts (`.claude/scripts/`)

**Examples:**
```json
"allow": [
  "Bash(npx prettier:*)",
  "Bash(yarn lint:*)",
  "Bash(npx jest:*)",
  "Bash(ls:*)",
  "Bash(git status:*)"
]
```

### `deny` - Always block (takes precedence)

**What to include:**
- ❌ Destructive operations (`rm -rf`)
- ❌ Sudo commands
- ❌ Force push
- ❌ Publishing packages
- ❌ Hard resets

**Examples:**
```json
"deny": [
  "Bash(rm -rf:*)",
  "Bash(sudo:*)",
  "Bash(git push --force:*)",
  "Bash(npm publish:*)"
]
```

### `ask` - Prompt user for confirmation

**What to include:**
- 🤔 Write operations (`git commit`, `git add`)
- 🤔 Package installations (`npm install`)
- 🤔 Database migrations
- 🤔 Branch operations (`git checkout`, `git merge`)

**Examples:**
```json
"ask": [
  "Bash(git commit:*)",
  "Bash(npm install:*)",
  "Bash(php artisan migrate:*)"
]
```

---

## 🎯 Common Configurations

### React Native Project

```json
{
  "permissions": {
    "allow": [
      "Bash(npx tsc:*)",
      "Bash(npx prettier:*)",
      "Bash(npx eslint:*)",
      "Bash(yarn lint:*)",
      "Bash(yarn test:*)",
      "Bash(yarn jest:*)",
      "Bash(npx react-native:*)",
      "Bash(yarn ios:*)",
      "Bash(yarn android:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(git status:*)"
    ]
  }
}
```

### Laravel Project

```json
{
  "permissions": {
    "allow": [
      "Bash(php artisan test:*)",
      "Bash(phpunit:*)",
      "Bash(composer validate:*)",
      "Bash(php -l:*)",
      "Bash(php artisan route:list:*)",
      "Bash(php artisan config:cache:*)",
      "Bash(ls:*)",
      "Bash(cat:*)"
    ],
    "ask": [
      "Bash(php artisan migrate:*)",
      "Bash(composer install:*)",
      "Bash(composer update:*)"
    ]
  }
}
```

### Vue.js Project

```json
{
  "permissions": {
    "allow": [
      "Bash(npx vue-tsc:*)",
      "Bash(npx prettier:*)",
      "Bash(npx eslint:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run test:unit:*)",
      "Bash(npx vitest:*)",
      "Bash(npm run build:*)",
      "Bash(ls:*)",
      "Bash(git status:*)"
    ]
  }
}
```

### Next.js Project

```json
{
  "permissions": {
    "allow": [
      "Bash(npx tsc:*)",
      "Bash(npx prettier:*)",
      "Bash(npx eslint:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run test:*)",
      "Bash(npx jest:*)",
      "Bash(npm run build:*)",
      "Bash(npm run type-check:*)",
      "Bash(ls:*)",
      "Bash(git diff:*)"
    ]
  }
}
```

---

## 🔍 Pattern Syntax

### Wildcards

**`*` - Match any text (single level)**
```json
"Bash(npx prettier:*)"
// Matches: npx prettier --check
// Matches: npx prettier --write src/
```

**`**` - Match any path (multiple levels)**
```json
"Bash(bash **/.claude/scripts/**/*.sh:*)"
// Matches: bash /any/path/.claude/scripts/test.sh
// Matches: bash /other/.claude/scripts/folder/test.sh
```

### Command Format

```json
"Bash(command:arguments)"
```

**Parts:**
- `Bash()` - Shell command wrapper
- `command` - The actual command (npm, yarn, git, etc.)
- `:` - Separator
- `arguments` - Command arguments (can use `*` wildcard)

---

## 🎨 Best Practices

### 1. Start Restrictive, Add as Needed

```json
{
  "permissions": {
    "allow": [
      "Bash(ls:*)",
      "Bash(cat:*)"
    ]
  }
}
```

When Claude asks for permission:
1. Review the command
2. If safe and frequent, add to `allow`
3. If dangerous, add to `deny`
4. If needs review, add to `ask`

### 2. Group by Category

```json
{
  "permissions": {
    "allow": [
      "# Linting",
      "Bash(npx prettier:*)",
      "Bash(npx eslint:*)",
      
      "# Testing",
      "Bash(npx jest:*)",
      "Bash(yarn test:*)",
      
      "# Read-only",
      "Bash(ls:*)",
      "Bash(cat:*)"
    ]
  }
}
```

### 3. Use Absolute Paths for Scripts

**Bad:**
```json
"Bash(bash .claude/scripts/*.sh:*)"
```

**Good:**
```json
"Bash(bash /Users/you/project/.claude/scripts/*.sh:*)"
```

### 4. Separate Project-Specific Settings

Keep in `.claude/settings.local.json` (git-ignored):
- Absolute paths
- Personal preferences
- Local tool versions

Keep in `.claude/settings.example.json` (git-tracked):
- Generic patterns
- Common commands
- Documentation

---

## 🛡️ Security Considerations

### Never Auto-Approve

**Destructive:**
- `rm`, `mv`, `cp` (write operations)
- `sudo` (elevated permissions)
- `chmod 777` (permission changes)

**External:**
- `curl`, `wget` (network operations)
- `npm publish` (package publishing)
- `git push` (repository changes)

**Database:**
- `DROP TABLE`
- `TRUNCATE`
- Production migrations

### Safe to Auto-Approve

**Read-only:**
- `ls`, `cat`, `grep`, `find`, `head`, `tail`
- `git status`, `git diff`, `git log`

**Validation:**
- Linters, formatters, type checkers
- Test runners (without coverage reporting to external services)

**Build (local):**
- `tsc --noEmit`, `yarn build` (local builds)

---

## 🔧 Troubleshooting

### Commands Still Asking Permission

**Problem:** Added to `allow` but still prompts

**Solutions:**
1. Check path is absolute, not relative
2. Verify wildcard syntax (`*` vs `**`)
3. Check for typos in command name
4. Restart Cursor to reload settings

### Commands Being Blocked

**Problem:** Command in `allow` but gets blocked

**Possible causes:**
1. Also in `deny` list (deny takes precedence)
2. Path doesn't match pattern
3. Command syntax different from pattern

**Debug:**
```json
// Log what's being matched
"Bash(echo Testing allow list:*)"
```

### Wildcard Not Working

**Problem:** `*` doesn't match expected commands

**Check:**
- Single `*` only matches within same directory level
- Use `**` for multi-level paths
- Path separators matter (`/` vs `\`)

---

## 📊 Template Breakdown

### Example Settings Explained

```json
{
  "permissions": {
    "allow": [
      // 1. CCPM Scripts - Auto-run workflow commands
      "Bash(bash **/.claude/scripts/**/*.sh:*)",
      
      // 2. Linting - Check code quality without changes
      "Bash(npx prettier:*)",
      "Bash(yarn lint:*)",
      
      // 3. Testing - Run tests to verify changes
      "Bash(npx jest:*)",
      "Bash(yarn test:*)",
      
      // 4. File Ops - Read files for context
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(grep:*)",
      
      // 5. Git Read - Check repository state
      "Bash(git status:*)",
      "Bash(git diff:*)"
    ],
    
    "deny": [
      // Block dangerous operations
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Bash(git push --force:*)"
    ],
    
    "ask": [
      // Confirm before modifying
      "Bash(git commit:*)",
      "Bash(npm install:*)"
    ]
  },
  
  "auto_approve": {
    "enabled": true,
    "actions": [
      "read_file",    // Reading files
      "list_dir",     // Listing directories
      "grep",         // Searching content
      "codebase_search" // Semantic search
    ]
  },
  
  "workflow": {
    "auto_continue_after_approval": true,  // Auto-proceed to next phase
    "show_token_usage": true,              // Show token count
    "token_warning_threshold": 150000,     // Warn at 150K tokens
    "default_test_coverage": 80            // Default coverage goal
  }
}
```

---

## ✅ Quick Reference

| List | Purpose | Precedence |
|------|---------|------------|
| `allow` | Auto-approve | 2nd |
| `deny` | Always block | 1st (highest) |
| `ask` | Prompt user | 3rd |

**Priority:** `deny` > `allow` > `ask` > default (ask)

---

## 🎯 Next Steps

1. ✅ Copy `settings.example.json` to `settings.local.json`
2. ✅ Update paths with your absolute project path
3. ✅ Add your frequently used commands
4. ✅ Test with a workflow command
5. ✅ Adjust as needed based on prompts

**Your `.claude/settings.local.json` is already configured! Just customize as needed! 🎉**

---

**Questions?**
- Check: `.claude/README.md`
- Check: `.claude/GET_STARTED.md`
- Review: Example patterns above

