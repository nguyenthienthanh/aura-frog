# Root Cause Tracing

Trace bugs backward through call stack to find original source.

---

## Principle

When error appears deep in execution, don't fix at symptom location. Trace backward to find where invalid data originated.

---

## Technique

### 1. Start at Error

```
Error: Cannot read property 'name' of undefined
  at UserCard.render (UserCard.tsx:45)
  at ProfilePage.render (ProfilePage.tsx:23)
  at App.render (App.tsx:15)
```

Error is at `UserCard.tsx:45` - but is that the cause?

### 2. Trace Backward

**Level 1:** UserCard expects `user` prop with `name`
- Where does `user` come from?

**Level 2:** ProfilePage passes `user` from state
- Where does state get populated?

**Level 3:** ProfilePage fetches user in useEffect
- API call returns undefined?

**Level 4:** API endpoint `/users/:id`
- Returns 404, caught as undefined

### 3. Identify Source

Root cause: Missing error handling in API response

### 4. Fix at Source

```typescript
// Fix at source (API handling), not at UserCard
const user = await fetchUser(id);
if (!user) {
  throw new UserNotFoundError(id);
}
```

---

## Signs to Look For

- **Null/undefined values** - Where did they originate?
- **Wrong data type** - Where was it transformed?
- **Missing data** - Where was it supposed to be set?
- **Invalid state** - What sequence led to this?

---

## Common Patterns

### Pattern 1: Unhandled API Error

```
Symptom: Component crashes on undefined
Source: API error swallowed, undefined returned
Fix: Add error handling at API layer
```

### Pattern 2: Race Condition

```
Symptom: Intermittent wrong data
Source: State update before async complete
Fix: Add proper async/await or guards
```

### Pattern 3: Stale Closure

```
Symptom: Function uses old value
Source: Callback captured old reference
Fix: Use ref or add to dependency array
```

---

## Script: Find Polluter

For test pollution (test A affects test B):

```bash
#!/bin/bash
# Bisect to find which test pollutes state

TESTS=$(npm test --listTests 2>/dev/null)
FAILING_TEST="$1"

for test in $TESTS; do
  npm test -- "$test" "$FAILING_TEST" --runInBand
  if [ $? -ne 0 ]; then
    echo "Polluter found: $test"
    break
  fi
done
```

---

## Remember

- **Symptom ≠ Cause**
- **Fix at source, not symptom**
- **Trace until you find origin**
