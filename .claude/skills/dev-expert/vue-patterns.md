# Skill: Vue.js Patterns & Best Practices

**Category:** Dev Expert  
**Priority:** High  
**Used By:** web-vuejs agent

---

## Overview

Vue.js 3 development patterns, best practices, and architectural guidelines for building modern, maintainable web applications.

---

## Core Capabilities

### 1. Composition API Patterns

**Modern Vue 3 approach:**

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/composables'

// Props with TypeScript
interface Props {
  userId: string
  initialView?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  initialView: 'grid'
})

// Emits
const emit = defineEmits<{
  userSelected: [user: User]
  viewChanged: [view: string]
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

// Watch
watch(searchQuery, (newValue) => {
  console.log(`Search changed to: ${newValue}`)
}, { debounce: 300 })

// Lifecycle
onMounted(async () => {
  await loadUsers()
})

// Methods
async function loadUsers() {
  loading.value = true
  try {
    const { data } = await useFetch<User[]>('/api/users')
    users.value = data.value
  } finally {
    loading.value = false
  }
}

function selectUser(user: User) {
  emit('userSelected', user)
}
</script>

<template>
  <div class="user-list">
    <input 
      v-model="searchQuery" 
      placeholder="Search users..."
      class="search-input"
    />
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="filteredUsers.length">
      <UserCard
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        @click="selectUser(user)"
      />
    </div>
    
    <div v-else class="empty">No users found</div>
  </div>
</template>

<style scoped>
.user-list {
  padding: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
</style>
```

### 2. Composables (Reusable Logic)

**Extract reusable logic:**

```typescript
// composables/useFetch.ts
import { ref, unref, watchEffect, type Ref } from 'vue'

export function useFetch<T>(url: string | Ref<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    error.value = null
    
    try {
      const response = await window.fetch(unref(url))
      if (!response.ok) throw new Error(response.statusText)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    fetch()
  })

  return { data, error, loading, refetch: fetch }
}

// Usage
const { data, error, loading } = useFetch<User[]>('/api/users')
```

```typescript
// composables/useLocalStorage.ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)

  // Read from localStorage
  try {
    const stored = localStorage.getItem(key)
    if (stored) data.value = JSON.parse(stored)
  } catch (e) {
    console.error('Failed to read from localStorage', e)
  }

  // Watch and sync to localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (e) {
        console.error('Failed to write to localStorage', e)
      }
    },
    { deep: true }
  )

  return data
}

// Usage
const theme = useLocalStorage('theme', 'light')
```

### 3. State Management (Pinia)

**Modern Vuex alternative:**

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', { email, password })
      user.value = response.data.user
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    fullName,
    // Actions
    login,
    logout
  }
})

// Usage in component
const userStore = useUserStore()
await userStore.login(email, password)
```

### 4. Component Patterns

**Smart vs Presentational:**

```vue
<!-- Presentational Component -->
<script setup lang="ts">
interface Props {
  user: User
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [userId: string]
}>()
</script>

<template>
  <div class="user-card">
    <Avatar :src="user.avatar" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    
    <button @click="emit('edit', user)">Edit</button>
    <button @click="emit('delete', user.id)">Delete</button>
  </div>
</template>
```

```vue
<!-- Smart Component (Container) -->
<script setup lang="ts">
import { ref } from 'vue'
import UserCard from './UserCard.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const selectedUser = ref<User | null>(null)

async function handleEdit(user: User) {
  selectedUser.value = user
  // Show edit modal
}

async function handleDelete(userId: string) {
  if (confirm('Delete user?')) {
    await userStore.deleteUser(userId)
  }
}
</script>

<template>
  <div class="user-list-container">
    <UserCard
      v-for="user in userStore.users"
      :key="user.id"
      :user="user"
      :loading="userStore.loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>
```

### 5. TypeScript Integration

**Type-safe Vue:**

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
}

export interface UserFilters {
  search?: string
  role?: User['role']
  sortBy?: keyof User
}
```

```vue
<script setup lang="ts">
import type { User, UserFilters } from '@/types/user'

