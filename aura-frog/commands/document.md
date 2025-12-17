# Command: document

**Purpose:** Create feature documentation (specs, guides, API docs)
**Aliases:** `doc`, `docs`, `create document`, `generate docs`

---

## Usage

```
document feature "User Authentication"
document api "src/api/authApi.ts"
document component "src/components/UserProfile.tsx"
document spec "Add dark mode support"
document guide "How to use authentication"
```

---

## Document Types

```toon
types[5]{type,generates,use_case}:
  feature,Full feature documentation with architecture,Existing/new features
  api,Endpoint reference with types + examples,API files
  component,Props + usage + structure + testing,React/Vue components
  spec,Technical specification (Phase 2 style),Before implementation
  guide,User-facing with steps + screenshots,End-user documentation
```

---

## Feature Doc Structure

```toon
sections[10]{section,content}:
  Overview,Brief description + purpose
  Features,Checklist of capabilities
  Architecture,System diagram + flow
  File Structure,Project organization
  API Reference,Endpoints with request/response
  Usage Examples,Code samples
  Testing,Coverage + test scenarios
  Deployment,Environment vars + setup
  Metrics,Performance + success rates
  Future,Planned enhancements
```

---

## Output Location

```
.claude/logs/documents/
├── features/{feature-name}.md
├── api/{api-name}.md
├── components/{component-name}.md
├── specs/{spec-name}.md
└── guides/{guide-name}.md
```

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `--format` | markdown, confluence, html, pdf | markdown |
| `--detail` | brief, standard, full | standard |
| `--examples` | Include code examples | false |
| `--diagrams` | Include architecture diagrams | false |
| `--include-tests` | Include test documentation | false |
| `--all` | Include everything | false |

---

## Success Criteria

- ✅ Documentation generated in correct format
- ✅ All sections complete
- ✅ Code examples included (if requested)
- ✅ Diagrams created (if applicable)
- ✅ Saved to documents folder

---

**Version:** 2.0.0
