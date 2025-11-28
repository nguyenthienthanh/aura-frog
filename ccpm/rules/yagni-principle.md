# YAGNI Principle (You Aren't Gonna Need It)

**Category:** Code Quality & Architecture
**Priority:** Critical
**Version:** 5.2.0
**Applies To:** All phases, especially Phase 2 (Design) and Phase 5b (Implementation)

---

## Overview

**YAGNI** = Only implement what is needed **right now**. Don't add functionality based on speculation about future requirements.

---

## Core Principle

```
"Always implement things when you actually need them,
never when you just foresee that you need them."
— Ron Jeffries (XP co-founder)
```

---

## Anti-Patterns to Avoid

### 1. Speculative Features

```typescript
// ❌ YAGNI Violation: Adding unused options
interface UserService {
  getUser(id: string): User
  getUsers(): User[]
  getUsersByRole(role: string): User[]  // "We might need this"
  getUsersByDepartment(dept: string): User[]  // "Just in case"
  getUsersByLocation(loc: string): User[]  // "Could be useful"
  getUsersWithFilters(filters: ComplexFilterObject): User[]  // "Future-proof"
}

// ✅ YAGNI: Only what's needed now
interface UserService {
  getUser(id: string): User
  getUsers(): User[]
}
// Add getUsersByRole when there's an actual requirement
```

### 2. Premature Abstraction

```typescript
// ❌ YAGNI Violation: Abstract for one use case
interface PaymentProcessor { process(payment: Payment): Result }
interface PaymentValidator { validate(payment: Payment): boolean }
interface PaymentLogger { log(payment: Payment): void }

class StripePaymentProcessor implements PaymentProcessor {
  constructor(
    private validator: PaymentValidator,
    private logger: PaymentLogger,
    private config: PaymentConfig
  ) {}
  // Complex implementation for just Stripe
}

// ✅ YAGNI: Direct implementation
async function processStripePayment(payment: Payment): Promise<Result> {
  const stripe = new Stripe(process.env.STRIPE_KEY)
  return await stripe.charges.create({
    amount: payment.amount,
    currency: payment.currency,
    source: payment.token
  })
}
// Abstract when you add a second payment provider
```

### 3. Unused Configuration

```typescript
// ❌ YAGNI Violation: Configurable everything
const config = {
  api: {
    baseUrl: process.env.API_URL,
    timeout: process.env.API_TIMEOUT || 5000,
    retries: process.env.API_RETRIES || 3,
    retryDelay: process.env.API_RETRY_DELAY || 1000,
    maxConcurrent: process.env.API_MAX_CONCURRENT || 10,
    cacheEnabled: process.env.API_CACHE_ENABLED || true,
    cacheTTL: process.env.API_CACHE_TTL || 3600,
    circuitBreaker: {
      enabled: process.env.CB_ENABLED || false,
      threshold: process.env.CB_THRESHOLD || 5,
      timeout: process.env.CB_TIMEOUT || 30000
    }
  }
}

// ✅ YAGNI: Only what you're using
const config = {
  api: {
    baseUrl: process.env.API_URL,
    timeout: 5000
  }
}
```

### 4. Future-Proof Parameters

```typescript
// ❌ YAGNI Violation: Unused parameters
function createUser(
  name: string,
  email: string,
  options?: {
    role?: string           // Not using yet
    department?: string     // Not using yet
    permissions?: string[]  // Not using yet
    metadata?: Record<string, unknown>  // "Just in case"
  }
): User {
  return { id: uuid(), name, email }
}

// ✅ YAGNI: Only current needs
function createUser(name: string, email: string): User {
  return { id: uuid(), name, email }
}
```

---

## When to Add Features

### Add When
- ✅ There's a concrete user story/ticket
- ✅ Tests are written for the feature
- ✅ Feature is part of current sprint
- ✅ Customer has requested it

### Don't Add When
- ❌ "We might need this later"
- ❌ "It's easy to add now"
- ❌ "Other systems have this"
- ❌ "It makes the API more complete"

---

## YAGNI Decision Flowchart

```
Is this feature in the current requirements?
├── YES → Implement it
└── NO → Is there a concrete future ticket?
    ├── YES → Wait for that ticket
    └── NO → Don't implement it
        └── If needed later, implement then
            (It's often easier with more context)
```

---

## YAGNI vs Planning Ahead

| YAGNI (Good) | Over-Engineering (Bad) |
|--------------|------------------------|
| Design for extensibility | Implement all extensions |
| Use dependency injection | Create abstract factories |
| Keep interfaces minimal | Add "might need" methods |
| Document future ideas | Code future ideas |

**Key Insight:** You can **design** for extensibility without **implementing** extensions.

```typescript
// ✅ Good: Extensible design, minimal implementation
interface NotificationService {
  send(message: string, recipient: string): Promise<void>
}

class EmailNotificationService implements NotificationService {
  async send(message: string, recipient: string) {
    await sendEmail(recipient, message)
  }
}

// Later, when actually needed:
class SMSNotificationService implements NotificationService { ... }
class PushNotificationService implements NotificationService { ... }
```

---

## Cost of YAGNI Violations

| Impact | Description |
|--------|-------------|
| Maintenance | Unused code still needs updates |
| Testing | Dead code paths need tests |
| Complexity | More code = harder to understand |
| Bugs | More code = more potential bugs |
| Time | Building unused features wastes time |

---

## Checklist Before Adding Code

- [ ] Is this in the current requirements?
- [ ] Does a test exist for this feature?
- [ ] Will this be used in the current sprint?
- [ ] Can I explain why this is needed NOW?
- [ ] Would removing this break current functionality?

**If any answer is NO → Don't add it**

---

## Best Practices

### Do's ✅
- Implement only current requirements
- Delete unused code immediately
- Question every "just in case" addition
- Keep interfaces minimal
- Add features when tests require them

### Don'ts ❌
- Add parameters "for future use"
- Create abstractions for single implementations
- Configure things that won't change
- Add API endpoints without consumers
- Build features without user stories

---

## Related Rules

- **KISS Principle** - Keep implementations simple
- **DRY with Caution** - Don't abstract prematurely
- **Scalable Thinking** - Design for scale, implement simply

---

**Version:** 5.2.0 | **Last Updated:** 2025-11-28