// Typed props
interface Props {
  users: User[]
  filters: UserFilters
}

const props = defineProps<Props>()

// Typed emits
const emit = defineEmits<{
  filterChange: [filters: UserFilters]
  userSelect: [user: User]
}>()

// Type inference
const filteredUsers = computed(() => {
  let result = props.users
  
  if (props.filters.search) {
    result = result.filter(u => 
      u.name.toLowerCase().includes(props.filters.search!.toLowerCase())
    )
  }
  
  if (props.filters.role) {
    result = result.filter(u => u.role === props.filters.role)
  }
  
  return result
})
</script>
```

### 6. Routing Patterns

**Vue Router best practices:**

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/users/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true, // Pass route params as props
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.role && userStore.user?.role !== to.meta.role) {
    next({ name: 'Forbidden' })
  } else {
    next()
  }
})

export default router
```

### 7. Testing Patterns

**Component testing with Vitest:**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  }

  it('renders user information', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('emits edit event when edit button clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    await wrapper.find('[data-test="edit-btn"]').trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([mockUser])
  })

  it('shows loading state', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, loading: true }
    })
    
    expect(wrapper.find('[data-test="loading"]').exists()).toBe(true)
  })
})
```

### 8. BEM CSS Methodology

**Block Element Modifier (BEM) naming convention:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)
const size = ref<'small' | 'medium' | 'large'>('medium')
const hasError = ref(false)
</script>

<template>
  <!-- Block: card -->
  <div 
    :class="[
      'card',
      `card--${size}`,
      { 'card--active': isActive }
    ]"
  >
    <!-- Element: card__header -->
    <div class="card__header">
      <!-- Element: card__title -->
      <h2 class="card__title">Title</h2>
      
      <!-- Element with Modifier: card__badge--new -->
      <span class="card__badge card__badge--new">New</span>
    </div>
    
    <!-- Element: card__body -->
    <div class="card__body">
      <!-- Element: card__text -->
      <p class="card__text">Content here</p>
      
      <!-- Element with state modifier: card__input--error -->
      <input
        :class="[
          'card__input',
          { 'card__input--error': hasError }
        ]"
        type="text"
      />
    </div>
    
    <!-- Element: card__footer -->
    <div class="card__footer">
      <!-- Element: card__button with modifiers -->
      <button 
        :class="[
          'card__button',
          'card__button--primary',
          'card__button--large'
        ]"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Block */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

/* Block Modifiers */
.card--small {
  padding: 8px;
}

.card--medium {
  padding: 16px;
}

.card--large {
  padding: 24px;
}

.card--active {
  border-color: #2196f3;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Elements */
.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card__badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Element Modifiers */
.card__badge--new {
  background: #4caf50;
  color: white;
}

.card__badge--hot {
  background: #f44336;
  color: white;
}

.card__body {
  margin-bottom: 16px;
}

.card__text {
  margin: 0 0 12px;
  line-height: 1.6;
  color: #666;
}

.card__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.card__input--error {
  border-color: #f44336;
  background: #ffebee;
}

.card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.card__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

/* Button Modifiers */
.card__button--primary {
  background: #2196f3;
  color: white;
}

.card__button--primary:hover {
  background: #1976d2;
}

.card__button--secondary {
  background: #9e9e9e;
  color: white;
}

.card__button--large {
  padding: 12px 24px;
  font-size: 1.125rem;
}

.card__button--small {
  padding: 4px 12px;
  font-size: 0.875rem;
}
</style>
```

**BEM Naming Rules:**

```scss
/* Block: Standalone component */
.block {}

/* Element: Part of block (use __) */
.block__element {}

/* Modifier: Variation of block or element (use --) */
.block--modifier {}
.block__element--modifier {}

/* Combined example */
.card {} /* Block */
.card__title {} /* Element */
.card__title--large {} /* Element with modifier */
.card--featured {} /* Block with modifier */
```

**BEM with Dynamic Classes (Vue):**

