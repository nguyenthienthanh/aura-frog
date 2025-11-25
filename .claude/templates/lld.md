# Low-Level Design (LLD) Template

**Feature:** [Feature Name]  
**Date:** [Date]

---

## Component Architecture

```
Component Hierarchy:
- ParentComponent
  ├── ChildComponent1
  │   └── GrandchildComponent
  └── ChildComponent2
```

---

## Data Structures

```typescript
interface User {
  id: string
  name: string
  email: string
}

interface Post {
  id: string
  userId: string
  content: string
  createdAt: Date
}
```

---

## API Endpoints

### POST /api/posts
**Request:**
```json
{
  "content": "string",
  "platform": "facebook" | "instagram"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "success"
}
```

---

## State Management

- Local state: Modal open/close
- Global state: User data (Zustand)
- Server state: API data (React Query)

---

## File Structure

```
src/
├── components/
│   └── ShareModal.tsx
├── hooks/
│   └── useSharePost.ts
└── api/
    └── shareApi.ts
```

---

## Functions & Methods

### handleSubmit()
**Purpose:** Submit post to selected platform  
**Parameters:** `{ platform, content }`  
**Returns:** `Promise<void>`  
**Logic:**
1. Validate input
2. Call API
3. Handle response
4. Show success/error

