# 1Password MCP Server

MCP server that exposes 1Password CLI operations to AI agents (GitHub Copilot `secrets-manager`).

## Tools

| Tool | Description | Security |
|------|-------------|----------|
| `op_get_secret` | Validate a secret reference and return op:// URI | Never returns raw value |
| `op_list_items` | List items in vault with op:// references | No secret values |
| `op_create_secret` | Create credential with generated password | Returns op:// only |
| `op_inject_env` | Validate op:// references in a .env file | Masked output |

## Requirements

- Node.js >= 18
- 1Password CLI (`op`) installed and authenticated
- Biometric unlock enabled (required by 1Password CLI integration)

## Setup

```bash
cd mcp-server
npm install
```

## VS Code Integration

Configured in `.vscode/mcp.json`. VS Code loads this server automatically when the workspace opens.

After VS Code loads the server, Copilot agents can call tools like:
- `op_list_items` to see vault contents
- `op_get_secret` to get a validated op:// reference
- `op_create_secret` to create new credentials
- `op_inject_env` to validate a .env file

## Testing

```bash
# Test startup
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | node src/index.js

# Test list items (PowerShell)
@(
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}',
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"op_list_items","arguments":{"vault":"Programing"}}}'
) -join "`n" | node src/index.js
```

## Security Design

- Raw secret values are **never** returned in tool responses
- All tools return `op://` references that resolve at runtime via `op run`
- The MCP server does not cache or store any values
- Audit trail preserved in 1Password activity log
