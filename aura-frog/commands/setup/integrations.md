# Command: setup:integrations

**Purpose:** Interactive setup for Jira, Confluence, Slack, and Figma integrations
**Category:** Setup

---

## Usage

```
setup:integrations                # Full interactive setup
setup:integrations --skip-install # Skip direnv installation
setup:integrations --test-only    # Only test connections
setup:integrations --reconfigure  # Update existing config
```

---

## What It Does

```toon
steps[8]{step,action}:
  1. Prerequisites,Check shell + direnv + existing config
  2. Install,Install direnv if needed (prompts for permission)
  3. Configure,Interactive prompts for each integration
  4. Generate,.envrc with credentials (git-ignored)
  5. gitignore,Update to ignore secrets
  6. Allow,direnv allow + reload variables
  7. Test,Verify all connections work
  8. Permissions,Update settings.local.json
```

---

## Integrations Configured

```toon
integrations[4]{service,credentials}:
  Jira,URL + email + API token + project key
  Confluence,URL + email + API token + space key
  Slack,Bot token OR webhook URL + channel ID
  Figma,Personal access token
```

---

## File Structure After Setup

```
project/
├── .envrc                 # Loads aura-frog config (can commit)
└── aura-frog/
    ├── .envrc             # Secrets (git-ignored)
    └── .gitignore         # Updated to ignore .envrc
```

---

## Security Features

- ✅ Secrets stay in `.envrc` (git-ignored)
- ✅ Main `.envrc` has no secrets (safe to commit)
- ✅ Token masking during input
- ✅ Backup before reconfiguring
- ✅ Immediate validation of tokens

---

## Getting Tokens

| Service | URL |
|---------|-----|
| Jira/Confluence | https://id.atlassian.com/manage-profile/security/api-tokens |
| Slack Bot | https://api.slack.com/apps |
| Figma | Figma → Settings → Personal access tokens |

---

## Troubleshooting

```bash
# If direnv not loading
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc && source ~/.zshrc

# If variables not available
direnv allow . && direnv reload

# Test integration manually
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" "$JIRA_URL/rest/api/3/myself"
```

---

**Version:** 2.0.0