```vue
<script setup lang="ts">
const props = defineProps<{
  variant: 'primary' | 'secondary'
  size: 'small' | 'large'
  isDisabled?: boolean
}>()

// BEM class generator composable
function useBem(block: string) {
  const element = (name: string) => `${block}__${name}`
  
  const modifier = (
    name: string, 
    condition: boolean | string
  ) => {
    if (typeof condition === 'string') {
      return `${block}--${condition}`
    }
    return condition ? `${block}--${name}` : ''
  }
  
  const elementModifier = (
    element: string,
    name: string,
    condition: boolean | string
  ) => {
    if (typeof condition === 'string') {
      return `${block}__${element}--${condition}`
    }
    return condition ? `${block}__${element}--${name}` : ''
  }
  
  return { element, modifier, elementModifier }
}

const bem = useBem('button')
</script>

<template>
  <button
    :class="[
      'button',
      bem.modifier(props.variant, props.variant),
      bem.modifier(props.size, props.size),
      bem.modifier('disabled', props.isDisabled ?? false)
    ]"
  >
    <span :class="bem.element('text')">
      <slot />
    </span>
  </button>
</template>
```

**BEM Best Practices:**

```vue
<!-- ✅ Good: Clear hierarchy -->
<div class="product-card">
  <div class="product-card__image">
    <img class="product-card__img" />
  </div>
  <div class="product-card__content">
    <h3 class="product-card__title">Title</h3>
    <p class="product-card__description">Description</p>
  </div>
</div>

<!-- ❌ Bad: Nested elements -->
<div class="product-card">
  <div class="product-card__header">
    <div class="product-card__header__title">
      <!-- Too deeply nested -->
    </div>
  </div>
</div>

<!-- ✅ Good: Flatten structure -->
<div class="product-card">
  <div class="product-card__header">
    <div class="product-card__title">
      <!-- Better -->
    </div>
  </div>
</div>

<!-- ✅ Good: Multiple modifiers -->
<button class="btn btn--primary btn--large btn--disabled">
  Button
</button>

<!-- ❌ Bad: Mixing BEM with other naming -->
<button class="btn btn--primary largeSize is-disabled">
  <!-- Inconsistent naming -->
</button>
```

---

### 9. Performance Optimization

**Optimize Vue apps:**

```vue
<script setup>
import { ref, shallowRef, computed, defineAsyncComponent } from 'vue'

// Use shallowRef for large objects
const largeData = shallowRef({})

// Lazy load heavy components
const HeavyChart = defineAsyncComponent(() =>
  import('./HeavyChart.vue')
)

// Memoize expensive computations
const expensiveComputation = computed(() => {
  // Heavy calculation
  return result
})

// Virtual scrolling for long lists
import { RecycleScroller } from 'vue-virtual-scroller'
</script>

<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <ItemCard :item="item" />
    </template>
  </RecycleScroller>
</template>
```

---

## Best Practices

### Do's ✅
- ✅ Use Composition API for new projects
- ✅ Extract reusable logic to composables
- ✅ Use TypeScript for type safety
- ✅ Keep components small and focused
- ✅ Use Pinia for state management
- ✅ Lazy load routes and components
- ✅ Use `v-memo` for performance-critical lists
- ✅ Provide/inject for deep component trees
- ✅ Use BEM for CSS class naming
- ✅ Keep BEM structure flat (max 2 levels)

### Don'ts ❌
- ❌ Mutate props directly
- ❌ Use Options API for new code
- ❌ Put business logic in components
- ❌ Forget to cleanup side effects
- ❌ Over-use watchers (prefer computed)
- ❌ Ignore TypeScript errors
- ❌ Create circular dependencies
- ❌ Nest BEM elements deeply (e.g., `block__el__el__el`)
- ❌ Mix BEM with other naming conventions

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
├── plugins/          # Vue plugins
├── router/           # Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript types
├── utils/            # Utility functions
├── views/            # Route views
├── App.vue
└── main.ts
```

---

**Used by web-vuejs agent for Vue.js 3 development guidance.**

