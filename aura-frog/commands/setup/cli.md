# Command: setup:cli

**Category:** Setup
**Syntax:** `setup:cli`

## Purpose

Install the `af` CLI tool globally so users can type `af` anywhere in their terminal.

## Execution

Show the user the install command and ask them to run it:

```
🐸 Install Aura Frog CLI

The af CLI lets you run health checks, performance reports, and setup guides
outside of Claude Code.

Run ONE of these in your terminal:

  # Option 1: Symlink (recommended)
  sudo ln -sf "$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts/af" /usr/local/bin/af

  # Option 2: Add to PATH (no sudo)
  echo 'export PATH="$HOME/.claude/plugins/marketplaces/aurafrog/aura-frog/scripts:$PATH"' >> ~/.zshrc
  source ~/.zshrc

Then type: af doctor
```

## After Install

```
af setup remote     # Remote control guide
af setup channels   # Telegram/Discord channels
af setup slack      # Slack notifications
af setup schedule   # Scheduled tasks
af doctor           # Health check
af measure          # Performance report
```
