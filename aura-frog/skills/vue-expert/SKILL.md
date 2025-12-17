---
name: vue-expert
description: "Vue.js best practices expert. PROACTIVELY use when working with Vue 3, Composition API, Pinia, Nuxt. Triggers: vue, composition API, pinia, nuxt, .vue files"
autoInvoke: true
priority: high
triggers:
  - "vue"
  - "composition api"
  - "pinia"
  - "nuxt"
  - ".vue file"
  - "ref"
  - "reactive"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Vue Expert Skill

Expert-level Vue 3 patterns, Composition API, state management, and performance optimization.

---

## Auto-Detection

This skill activates when:
- Working with `.vue` files
- Using Vue 3 Composition API
- Detected `vue` in package.json
- Using Pinia or Nuxt

---

## 1. Composition API Patterns

### Script Setup (Preferred)

```vue
<!-- ✅ GOOD - script setup syntax -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types';

// Props with defaults
interface Props {
  user: User;
  showAvatar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
});

// Emits with types
const emit = defineEmits<{
  select: [user: User];
  update: [id: string, data: Partial<User>];
}>();

// Reactive state
const isLoading = ref(false);
const items = ref<Item[]>([]);

// Computed
const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`);

// Methods
function handleSelect() {
  emit('select', props.user);
}

// Lifecycle
onMounted(async () => {
  isLoading.value = true;
  items.value = await fetchItems();
  isLoading.value = false;
});
</script>
```

### Composables (Custom Hooks)

```typescript
// ✅ GOOD - Reusable composable
// composables/useUser.ts
import { ref, computed } from 'vue';
import type { User } from '@/types';

export function useUser(userId: Ref<string>) {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fullName = computed(() => {
    if (user.value == null) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  async function fetchUser() {
    isLoading.value = true;
    error.value = null;
    try {
      user.value = await api.getUser(userId.value);
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error');
    } finally {
      isLoading.value = false;
    }
  }

  watch(userId, fetchUser, { immediate: true });

  return {
    user: readonly(user),
    fullName,
    isLoading: readonly(isLoading),
    error: readonly(error),
    refetch: fetchUser,
  };
}

// Usage
const userId = ref('123');
const { user, fullName, isLoading } = useUser(userId);
```

---

## 2. Reactivity Best Practices

### ref vs reactive

```typescript
// ✅ GOOD - ref for primitives
const count = ref(0);
const name = ref('');
const isActive = ref(false);

// ✅ GOOD - ref for objects (consistent .value)
const user = ref<User | null>(null);
user.value = { id: '1', name: 'John' };

// ⚠️ CAUTION - reactive loses reactivity on reassignment
const state = reactive({ user: null });
state.user = newUser; // ✅ Works
// state = { user: newUser }; // ❌ Loses reactivity!

// ✅ GOOD - Use ref for replaceable objects
const user = ref<User | null>(null);
user.value = newUser; // ✅ Works
```

### Watch Patterns

```typescript
// ✅ GOOD - Watch single ref
watch(userId, async (newId, oldId) => {
  if (newId !== oldId) {
    await fetchUser(newId);
  }
});

// ✅ GOOD - Watch multiple sources
watch(
  [userId, companyId],
  async ([newUserId, newCompanyId]) => {
    await fetchData(newUserId, newCompanyId);
  }
);

// ✅ GOOD - watchEffect for auto-tracking
watchEffect(async () => {
  // Automatically tracks userId.value
  const data = await fetchUser(userId.value);
  user.value = data;
});

// ✅ GOOD - Cleanup in watch
watch(userId, async (newId, oldId, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort());

  const data = await fetchUser(newId, { signal: controller.signal });
  user.value = data;
});
```

---

## 3. Template Best Practices

### Conditional Rendering

```vue
<template>
  <!-- ❌ BAD - Implicit truthy check -->
  <div v-if="userName">{{ userName }}</div>

  <!-- ✅ GOOD - Explicit check -->
  <div v-if="userName != null && userName !== ''">{{ userName }}</div>

  <!-- ✅ GOOD - v-show for frequent toggles -->
  <div v-show="isVisible">Frequently toggled content</div>

  <!-- ✅ GOOD - v-if for conditional rendering -->
  <div v-if="isLoaded">Rendered once</div>

  <!-- ✅ GOOD - Template for multiple elements -->
  <template v-if="items.length > 0">
    <h2>Items</h2>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </template>
  <EmptyState v-else />
</template>
```

### List Rendering

```vue
<template>
  <!-- ❌ BAD - Index as key -->
  <li v-for="(item, index) in items" :key="index">{{ item.name }}</li>

  <!-- ✅ GOOD - Unique ID as key -->
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>

  <!-- ✅ GOOD - v-for with v-if (separate element) -->
  <template v-for="item in items" :key="item.id">
    <li v-if="item.isVisible">{{ item.name }}</li>
  </template>

  <!-- ✅ GOOD - Computed for filtering -->
  <li v-for="item in visibleItems" :key="item.id">{{ item.name }}</li>
</template>

<script setup lang="ts">
const visibleItems = computed(() => items.value.filter(item => item.isVisible));
</script>
```

### Event Handling

```vue
<template>
  <!-- ✅ GOOD - Inline for simple -->
  <button @click="count++">Increment</button>

  <!-- ✅ GOOD - Method reference -->
  <button @click="handleClick">Click</button>

  <!-- ✅ GOOD - With event -->
  <input @input="handleInput($event)" />

  <!-- ✅ GOOD - Modifiers -->
  <form @submit.prevent="handleSubmit">
  <input @keyup.enter="submit" />
  <div @click.stop="handleClick">
</template>
```

---

## 4. Component Design

### Props Validation

```vue
<script setup lang="ts">
// ✅ GOOD - Type-based props
interface Props {
  // Required
  id: string;
  user: User;

  // Optional with type
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;

  // With default (use withDefaults)
  variant?: 'primary' | 'secondary';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  variant: 'primary',
});
</script>
```

### Slots

```vue
<!-- ParentComponent.vue -->
<template>
  <Card>
    <template #header>
      <h2>Title</h2>
    </template>

    <template #default>
      <p>Main content</p>
    </template>

    <template #footer="{ canSubmit }">
      <button :disabled="!canSubmit">Submit</button>
    </template>
  </Card>
