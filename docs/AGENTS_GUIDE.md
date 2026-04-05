# Copilot Agents Guide

This guide explains how to work with the 8 specialized agents in the n8n-auto project.

## Quick Reference

| Request Type | Use Agent | Example |
|--------------|-----------|---------|
| "I need to..." (any request) | `@orchestrator` | "I need to add GitHub integration to n8n" |
| Store/retrieve credentials | `@secrets-manager` | "Store the API key securely" |
| Design a solution | `@solution-architect` | "How should I structure n8n webhooks?" |
| Break design into tasks | `@system-architect` | "I have a solution, make it implementable" |
| Docker/infra work | `@sysadmin` | "Set up Redis cache for n8n" |
| Write code/scripts | `@programmer` | "Create a monitoring script" |
| Check security | `@security-analyst` | "Audit this deployment" |
| Write release notes | `@historian` | "Document these changes" |

## The Orchestrator (Main Entry Point)

**Always start here for complex work.**

```
@orchestrator [your request]
```

The orchestrator:
1. Breaks down your request into tasks
2. Delegates to appropriate agents
3. Reviews each output
4. Coordinates the workflow
5. **Never** bypasses the delegation chain

### What the Orchestrator Does

✅ Plans multi-step work  
✅ Coordinates all 7 agents  
✅ Ensures security review happens  
✅ Tracks progress with todo list  

### Example: "Add GitHub webhook integration"

```
@orchestrator I want to add GitHub webhook support to n8n so it can listen 
to repository events and trigger workflows
```

**Orchestrator workflow**:
1. Requests solution design → `solution-architect`
2. Requests decomposition → `system-architect`
3. Delegates infrastructure → `sysadmin`
4. Delegates code → `programmer`
5. Requests secret keys → `secrets-manager`
6. Requests security audit → `security-analyst`
7. Requests documentation → `historian`

## Individual Agents

### 1. secrets-manager

**Manages**: All credentials, API keys, passwords via 1Password

```
@secrets-manager Store the GitHub webhook secret for n8n
```

**Responsibilities**:
- 1Password vault management
- Secret retrieval at runtime
- Credential rotation
- Audit & compliance

**Returns**: Secure retrieval commands for other agents

See: [docs/SECRETS_MANAGER.md](SECRETS_MANAGER.md)

### 2. solution-architect

**Manages**: High-level design, requirements, trade-offs

```
@solution-architect How should we design multi-user authentication 
for n8n with GitHub Copilot login?
```

**Process**:
1. Understands requirements
2. Evaluates options
3. Proposes solution with trade-offs
4. Hands off to system-architect

**Returns**: Solution document with architecture diagram

### 3. system-architect

**Manages**: Technical decomposition, component specs, task assignments

```
@system-architect Take the solution design and break it into 
implementable components
```

**Process**:
1. Receives solution plan
2. Decomposes into components
3. Defines interfaces & dependencies
4. Creates task list for sysadmin + programmer

**Returns**: Detailed technical specs with task assignments

### 4. sysadmin

**Manages**: Docker, networking, infrastructure as code

```
@sysadmin Set up Redis cache alongside n8n for workflow caching
```

**Process**:
1. Receives component specs
2. Requests secrets if needed (→ secrets-manager)
3. Implements Docker/networking/IaC
4. Validates configuration

**Returns**: Modified docker-compose.yml, docs, scripts

### 5. programmer

**Manages**: Application code, scripts, integrations

```
@programmer Create a Python script to sync n8n workflows from GitHub
```

**Process**:
1. Receives component specs
2. Requests secrets if needed (→ secrets-manager)
3. Writes code/tests
4. Validates against style guide

**Returns**: Code, tests, usage instructions

### 6. security-analyst

**Manages**: OWASP compliance, vulnerability scanning, secret audits

```
@security-analyst Audit the GitHub integration for security issues
```

**Process**:
1. Scans code/config/secrets
2. Checks OWASP Top 10
3. Coordinates with secrets-manager on credential handling
4. Reports findings & remediation

**Returns**: Security report (PASS/WARNINGS/FAIL with actions)

### 7. historian

**Manages**: Release notes, commit messages, changelog

```
@historian Create release notes for the GitHub integration feature
```

**Process**:
1. Gathers change context
2. Writes conventional commits
3. Updates CHANGELOG.md
4. Formats release notes

**Returns**: Commit messages, release notes, updated changelog

## Workflows

### Workflow 1: New Feature (Simple)

```
User: "Add n8n REST API client node"
  ↓
Orchestrator delegates:
  → Programmer: Create the node code
  → Secrets-manager: Get any API keys needed
  → Security-analyst: Audit for vulnerabilities
  → Historian: Write commit message
```

### Workflow 2: Infrastructure Change (Complex)

```
User: "Migrate n8n to Kubernetes"
  ↓
Orchestrator requests:
  → Solution-architect: Design cloud architecture
  → System-architect: Decompose into K8s manifests, helm charts, operators
  → Sysadmin: Implement K8s setup
  → Programmer: Create deployment scripts
  → Secrets-manager: Manage cloud credentials, database passwords
  → Security-analyst: Audit K8s security posture
  → Historian: Document migration guide
```

### Workflow 3: Security Review (Before Merge)

```
User: "Is this change ready to merge?"
  ↓
Orchestrator routes to:
  → Security-analyst: Full audit
    ├─ Code scanning
    ├─ Docker security
    ├─ Secret management (with secrets-manager)
    └─ OWASP Top 10 check
  ↓ (if approved)
  → Histogram: Create release notes
```

## DO's and DON'Ts

### ✅ DO

- Start with **@orchestrator** for complex work
- Use **@secrets-manager** for ANY credential
- Let agents coordinate — don't skip the chain
- Check agent descriptions for trigger phrases
- Request **security-analyst** review before merge

### ❌ DON'T

- Hardcode secrets anywhere
- Ask sysadmin to write code (use programmer)
- Ask programmer to deploy (use sysadmin)
- Skip security review for "quick" changes
- Bypass the orchestrator for multi-agent work

## Tips

1. **Be specific** — "Add webhook support" vs "Add GitHub webhook with payload validation and rate limiting"
2. **Trust delegation** — Let orchestrator route to the right agent
3. **Review outputs** — Each agent returns a deliverable; check before using
4. **Leverage history** — Agents maintain context across the project
5. **Audit by design** — Security-analyst review is always the final step

---

**Ready to start?** Open chat and type: `@orchestrator [your feature request]`
