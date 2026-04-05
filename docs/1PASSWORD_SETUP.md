# 1Password Setup Guide

This guide helps you set up **1Password CLI** to work with the n8n-auto project's shared `Programing` vault.

## Prerequisites

- [1Password account](https://1password.com/) (personal or team)
- [1Password CLI installed](https://developer.1password.com/docs/cli/get-started) (verified 2026-04-05)

## Setup Steps

### 1. Authenticate 1Password CLI

```powershell
op account add
```

Follow the prompts to sign in. This creates a secure local session.

### 2. Verify Access to Programing Vault

The n8n-auto project uses the shared **Programing** vault (ID: `nhqglql2e6aig6er5zz6vbkwwq`).

```powershell
# Verify vault access
op vault get Programing

# List items in vault
op item list --vault Programing
```

### 3. Add Secrets

Create each secret in the **Programing** vault. Use the `secrets-manager` agent to retrieve them at runtime.

According to [1Password Item Management Documentation](https://developer.1password.com/docs/cli/reference/commands/item-create) 
(verified 2026-04-05):

#### Example: n8n admin credentials

```powershell
# Generate a strong password
op item create \
  --vault Programing \
  --category password \
  --title "n8n-admin" \
  --generate-password=32

# Set the username field
op item edit "n8n-admin" --vault Programing username=admin
```

#### Example: n8n API key
Programing \
  --category api-credential \
  --title "n8n-api-key" \
  --generate-password=32
```

### 4. View Stored Secrets

```powershell
# List all items in the Programing vault
op item list --vault Programing

# Get a specific secret
op item get "n8n-admin" --vault Programing --format json
```

## Usage Workflow

### Starting n8n with Secrets

Per [1Password Security Best Practices](https://developer.1password.com/docs/cli/secrets-environment-variables/) 
(verified 2026-04-05), **never** hardcode secrets. Always retrieve them at runtime:

```powershell
# Load from 1Password (not stored anywhere)
$env:N8N_BASIC_AUTH_PASSWORD = op item get "n8n-admin" --vault Programing --field password

# Start the container
docker compose up -d

# Unset after done (optional, but good practice)
Remove-Item env:N8N_BASIC_AUTH_PASSWORD
```

### For Automation Scripts

Create a helper script `scripts/load-secrets.ps1`:

```powershell
# Load all n8n secrets into environment from Programing vault
$env:N8N_BASIC_AUTH_USER = op item get "n8n-admin" --vault Programing --field username
$env:N8N_BASIC_AUTH_PASSWORD = op item get "n8n-admin" --vault Programing --field password
$env:N8N_API_KEY = op item get "n8n-api-key" --vault Programing --field password

# Export them for docker-compose
docker compose up -d
```

Then use:

```powershell
. .\scripts\load-secrets.ps1
```

## Security Best Practices

✅ **DO**
- Store all credentials in 1Password Programing vault
- Load secrets at **runtime** only
- Use strong, generated passwords (32+ chars)
- Rotate secrets periodically (every 90 days)
- Keep `.env` in `.gitignore` and never commit
- Log out of `op` session when done (`op signout`)

❌ **DON'T**
- Commit `.env` files with real secrets
- Put secrets in docker-compose.yml files
- Hardcode passwords in scripts
- Share vault access without audit trail
- Store secrets in version control

## Troubleshooting

### "op: command not found"

Per [1Password CLI Installation Guide](https://developer.1password.com/docs/cli/get-started) 
(verified 2026-04-05):

1Password CLI is not in your PATH. Reinstall:

```powershell
winget install 1password-cli
# or
brew install 1password-cli        # macOS
sudo apt install 1password         # Linux (if available)
```

Then restart Terminal.

### "Authentication required"

Your `op` session expired. Re-authenticate:

```powershell
op account add
```

### "Item not found" or "Vault not found"

Verify the secret exists in the Programing vault:

```powershell
op vault list
op item list --vault Programing
```

Check the exact title matches. If the vault is not visible, verify your 1Password account has access.

## Delegating to secrets-manager Agent

When you need Copilot to manage secrets, use the **secrets-manager** agent:

```
@orchestrator I need to add new API keys for the n8n service
```

The orchestrator will delegate to `secrets-manager`, which will:
1. Help you create the vault item in the Programing vault
2. Provide retrieval commands for your scripts
3. Ensure other agents use the secrets securely

See agent documentation: [docs/SECRETS_MANAGER.md](./SECRETS_MANAGER.md)

---

**References**:
- [1Password CLI Documentation](https://developer.1password.com/docs/cli) (official)
- [1Password CLI Reference](https://developer.1password.com/docs/cli/reference/commands/) (command reference)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (security standards)
