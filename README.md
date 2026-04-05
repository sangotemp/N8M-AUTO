# n8n-auto

Infrastructure **n8n** conteneurisée (Docker) intégrée avec **GitHub Copilot CLI** pour l'automatisation de workflows portables et reproductibles.

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) (with active subscription)
- [1Password](https://1password.com/) account + [1Password CLI](https://developer.1password.com/docs/cli)

### Automated Setup (Recommended)

**Windows**:
```powershell
.\scripts\onboard.ps1
```

**macOS/Linux**:
```bash
./scripts/onboard.sh
```

### Manual Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd n8n-auto

# 2. Create your .env file
cp .env.example .env
# Edit .env with your own values (especially the password!)

# 3. Authenticate 1Password (for secrets manager)
op account add

# 4. Create 1Password vault
op vault create n8n-auto

# 5. Start n8n
docker compose up -d

# 6. Access n8n
# Open http://localhost:5678 in your browser
```

### Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f n8n

# Check status
docker compose ps

# Restart
docker compose restart n8n
```

## Architecture

```
n8n-auto/
├── .github/
│   ├── copilot-instructions.md    # Project-wide Copilot guidelines
│   ├── instructions/              # Shared instruction files
│   │   └── source-verification.instructions.md
│   └── agents/                    # 8 specialized agents
│       ├── orchestrator.agent.md
│       ├── secrets-manager.agent.md
│       ├── solution-architect.agent.md
│       ├── system-architect.agent.md
│       ├── sysadmin.agent.md
│       ├── programmer.agent.md
│       ├── security-analyst.agent.md
│       └── historian.agent.md
├── .memories/                     # Agent-specific memory folders
│   ├── orchestrator/
│   ├── secrets-manager/
│   ├── solution-architect/
│   ├── system-architect/
│   ├── sysadmin/
│   ├── programmer/
│   ├── security-analyst/
│   └── historian/
├── docs/
│   ├── AGENTS_GUIDE.md
│   ├── SECRETS_MANAGER.md
│   └── 1PASSWORD_SETUP.md
├── scripts/
│   ├── onboard.ps1
│   └── onboard.sh
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

Each agent has its own memory folder (`.memories/<agent-name>/`) to store:
- Architectural patterns and decisions
- Implementation patterns and best practices
- Security findings and audit results
- Issue solutions and troubleshooting notes
- Project-specific knowledge

## Copilot Agents

This project uses a multi-agent workflow via GitHub Copilot:

| Agent | Role |
|-------|------|
| **Orchestrator** | Coordinates all agents, main entry point |
| **Secrets Manager** | Manages 1Password integration, credentials |
| **Solution Architect** | Designs high-level solutions |
| **System Architect** | Decomposes solutions into components |
| **Sysadmin** | Implements infrastructure & Docker |
| **Programmer** | Implements application code |
| **Security Analyst** | Reviews security before merge |
| **Historian** | Creates release notes & commit messages |

## Documentation

- **[docs/AGENTS_GUIDE.md](docs/AGENTS_GUIDE.md)** — How to work with 8 agents (START HERE for agents)
- **[docs/AGENT_MEMORY_SYSTEM.md](docs/AGENT_MEMORY_SYSTEM.md)** — How agent memories work (.memories/ folders)
- **[docs/SECRETS_MANAGER.md](docs/SECRETS_MANAGER.md)** — Secrets manager agent with 1Password examples
- **[docs/1PASSWORD_SETUP.md](docs/1PASSWORD_SETUP.md)** — Detailed 1Password CLI setup and troubleshooting
- **[docs/1PASSWORD_MCP_SECURITY.md](docs/1PASSWORD_MCP_SECURITY.md)** — MCP integration with op:// references (optional)

### Workflow

```
User Request → Orchestrator → (Secrets Manager if needed) 
                                        ↓
                              Solution Architect → System Architect
                                        ↓
                              Sysadmin + Programmer
                                        ↓
                              Security Analyst → Historian
```

## Security

- **Secrets**: Managed by `secrets-manager` agent using 1Password — see [docs/1PASSWORD_SETUP.md](docs/1PASSWORD_SETUP.md)
- No secrets in version control — use `.env` (gitignored) for development only
- Snyk scanning before every commit
- OWASP Top 10 compliance reviewed by security-analyst agent
- Isolated Docker networks

## License

Private project.
