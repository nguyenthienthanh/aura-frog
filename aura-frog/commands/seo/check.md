# Command: seo:check

**Command:** `seo:check [url]`
**Agent:** ui-expert
**Version:** 1.0.0

---

## Purpose

Run comprehensive SEO and GEO (Generative Engine Optimization) audit including meta tags, structured data, Core Web Vitals, and AI discovery readiness.

---

## Usage

```bash
# Check current project (localhost)
seo:check

# Check production URL
seo:check https://myapp.com

# Check specific page
seo:check https://myapp.com/blog/article

# Full audit with all checks
seo:check --full

# Quick check (meta + schema only)
seo:check --quick
```

---

## Checks Performed

### 1. Meta Tags Audit

```toon
meta_checks[8]{check,requirement}:
  Title tag,50-60 characters - unique per page
  Meta description,150-160 characters - compelling
  Canonical URL,Absolute URL present
  Viewport,width=device-width present
  Open Graph,og:title og:description og:image
  Twitter Cards,twitter:card twitter:title
  Robots meta,index/noindex appropriate
  hreflang,Multi-language if applicable
```

### 2. Structured Data (Schema.org)

**Validation URL:** https://search.google.com/test/rich-results

```bash
# Manual validation steps
1. Open https://search.google.com/test/rich-results
2. Enter URL or paste JSON-LD code
3. Click "Test URL" or "Test Code"
4. Review results for errors/warnings
```

```toon
schema_checks[6]{schema,fields}:
  Organization,name url logo sameAs
  WebSite,name url potentialAction
  Article,headline author datePublished image
  Product,name image offers aggregateRating
  FAQPage,mainEntity (Question + Answer)
  BreadcrumbList,itemListElement position
```

### 3. Core Web Vitals

```toon
cwv_thresholds[4]{metric,good,needs_improvement,poor}:
  LCP (Largest Contentful Paint),<2.5s,2.5-4.0s,>4.0s
  INP (Interaction to Next Paint),<200ms,200-500ms,>500ms
  CLS (Cumulative Layout Shift),<0.1,0.1-0.25,>0.25
  FCP (First Contentful Paint),<1.8s,1.8-3.0s,>3.0s
```

### 4. AI Discovery (GEO)

```toon
geo_checks[6]{check,requirement}:
  robots.txt,GPTBot PerplexityBot ClaudeBot allowed
  Content structure,Answer-first paragraphs
  Semantic HTML,article section aside proper usage
  Author schema,Person with credentials
  Update dates,dateModified visible
  FAQ sections,FAQPage schema implemented
```

### 5. Technical SEO

```toon
technical_checks[8]{check,tool}:
  sitemap.xml,Validate at /sitemap.xml
  robots.txt,Validate at /robots.txt
  HTTPS,SSL certificate valid
  Mobile-friendly,Google Mobile Test
  Page speed,PageSpeed Insights
  Broken links,Crawl for 404s
  Redirect chains,Max 1 redirect
  Duplicate content,Canonical tags
```

---

## Output

```markdown
# SEO/GEO Audit Report

**URL:** https://myapp.com
**Date:** 2025-01-15
**Agent:** ui-expert

---

## Summary

| Category | Score | Status |
|----------|-------|--------|
| Meta Tags | 90/100 | PASS |
| Structured Data | 85/100 | PASS |
| Core Web Vitals | 75/100 | WARNING |
| AI Discovery (GEO) | 80/100 | PASS |
| Technical SEO | 95/100 | PASS |

**Overall:** 85/100 - GOOD

---

## Meta Tags

- Title: "My App - Build Better Software" (32 chars)
- Description: "Build better software with..." (142 chars)
- Canonical: https://myapp.com
- Open Graph: Complete
- Twitter Cards: Complete

---

## Structured Data

**Rich Results Test:** https://search.google.com/test/rich-results?url=https://myapp.com

| Schema | Status | Issues |
|--------|--------|--------|
| Organization | PASS | None |
| WebSite | PASS | None |
| BreadcrumbList | PASS | None |

---

## Core Web Vitals

| Metric | Value | Status |
|--------|-------|--------|
| LCP | 2.8s | WARNING |
| INP | 150ms | PASS |
| CLS | 0.05 | PASS |
| FCP | 1.5s | PASS |

**Action:** Optimize LCP - consider lazy loading below-fold images

---

## AI Discovery (GEO)

| Check | Status |
|-------|--------|
| GPTBot allowed | PASS |
| PerplexityBot allowed | PASS |
| Answer-first content | PASS |
| Author schema | MISSING |
| FAQ schema | PASS |

**Action:** Add author schema with credentials

---

## Issues Found: 3

### WARNING: LCP above 2.5s threshold
- **Current:** 2.8s
- **Target:** <2.5s
- **Fix:** Optimize hero image, add preload hints

### WARNING: Missing author schema
- **Impact:** Reduced E-E-A-T signals for AI
- **Fix:** Add Person schema with credentials

### INFO: Consider adding HowTo schema
- **Page:** /docs/getting-started
- **Benefit:** Rich result eligibility

---

## Validation Links

- **Rich Results Test:** https://search.google.com/test/rich-results
- **Mobile-Friendly:** https://search.google.com/test/mobile-friendly
- **PageSpeed:** https://pagespeed.web.dev
- **Schema Validator:** https://validator.schema.org

---

## Next Steps

1. Run Rich Results Test to validate schema
2. Fix LCP performance issue
3. Add author schema for E-E-A-T
4. Re-run seo:check to verify

**Estimated time:** 30 minutes
```

---

## Related Commands

| Command | Purpose |
|---------|---------|
| `seo:schema` | Validate structured data only |
| `seo:geo` | AI discovery audit only |
| `perf:lighthouse` | Full Lighthouse audit |
| `quality:check` | Code quality checks |

---

## Related Skills

- `seo-expert` - Technical SEO implementation
- `ai-discovery-expert` - GEO optimization

---

**Command:** seo:check
**Version:** 1.0.0
