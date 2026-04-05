---
name: source-standards
description: "Use when: agents need to provide verified documentation links, validate content currency, research technical standards. Applies to all agent outputs that include explanations or references."
applyTo: ".github/agents/**"
---

# Source Verification & Documentation Standards

All agents in this project follow strict verification and research standards to ensure information is current, accurate, and properly cited.

## Verification Checklist

Before providing any technical explanation or recommendation:

- [ ] **Is this a link or reference?** → Include full URL
- [ ] **Is the documentation current?** → Check the publication/update date
- [ ] **Are there newer versions?** → Search for recent releases or breaking changes
- [ ] **Is this an official source?** → Prefer vendor/project documentation over blogs
- [ ] **Should I research this?** → Yes, if the information might be outdated (>6 months old)

## Format Standards

### Citation Format

```markdown
According to [Official Documentation](https://full-url-here) (verified YYYY-MM-DD):
The procedure is...
```

### Version Awareness

```markdown
As of **[Tool Name v2.5.0](https://github.com/org/repo/releases/tag/v2.5.0)** (released 2024-03-15):
The recommended approach is...

⚠️ Note: v3.0.0 introduces breaking changes (see [migration guide](https://link))
```

### Multiple References

```markdown
According to:
1. [1Password CLI Official Docs](https://developer.1password.com/docs/cli) - Command reference
2. [Official GitHub Repository](https://github.com/1Password/shell-plugins) - Latest code
3. [Release Notes v2.20.0](https://github.com/1Password/sh/releases/tag/v2.20.0) - Current version

The recommended pattern is...
```

### Security & Compliance References

```markdown
This follows [OWASP A02:2021 - Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/) guidelines:
- [Direct link to specific guidance](https://owasp.org/...)
- See [NIST Cryptographic Standards](https://csrc.nist.gov/publications/detail/sp/800-175b/final) for detailed specs
```

## Research Requirements by Agent

### secrets-manager

- ✅ Must verify 1Password CLI command syntax against [official reference](https://developer.1password.com/docs/cli/reference/commands/)
- ✅ Must check latest 1Password security advisories
- ✅ Must validate vault/item APIs against current version
- ✅ Should research OWASP secrets management best practices

### sysadmin

- ✅ Must verify Docker image compatibility and CVEs
- ✅ Must check docker-compose version compatibility
- ✅ Must validate Alpine/Slim image updates and security patches
- ✅ Should research infrastructure best practices

### programmer

- ✅ Must verify language/framework documentation
- ✅ Must check for known vulnerabilities in dependencies
- ✅ Must validate API references against current versions
- ✅ Should research code security best practices

### security-analyst

- ✅ Must verify OWASP Top 10 current version and frameworks
- ✅ Must check CVE databases and vulnerability advisories
- ✅ Must validate security standards (CWE, CVSS, etc.)
- ✅ Must research latest attack patterns and mitigations

### solution-architect

- ✅ Must verify architectural patterns and best practices
- ✅ Must research alternatives and recent innovations
- ✅ Must validate against industry standards
- ✅ Should link to reference architectures and case studies

### system-architect

- ✅ Must verify technical specifications and APIs
- ✅ Must validate interface compatibility
- ✅ Must research current deployment patterns
- ✅ Should link to standard implementations

### historian

- ✅ Must verify Conventional Commits specification
- ✅ Must validate changelog format standards
- ✅ Must check semantic versioning guidelines
- ✅ Should reference industry release note examples

### orchestrator

- ✅ Must verify all agent delegations are current
- ✅ Must validate project standards match current best practices
- ✅ Must research project management patterns
- ✅ Should audit links in all agent outputs

## Useful Reference Databases

When researching, check these authoritative sources:

| Topic | Reference | Link |
|-------|-----------|------|
| Vulnerabilities | CVE Database | https://nvd.nist.gov/vuln/ |
| Security | OWASP | https://owasp.org/Top10/ |
| Security | CWE (Common Weakness) | https://cwe.mitre.org/ |
| Container Security | Docker CVE | https://docs.docker.com/engine/reference/run/ |
| Cryptography | NIST Standards | https://csrc.nist.gov/publications/detail/sp/800-175b/final |
| API Standards | OpenAPI | https://spec.openapis.org/ |
| Secrets | OWASP Secrets | https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html |
| Cloud Native | CNCF | https://www.cncf.io/ |
| Code Quality | CII Best Practices | https://bestpractices.coreinfrastructure.org/ |

## Example: Good Documentation

```markdown
## n8n REST Client Node Implementation

According to [n8n Official Documentation](https://docs.n8n.io/integrations/) 
(verified 2026-04-05):

### Creating a Custom Node

The recommended approach uses the [n8n Node Development Library](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base) 
(commit: abc1234..., current version n8n v1.35.0).

**Step 1**: Follow the structure in [n8n Repository](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md)

⚠️ Note: n8n v2.0.0 (released 2026-03), introduces breaking changes:
- See [Migration Guide](https://docs.n8n.io/migration/v2-0-0/)
- See [Release Notes](https://github.com/n8n-io/n8n/releases/tag/2.0.0)

### Security Considerations

According to [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html),
always validate user input. This project follows [OWASP Parameterized Queries](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).
```

## When You Don't Know

If uncertain about current information:

1. **Search**: "What is the latest version of [tool/library] as of 2026?"
2. **Verify**: Check the official GitHub Release page or documentation date
3. **Disclose**: "⚠️ I'm uncertain about the current best practice — please verify with [link]"
4. **Recommend**: "For the latest guidance, see [Official Documentation](link)"

---

All agents commit to these standards. Questions about verification? Ask the security-analyst agent or orchestrator.
