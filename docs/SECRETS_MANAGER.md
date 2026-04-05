# Using the Secrets Manager Agent

The **secrets-manager** agent is your centralized point for managing all credentials and sensitive data in the n8n-auto project using 1Password.

**Account**: Personal 1Password account with `Programing` vault
**Features**: All 1Password features (CLI, op:// references, MCP integration) work with personal accounts

## Key Resources

- **[1PASSWORD_SETUP.md](1PASSWORD_SETUP.md)** - Initial setup and troubleshooting
- **[1PASSWORD_MCP_SECURITY.md](1PASSWORD_MCP_SECURITY.md)** - MCP integration with op:// references
- **[1Password CLI Reference](https://developer.1password.com/docs/cli/reference/)** - Official command documentation
- **[Secret References (op://)](https://developer.1password.com/docs/cli/secret-references/)** - Reference pattern format

## When to Use secrets-manager

Delegate to `secrets-manager` when you need to:

- ✅ Create or store new API keys, passwords, tokens
- ✅ Retrieve secrets for deployment or configuration
- ✅ Rotate or update existing credentials
- ✅ Audit secret usage across the project
- ✅ Set up 1Password vault and items
- ✅ Ensure compliance with secret storage standards

## How to Request

### Via Orchestrator

```
@orchestrator I need to add GitHub API token for n8n webhook authentication
```

The orchestrator will automatically delegate to the `secrets-manager` agent.

### Direct Request

```
@secrets-manager Create a new API key vault item for the n8n service
```

## Examples

### Example 1: Add a new credential

**You**: "I need to store the n8n license key securely"

**secrets-manager will**:
1. Create a new item in the 1Password `n8n-auto` vault
2. Generate a secure password or accept your value
3. Provide two retrieval options:

**Option A: Direct CLI** (for ad-hoc use)
```powershell
op item get "n8n-license" --vault Programing --field password
```

**Option B: op:// Reference** (recommended for automation)
```yaml
# docker-compose.yml or .env
N8N_LICENSE=op://Programing/n8n-license/password
```
2. Verify they exist in the Programing vault
3. Provide two deployment options:

**Option A: Traditional** (direct CLI)
```powershell
# Load secrets (sysadmin runs this)
$env:N8N_BASIC_AUTH_PASSWORD = op item get "n8n-admin" --vault Programing --field password
$env:N8N_API_KEY = op item get "n8n-api-key" --vault Programing --field password

docker compose up -d
```

**Option B: Modern** (op:// references with `op run`)
```yaml
# docker-compose.yml
services:
  n8n:
    environment:
      - N8N_BASIC_AUTH_PASSWORD=op://Programing/n8n-admin/password
      - N8N_API_KEY=op://Programing/n8n-api-key/password
```

Deploy with: `op run -- docker compose up -d`

**Benefits of op:// approach** (per [1Password MCP Blog, March 2026](https://1password.com/blog/secure-mcp-credentials-1password-runlayer)):
- Secrets resolved only at runtime
- Automatic rotation detection
- Zero downtime on credential  in Programing vault
2. Generate new secure passwords
3. Update 1Password items
4. Notify: If using op:// references, rotation is automatic (zero downtime)
5. Provide verification commands to test services

**Automatic Rotation** (with op:// references):
- Update credential in 1Password vault
- Next service connection automatically picks up new value
- SHA-256 hash comparison detects rotation
- Audit event logged: `secret_provider.rotated`

**Manual Rotation** (direct CLI):
- Update credential in 1Password vault
- Services need manual restart to pick up new credentials
3. Provide a safe retrieval script:

```powershell
# Load secrets (sysadmin runs this)
$env:N8N_BASIC_AUTH_PASSWORD = op item get "n8n-admin" --vault n8n-auto --field password
$env:N8N_API_KEY = op item get "n8n-api-key" --vault n8n-auto --field password

docker compose up -d
```

### Example 3: Rotate credentials

**You**: "Rotate all n8n passwords for security"

**secrets-manager will**:
1. Identify all password items
2. Generate new secure passwords
3. Update 1Password items
4. Notify affected agents (sysadmin, programmer, security-analyst)

## Integration with Other Agents

### ✅ Sysadmin + secrets-manager

**Sysadmin**: "Deploy n8n to production"
→ Requests secrets from `secrets-manager`
→ Uses them at runtime in docker-compose
→ Never stores them in files

### ✅ Programmer + secrets-manager

**Programmer**: "Create a webhook script for n8n API"
→ Requests API key from `secrets-manager`
→ Uses it in environment variable, not hardcoded
→ Tests locally with 1Password CLI with 1Password:

✅ Secrets **never appear** in:
- Git commit history
- Docker Compose files (when using op:// references)
- Environment variable files (when using op:// references)
- Logs or console output
- Copilot chat history

✅ Secrets **only exist** in:
- 1Password Programing vault (encrypted at rest)
- Runtime environment (memory only, cleared after use)

✅ All secret operations are:
- Auditable via 1Password activity logs
- Encrypted end-to-end
- Protected by your 1Password master password
- Hash-traced (SHA-256) for rotation detection

## Advanced: MCP Integration (Optional)
 with 1Password:

- 🔒 **OWASP A02:2021 — Cryptographic Failures**: Secrets encrypted at rest in vault
- 🔒 **OWASP A07:2021 — Identification and Authentication**: Proper credential storage
- 🔒 **OWASP A06:2021 — Vulnerable and Outdated Components**: Automatic rotation detection
- 🔒 **SOC 2 Type II**: Immutable audit trail with hash-based tracing
- 🔒 **ISO 27001**: Access control and secrets management

See [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) for complete standards.

## References

All links verified April 5, 2026:

- [1Password CLI Reference](https://developer.1password.com/docs/cli/reference/) - Official commands
- [Secret References (op://)](https://developer.1password.com/docs/cli/secret-references/) - Reference pattern
- [1Password MCP Security](https://1password.com/blog/secure-mcp-credentials-1password-runlayer) - MCP integration
- [1Password AI Security](https://1password.com/blog/security-principles-guiding-1passwords-approach-to-ai) - Security principles
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) - Best practices
- AI agents need access to multiple services (GitHub, Slack, APIs)
- Each service needs credentials
- Traditional approach: store in MCP platform database (secrets sprawl)

### 1Password Solution
- Store MCP credentials in Programing vault
- Use op:// references in MCP configuration
- Credentials resolved at runtime via 1Password SDK
- Zero persistence after request

### Example MCP Setup

```bash
# Create MCP server credentials
op item create --vault Programing \
  --category "API Credential" \
  --title "github-mcp-token" \
  github_token[password]="ghp_your_token"

op item create --vault Programing \
  --category "API Credential" \
  --title "slack-mcp-token" \
  slack_token[password]="xoxb_your_token"
```

```json
// MCP configuration
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "op://Programing/github-mcp-token/github_token"
      }
    }
  }
}
```

Run with: `op run -- your-mcp-launcher`

See [1PASSWORD_MCP_SECURITY.md](1PASSWORD_MCP_SECURITY.md) for complete MCP integration guide.
- Logs or console output
- Copilot chat history

✅ Secrets **only exist** in:
- 1Password vault (encrypted, your account only)
- Runtime environment (unset after use)

✅ All secret operations are:
- Auditable via 1Password activity logs
- Encrypted end-to-end
- Protected by your 1Password master password

## Compliance

By delegating secret management to `secrets-manager`, you ensure:

- 🔒 **OWASP A02:2021** — Cryptographic Failures: Secrets encrypted at rest
- 🔒 **OWASP A07:2021** — Identification and Authentication: Proper credential storage
- 🔒 **OWASP A06:2021** — Vulnerable and Outdated Components: Secrets rotated regularly
- 🔒 **Industry Standards**: (SOC 2, ISO 27001 compatible)

## Troubleshooting

### "I have a secret I need to reference"

→ Ask the `secrets-manager` agent to create/retrieve it: "Store this API key securely"

### "Other agents are hardcoding credentials"

→ Have the `orchestrator` audit all agents and enforce `secrets-manager` delegation

### "I need to audit who accessed secrets"

→ Check 1Password activity logs (Account > Activity Log), or request `secrets-manager` to generate audit report

---

**Next steps**: See [docs/1PASSWORD_SETUP.md](../1PASSWORD_SETUP.md) for initial 1Password configuration.
