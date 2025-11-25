# Skill: Next.js Patterns & Best Practices

**Category:** Dev Expert  
**Priority:** High  
**Used By:** web-nextjs agent

---

## Core Patterns

### 1. App Router (Next.js 13+)

```typescript
// app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx - Server Component (default)
export default async function Home() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* render data */}</div>
}

// app/users/[id]/page.tsx - Dynamic route
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id)
  return <UserProfile user={user} />
}
```

### 2. Server vs Client Components

```typescript
// Server Component (default) - runs on server
export default async function ProductList() {
  const products = await db.products.findMany()
  return <div>{products.map(renderProduct)}</div>
}

// Client Component - 'use client' directive
'use client'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Mixed: Server wrapper with Client children
export default async function Dashboard() {
  const data = await fetchData() // Server
  return (
    <div>
      <ServerSidebar data={data} />
      <ClientInteractiveChart data={data} /> {/* Client */}
    </div>
  )
}
```

### 3. Data Fetching

```typescript
// Server-side fetch with caching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  return res.json()
}

// Route Handlers (API routes)
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await db.users.findMany()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.users.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}
```

### 4. Metadata & SEO

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await fetchUser(params.id)
  return {
    title: user.name,
    description: user.bio,
    openGraph: {
      images: [user.avatar],
    },
  }
}
```

### 5. Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Load immediately
  placeholder="blur"
  blurDataURL="data:image/..." 
/>
```

### 6. Server Actions

```typescript
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const user = await db.users.create({ data: { name } })
  revalidatePath('/users') // Refresh data
  return user
}

// app/form.tsx
'use client'
import { createUser } from './actions'

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button>Submit</button>
    </form>
  )
}
```

---

## Best Practices

### Do's ✅
- ✅ Use App Router for new projects
- ✅ Default to Server Components
- ✅ Use 'use client' only when needed
- ✅ Optimize images with next/image
- ✅ Implement proper caching strategies
- ✅ Use Server Actions for mutations

### Don'ts ❌
- ❌ Fetch data in Client Components
- ❌ Use useState in Server Components
- ❌ Forget to revalidate after mutations
- ❌ Ignore loading/error states

---

**Used by web-nextjs agent for Next.js development guidance.**

