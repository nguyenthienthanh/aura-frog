# Plugin Installation - Advanced

**For standard installation, see:** `GET_STARTED.md`

This guide covers manual installation and troubleshooting only.

---

## Manual Installation (Advanced Users)

If plugin commands don't work, install manually:

```bash
# Clone to plugins directory
mkdir -p ~/.claude/plugins/marketplaces/aurafrog
git clone https://github.com/nguyenthienthanh/aura-frog.git \
  ~/.claude/plugins/marketplaces/aurafrog/aura-frog

# Create settings.local.json (REQUIRED)
cd ~/.claude/plugins/marketplaces/aurafrog/aura-frog
cp settings.example.json settings.local.json
```

---

## Troubleshooting

```toon
issues[4]{symptom,cause,fix}:
  No Aura Frog banner,Missing .claude/CLAUDE.md,Run setup:activate
  Commands not found,Plugin not loaded,Run /plugin list to verify
  MCP not working,Missing env vars,Check .envrc and run mcp:status
  Agents not detected,No project context,Run project:init
```

### Quick Fix Checklist

1. Verify plugin: `/plugin list` shows `aura-frog`
2. Activate in project: `setup:activate`
3. Start NEW Claude Code session
4. Test: Type "how are you" - should see banner

### Detailed Troubleshooting

See: `docs/PLUGIN_TROUBLESHOOTING.md`

---

## Uninstall

```bash
/plugin uninstall aura-frog@aurafrog
```

---

**Version:** 1.4.1
