---
name: seo-bundle
description: "Unified SEO and AI Discovery expertise bundle. Lazy-loads technical SEO, schema markup, Core Web Vitals, and GEO/AI search patterns based on task type."
autoInvoke: true
priority: 50
triggers:
  - "seo"
  - "meta tags"
  - "sitemap"
  - "schema"
  - "JSON-LD"
  - "structured data"
  - "core web vitals"
  - "AI discovery"
  - "GEO"
---

# Skill: SEO Bundle

**Skill ID:** seo-bundle
**Version:** 1.0.0
**Priority:** 50
**Auto-Invoke:** Yes (when SEO/GEO task detected)

---

## Purpose

Unified entry point for all SEO and AI Discovery expertise. Lazy-loads only the relevant patterns based on task type, reducing token usage by ~60% compared to loading all 5 individual SEO skills.

**Consolidates:**
- seo-expert (technical SEO)
- ai-discovery-expert (GEO/AI search)
- seo-check (audit command)
- seo-schema (schema validation)
- seo-geo (AI discovery audit)

---

## Triggers

- SEO keywords: meta tags, sitemap, robots.txt, canonical
- Schema keywords: JSON-LD, structured data, rich results
- AI Discovery: Perplexity, ChatGPT Search, AI crawler, GEO
- Commands: /seo:check, /seo:schema, /seo:geo

---

## Task Detection

```toon
seo_tasks[5]{task_type,patterns,loads}:
  technical-seo,"meta tags/sitemap/robots/canonical/hreflang",seo_technical_patterns
  schema-markup,"JSON-LD/structured data/schema.org/rich results",schema_patterns
  core-web-vitals,"LCP/INP/CLS/performance/page speed",performance_patterns
  ai-discovery,"Perplexity/ChatGPT/AI crawler/GEO/LLM citation",geo_patterns
  full-audit,"/seo:check or comprehensive audit",all_patterns
```

---

## Core Patterns (Always Loaded ~200 tokens)

```toon
seo_core[6]{area,requirement}:
  Title tags,50-60 chars with primary keyword
  Meta description,150-160 chars with CTA
  Canonical URL,Self-referencing on all pages
  Mobile-friendly,Responsive + viewport meta
  HTTPS,SSL certificate required
  Page speed,LCP <2.5s INP <200ms CLS <0.1
```

---

## Technical SEO Patterns (Load on demand)

```toon
technical_seo[12]{element,implementation}:
  Title tag,<title>{Primary Keyword} - {Brand}</title>
  Meta description,<meta name="description" content="...">
  Canonical,<link rel="canonical" href="{url}">
  Robots meta,<meta name="robots" content="index follow">
  Hreflang,<link rel="alternate" hreflang="en" href="...">
  Open Graph,og:title og:description og:image og:url
  Twitter Cards,twitter:card twitter:title twitter:image
  Sitemap,XML sitemap at /sitemap.xml
  Robots.txt,Allow/Disallow directives
  Breadcrumbs,Schema + visual navigation
  Internal links,Descriptive anchor text
  Image SEO,Alt text + lazy loading + WebP
```

---

## Schema Patterns (Load on demand)

```toon
schema_types[10]{type,use_case,required_fields}:
  Organization,Company pages,name/url/logo/sameAs
  WebSite,Homepage,name/url/potentialAction (search)
  Article,Blog posts,headline/author/datePublished/image
  Product,E-commerce,name/image/price/availability
  FAQPage,FAQ sections,mainEntity array
  BreadcrumbList,Navigation,itemListElement array
  LocalBusiness,Local SEO,name/address/telephone/geo
  Person,Author pages,name/jobTitle/image
  HowTo,Tutorials,step array with text/image
  Review,Testimonials,itemReviewed/reviewRating/author
```

**Schema Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "{Type}",
  "name": "{name}",
  ...
}
```

---

## AI Discovery / GEO Patterns (Load on demand)

```toon
geo_patterns[8]{element,implementation}:
  Answer-first,Start content with direct answer (first 100 words)
  FAQ schema,FAQPage JSON-LD for question targeting
  Entity signals,Author bio + Organization schema + E-E-A-T
  Freshness,dateModified + regular updates
  AI crawlers,Allow GPTBot/PerplexityBot/ClaudeBot in robots.txt
  LLM.txt,/llm.txt with site summary for AI
  Semantic HTML,Proper heading hierarchy H1→H6
  Cite sources,Link to authoritative references
```

**AI Crawler robots.txt:**
```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /
```

---

## Core Web Vitals (Load on demand)

```toon
cwv_targets[3]{metric,good,needs_work,poor}:
  LCP (Largest Contentful Paint),<2.5s,2.5-4s,>4s
  INP (Interaction to Next Paint),<200ms,200-500ms,>500ms
  CLS (Cumulative Layout Shift),<0.1,0.1-0.25,>0.25
```

**Optimization Checklist:**
```toon
cwv_fixes[9]{issue,solution}:
  Slow LCP,Preload hero image + optimize server response
  High INP,Break long tasks + use requestIdleCallback
  Layout shift,Set explicit width/height on images/embeds
  Render blocking,Defer non-critical CSS/JS
  Large images,Use WebP + srcset + lazy loading
  Third-party,Facade pattern for embeds
  Font flash,font-display: swap + preload
  JavaScript,Code split + tree shake
  Server,Edge caching + CDN
```

---

## Commands

| Command | Action | Loads |
|---------|--------|-------|
| `/seo:check [url]` | Full SEO + GEO audit | All patterns |
| `/seo:schema [url]` | Schema validation | Schema patterns |
| `/seo:geo [url]` | AI discovery audit | GEO patterns |

---

## Audit Output Format

```markdown
## SEO Audit: {url}

### Technical SEO
- [ ] Title tag (XX chars): {title}
- [ ] Meta description (XX chars): {description}
- [ ] Canonical: {status}
- [ ] Mobile-friendly: {status}

### Schema Markup
- [ ] Organization: {status}
- [ ] Breadcrumbs: {status}
- [ ] {Page-specific type}: {status}

### Core Web Vitals
- [ ] LCP: {value} ({rating})
- [ ] INP: {value} ({rating})
- [ ] CLS: {value} ({rating})

### AI Discovery (GEO)
- [ ] GPTBot access: {status}
- [ ] Answer-first content: {status}
- [ ] FAQ schema: {status}
- [ ] E-E-A-T signals: {status}

### Priority Fixes
1. {Critical issue}
2. {High priority}
3. {Medium priority}
```

---

## Integration with Project Cache

```javascript
// Check if project has SEO requirements
const detection = getCachedDetection();
if (detection.framework === 'nextjs' || detection.filePatterns.templates) {
  // Load SEO patterns relevant to framework
  loadPatterns('seo', detection.framework);
}
```

---

## Related Files

- Individual skills (legacy, still available for direct invocation):
  - `skills/seo-expert/SKILL.md`
  - `skills/ai-discovery-expert/SKILL.md`
  - `skills/seo-check/SKILL.md`
  - `skills/seo-schema/SKILL.md`
  - `skills/seo-geo/SKILL.md`
- `rules/seo-technical-requirements.md`
- `rules/structured-data-schema.md`
- `rules/ai-discovery-optimization.md`

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-21
