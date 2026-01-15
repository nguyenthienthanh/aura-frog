# AI Discovery Optimization Rules

**Category:** Quality
**Priority:** High
**Version:** 1.0.0
**Purpose:** Optimize web content for AI search engines (Perplexity, ChatGPT, Gemini) and LLM citation

---

## Overview

AI-powered search engines synthesize answers from multiple sources. These rules ensure your content gets discovered and cited by AI systems like Perplexity, ChatGPT Search, Google Gemini, and Claude.

---

## Core Principles

### 1. Answer-First Content Structure

```markdown
<!-- ✅ GOOD: Direct answer in first paragraph -->
# What is Server-Side Rendering?

Server-Side Rendering (SSR) is a technique where web pages are
generated on the server and sent as complete HTML to the browser.
This improves initial load time and SEO compared to client-side rendering.

## How It Works
...

<!-- ❌ BAD: Answer buried after introduction -->
# Understanding Modern Web Development

In the rapidly evolving world of web development, there are many
approaches to rendering content. Some frameworks use client-side
rendering, while others prefer server-side approaches...
[300 words later]
...this is called Server-Side Rendering (SSR).
```

### 2. Clear, Parseable Structure

```toon
structure_rules[5]{element,purpose}:
  H1,One per page - main topic
  H2,Major sections/questions
  H3,Subsections/details
  Lists,Scannable key points
  Tables,Structured comparisons
```

---

## AI-Optimized Content Patterns

### Definition Pattern

```markdown
## What is [Term]?

[Term] is [one-sentence definition]. It [primary function/purpose].

Key characteristics:
- Characteristic 1
- Characteristic 2
- Characteristic 3
```

### Comparison Pattern

```markdown
## [Option A] vs [Option B]

| Feature | Option A | Option B |
|---------|----------|----------|
| Speed   | Fast     | Faster   |
| Cost    | $10/mo   | $20/mo   |
| Ease    | Easy     | Medium   |

**Choose Option A if:** You need [specific use case].
**Choose Option B if:** You need [different use case].
```

### How-To Pattern

```markdown
## How to [Task]

[Brief overview of what user will accomplish]

### Prerequisites
- Requirement 1
- Requirement 2

### Steps

1. **Step 1 Title**
   Description of step 1.

2. **Step 2 Title**
   Description of step 2.

3. **Step 3 Title**
   Description of step 3.

### Result
After completing these steps, you will have [outcome].
```

---

## Entity Optimization (Critical)

### Build Topic Authority

```toon
entity_requirements[4]{signal,implementation}:
  Author expertise,Credentials on author page + bio
  Organization authority,About page with company info
  Topic clusters,Hub pages linking to subtopics
  Consistent naming,Same entity names site-wide
```

### Author Schema (Required for E-E-A-T)

```json
{
  "@type": "Person",
  "name": "Author Name",
  "jobTitle": "Senior Engineer",
  "knowsAbout": ["React", "TypeScript", "SEO"],
  "sameAs": [
    "https://twitter.com/author",
    "https://github.com/author"
  ]
}
```

---

## AI Crawler Access

### robots.txt Configuration

```txt
# Allow AI crawlers for discovery
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

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### Known AI Crawlers

```toon
ai_crawlers[6]{bot,engine,status}:
  GPTBot,OpenAI/ChatGPT,ALLOW recommended
  Google-Extended,Google Gemini,ALLOW recommended
  PerplexityBot,Perplexity,ALLOW recommended
  ClaudeBot,Anthropic Claude,ALLOW recommended
  Applebot-Extended,Apple Intelligence,ALLOW recommended
  CCBot,Common Crawl,Optional (training only)
```

---

## Content Quality Signals

### What Gets Cited

```toon
citation_factors[6]{factor,implementation}:
  Original data,Research/benchmarks/surveys
  Expert opinions,Quotes from recognized authorities
  Specific numbers,"Stats like 47% faster not just faster"
  Step-by-step guides,Numbered actionable instructions
  Comparison tables,Side-by-side feature matrices
  Clear definitions,One-sentence explanations first
```

### Content Freshness

```html
<!-- ✅ Show dates prominently -->
<article>
  <header>
    <h1>Complete Guide to Next.js 15</h1>
    <time datetime="2025-01-15">Last updated: January 15, 2025</time>
  </header>
</article>

<!-- Include update history for major guides -->
<section>
  <h2>Revision History</h2>
  <ul>
    <li><strong>Jan 2025:</strong> Updated for Next.js 15</li>
    <li><strong>Aug 2024:</strong> Added App Router section</li>
  </ul>
</section>
```

---

## FAQ Implementation

### AI-Friendly FAQ Structure

```html
<!-- Schema + HTML combined -->
<section itemscope itemtype="https://schema.org/FAQPage">
  <h2>Frequently Asked Questions</h2>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">What is the best framework for SSR?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        Next.js is widely considered the best framework for SSR because
        of its built-in support for server components, automatic code
        splitting, and excellent developer experience.
      </p>
    </div>
  </div>
</section>
```

---

## LLM.txt (Emerging Standard)

### Implementation

```txt
# /llm.txt - AI-specific instructions
name: Your Site Name
description: What your site is about
author: Company/Author Name

topics: topic1, topic2, topic3
update-frequency: weekly
last-update: 2025-01-15

citation-name: Your Preferred Citation Name
citation-url: https://yoursite.com

key-pages:
  - /about - Company information
  - /glossary - Term definitions
  - /guides - Tutorials and guides
```

---

## Semantic HTML Requirements

```html
<!-- ✅ GOOD: Rich semantic structure -->
<article>
  <header>
    <h1>Main Topic</h1>
    <p class="lead">Summary paragraph for quick parsing</p>
  </header>

  <nav aria-label="Table of contents">
    <h2>In this article</h2>
    <ol>
      <li><a href="#section-1">Section 1</a></li>
      <li><a href="#section-2">Section 2</a></li>
    </ol>
  </nav>

  <section id="section-1">
    <h2>Section 1 Heading</h2>
    <p>Content...</p>
  </section>

  <aside>
    <h3>Related Topics</h3>
    <ul>
      <li><a href="/related-1">Related Article 1</a></li>
    </ul>
  </aside>
</article>

<!-- ❌ BAD: Generic divs without semantics -->
<div class="article">
  <div class="header">...</div>
  <div class="content">...</div>
</div>
```

---

## Monitoring AI Citations

### Manual Testing

Test your content visibility with these queries:

```markdown
1. "What is [your main topic]?"
2. "Best [your product/service category]"
3. "How to [task your content teaches]"
4. "[Your brand name]"
```

### Tracking Mentions

```toon
monitoring_methods[3]{method,purpose}:
  Perplexity search,Direct citation check
  Google Alerts,Brand mention tracking
  ChatGPT queries,Test answer engine visibility
```

---

## Implementation Checklist

```toon
ai_checklist[12]{requirement,priority}:
  Answer-first content,Critical
  Clear heading hierarchy,Critical
  Semantic HTML structure,Critical
  Allow AI crawlers,High
  Author/org schema,High
  FAQ sections with schema,High
  Visible update dates,High
  Original research/data,High
  Comparison tables,Medium
  llm.txt file,Medium
  Topic cluster architecture,Medium
  Citation monitoring,Low
```

---

**Related Skills:** `ai-discovery-expert`, `seo-expert`
**Version:** 1.0.0
