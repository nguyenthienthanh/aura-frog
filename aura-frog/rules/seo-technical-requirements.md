# SEO Technical Requirements

**Category:** Quality
**Priority:** High
**Version:** 1.0.0
**Purpose:** Ensure all web projects meet technical SEO requirements for search engine visibility

---

## Overview

Technical SEO is the foundation for search visibility. These requirements ensure crawlability, indexability, and optimal ranking potential for all web projects.

---

## Core Requirements

### 1. Meta Tags (MANDATORY)

Every page MUST have:

```html
<!-- ✅ REQUIRED -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Primary Keyword - Secondary | Brand</title>
  <meta name="description" content="150-160 character description">
  <link rel="canonical" href="https://example.com/current-page">
</head>
```

```toon
meta_rules[5]{element,requirement,limit}:
  title,Unique per page,50-60 characters
  description,Compelling + keywords,150-160 characters
  canonical,Absolute URL,Required on every page
  viewport,Mobile-responsive,width=device-width
  charset,UTF-8,First meta tag
```

### 2. URL Structure

```toon
url_requirements[5]{rule,good,bad}:
  Use hyphens,/my-page,/my_page or /myPage
  Lowercase only,/products,/Products
  No special chars,/about-us,/about%20us
  Descriptive,/seo-guide,/page?id=123
  Short paths,/blog/post,/blog/2025/01/15/post
```

### 3. Heading Hierarchy

```html
<!-- ✅ CORRECT: Single H1, proper hierarchy -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>

<!-- ❌ WRONG: Multiple H1s, skipped levels -->
<h1>Title 1</h1>
<h1>Title 2</h1>
<h4>Skipped H2 and H3</h4>
```

---

## Performance Requirements (Core Web Vitals)

### Mandatory Thresholds

```toon
cwv_gates[4]{metric,pass,fail}:
  LCP (Largest Contentful Paint),<2.5s,>4.0s
  INP (Interaction to Next Paint),<200ms,>500ms
  CLS (Cumulative Layout Shift),<0.1,>0.25
  FCP (First Contentful Paint),<1.8s,>3.0s
```

### Implementation Rules

```typescript
// ✅ Images MUST have explicit dimensions
<img
  src="/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy"
/>

// ✅ LCP images MUST be prioritized
<Image
  src="/hero.jpg"
  alt="Hero image"
  priority
  loading="eager"
/>

// ✅ Fonts MUST use font-display: swap
@font-face {
  font-family: 'Inter';
  font-display: swap;
}

// ❌ NEVER: Images without dimensions
<img src="/image.jpg" alt="...">
```

---

## Crawlability Requirements

### robots.txt

```txt
# REQUIRED at site root
User-agent: *
Allow: /

# Block non-content paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Sitemap reference
Sitemap: https://example.com/sitemap.xml
```

### XML Sitemap

Required elements:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Indexability Checklist

```toon
index_checklist[10]{requirement,validation}:
  No duplicate content,Canonical tags on all pages
  No thin pages,Minimum 300 words meaningful content
  No orphan pages,All pages linked internally
  No broken links,Regular link audits
  HTTPS everywhere,No mixed content warnings
  Mobile responsive,Passes Google Mobile Test
  Fast load times,CWV passing
  Proper redirects,301 for permanent - 302 for temporary
  No noindex on important pages,Verify meta robots
  Sitemap submitted,Google Search Console verified
```

---

## Social Meta Tags (Required)

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/page">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/og.jpg">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/twitter.jpg">
```

### Image Requirements

```toon
social_images[2]{platform,dimensions}:
  Open Graph,1200x630px minimum
  Twitter,1200x600px (2:1 ratio)
```

---

## International SEO (If Applicable)

```html
<!-- hreflang for multi-language sites -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

---

## Validation Tools (MANDATORY)

### Google Rich Results Test (Required Before Deploy)

**URL:** https://search.google.com/test/rich-results

```toon
testing_workflow[5]{step,tool,url}:
  1,Rich Results Test,https://search.google.com/test/rich-results
  2,Mobile-Friendly Test,https://search.google.com/test/mobile-friendly
  3,PageSpeed Insights,https://pagespeed.web.dev
  4,Schema Validator,https://validator.schema.org
  5,Search Console,https://search.google.com/search-console
```

### Testing Protocol

```markdown
1. **Before deployment:** Test structured data in Rich Results Test
2. **Fix all errors:** 0 errors required before going live
3. **Check preview:** Verify rich result appearance
4. **Monitor post-launch:** Check Search Console for issues
```

```toon
seo_tools[5]{tool,purpose}:
  Google Rich Results Test,Structured data validation (REQUIRED)
  Google Search Console,Index coverage + performance
  Lighthouse,Core Web Vitals + SEO audit
  Mobile-Friendly Test,Mobile responsiveness
  PageSpeed Insights,Performance metrics
```

---

## Pre-Launch Checklist

Before any site launch:

- [ ] All pages have unique title + description
- [ ] Canonical URLs set correctly
- [ ] sitemap.xml generated and submitted
- [ ] robots.txt configured
- [ ] **Rich Results Test passing** (https://search.google.com/test/rich-results)
- [ ] Structured data validated with 0 errors
- [ ] Core Web Vitals passing
- [ ] Mobile responsive verified
- [ ] HTTPS enforced
- [ ] 404 page exists
- [ ] Google Search Console connected

---

**Related Skills:** `seo-expert`, `ai-discovery-expert`, `ui-expert`
**Version:** 1.0.0
