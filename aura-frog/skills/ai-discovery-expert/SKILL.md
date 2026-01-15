---
name: ai-discovery-expert
description: "AI Discovery and LLM search optimization expert. PROACTIVELY use when optimizing for Perplexity, ChatGPT Search, Gemini, Claude, AI crawlers. Triggers: AI search, Perplexity, ChatGPT, AI discovery, LLM citation"
autoInvoke: true
priority: high
triggers:
  - "ai search"
  - "perplexity"
  - "chatgpt search"
  - "gemini search"
  - "ai discovery"
  - "llm citation"
  - "ai crawler"
  - "answer engine"
  - "generative search"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# AI Discovery Expert Skill

Expert-level optimization for AI-powered search engines and answer engines. Covers Perplexity, ChatGPT Search, Gemini, Claude, and other LLM-based discovery platforms.

---

## Auto-Detection

This skill activates when:
- Discussing AI search engines (Perplexity, ChatGPT Search, Gemini)
- Optimizing content for LLM citation and discovery
- Implementing AI-friendly content structures
- Working on answer engine optimization (AEO)
- Discussing generative search and AI crawlers

---

## 1. AI Discovery vs Traditional SEO

```toon
comparison[4]{aspect,traditional_seo,ai_discovery}:
  Goal,Rank on SERP position 1-10,Get cited in AI answers
  Format,Keywords + backlinks,Clear answers + structured data
  Content,Keyword density,Comprehensive + authoritative
  Measurement,Rankings + clicks,Citations + brand mentions
```

### Key Insight

AI search engines synthesize answers from multiple sources. Your goal is to be **cited as an authoritative source**, not just ranked.

---

## 2. Content Structure for AI Citation

### Answer-First Writing

```markdown
<!-- ✅ GOOD: Direct answer first -->
# What is Server-Side Rendering (SSR)?

Server-Side Rendering (SSR) is a technique where web pages are rendered
on the server and sent as fully-formed HTML to the browser. This improves
initial page load time and SEO compared to client-side rendering.

## How SSR Works
1. User requests a page
2. Server renders the HTML
3. Browser receives complete HTML
4. JavaScript hydrates for interactivity

<!-- ❌ BAD: Buried answer -->
# Understanding Modern Web Development

In the evolving landscape of web development, there are many techniques...
[500 words later]
...which brings us to Server-Side Rendering (SSR).
```

### Structured Answer Patterns

```toon
answer_patterns[5]{pattern,usage,example}:
  Definition first,Concepts/terms,"X is a technique that..."
  Step-by-step,How-to guides,"1. First... 2. Then... 3. Finally..."
  Comparison tables,Alternatives,Feature comparison grids
  Pro/con lists,Decision making,"Pros: ... Cons: ..."
  FAQ format,Common questions,"Q: What is? A: It is..."
```

---

## 3. AI-Optimized Content Formats

### Comprehensive FAQ Sections

```html
<!-- Structured for both SEO and AI -->
<section itemscope itemtype="https://schema.org/FAQPage">
  <h2>Frequently Asked Questions</h2>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">What is the best framework for SSR?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        Next.js is widely considered the best framework for SSR due to its
        built-in support for server components, automatic code splitting,
        and excellent developer experience. Alternatives include Nuxt.js
        for Vue and SvelteKit for Svelte.
      </p>
    </div>
  </div>
</section>
```

### Authoritative Data Tables

```html
<!-- Tables are easily parsed by AI -->
<table>
  <caption>SSR Framework Comparison 2025</caption>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Language</th>
      <th>Performance</th>
      <th>Learning Curve</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Next.js</td>
      <td>React/TypeScript</td>
      <td>Excellent</td>
      <td>Medium</td>
    </tr>
    <tr>
      <td>Nuxt.js</td>
      <td>Vue/TypeScript</td>
      <td>Excellent</td>
      <td>Easy</td>
    </tr>
  </tbody>
</table>
```

---

## 4. Entity Optimization (Critical for AI)

### Build Topic Authority

```toon
entity_signals[5]{signal,implementation}:
  Author entities,Author pages with credentials + schema
  Organization entities,About page with company schema
  Topic clusters,Hub pages linking to detailed subtopics
  External mentions,Citations from authoritative sources
  Consistent naming,Same entity names across all content
```

### Author Schema for E-E-A-T

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://example.com/authors/john-doe#person",
  "name": "John Doe",
  "jobTitle": "Senior Software Engineer",
  "description": "10+ years experience in web development, contributor to React and Next.js",
  "url": "https://example.com/authors/john-doe",
  "sameAs": [
    "https://twitter.com/johndoe",
    "https://github.com/johndoe",
    "https://linkedin.com/in/johndoe"
  ],
  "knowsAbout": [
    "React",
    "Next.js",
    "Server-Side Rendering",
    "Web Performance"
  ],
  "alumniOf": {
    "@type": "Organization",
    "name": "MIT"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name"
  }
}
```

---

## 5. Semantic HTML for AI Parsing

### Clear Content Hierarchy

```html
<!-- ✅ GOOD: Clear semantic structure -->
<article>
  <header>
    <h1>Complete Guide to Server-Side Rendering</h1>
    <p class="summary">
      Learn how SSR improves performance and SEO for modern web apps.
    </p>
    <time datetime="2025-01-15">January 15, 2025</time>
  </header>

  <nav aria-label="Table of contents">
    <h2>Contents</h2>
    <ol>
      <li><a href="#what-is-ssr">What is SSR?</a></li>
      <li><a href="#benefits">Benefits of SSR</a></li>
      <li><a href="#implementation">Implementation Guide</a></li>
    </ol>
  </nav>

  <section id="what-is-ssr">
    <h2>What is SSR?</h2>
    <p>Server-Side Rendering is...</p>
  </section>

  <section id="benefits">
    <h2>Benefits of SSR</h2>
    <ul>
      <li>Faster initial page load</li>
      <li>Better SEO performance</li>
      <li>Improved accessibility</li>
    </ul>
  </section>

  <aside>
    <h3>Related Articles</h3>
    <ul>
      <li><a href="/static-generation">Static Site Generation</a></li>
      <li><a href="/client-rendering">Client-Side Rendering</a></li>
    </ul>
  </aside>
