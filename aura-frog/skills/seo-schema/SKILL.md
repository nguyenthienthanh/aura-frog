---
name: seo-schema
description: "Validate structured data (Schema.org JSON-LD) using Google Rich Results Test. Ensures schema is error-free before deployment."
autoInvoke: false
priority: high
triggers:
  - "seo:schema"
  - "schema validation"
  - "validate schema"
  - "rich results"
  - "json-ld validation"
allowed-tools: Read, Grep, Glob, WebFetch, Bash
---

# SEO Schema Validation Command

Validate structured data (Schema.org JSON-LD) using Google Rich Results Test.

---

## Usage

```bash
# Validate schema on URL
/seo:schema https://myapp.com

# Validate specific page
/seo:schema https://myapp.com/blog/article

# Validate local dev server
/seo:schema http://localhost:3000

# Validate code snippet (opens Rich Results Test)
/seo:schema --code
```

---

## Validation Process

### Step 1: Open Rich Results Test

**URL:** https://search.google.com/test/rich-results

### Step 2: Test URL or Code

**Option A: Test Live URL**
1. Go to https://search.google.com/test/rich-results
2. Paste URL in the input field
3. Click "Test URL"
4. Wait for analysis (10-30 seconds)

**Option B: Test Code Snippet**
1. Go to https://search.google.com/test/rich-results
2. Click "Code" tab
3. Paste JSON-LD script
4. Click "Test Code"

### Step 3: Review Results

```toon
result_status[3]{status,meaning,action}:
  Green checkmark,Schema valid - eligible for rich results,Deploy
  Yellow warning,Non-critical issues,Review and fix if important
  Red error,Schema invalid - won't show rich results,Must fix before deploy
```

---

## Schema Types to Validate

```toon
schema_types[10]{type,rich_result,priority}:
  Article,Article rich result,High
  Product,Product snippet with price/rating,High
  FAQPage,FAQ accordion in SERP,High
  HowTo,Step-by-step instructions,Medium
  BreadcrumbList,Breadcrumb trail,High
  Organization,Knowledge panel,High
  LocalBusiness,Local pack listing,High
  Review,Review stars,Medium
  Event,Event listing,Medium
  Recipe,Recipe card,Medium
```

---

## Common Errors & Fixes

```toon
common_errors[6]{error,cause,fix}:
  Missing required field,Required property not present,Add missing property
  Invalid date format,Wrong date string,Use ISO 8601: 2025-01-15T08:00:00+00:00
  Invalid URL,Relative URL used,Use absolute URL with https://
  Missing @context,No context declaration,Add "@context": "https://schema.org"
  Wrong @type,Typo in type name,Use exact Schema.org type name
  Invalid image,Broken or wrong format image,Use absolute URL to valid image
```

---

## Quick Reference: Valid JSON-LD Template

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 chars)",
  "description": "Article description",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name"
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
  "dateModified": "2025-01-15T10:30:00+00:00"
}
</script>
```

---

## Output Format

Generate report with:

| Schema Type | Status | Issues |
|-------------|--------|--------|
| Article | PASS/WARNING/FAIL | Details |
| BreadcrumbList | PASS/WARNING/FAIL | Details |

Include:
- Rich Results Test link for URL
- Preview of rich result appearance
- Specific fixes for any issues

---

## Related Commands

| Command | Purpose |
|---------|---------|
| `/seo:check` | Full SEO audit |
| `/seo:geo` | AI discovery audit |

---

**Version:** 1.16.0