</template>

<!-- Card.vue -->
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <main>
      <slot />
    </main>

    <footer v-if="$slots.footer">
      <slot name="footer" :canSubmit="isValid" />
    </footer>
  </div>
</template>
```

### Expose

```vue
<!-- ✅ GOOD - Expose specific methods/refs -->
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null);

function focus() {
  inputRef.value?.focus();
}

function reset() {
  // Reset logic
}

// Only expose what's needed
defineExpose({
  focus,
  reset,
});
</script>
```

---

## 5. State Management (Pinia)

### Store Definition

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

// ✅ GOOD - Setup store syntax (Composition API style)
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => user.value != null);
  const fullName = computed(() => {
    if (user.value == null) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  // Actions
  async function login(credentials: Credentials) {
    isLoading.value = true;
    try {
      user.value = await authApi.login(credentials);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
  }

  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    // Getters
    isAuthenticated,
    fullName,
    // Actions
    login,
    logout,
  };
});
```

### Store Usage

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

// ✅ GOOD - storeToRefs for reactive destructuring
const { user, isAuthenticated, fullName } = storeToRefs(userStore);

// Actions don't need storeToRefs
const { login, logout } = userStore;
</script>
```

---

## 6. Performance Optimization

### Computed Caching

```typescript
// ✅ GOOD - Computed for derived state (cached)
const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name));
});

// ❌ BAD - Method called in template (no caching)
function getSortedItems() {
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name));
}
```

### v-once and v-memo

```vue
<template>
  <!-- ✅ GOOD - Static content -->
  <footer v-once>
    <p>Copyright 2024</p>
  </footer>

  <!-- ✅ GOOD - Memoize expensive renders -->
  <div v-for="item in items" :key="item.id" v-memo="[item.id, item.selected]">
    <ExpensiveComponent :item="item" />
  </div>
</template>
```

### Async Components

```typescript
// ✅ GOOD - Lazy load components
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
);

// ✅ GOOD - With loading/error states
const AsyncModal = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
});
```

---

## 7. Form Handling

### VeeValidate + Zod

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
  })
);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  await login(values);
});
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" v-bind="emailAttrs" type="email" />
    <span v-if="errors.email">{{ errors.email }}</span>

    <input v-model="password" v-bind="passwordAttrs" type="password" />
    <span v-if="errors.password">{{ errors.password }}</span>

    <button type="submit">Login</button>
  </form>
</template>
```

---

## 8. TypeScript Integration

### Component Types

```typescript
// ✅ GOOD - Import component type
import type { Component } from 'vue';
import MyComponent from './MyComponent.vue';

// ✅ GOOD - Template ref typing
const modalRef = ref<InstanceType<typeof MyComponent> | null>(null);

// ✅ GOOD - Global component types (env.d.ts)
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink'];
    RouterView: typeof import('vue-router')['RouterView'];
  }
}
```

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  Script,Use script setup lang="ts"
  State,ref for primitives and objects
  Props,withDefaults + defineProps<Props>()
  Emits,defineEmits with typed events
  Computed,Use for derived reactive state
  Watch,Use onCleanup for async
  Templates,Explicit v-if checks
  Keys,Unique IDs not indices
  Store,Pinia setup store syntax
  Store refs,storeToRefs for destructuring
  Async,defineAsyncComponent for lazy load
  Forms,VeeValidate + Zod
```

---

**Version:** 1.2.5