</article>
```

---

## 6. AI Crawler Considerations

### Perplexity Bot

```txt
# robots.txt - Allow Perplexity
User-agent: PerplexityBot
Allow: /
Crawl-delay: 1
```

### Common AI Crawlers

```toon
ai_crawlers[6]{bot,engine,recommendation}:
  GPTBot,OpenAI/ChatGPT,Allow for AI search visibility
  Google-Extended,Google Gemini,Allow for Gemini citations
  PerplexityBot,Perplexity,Allow - major AI search engine
  ClaudeBot,Anthropic Claude,Allow for Claude citations
  Applebot-Extended,Apple Intelligence,Allow for Apple AI features
  CCBot,Common Crawl,Allow - trains many AI models
```

### Recommended robots.txt

```txt
# Allow major AI crawlers for discovery
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

# Block training-only crawlers if desired
User-agent: CCBot
Disallow: /

# Standard search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

## 7. Content Freshness Signals

### Keep-Current Patterns

```typescript
// Show last updated date prominently
<article>
  <header>
    <h1>Next.js SEO Guide</h1>
    <div className="meta">
      <time dateTime="2025-01-15">
        Last updated: January 15, 2025
      </time>
      <span>Originally published: March 2024</span>
    </div>
  </header>
</article>

// Add update log for major changes
<section>
  <h2>Update History</h2>
  <ul>
    <li><strong>Jan 2025:</strong> Added Next.js 15 features</li>
    <li><strong>Oct 2024:</strong> Updated for App Router changes</li>
    <li><strong>Mar 2024:</strong> Initial publication</li>
  </ul>
</section>
```

### Schema with Dates

```json
{
  "@type": "Article",
  "datePublished": "2024-03-15T08:00:00+00:00",
  "dateModified": "2025-01-15T10:30:00+00:00"
}
```

---

## 8. Citation-Worthy Content Patterns

### What Gets Cited

```toon
citation_factors[6]{factor,why}:
  Original research,Unique data AI can't find elsewhere
  Expert opinions,Authoritative perspectives
  Concrete numbers,Statistics and benchmarks
  Step-by-step guides,Actionable how-to content
  Comparison tables,Structured decision-making data
  Definition sections,Clear explanations of concepts
```

### Content Quality Signals

```toon
quality_signals[5]{signal,implementation}:
  Expertise,Author credentials + experience displayed
  Sources,Citations to authoritative references
  Comprehensiveness,Cover topic fully with depth
  Recency,Regular updates with visible dates
  Uniqueness,Original insights not found elsewhere
```

---

## 9. LLM.txt Standard (Emerging)

### What is llm.txt?

A proposed standard (like robots.txt) specifically for AI/LLM consumption.

```txt
# llm.txt - AI-specific instructions
# Place at site root: https://example.com/llm.txt

# Site identity
name: Example Tech Blog
description: Expert guides on web development and JavaScript frameworks
author: Example Team
contact: hello@example.com

# Content focus
topics: React, Next.js, TypeScript, Web Performance, SEO

# Citation preferences
citation-name: Example Tech Blog
citation-url: https://example.com

# Content freshness
update-frequency: weekly
last-major-update: 2025-01-15

# Preferred citation format
cite-as: "According to Example Tech Blog..."

# Key resources for AI understanding
resources:
  - /about - Company and author information
  - /glossary - Technical term definitions
  - /guides - Comprehensive tutorials
```

---

## 10. Monitoring AI Citations

### Track Brand Mentions

```toon
monitoring_tools[4]{tool,purpose}:
  Perplexity,Search your brand - see if cited
  ChatGPT,Ask about your topic - check citations
  Google Alerts,Monitor brand mentions across web
  BrandMentions,Track citations in AI responses
```

### Manual Testing Prompts

```markdown
Test queries to check AI citations:

1. "What is [your topic]?" - Check if your definition is cited
2. "Best [your product category]" - Check if you appear in recommendations
3. "How to [task you teach]" - Check if your guide is referenced
4. "[Your brand name] review" - Check brand awareness
```

---

## Quick Reference Checklist

```toon
ai_discovery_checklist[12]{check,priority}:
  Answer-first content structure,Critical
  Clear semantic HTML hierarchy,Critical
  Comprehensive FAQ sections,High
  Author/organization schema,High
  Allow AI crawlers in robots.txt,High
  Visible update dates,High
  Original research/data,High
  Structured comparison tables,Medium
  Topic cluster architecture,Medium
  External authority signals,Medium
  llm.txt file (emerging),Low
  Citation monitoring setup,Low
```

---

## Related Skills

- `seo-expert` - Traditional search engine optimization
- `web-expert` - Frontend implementation
- `nextjs-expert` - Next.js metadata implementation

---

**Version:** 1.0.0
