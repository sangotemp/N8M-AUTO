# AGENTS.md — n8m-auto Project Conventions

> Maintained by the **orchestrator** agent. Updated after each significant decision or pattern discovery.
> Reference: [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/agents) (verified April 5, 2026)

---

## Architecture Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-05 | 1Password CLI for all secrets via `op://` references | Zero-trust, audit trail, auto-rotation detection |
| 2026-04-05 | `op run --env-file=.env -- docker compose up -d` as deploy pattern | Secrets never touch disk |
| 2026-04-05 | MCP server via stdio transport (Node.js) | Zero-trust tool exposure for secrets-manager agent |
| 2026-04-05 | Personal 1Password account (not enterprise) | All features work identically |

## Conventions

### Commit Protocol (MANDATORY)
1. `security-analyst` must sign off before `historian` commits
2. `secrets-manager` must scan for secret exposure before any commit
3. No vault IDs, item IDs, or internal identifiers in commit messages or files
4. Pre-commit hook enforced at `.git/hooks/pre-commit`

### Secrets
- Vault: `Programing` (personal account)
- Pattern: `op://Programing/<item-name>/<field>`
- Deploy: `op run --env-file=.env -- docker compose up -d`
- Never: hardcoded values, vault IDs in git, `.env` tracked

### Infrastructure
- n8n on port 5678, bridge network `n8n-net`
- Health check: `http://localhost:5678/healthz`
- Volume: `n8n_data` (named, local driver)
- Timezone: America/Montreal

### Agent Delegation Chain
```
User → orchestrator → [specialist agents] → security-analyst → secrets-manager → historian → git commit
```

### MCP Server
- Path: `mcp-server/src/index.js`
- Transport: stdio
- VS Code config: `.vscode/mcp.json`
- Tools: `op_list_items`, `op_get_secret`, `op_create_secret`, `op_inject_env`
- Security: raw values never returned in responses

## Patterns Discovered

### op:// Reference Pattern
```env
# .env
N8N_BASIC_AUTH_USER=op://Programing/item-name/username
N8N_BASIC_AUTH_PASSWORD=op://Programing/item-name/password
```

### Docker Deployment
```bash
op run --env-file=".env" -- docker compose up -d
```

### Rotation Detection
1Password uses SHA-256 hash comparison to detect rotation — no restart needed.

## Agent Memory Locations

| Agent | Memory Path |
|-------|-------------|
| orchestrator | `.memories/orchestrator/` |
| historian | `.memories/historian/` |
| solution-architect | `.memories/solution-architect/` |
| system-architect | `.memories/system-architect/` |
| sysadmin | `.memories/sysadmin/` |
| programmer | `.memories/programmer/` |
| security-analyst | `.memories/security-analyst/` |
| secrets-manager | `.memories/secrets-manager/` |

## Security Findings Log

| Date | Finding | Severity | Status |
|------|---------|----------|--------|
| 2026-04-05 | Vault ID in committed files and commit messages | Medium | Fixed (commit d4fad41) |
| 2026-04-05 | No pre-commit hook protecting against secret leaks | Medium | Fixed (.git/hooks/pre-commit) |
| 2026-04-05 | git init not done before first commits | N/A | Fixed |

## Tools Available to Agents

| Tool | Description |
|------|-------------|
| `read` | Read files in workspace |
| `search` | Search workspace (semantic + grep) |
| `edit` | Edit files |
| `execute` | Run terminal commands |
| `agent` | Invoke subagents |
| `web` | Fetch web pages |
| `todo` | Manage todo list |
| `github/*` | GitHub operations (PR, issues) |
