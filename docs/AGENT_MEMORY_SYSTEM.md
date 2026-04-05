# Agent Memory System

The n8n-auto project uses a memory system where each agent maintains its own knowledge base.

## Why Agent Memories?

- **Continuity**: Agents remember solutions to recurring problems
- **Learning**: Patterns and best practices are documented and reused
- **Efficiency**: Less research needed when similar problems are encountered
- **Quality**: Maintains consistent decision-making across the project

## Memory Locations

Each agent has a dedicated memory folder:

```
.memories/
├── orchestrator/          # Orchestration patterns and workflows
├── secrets-manager/       # Vault structure and credential management
├── solution-architect/    # Solution designs and trade-off analysis
├── system-architect/      # Technical decompositions and specs
├── sysadmin/             # Infrastructure patterns and deployments
├── programmer/           # Code patterns and implementation practices
├── security-analyst/     # Security findings and OWASP audits
└── historian/            # Release patterns and changelog formats
```

## What Gets Stored

| Agent | Stores |
|-------|--------|
| **Orchestrator** | Workflow patterns, multi-agent coordination, project conventions |
| **Secrets Manager** | Vault structure, credential rotation, security audit findings |
| **Solution Architect** | Design proposals, trade-off analysis, architectural patterns |
| **System Architect** | Technical decompositions, component specs, interface definitions |
| **Sysadmin** | Docker configs, deployment procedures, infrastructure troubleshooting |
| **Programmer** | Code patterns, testing strategies, API integration, security practices |
| **Security Analyst** | OWASP findings, CVE results, vulnerability remediation, compliance notes |
| **Historian** | Release templates, changelog entries, commit message patterns |

## How Agents Use Memories

**When starting work:**
```
Agent checks: .memories/<agent-name>/
"Do I know a pattern for this?"
"Has this been solved before?"
"What issues did we encounter last time?"
```

**After completing work:**
```
Agent saves: .memories/<agent-name>/<topic>.md
"Store this pattern for future use"
"Document the solution to this problem"
"Keep this architectural decision"
```

## Example Memory Files

### secrets-manager/vault-structure.md
```markdown
# Programing Vault Structure

Items currently in vault:
- n8n-admin (username: admin, password: 32-char generated)
- n8n-api-key (API credential for headless mode)

Rotation schedule:
- n8n-admin: Q1, Q3 (every 6 months)
- API keys: On deployment or per service requirement
```

### sysadmin/n8n-deployment-checklist.md
```markdown
# n8n Deployment Checklist

Pre-deployment:
- [ ] Run `docker compose config` to validate syntax
- [ ] Verify `docker-compose.yml` has health check configured
- [ ] Ensure Programing vault is accessible via `op vault get Programing`

Security:
- [ ] Image: n8nio/n8n:latest (verify CVEs with Trivy)
- [ ] No hardcoded secrets in compose file
- [ ] All credentials from secrets-manager
- [ ] Network is isolated (not 'host' mode)
```

### programmer/n8n-node-patterns.md
```markdown
# n8n Node Implementation Patterns

Common patterns for custom n8n nodes:
1. Input validation at system boundaries
2. Error handling with try-catch for API calls
3. Secure credential retrieval via 1Password
4. Test suite for happy path and error cases

API integration:
- Use axios for HTTP requests
- Include retry logic for transient failures
- Always validate API responses before processing
```

### security-analyst/owasp-audit-n8n-docker.md
```markdown
# OWASP Audit: n8n Docker Deployment

### A02:2021 - Cryptographic Failures
✅ PASS - Secrets stored in 1Password (encrypted at rest)
✅ PASS - TLS enabled for external communication
⚠️ WARNING - Verify HTTPS certificate validity in production

### A04:2021 - Insecure Design
✅ PASS - Principle of least privilege applied
✅ PASS - Network isolation implemented

### A06:2021 - Vulnerable and Outdated Components
🔄 IN REVIEW - n8nio/n8n:latest CVE scan pending
```

## Memory Best Practices

✅ **DO**
- Store structured, reusable patterns
- Include dates and version numbers
- Cross-reference related memories
- Keep memories DRY (reference other docs instead of duplicating)
- Review and update memories when approaches change

❌ **DON'T**
- Store raw secrets (use 1Password for that)
- Duplicate information from `.github/` docs
- Store personal opinions without context
- Mix multiple unrelated topics in one file
- Forget to update memories when patterns evolve

## Accessing Agent Memories

**In agent descriptions**, reference these memories:

```
"I will review my memories at .memories/sysadmin/ for deployment patterns we've used before"
```

**When requesting an agent:**
```
@sysadmin I need to deploy n8n. Check your memory for the deployment checklist.
```

**When asking the orchestrator:**
```
@orchestrator Review the memories in .memories/ for similar past workflows
```

## Memory Privacy

⚠️ **Important**: Memory folders (`.memories/`) are in `.gitignore`:
- Memories are LOCAL to your workspace
- They are NOT committed to Git
- Each user/session can have different contexts
- Use `.memories/` for transient notes and patterns
- Use `.github/` and `docs/` for shared, versioned knowledge

---

**Next**: Have agents create memory files as they work. Review memories when planning similar work. Update memories when approaches change.
