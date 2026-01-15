# Command: seo:geo

**Command:** `seo:geo [url]`
**Agent:** web-expert
**Version:** 1.0.0

---

## Purpose

Audit website for Generative Engine Optimization (GEO) - optimization for AI search engines like Perplexity, ChatGPT Search, Gemini, and Claude.

---

## Usage

```bash
# GEO audit on URL
seo:geo https://myapp.com

# Audit specific page
seo:geo https://myapp.com/docs/guide

# Check robots.txt AI crawler access
seo:geo --crawlers

# Check content structure only
seo:geo --content
```

---

## Checks Performed

### 1. AI Crawler Access

**Check robots.txt for AI bot access:**

```toon
ai_crawlers[6]{bot,engine,status}:
  GPTBot,OpenAI/ChatGPT,Check Allow/Disallow
  Google-Extended,Google Gemini,Check Allow/Disallow
  PerplexityBot,Perplexity,Check Allow/Disallow
  ClaudeBot,Anthropic Claude,Check Allow/Disallow
  Applebot-Extended,Apple Intelligence,Check Allow/Disallow
  CCBot,Common Crawl,Check Allow/Disallow
```

**Recommended robots.txt:**

```txt
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /
```

### 2. Content Structure

```toon
content_checks[6]{check,requirement}:
  Answer-first,Direct answer in first paragraph
  Heading hierarchy,H1 → H2 → H3 (no skipping)
  Semantic HTML,article section aside nav used
  Lists and tables,Structured scannable content
  Word count,Minimum 300 words meaningful content
  Readability,Clear concise language
```

### 3. Entity Signals (E-E-A-T)

```toon
entity_checks[5]{check,implementation}:
  Author schema,Person with credentials + sameAs
  Organization schema,Company info + logo + sameAs
  Author page,Dedicated page with bio
  About page,Company/author information
  External citations,Links to authoritative sources
```

### 4. Freshness Signals

```toon
freshness_checks[4]{check,requirement}:
  datePublished,ISO 8601 format in schema
  dateModified,Updated when content changes
  Visible dates,Human-readable dates on page
  Update history,Revision log for major content
```

### 5. FAQ Implementation

```toon
faq_checks[3]{check,requirement}:
  FAQPage schema,JSON-LD with Question/Answer
  HTML structure,Semantic FAQ markup
  Answer quality,Complete actionable answers
```

---

## Output

```markdown
# GEO (AI Discovery) Audit Report

**URL:** https://myapp.com
**Date:** 2025-01-15
**Agent:** web-expert

---

## Summary

| Category | Score | Status |
|----------|-------|--------|
| AI Crawler Access | 100/100 | PASS |
| Content Structure | 85/100 | PASS |
| Entity Signals | 60/100 | WARNING |
| Freshness Signals | 90/100 | PASS |
| FAQ Implementation | 80/100 | PASS |

**Overall GEO Score:** 83/100 - GOOD

---

## AI Crawler Access

| Bot | Status | robots.txt |
|-----|--------|------------|
| GPTBot | ALLOWED | Allow: / |
| PerplexityBot | ALLOWED | Allow: / |
| ClaudeBot | ALLOWED | Allow: / |
| Google-Extended | ALLOWED | Allow: / |

**Result:** All major AI crawlers can access your content

---

## Content Structure

| Check | Status | Notes |
|-------|--------|-------|
| Answer-first | PASS | Direct answer in first paragraph |
| Heading hierarchy | PASS | H1 → H2 → H3 correct |
| Semantic HTML | PASS | article, section used |
| Lists/tables | PASS | Structured content present |

---

## Entity Signals (E-E-A-T)

| Check | Status | Action |
|-------|--------|--------|
| Author schema | MISSING | Add Person schema |
| Organization schema | PASS | Complete |
| Author page | MISSING | Create /about/author |
| External citations | WARNING | Add 2-3 authoritative sources |

**Impact:** Missing author signals reduce trust for AI engines

---

## Freshness Signals

| Signal | Status | Value |
|--------|--------|-------|
| datePublished | PASS | 2025-01-10 |
| dateModified | PASS | 2025-01-15 |
| Visible dates | PASS | "Updated January 15, 2025" |

---

## Issues Found: 3

### WARNING: Missing author schema
- **Impact:** Reduced E-E-A-T signals
- **Fix:** Add Person schema with credentials

### WARNING: No dedicated author page
- **Impact:** Cannot establish author authority
- **Fix:** Create /about/author with bio

### INFO: Consider more external citations
- **Current:** 1 external link
- **Recommended:** 3-5 authoritative sources

---

## AI Citation Test

Test your content visibility in AI search:

1. **Perplexity:** Search "what is [your topic]"
2. **ChatGPT:** Ask about your expertise area
3. **Gemini:** Query your brand name

---

## Next Steps

1. Add author schema with credentials
2. Create dedicated author page
3. Add 2-3 external citations to authoritative sources
4. Re-run seo:geo to verify

**Estimated time:** 45 minutes
```

---

## LLM.txt (Optional)

Consider adding `/llm.txt` for AI-specific instructions:

```txt
# /llm.txt
name: Your Site Name
description: What your site is about
author: Author/Company Name
topics: topic1, topic2, topic3
citation-name: Preferred Citation Name
```

---

## Related Commands

| Command | Purpose |
|---------|---------|
| `seo:check` | Full SEO audit |
| `seo:schema` | Schema validation |

---

## Related Skills

- `ai-discovery-expert` - GEO implementation
- `seo-expert` - Technical SEO

---

**Command:** seo:geo
**Version:** 1.0.0
