---
name: nextjs-expert
description: "Next.js 14+ gotchas and decision criteria. Covers server/client boundary, caching strategy, and data fetching patterns Claude commonly gets wrong."
autoInvoke: false
priority: high
triggers:
  - "nextjs"
  - "next.js"
  - "app router"
  - "server component"
paths:
  - "app/**/*"
  - "pages/**/*"
  - "next.config.*"
  - "middleware.*"
allowed-tools: Read, Grep, Glob, Edit, Write
user-invocable: false
---

# Next.js Expert — Gotchas & Decisions

Use Context7 for full Next.js docs.

## Key Decisions

```toon
decisions[4]{choice,use_when}:
  Server vs Client,"Server by default. 'use client' ONLY for interactivity (useState/onClick). Push boundary as low as possible"
  Cache strategy,"force-cache (static) | revalidate:N (time) | revalidateTag (on-demand) | no-store (always fresh)"
  Server Actions vs API routes,"Actions for form mutations. API routes for external consumers/webhooks"
  Streaming vs blocking,"Suspense wrap for slow data. Always Promise.all for parallel fetches"
```

## Gotchas

- Server Components can't use useState/useEffect — move interactive parts to a child Client Component
- `'use client'` makes ALL imports in that file client-side — keep it at leaf components
- `fetch()` in Server Components is auto-deduped but only within same render pass
- Server Actions: always validate with Zod — formData comes from untrusted client
- `error.tsx` MUST be a Client Component (`'use client'`). `global-error.tsx` must render `<html>` and `<body>`
- `loading.tsx` wraps page in Suspense — don't double-wrap with manual Suspense
- Dynamic routes `[slug]`: params are now a Promise in Next.js 15 — `await params`
- `revalidatePath('/')` revalidates ALL pages, not just home — use `revalidateTag` for precision
- Image: always provide `sizes` prop with `fill` — without it, Next.js sends full-size image
- Middleware runs on Edge: no Node.js APIs (fs, Buffer, etc.)
