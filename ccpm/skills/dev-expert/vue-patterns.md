# Skill: Vue.js Patterns & Best Practices

**Category:** Dev Expert
**Version:** 5.2.0
**Used By:** web-vuejs agent

---

## Overview

Vue.js 3 development patterns using Composition API, TypeScript, and Pinia for modern web applications.

---

## Core Patterns

### 1. Composition API Component

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  userId: string
  initialView?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  initialView: 'grid'
})

const emit = defineEmits<{
  userSelected: [user: User]
}>()

// Reactive state
const loading = ref(false)
const users = ref<User[]>([])
const searchQuery = ref('')

// Computed
const filteredUsers = computed(() =>
  users.value.filter(u =>
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// Watch with debounce
watch(searchQuery, (newValue) => {
  console.log(`Search: ${newValue}`)
}, { debounce: 300 })

// Lifecycle
onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="user-list">
    <input v-model="searchQuery" placeholder="Search..." />
    <div v-if="loading">Loading...</div>
    <UserCard
      v-for="user in filteredUsers"
      :key="user.id"
      :user="user"
      @click="emit('userSelected', user)"
    />
  </div>
</template>
```

### 2. Composables (Reusable Logic)

```typescript
// composables/useFetch.ts
import { ref, unref, watchEffect, type Ref } from 'vue'

export function useFetch<T>(url: string | Ref<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    try {
      const response = await window.fetch(unref(url))
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => fetch())

  return { data, error, loading, refetch: fetch }
}

// Usage
const { data, loading } = useFetch<User[]>('/api/users')
```

### 3. Pinia Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await api.post('/auth/login', { email, password })
      user.value = response.data.user
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
  }

  return { user, loading, isAuthenticated, login, logout }
})
```

### 4. Router with Guards

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', component: () => import('@/views/admin/Dashboard.vue') }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})
```

### 5. Testing with Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const mockUser = { id: '1', name: 'John', email: 'john@test.com' }

  it('renders user info', () => {
    const wrapper = mount(UserCard, { props: { user: mockUser } })
    expect(wrapper.text()).toContain('John')
  })

  it('emits edit event', async () => {
    const wrapper = mount(UserCard, { props: { user: mockUser } })
    await wrapper.find('[data-test="edit-btn"]').trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockUser])
  })
})
```

---

## BEM CSS Naming

```vue
<template>
  <!-- Block: card -->
  <div :class="['card', `card--${size}`, { 'card--active': isActive }]">
    <!-- Element: card__header -->
    <div class="card__header">
      <h2 class="card__title">Title</h2>
      <!-- Element with Modifier -->
      <span class="card__badge card__badge--new">New</span>
    </div>
    <div class="card__body">
      <input :class="['card__input', { 'card__input--error': hasError }]" />
    </div>
  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; border-radius: 8px; }
.card--small { padding: 8px; }
.card--medium { padding: 16px; }
.card--active { border-color: #2196f3; }
.card__header { display: flex; justify-content: space-between; }
.card__title { font-size: 1.25rem; font-weight: 600; }
.card__badge { padding: 4px 8px; border-radius: 4px; }
.card__badge--new { background: #4caf50; color: white; }
.card__input--error { border-color: #f44336; }
</style>
```

**BEM Rules:**
- Block: `.block` (standalone component)
- Element: `.block__element` (part of block)
- Modifier: `.block--modifier` or `.block__element--modifier`
- Keep flat (max 2 levels, avoid `.block__el__el`)

---

## Best Practices

### Do's ✅
- Use Composition API for new projects
- Extract reusable logic to composables
- Use TypeScript for type safety
- Keep components small and focused
- Use Pinia for state management
- Lazy load routes and components
- Use BEM for CSS naming

### Don'ts ❌
- Mutate props directly
- Use Options API for new code
- Put business logic in components
- Forget to cleanup side effects
- Over-use watchers (prefer computed)
- Nest BEM elements deeply

---

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── ui/          # UI components
│   └── features/    # Feature components
├── composables/      # Reusable logic
├── layouts/          # Layout components
├── router/           # Router config
├── stores/           # Pinia stores
├── types/            # TypeScript types
├── views/            # Route views
└── main.ts
```

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
