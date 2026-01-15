# Command: seo:schema

**Command:** `seo:schema [url]`
**Agent:** web-expert
**Version:** 1.0.0

---

## Purpose

Validate structured data (Schema.org JSON-LD) using Google Rich Results Test. Ensures schema is error-free before deployment.

---

## Usage

```bash
# Validate schema on URL
seo:schema https://myapp.com

# Validate specific page
seo:schema https://myapp.com/blog/article

# Validate local dev server
seo:schema http://localhost:3000

# Validate code snippet (opens Rich Results Test)
seo:schema --code
```

---

## Validation Process

### Step 1: Open Rich Results Test

**URL:** https://search.google.com/test/rich-results

### Step 2: Test URL or Code

```markdown
**Option A: Test Live URL**
1. Go to https://search.google.com/test/rich-results
2. Paste your URL in the input field
3. Click "Test URL"
4. Wait for analysis (10-30 seconds)

**Option B: Test Code Snippet**
1. Go to https://search.google.com/test/rich-results
2. Click "Code" tab
3. Paste your JSON-LD script
4. Click "Test Code"
```

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

## Output

```markdown
# Schema Validation Report

**URL:** https://myapp.com/blog/my-article
**Date:** 2025-01-15
**Test:** Google Rich Results Test

---

## Results

| Schema Type | Status | Issues |
|-------------|--------|--------|
| Article | PASS | None |
| BreadcrumbList | PASS | None |
| Organization | WARNING | Missing logo |

**Overall:** PASS (eligible for rich results)

---

## Rich Results Preview

**Article:**
- Headline: "Complete Guide to SEO"
- Author: John Doe
- Date: January 15, 2025
- Image: [Preview shown]

---

## Warnings

### Organization: Missing logo
- **Field:** logo
- **Impact:** Knowledge panel may not show logo
- **Fix:** Add logo property with ImageObject

---

## Validation Links

- **Test this URL:** https://search.google.com/test/rich-results?url=https://myapp.com/blog/my-article
- **Schema.org Validator:** https://validator.schema.org

---

## Next Steps

1. Fix logo warning in Organization schema
2. Re-test to confirm fix
3. Submit URL to Google Search Console for indexing
```

---

## Quick Reference

### Valid JSON-LD Template

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

## Related Commands

| Command | Purpose |
|---------|---------|
| `seo:check` | Full SEO audit |
| `seo:geo` | AI discovery audit |

---

**Command:** seo:schema
**Version:** 1.0.0
