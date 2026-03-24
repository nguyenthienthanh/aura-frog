# Command: plugin:update

**Category:** Plugin Management
**Syntax:** `plugin:update`

---

## Purpose

Check for and install the latest version of Aura Frog.

---

## Usage

```bash
# Check for updates
plugin:update

# Force check (skip daily cache)
plugin:update --force
```

---

## Update Command

```bash
/plugin marketplace update aurafrog
```

After updating, restart Claude Code:
```bash
/exit
claude
```

---

## Troubleshooting

### "marketplace not found"
```bash
/plugin marketplace add nguyenthienthanh/aura-frog
/plugin marketplace update aurafrog
```

### "plugin not installed"
```bash
/plugin install aura-frog@aurafrog
```

---

## Auto-Check

Aura Frog checks for updates daily on session start (async, non-blocking).
Set `AF_UPDATE_CHECK=false` in `.envrc` to disable.

---

**Version:** 1.0.0
