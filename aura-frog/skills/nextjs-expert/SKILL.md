---
name: nextjs-expert
description: "Next.js best practices expert. PROACTIVELY use when working with Next.js, App Router, Server Components, API routes. Triggers: nextjs, next.js, app router, server components, API routes"
autoInvoke: true
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

Expert-level Next.js 14+ patterns, App Router, Server Components, data fetching, and optimization.

---

## Auto-Detection

This skill activates when:
- Working with Next.js projects
- Detected `next` in package.json
- Working with App Router structure (`app/` directory)
- Building API routes or Server Components

---

## 1. App Router Structure

### Recommended Structure

```
app/
├── (auth)/                    # Route group (no URL impact)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx            # Shared dashboard layout
│   ├── page.tsx              # /dashboard
│   └── settings/
│       └── page.tsx          # /dashboard/settings
├── api/
│   └── users/
│       └── route.ts          # API route
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
├── loading.tsx               # Loading UI
├── error.tsx                 # Error UI
├── not-found.tsx             # 404 page
└── global-error.tsx          # Global error boundary
```

### File Conventions

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

### Server Components (Default)

```tsx
// ✅ GOOD - Server Component (default, no directive needed)
// app/users/page.tsx
import { db } from '@/lib/db';

export default async function UsersPage() {
  // Direct database access - runs on server only
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Client Components

```tsx
// ✅ GOOD - Client Component (explicit directive)
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Component Boundaries

```tsx
// ✅ GOOD - Keep client boundary as low as possible
// app/dashboard/page.tsx (Server Component)
import { getUser } from '@/lib/auth';
import { UserProfile } from './UserProfile';
import { InteractiveChart } from './InteractiveChart'; // Client

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      {/* Server Component - no JS shipped */}
      <UserProfile user={user} />

      {/* Client Component - only this ships JS */}
      <InteractiveChart data={user.stats} />
    </div>
  );
}
```

---

## 3. Data Fetching

### Server Component Fetching

```tsx
// ✅ GOOD - Fetch in Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    // Cache options
    cache: 'force-cache',      // Default - cached indefinitely
    // cache: 'no-store',      // No caching
    // next: { revalidate: 60 }, // Revalidate every 60s
    // next: { tags: ['posts'] }, // Tag-based revalidation
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{/* render data */}</div>;
}
```

### Parallel Data Fetching

```tsx
// ✅ GOOD - Parallel fetching
export default async function Page() {
  // Start both fetches simultaneously
  const userPromise = getUser();
  const postsPromise = getPosts();

  // Wait for both
  const [user, posts] = await Promise.all([userPromise, postsPromise]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
    </div>
  );
}
```

### Streaming with Suspense

```tsx
// ✅ GOOD - Stream slow data
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      {/* Renders immediately */}
      <Header />

      {/* Streams when ready */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

// Async Server Component
async function Posts() {
  const posts = await getPosts(); // Slow fetch
  return <PostList posts={posts} />;
}
```

---

## 4. Server Actions

### Form Actions

```tsx
// ✅ GOOD - Server Action in separate file
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
});

export async function createPost(formData: FormData) {
  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, content } = validatedFields.data;

  await db.post.create({ data: { title, content } });

  revalidatePath('/posts');
  redirect('/posts');
}
```

```tsx
// ✅ GOOD - Form with Server Action
// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <SubmitButton />
    </form>
  );
}

// Client component for pending state
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}
```

### useActionState (React 19)

```tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/app/actions';

export function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" />
      {state?.errors?.title && <p>{state.errors.title}</p>}

      <textarea name="content" />
      {state?.errors?.content && <p>{state.errors.content}</p>}

      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

---

## 5. API Routes

### Route Handlers

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ?? '1';

  const users = await db.user.findMany({
    skip: (parseInt(page) - 1) * 10,
    take: 10,
  });

  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await db.user.create({ data: body });

  return NextResponse.json(user, { status: 201 });
}
```

### Dynamic Routes

```tsx
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const user = await db.user.findUnique({
    where: { id: params.id },
  });

  if (user == null) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await db.user.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
```

---

## 6. Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth
  const token = request.cookies.get('token');

  if (token == null && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 7. Metadata & SEO

### Static Metadata

```tsx
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | My App',
  description: 'Welcome to my app',
  openGraph: {
    title: 'Home | My App',
    description: 'Welcome to my app',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return <main>...</main>;
}
```

### Dynamic Metadata

```tsx
// app/posts/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  return <article>{/* ... */}</article>;
}
```

---

## 8. Caching & Revalidation

### Cache Strategies

```toon
cache_strategies[4]{strategy,use_case,code}:
  Static,Rarely changes,cache: 'force-cache'
  Time-based,Updates periodically,next: { revalidate: 60 }
  On-demand,User-triggered,revalidatePath() / revalidateTag()
  No cache,Always fresh,cache: 'no-store'
```

### On-Demand Revalidation

```tsx
// app/actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updatePost(id: string, data: PostData) {
  await db.post.update({ where: { id }, data });

  // Revalidate specific path
  revalidatePath(`/posts/${id}`);

  // Or revalidate by tag
  revalidateTag('posts');
}

// In fetch
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
});
```

---

## 9. Image Optimization

```tsx
import Image from 'next/image';

// ✅ GOOD - Optimized image
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Load immediately (LCP)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// ✅ GOOD - Fill container
<div className="relative h-64 w-full">
  <Image
    src={post.coverImage}
    alt={post.title}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>

// ✅ GOOD - Remote images (configure in next.config.js)
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
};
```

---

## 10. Error Handling

```tsx
// app/error.tsx (Client Component required)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/global-error.tsx (Root layout errors)
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

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

**Version:** 1.2.5
