# n8n-auto — Project Guidelines

## Overview

Ce projet fournit une infrastructure **n8n** conteneurisée (Docker) intégrée avec **GitHub Copilot CLI**. L'objectif est de permettre l'automatisation de workflows n8n portable et reproductible.

## Architecture

- **n8n** tourne dans un conteneur Docker (voir `docker/`)
- L'infrastructure est définie en tant que code (Docker Compose, configs)
- Les agents Copilot collaborent via le dossier `.github/agents/`

## Langue

- Le code, les commits et la documentation technique sont en **anglais**
- Les échanges avec l'utilisateur peuvent être en **français**

## Code Style

- YAML : indentation 2 espaces, pas de tabs
- Shell scripts : `set -euo pipefail`, shebang `#!/usr/bin/env bash`
- Docker : multi-stage builds quand pertinent, images slim/alpine préférées
- Secrets : jamais en clair dans le repo, utiliser `.env` (gitignored) ou secrets manager

## Build and Test

```bash
# Démarrer n8n
docker compose up -d

# Vérifier le statut
docker compose ps

# Logs
docker compose logs -f n8n

# Arrêter
docker compose down
```

## Conventions

- **Secrets management**: All credentials go through the `secrets-manager` agent with 1Password — see `docs/1PASSWORD_SETUP.md`
- **Vault**: Use the shared `Programing` vault (ID: `nhqglql2e6aig6er5zz6vbkwwq`) for all n8n-auto secrets
- **op:// references**: Use 1Password secret references for runtime credential injection — see `docs/1PASSWORD_MCP_SECURITY.md`
- **Agent memory**: Each agent has its own `.memories/<agent-name>/` folder to store context and decisions
- Tout changement d'infra passe par le sysadmin agent
- Tout changement de code applicatif passe par le programmer agent
- Les release notes sont gérées par l'historian agent
- La revue de sécurité est faite par le security analyst agent avant tout merge
- L'orchestrateur coordonne les agents — ne pas bypasser la chaîne

## Documentation Standards

**All agents MUST follow these standards when providing explanations:**

1. **Provide Verifiable Links** (when applicable)
   - Always include direct links to official documentation
   - Use format: [Link text](https://full-url-here)
   - Verify URLs are current (not broken or redirected)

2. **Validate Content** 
   - Before citing a reference: "According to [Official Docs](link) (verified YYYY-MM-DD)..."
   - Check that information matches current library/tool versions
   - Alert if documentation is outdated

3. **Research Currency**
   - For technology recommendations: include version numbers and release dates
   - Search for breaking changes or deprecations in recent releases
   - Note if information may be outdated: "⚠️ This information is from {date}, verify against current version"

4. **Encourage Verification**
   - Suggest users: "See the official docs at [link] for the latest version"
   - Provide links to:
     - Official release notes
     - GitHub repositories
     - Security advisories (for dependencies)
     - Community resources

5. **Format Documentation References**
   ```
   ✅ Recommended:
   - According to [1Password CLI Documentation](https://developer.1password.com/docs/cli) 
     (verified 2026-04-05), the command is...
   - GitHub Release Notes: [v2.0.0](https://github.com/project/releases/tag/v2.0.0)
   - Security: See [OWASP Top 10: 2021](https://owasp.org/Top10/) for context
   
   ❌ Avoid:
   - "As some guides say..." (use actual references)
   - Citing old versions without noting date
   - Dead links or unverified sources
   ```

## Security

- Suivre les règles OWASP Top 10
- Scanner avec Snyk avant chaque commit (voir `.instructions.md` Snyk)
- Ne jamais exposer des credentials dans les fichiers versionnés
- Utiliser des réseaux Docker isolés
