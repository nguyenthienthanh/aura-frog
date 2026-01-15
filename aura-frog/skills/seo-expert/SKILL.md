---
name: seo-expert
description: "SEO and search engine optimization expert. PROACTIVELY use when working with meta tags, structured data, Core Web Vitals, sitemap, robots.txt, canonical URLs. Triggers: SEO, meta tags, schema markup, search ranking"
autoInvoke: true
priority: high
triggers:
  - "seo"
  - "search engine"
  - "meta tags"
  - "structured data"
  - "schema markup"
  - "sitemap"
  - "robots.txt"
  - "canonical"
  - "google search"
  - "search ranking"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# SEO Expert Skill

Expert-level Search Engine Optimization for modern web applications. Covers technical SEO, on-page optimization, and structured data implementation.

---

## Auto-Detection

This skill activates when:
- Working with `<head>` meta tags or SEO configuration
- Creating sitemaps, robots.txt, or canonical URLs
- Implementing Schema.org structured data
- Optimizing for Google Search or other search engines
- Discussing page speed, Core Web Vitals, or crawlability

---

## 1. Technical SEO Fundamentals

### Required Meta Tags

```html
<!-- ✅ REQUIRED: Every page -->
<head>
  <!-- Character encoding (first) -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary meta -->
  <title>Primary Keyword - Secondary Keyword | Brand (50-60 chars)</title>
  <meta name="description" content="Compelling description with keywords. 150-160 characters max. Include call-to-action.">

  <!-- Canonical URL (prevents duplicate content) -->
  <link rel="canonical" href="https://example.com/page">

  <!-- Language -->
  <html lang="en">
  <link rel="alternate" hreflang="en" href="https://example.com/en/page">
  <link rel="alternate" hreflang="es" href="https://example.com/es/page">
  <link rel="alternate" hreflang="x-default" href="https://example.com/page">

  <!-- Robots (only if restricting) -->
  <meta name="robots" content="index, follow">
</head>
```

### Open Graph (Social Sharing)

```html
<!-- ✅ Open Graph for Facebook/LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/page">
<meta property="og:title" content="Page Title (60-90 chars)">
<meta property="og:description" content="Description (200 chars max)">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Brand Name">
<meta property="og:locale" content="en_US">

<!-- ✅ Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:creator" content="@author">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

---

## 2. Core Web Vitals (Google Ranking Factor)

```toon
cwv_targets[4]{metric,target,impact}:
  LCP (Largest Contentful Paint),<2.5s,Page load speed
  INP (Interaction to Next Paint),<200ms,Interactivity
  CLS (Cumulative Layout Shift),<0.1,Visual stability
  FCP (First Contentful Paint),<1.8s,Perceived speed
```

### Implementation Checklist

```typescript
// ✅ Image optimization
<Image
  src="/hero.jpg"
  alt="Descriptive alt text with keywords"
  width={1200}
  height={630}
  priority // LCP image
  loading="eager" // Above-fold
/>

// ✅ Below-fold images
<Image
  src="/product.jpg"
  alt="Product description"
  width={400}
  height={300}
  loading="lazy"
/>

// ✅ Prevent CLS - always specify dimensions
// ❌ BAD: No dimensions
<img src="/image.jpg" alt="...">

// ✅ GOOD: Explicit dimensions
<img src="/image.jpg" alt="..." width="400" height="300">
```

### Font Optimization

```html
<!-- ✅ Preload critical fonts -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- ✅ Use font-display: swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter.woff2') format('woff2');
    font-display: swap; /* Prevent FOIT */
  }
</style>
```

---

## 3. Structured Data (Schema.org)

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/name",
    "https://facebook.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-555-1234",
    "contactType": "customer service"
  }
}
```

### Article/Blog Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (110 chars max)",
  "description": "Article description",
  "image": ["https://example.com/image.jpg"],
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15"
}
```

### Product Schema (E-commerce)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product.jpg",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "99.99",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "89"
  }
}
```

### FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 30-day returns on all products..."
      }
    },
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping takes 3-5 business days..."
      }
    }
  ]
}
```

---

## 4. Sitemap & Robots.txt

### XML Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2025-01-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt

```txt
# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin/private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Sitemap location
Sitemap: https://example.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
```

---

## 5. Next.js SEO Implementation

### Metadata API (App Router)

```typescript
// app/layout.tsx - Root metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Site Name',
    template: '%s | Site Name',
  },
  description: 'Default site description',
  keywords: ['keyword1', 'keyword2'],
  authors: [{ name: 'Author' }],
  creator: 'Creator Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Site Name',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@username',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// app/blog/[slug]/page.tsx - Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage }],
    },
  };
}
```

### JSON-LD Component

```typescript
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in page
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  // ...
}} />
```

---

## 6. URL Structure Best Practices

```toon
url_rules[6]{rule,example}:
  Use hyphens not underscores,/blog/my-post ✅ /blog/my_post ❌
  Lowercase only,/products/shoes ✅ /Products/Shoes ❌
  Short and descriptive,/blog/seo-guide ✅ /blog/2025/01/15/a-complete-guide-to-seo ❌
  Include keywords,/services/web-development ✅ /services/1234 ❌
  Avoid query params for content,/products/shoes ✅ /products?id=shoes ❌
  Trailing slash consistency,Pick one and stick with it
```

---

## 7. Internal Linking Strategy

```typescript
// ✅ GOOD: Descriptive anchor text
<Link href="/services/seo">SEO optimization services</Link>

// ❌ BAD: Generic anchor text
<Link href="/services/seo">Click here</Link>
<Link href="/services/seo">Learn more</Link>

// ✅ Breadcrumbs for hierarchy
<nav aria-label="Breadcrumb">
  <ol itemScope itemType="https://schema.org/BreadcrumbList">
    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
      <a itemProp="item" href="/"><span itemProp="name">Home</span></a>
      <meta itemProp="position" content="1" />
    </li>
    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
      <a itemProp="item" href="/services"><span itemProp="name">Services</span></a>
      <meta itemProp="position" content="2" />
    </li>
  </ol>
</nav>
```

---

## 8. Image SEO

```toon
image_seo[5]{aspect,requirement}:
  Alt text,Descriptive + keywords (125 chars max)
  File names,descriptive-name.jpg not IMG_1234.jpg
  Format,WebP with JPEG fallback
  Compression,<100KB for thumbnails - <500KB for hero
  Lazy loading,loading="lazy" for below-fold images
```

---

## Quick Reference Checklist

```toon
seo_checklist[12]{check,priority}:
  Unique title per page (50-60 chars),Critical
  Meta description (150-160 chars),Critical
  Canonical URL on every page,Critical
  H1 tag (one per page),Critical
  Structured data (JSON-LD),High
  Open Graph + Twitter cards,High
  XML sitemap submitted,High
  Robots.txt configured,High
  Core Web Vitals passing,High
  Mobile-friendly design,Critical
  HTTPS everywhere,Critical
  Image alt text,Medium
```

---

## Related Skills

- `ai-discovery-expert` - AI search engine optimization
- `web-expert` - Frontend performance
- `nextjs-expert` - Next.js SEO implementation

---

**Version:** 1.0.0
