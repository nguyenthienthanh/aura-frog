# Command: /seo

**Category:** SEO & AI Discovery (Bundled)
**Scope:** Session
**Version:** 2.0.0

---

## Purpose

Unified SEO and AI Discovery (GEO) command. Handles audits, schema validation, and optimization.

---

## Usage

```bash
# Full SEO + GEO audit
/seo check [url]

# Specific subcommands
/seo schema [url]
/seo geo [url]
/seo fix
```

---

## Subcommands

| Subcommand | Description | Example |
|------------|-------------|---------|
| `check [url]` | Full SEO + GEO audit | `/seo check https://example.com` |
| `schema [url]` | Validate JSON-LD structured data | `/seo schema https://example.com` |
| `geo [url]` | AI discovery audit (Perplexity, ChatGPT) | `/seo geo https://example.com` |
| `fix` | Auto-fix common SEO issues | `/seo fix` |
| `vitals` | Core Web Vitals analysis | `/seo vitals` |

---

## Interactive Menu

```
🔍 SEO Commands

Quick Actions:
  [1] Full SEO + GEO audit
  [2] Check schema markup
  [3] AI discovery audit

Specific Checks:
  [4] Core Web Vitals
  [5] Meta tags audit
  [6] Sitemap check

Fixes:
  [7] Auto-fix issues
  [8] Generate missing schema

Enter URL or select [1-8]:
> _
```

---

## Audit Output

```markdown
## 🔍 SEO Audit: example.com

### Technical SEO: 85/100
- ✅ Title tag (58 chars)
- ✅ Meta description (155 chars)
- ✅ Canonical URL set
- ⚠️ Missing hreflang tags

### Schema Markup: 90/100
- ✅ Organization schema
- ✅ BreadcrumbList
- ⚠️ Missing FAQ schema on FAQ page

### Core Web Vitals: 78/100
- ✅ LCP: 2.1s (Good)
- ⚠️ INP: 250ms (Needs Improvement)
- ✅ CLS: 0.05 (Good)

### AI Discovery (GEO): 70/100
- ✅ GPTBot allowed
- ⚠️ No LLM.txt file
- ⚠️ Missing answer-first content structure

### Priority Fixes
1. Add hreflang for multi-language support
2. Implement FAQ schema on FAQ pages
3. Improve INP by optimizing event handlers
4. Create LLM.txt for AI crawlers
```

---

## Related Files

- **SEO Bundle Skill:** `skills/seo-bundle/SKILL.md`
- **SEO Expert:** `skills/seo-expert/SKILL.md`
- **AI Discovery:** `skills/ai-discovery-expert/SKILL.md`
- **SEO Rules:** `rules/seo-technical-requirements.md`
- **Legacy Commands:** `commands/seo/*.md`

---

**Version:** 2.0.0 | **Last Updated:** 2026-01-21
