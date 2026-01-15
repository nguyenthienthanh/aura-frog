# Structured Data & Schema.org Rules

**Category:** Quality
**Priority:** High
**Version:** 1.0.0
**Purpose:** Implement Schema.org structured data for rich search results and AI discovery

---

## Overview

Structured data helps search engines and AI systems understand your content. Proper implementation enables rich snippets, knowledge panels, and better AI citations.

---

## Core Principles

### 1. Use JSON-LD Format

```html
<!-- ✅ GOOD: JSON-LD (Google recommended) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title"
}
</script>

<!-- ❌ AVOID: Microdata (harder to maintain) -->
<div itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">Article Title</h1>
</div>
```

### 2. Place in `<head>` or End of `<body>`

```html
<head>
  <!-- Other meta tags -->
  <script type="application/ld+json">
    { "@context": "https://schema.org", ... }
  </script>
</head>
```

---

## Required Schemas by Page Type

### Website (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Organization

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
    "contactType": "customer service",
    "availableLanguage": ["English", "Spanish"]
  }
}
```

### Article / Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 chars)",
  "description": "Article description",
  "image": [
    "https://example.com/image-1x1.jpg",
    "https://example.com/image-4x3.jpg",
    "https://example.com/image-16x9.jpg"
  ],
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author/name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-15T08:00:00+00:00",
  "dateModified": "2025-01-15T10:30:00+00:00",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/article-url"
  }
}
```

### Product (E-commerce)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product.jpg",
  "description": "Product description",
  "sku": "SKU123",
  "mpn": "MPN456",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "99.99",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Seller Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "bestRating": "5",
    "worstRating": "1",
    "reviewCount": "89"
  }
}
```

### FAQ Page

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here."
      }
    },
    {
      "@type": "Question",
      "name": "Another question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Another answer."
      }
    }
  ]
}
```

### Local Business

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/photo.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "telephone": "+1-800-555-1234",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ]
}
```

### Breadcrumb

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current Page"
    }
  ]
}
```

### HowTo (Step-by-Step Guide)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Do Something",
  "description": "Brief description of what this guide teaches",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1 Title",
      "text": "Step 1 instructions",
      "image": "https://example.com/step1.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2 Title",
      "text": "Step 2 instructions",
      "image": "https://example.com/step2.jpg"
    }
  ]
}
```

---

## Implementation in Next.js

### JSON-LD Component

```typescript
// components/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Usage

```typescript
// app/blog/[slug]/page.tsx
import { JsonLd } from '@/components/JsonLd';

export default function BlogPost({ post }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": { "@type": "Person", "name": post.author },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <article>...</article>
    </>
  );
}
```

---

## Validation Requirements

### Before Deployment

```toon
validation_checklist[4]{step,tool}:
  Test with Rich Results,Google Rich Results Test
  Validate JSON-LD syntax,Schema.org Validator
  Check for errors,Google Search Console
  Monitor rich snippets,Search Console Enhancements
```

### Common Errors to Avoid

```toon
schema_errors[5]{error,fix}:
  Missing required fields,Check schema.org for required properties
  Invalid date format,Use ISO 8601: 2025-01-15T08:00:00+00:00
  Missing @context,Always include "https://schema.org"
  Wrong @type,Use exact schema.org type names
  Broken image URLs,Use absolute URLs with https
```

---

## Multiple Schemas per Page

```html
<!-- ✅ Can include multiple schemas -->
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Company"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Site Name"
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
]
</script>
```

---

**Related Skills:** `seo-expert`, `ai-discovery-expert`
**Version:** 1.0.0
