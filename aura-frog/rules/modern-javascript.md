# Rule: Modern JavaScript (ES6+)

**Version:** 1.1.2
**Priority:** HIGH
**Applies:** All JavaScript/TypeScript code generation

---

## Core Rule

**ALWAYS use modern ES6+ syntax and features.**

Write clean, modern code using the latest JavaScript features available.

---

## Required Features

### Optional Chaining (`?.`)

```javascript
// ✅ GOOD - Use optional chaining
const name = user?.profile?.name;
const result = data?.items?.[0]?.value;
const callback = obj?.method?.();

// ❌ BAD - Don't use verbose null checks
const name = user && user.profile && user.profile.name;
const result = data && data.items && data.items[0] && data.items[0].value;
```

### Nullish Coalescing (`??`)

```javascript
// ✅ GOOD - Use nullish coalescing
const value = input ?? 'default';
const count = data?.count ?? 0;

// ❌ BAD - Don't use || for defaults (fails on 0, '', false)
const value = input || 'default';  // Bug: '' becomes 'default'
```

### Destructuring

```javascript
// ✅ GOOD - Use destructuring
const { name, email, age = 18 } = user;
const [first, second, ...rest] = items;
const { data: userData, error } = response;

// ❌ BAD - Don't access properties repeatedly
const name = user.name;
const email = user.email;
const age = user.age || 18;
```

### Arrow Functions

```javascript
// ✅ GOOD - Use arrow functions for callbacks
const doubled = items.map(x => x * 2);
const adults = users.filter(u => u.age >= 18);
const handleClick = () => setOpen(true);

// ❌ BAD - Don't use function keyword for simple callbacks
const doubled = items.map(function(x) { return x * 2; });
```

### Template Literals

```javascript
// ✅ GOOD - Use template literals
const message = `Hello ${name}, you have ${count} messages`;
const query = `
  SELECT *
  FROM users
  WHERE id = ${userId}
`;

// ❌ BAD - Don't concatenate strings
const message = 'Hello ' + name + ', you have ' + count + ' messages';
```

### Spread Operator

```javascript
// ✅ GOOD - Use spread for copies and merging
const newArray = [...items, newItem];
const merged = { ...defaults, ...options };
const copy = [...originalArray];

// ❌ BAD - Don't use Object.assign or concat
const merged = Object.assign({}, defaults, options);
const newArray = items.concat([newItem]);
```

### const/let (No var)

```javascript
// ✅ GOOD - Use const by default, let when needed
const API_URL = 'https://api.example.com';
let counter = 0;
counter += 1;

// ❌ BAD - Never use var
var API_URL = 'https://api.example.com';
var counter = 0;
```

### Object Shorthand

```javascript
// ✅ GOOD - Use shorthand properties and methods
const user = { name, email, age };
const api = {
  async fetchData() { ... },
  processItem(item) { ... }
};

// ❌ BAD - Don't repeat property names
const user = { name: name, email: email, age: age };
const api = {
  fetchData: async function() { ... }
};
```

### async/await

```javascript
// ✅ GOOD - Use async/await
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
};

// ❌ BAD - Don't use .then() chains for complex flows
const fetchUser = (id) => {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data);
};
```

### Array Methods

```javascript
// ✅ GOOD - Use modern array methods
const names = users.map(u => u.name);
const active = users.filter(u => u.isActive);
const total = items.reduce((sum, i) => sum + i.price, 0);
const found = items.find(i => i.id === targetId);
const hasAdmin = users.some(u => u.role === 'admin');

// ❌ BAD - Don't use for loops for simple transforms
let names = [];
for (let i = 0; i < users.length; i++) {
  names.push(users[i].name);
}
```

### Object Methods

```javascript
// ✅ GOOD - Use Object methods
const keys = Object.keys(config);
const values = Object.values(config);
const entries = Object.entries(config);
const merged = Object.fromEntries(entries);

// ❌ BAD - Don't use for...in without hasOwnProperty
for (let key in config) { ... }
```

---

## TypeScript-Specific

### Type Inference

```typescript
// ✅ GOOD - Let TypeScript infer when obvious
const name = 'John';  // string inferred
const items = [1, 2, 3];  // number[] inferred
const user = { name: 'John', age: 30 };  // inferred

// ❌ BAD - Don't over-annotate obvious types
const name: string = 'John';
const items: number[] = [1, 2, 3];
```

### Optional Properties

```typescript
// ✅ GOOD - Use optional properties
interface User {
  name: string;
  email?: string;
  profile?: {
    avatar?: string;
  };
}

// Access with optional chaining
const avatar = user.profile?.avatar ?? '/default.png';
```

### Non-null Assertion (Use Sparingly)

```typescript
// ✅ OK - When you're certain it exists
const element = document.getElementById('app')!;

// ⚠️ PREFER - Optional chaining with fallback
const element = document.getElementById('app');
if (!element) throw new Error('App element not found');
```

---

## React-Specific

### Functional Components

```tsx
// ✅ GOOD - Use functional components with hooks
const UserCard = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {user?.name ?? 'Anonymous'}
    </div>
  );
};

// ❌ BAD - Don't use class components for new code
class UserCard extends React.Component { ... }
```

### Optional Props

```tsx
// ✅ GOOD - Use optional chaining for optional props
const Button = ({ onClick, label, icon }: Props) => (
  <button onClick={onClick}>
    {icon?.()}
    {label ?? 'Click me'}
  </button>
);
```

---

## Quick Reference

| Old Way | Modern Way |
|---------|------------|
| `a && a.b && a.b.c` | `a?.b?.c` |
| `x || 'default'` | `x ?? 'default'` |
| `{ name: name }` | `{ name }` |
| `function() {}` | `() => {}` |
| `'Hello ' + name` | `` `Hello ${name}` `` |
| `Object.assign({}, a, b)` | `{ ...a, ...b }` |
| `arr.concat([x])` | `[...arr, x]` |
| `var x = 1` | `const x = 1` |
| `.then().then()` | `async/await` |

---

## Exceptions

### When NOT to use optional chaining

```javascript
// When you WANT an error if undefined (fail fast)
const name = user.profile.name;  // Intentional - should throw if no profile

// Use non-null assertion in TypeScript if certain
const name = user!.profile!.name;
```

### When to use || instead of ??

```javascript
// When you want falsy coalescing (0, '', false should become default)
const displayName = name || 'Anonymous';  // '' should become 'Anonymous'
```

---

**Version:** 1.1.2
**Last Updated:** 2025-12-01
