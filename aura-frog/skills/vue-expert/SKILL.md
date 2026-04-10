---
name: vue-expert
description: "Vue.js best practices expert. PROACTIVELY use when working with Vue 3, Composition API, Pinia, Nuxt. Triggers: vue, composition API, pinia, nuxt, .vue files"
autoInvoke: false
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

Vue 3 patterns: Composition API, Pinia, reactivity, performance.

---

## 1. Composition API (Script Setup)

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props { user: User; showAvatar?: boolean; }
const props = withDefaults(defineProps<Props>(), { showAvatar: true });
const emit = defineEmits<{ select: [user: User]; update: [id: string, data: Partial<User>]; }>();

const isLoading = ref(false);
const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`);
</script>
```

### Composables

Extract reusable logic into `composables/useX.ts`. Return `readonly()` refs. Use `watch()` with `{ immediate: true }` for auto-fetch.

```typescript
export function useUser(userId: Ref<string>) {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  // ... fetch logic with watch(userId, fetchUser, { immediate: true })
  return { user: readonly(user), isLoading: readonly(isLoading), error: readonly(error), refetch };
}
```

---

## 2. Reactivity

- **ref** for all values (primitives and objects) -- consistent `.value`
- **reactive** loses reactivity on reassignment -- avoid for replaceable objects
- **watch:** Single ref, multiple `[ref1, ref2]`, or `watchEffect` for auto-tracking
- **Cleanup:** Use `onCleanup` parameter for AbortController in async watchers

---

## 3. Template Patterns

- Explicit `v-if` checks: `v-if="userName != null && userName !== ''"`
- `v-show` for frequent toggles, `v-if` for conditional render
- Unique `:key="item.id"` (never index)
- `computed` for filtering (not methods in template)
- Event modifiers: `@submit.prevent`, `@keyup.enter`, `@click.stop`

---

## 4. Component Design

- **Props:** `withDefaults(defineProps<Props>(), { ... })`
- **Emits:** `defineEmits<{ event: [payload] }>()`
- **Slots:** Named slots with `$slots.header` check, scoped slots with `:canSubmit="isValid"`
- **Expose:** `defineExpose({ focus, reset })` -- only what consumers need

---

## 5. State Management (Pinia)

**Setup store syntax** (Composition API style):

```typescript
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value != null);
  async function login(credentials: Credentials) { /* ... */ }
  return { user: readonly(user), isAuthenticated, login };
});
```

Usage: `storeToRefs(store)` for reactive destructuring. Actions don't need storeToRefs.

---

## 6. Performance

- `computed` for derived state (cached vs method calls)
- `v-once` for static content
- `v-memo="[item.id, item.selected]"` for expensive list items
- `defineAsyncComponent(() => import('./Heavy.vue'))` with loading/error states

---

## 7. Forms (VeeValidate + Zod)

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
const schema = toTypedSchema(z.object({ email: z.string().email(), password: z.string().min(8) }));
const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema });
const [email, emailAttrs] = defineField('email');
</script>
```

---

## 8. TypeScript

- Template ref: `ref<InstanceType<typeof MyComponent> | null>(null)`
- Global components: `declare module 'vue' { export interface GlobalComponents { ... } }`

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
