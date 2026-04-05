# 1Password MCP Security Integration

## Overview

According to [1Password + Runlayer MCP Security Blog](https://1password.com/blog/secure-mcp-credentials-1password-runlayer) (published March 20, 2026 - verified April 5, 2026):

MCP (Model Context Protocol) platforms can integrate with 1Password to resolve credentials at runtime using the `op://` reference pattern, keeping secrets in the vault instead of platform databases.

## Personal Account Support

✅ **Personal 1Password accounts** support the op:// reference pattern and CLI integration
- All features work with personal accounts
- No enterprise/service account required for basic MCP integration
- 1Password CLI works identically for personal and business accounts

## Security Principles

From [1Password's AI Security Principles](https://1password.com/blog/security-principles-guiding-1passwords-approach-to-ai) (verified April 5, 2026):

1. **Secrets stay secret** - Credentials live exclusively in the vault, never in plaintext
2. **Least privilege** - Secrets exist in memory only for the duration of the request
3. **Full auditability** - Every fetch and rotation is logged with hash-based traceability

## op:// Reference Pattern

### Format

```
op://vault-name/item-name/field-name
```

### Example: MCP Server Credentials

Instead of hardcoding:
```
GITHUB_TOKEN=ghp_actual_token_value
```

Use a reference:
```
GITHUB_TOKEN=op://Programing/github-mcp-token/token
```

### How It Works

1. **Store credential** in 1Password vault
2. **Use op:// reference** in config files or environment variables
3. **Resolve at runtime** - The 1Password SDK/CLI resolves the live value only when needed
4. **No persistence** - Secret exists in memory for the request duration, then discarded

## MCP Integration (Optional)

If using MCP platforms like Runlayer, Claude Desktop, or similar:

### Setup

1. **Create MCP credentials in 1Password Programing vault**:
```powershell
op item create --vault Programing \
  --category "API Credential" \
  --title "github-mcp-token" \
  github_token[password]="ghp_your_token_here"

op item create --vault Programing \
  --category "API Credential" \
  --title "slack-mcp-token" \
  slack_token[password]="xoxb-your-token"
```

2. **Configure MCP server with op:// references**:
```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "op://Programing/github-mcp-token/token"
      }
    },
    "slack": {
      "command": "mcp-server-slack",
      "env": {
        "SLACK_TOKEN": "op://Programing/slack-mcp-token/token"
      }
    }
  }
}
```

3. **Run with 1Password CLI**:
```powershell
# Authenticate first
op signin

# Run MCP with credential injection
op run -- your-mcp-command
```

The `op run` command automatically resolves all `op://` references in environment variables before executing.

## Automatic Rotation Detection

Per [1Password MCP Blog](https://1password.com/blog/secure-mcp-credentials-1password-runlayer) (March 2026):

When you rotate a credential in 1Password:
- Next connection automatically picks up the new value
- Uses SHA-256 hash comparison to detect rotation
- Zero downtime, no config changes needed
- Audit event logged: `secret_provider.rotated`

## Benefits for n8n-auto

1. **n8n Workflows** - Use op:// for webhook secrets, API keys
2. **Docker Secrets** - Inject at runtime without storing in compose files
3. **CI/CD** - GitHub Actions can use op:// references
4. **MCP Agents** - If using Copilot CLI with MCP, credentials stay in vault

## Implementation Examples

### Docker Compose with op://

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    environment:
      - N8N_BASIC_AUTH_PASSWORD=op://Programing/n8n-admin/password
      - N8N_API_KEY=op://Programing/n8n-api-key/password
```

Run with:
```powershell
op run -- docker compose up -d
```

### GitHub Actions (if using CI/CD)

```yaml
- name: Deploy with secrets
  run: op run -- ./deploy.sh
  env:
    OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
```

### n8n Workflow Credentials

Instead of storing credentials in n8n's credential store, use op:// in webhook URLs or environment variables that n8n can access.

## Audit Trail

Every secret access generates audit events:
- `secret_provider.fetched` - When credential is resolved
- `secret_provider.rotated` - When rotation is detected
- Hash-based traceability (SHA-256)
- No credential values logged

View in 1Password Activity Log:
```powershell
op account get --format json | jq '.url'
# Visit: https://my.1password.com/activity
```

## Security Checklist

- [ ] All MCP/agent credentials stored in Programing vault
- [ ] Use op:// references instead of plaintext in configs
- [ ] Run services with `op run --` for automatic injection
- [ ] Rotate credentials regularly (1Password detects automatically)
- [ ] Review audit logs monthly for unexpected access
- [ ] Never commit op:// references if they reveal vault structure (use .env)
- [ ] Test credential rotation without downtime

## Reference Links

Verified April 5, 2026:

- [1Password MCP Security Blog](https://1password.com/blog/secure-mcp-credentials-1password-runlayer) - MCP integration with Runlayer
- [1Password Unified Access](https://1password.com/product/unified-access) - Identity security for humans and AI agents
- [1Password AI Security Principles](https://1password.com/blog/security-principles-guiding-1passwords-approach-to-ai) - August 2025
- [1Password CLI Reference](https://developer.1password.com/docs/cli/reference/) - Command reference
- [1Password Secret References](https://developer.1password.com/docs/cli/secret-references/) - op:// format documentation
- [1Password Service Accounts](https://developer.1password.com/docs/service-accounts/) - For CI/CD automation

## Future Enhancements (Roadmap)

Per 1Password blog (March 2026), upcoming features:
- **Coordinated rotation** - Automated rotation triggered by policy
- **Full agent identity lifecycle** - Auto-create vault items when agents are created
- **OAuth token support** - Extend op:// to OAuth client secrets and refresh tokens

---

**Next Steps**: See [docs/SECRETS_MANAGER.md](../SECRETS_MANAGER.md) for n8n-auto specific patterns.
