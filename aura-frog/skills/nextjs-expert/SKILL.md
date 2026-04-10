---
name: nextjs-expert
description: "Next.js best practices expert. PROACTIVELY use when working with Next.js, App Router, Server Components, API routes. Triggers: nextjs, next.js, app router, server components, API routes"
autoInvoke: false
priority: high
triggers:
  - "nextjs"
  - "next.js"
  - "app router"
  - "server component"
  - "api route"
  - "page.tsx"
  - "layout.tsx"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Next.js Expert Skill

Next.js 14+ patterns: App Router, Server Components, data fetching, optimization.

---

## 1. App Router Structure

```
app/
├── (auth)/login/page.tsx       # Route group (no URL impact)
├── (dashboard)/
│   ├── layout.tsx              # Shared dashboard layout
│   ├── page.tsx
│   └── settings/page.tsx
├── api/users/route.ts          # API route
├── layout.tsx                  # Root layout
├── page.tsx                    # Home
├── loading.tsx / error.tsx / not-found.tsx
└── global-error.tsx
```

```toon
file_conventions[8]{file,purpose}:
  page.tsx,Route UI component
  layout.tsx,Shared layout (preserves state)
  template.tsx,Shared layout (re-renders)
  loading.tsx,Loading UI (Suspense)
  error.tsx,Error boundary
  not-found.tsx,404 page
  route.ts,API endpoint
  middleware.ts,Request middleware
```

---

## 2. Server vs Client Components

**Server Components** are default -- no directive needed. Access DB/APIs directly.

**Client Components** require `'use client'` directive. Use for interactivity (useState, onClick).

**Principle:** Push `'use client'` boundary as low as possible. Server Components ship zero JS.

```tsx
// Server Component page composing a Client Component
import { getUser } from '@/lib/auth';
import { InteractiveChart } from './InteractiveChart'; // 'use client'

export default async function DashboardPage() {
  const user = await getUser();
  return (
    <div>
      <UserProfile user={user} />         {/* Server - no JS */}
      <InteractiveChart data={user.stats} /> {/* Client - ships JS */}
    </div>
  );
}
```

---

## 3. Data Fetching

**Fetch in Server Components** with cache control:

```tsx
const res = await fetch('https://api.example.com/data', {
  cache: 'force-cache',        // Default - cached indefinitely
  // cache: 'no-store',        // No caching
  // next: { revalidate: 60 }, // Revalidate every 60s
  // next: { tags: ['posts'] },// Tag-based revalidation
});
```

**Parallel fetching** -- always use Promise.all:

```tsx
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

**Streaming** -- wrap slow data in Suspense:

```tsx
<Suspense fallback={<PostsSkeleton />}>
  <Posts />  {/* async Server Component */}
</Suspense>
```

---

## 4. Server Actions

```tsx
// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
});

export async function createPost(formData: FormData) {
  const validated = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors };

  await db.post.create({ data: validated.data });
  revalidatePath('/posts');
  redirect('/posts');
}
```

Use with `useFormStatus` for pending state, `useActionState` (React 19) for form state.

---

## 5. API Routes

```tsx
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const users = await db.user.findMany({ skip: (parseInt(page) - 1) * 10, take: 10 });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts -- access params.id for dynamic routes
```

---

## 6. Middleware

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (token == null && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 7. Metadata & SEO

**Static:** Export `metadata` object. **Dynamic:** Export `generateMetadata` async function.

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt, openGraph: { images: [post.coverImage] } };
}
```

---

## 8. Caching & Revalidation

```toon
cache_strategies[4]{strategy,use_case,code}:
  Static,Rarely changes,cache: 'force-cache'
  Time-based,Updates periodically,next: { revalidate: 60 }
  On-demand,User-triggered,revalidatePath() / revalidateTag()
  No cache,Always fresh,cache: 'no-store'
```

Tag-based: `fetch(url, { next: { tags: ['posts'] } })` then `revalidateTag('posts')`.

---

## 9. Image Optimization

```tsx
import Image from 'next/image';

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority placeholder="blur" />

// Fill container
<div className="relative h-64 w-full">
  <Image src={url} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
</div>
```

Configure remote images in `next.config.js` under `images.remotePatterns`.

---

## 10. Error Handling

`error.tsx` must be a Client Component. Receives `error` and `reset` props. Use `global-error.tsx` for root layout errors (must render `<html>` and `<body>`).

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  Components,Server by default Client when needed
  Client directive,'use client' at top of file
  Data fetching,Fetch in Server Components
  Parallel fetch,Promise.all for multiple fetches
  Streaming,Suspense for slow data
  Forms,Server Actions + useFormStatus
  API routes,Route handlers in app/api
  Caching,Tag-based revalidation
  Images,next/image with sizes prop
  Metadata,generateMetadata for dynamic
  Errors,error.tsx at route level
  Loading,loading.tsx for Suspense
```

---
