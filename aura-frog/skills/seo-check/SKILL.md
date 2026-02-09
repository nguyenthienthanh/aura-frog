---
name: seo-check
description: "Run comprehensive SEO and GEO audit including meta tags, structured data, Core Web Vitals, and AI discovery readiness."
autoInvoke: false
priority: high
triggers:
  - "seo:check"
  - "seo check"
  - "seo audit"
  - "check seo"
allowed-tools: Read, Grep, Glob, WebFetch, Bash
---

# SEO Check Command

Run comprehensive SEO and GEO (Generative Engine Optimization) audit.

---

## Usage

```bash
# Check current project (localhost)
/seo:check

# Check production URL
/seo:check https://myapp.com

# Check specific page
/seo:check https://myapp.com/blog/article

# Full audit with all checks
/seo:check --full

# Quick check (meta + schema only)
/seo:check --quick
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

## Output Format

Generate report with:

| Category | Score | Status |
|----------|-------|--------|
| Meta Tags | X/100 | PASS/WARNING/FAIL |
| Structured Data | X/100 | PASS/WARNING/FAIL |
| Core Web Vitals | X/100 | PASS/WARNING/FAIL |
| AI Discovery (GEO) | X/100 | PASS/WARNING/FAIL |
| Technical SEO | X/100 | PASS/WARNING/FAIL |

Include:
- Validation links (Rich Results Test, PageSpeed Insights)
- Specific issues with fixes
- Next steps with time estimates

---

## Related Commands

| Command | Purpose |
|---------|---------|
| `/seo:schema` | Validate structured data only |
| `/seo:geo` | AI discovery audit only |

---

**Version:** 1.18.0
