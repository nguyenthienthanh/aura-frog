# Verification Protocol

Run verification commands and confirm output before claiming success.

---

## Iron Law

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

- Run the command
- Read the output
- THEN claim the result

---

## Wrong vs Right

### Wrong

```
"I've fixed the bug. It should work now."
"Tests should be passing."
"That should resolve the issue."
```

### Right

```
"Tests pass:

  PASS src/auth/login.test.ts
  ✓ should validate email (5ms)
  ✓ should reject invalid password (3ms)

  Test Suites: 1 passed, 1 total
  Tests: 2 passed, 2 total"
```

---

## Verification Commands

### JavaScript/TypeScript

```bash
# Run tests
npm test
yarn test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Python

```bash
# Run tests
pytest
python -m pytest

# Type check
mypy src/
```

### Go

```bash
# Run tests
go test ./...

# Build
go build ./...
```

### General

```bash
# Build project
npm run build

# Check for errors
echo $?  # 0 = success
```

---

## What to Include

When reporting verification:

1. **Command run**
2. **Key output lines** (pass/fail, counts)
3. **Exit code** if relevant

---

## When to Verify

- After applying fix
- Before claiming "done"
- After refactoring
- Before commit
- After merge

---

## Red Flags

Stop and verify if you're about to say:

- "Should work now"
- "Seems fixed"
- "I think that's it"
- "Probably passing"

All require: Run command → Read output → Report result.
