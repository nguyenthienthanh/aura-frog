# Logging Standards

**Category:** Code Quality
**Priority:** High
**Version:** 1.0.0
**Applies To:** All code, especially backend services

---

## Overview

Consistent, structured logging improves debugging, monitoring, and incident response.

---

## 1. Log Levels

```toon
log_levels[5]{level,when_to_use,example}:
  ERROR,Failures requiring attention,Database connection failed
  WARN,Potential issues / recoverable,Rate limit approaching
  INFO,Important business events,User registered / order placed
  DEBUG,Development troubleshooting,Function input/output
  TRACE,Detailed execution flow,Loop iterations
```

### Level Selection
```typescript
// ERROR - Something broke
logger.error('Payment failed', { orderId, error: err.message })

// WARN - Concerning but handled
logger.warn('Retry attempt', { attempt: 3, maxRetries: 5 })

// INFO - Business events
logger.info('User registered', { userId, email })

// DEBUG - Development only
logger.debug('Cache lookup', { key, hit: true })
```

---

## 2. Structured Logging Format

### Required Fields
```typescript
{
  timestamp: '2025-01-15T10:30:00.000Z',  // ISO 8601
  level: 'error',                          // Log level
  message: 'Payment processing failed',    // Human-readable
  service: 'payment-service',              // Service name
  requestId: 'req_abc123',                 // Request correlation
  // Context-specific fields below
}
```

### Context-Aware Logging
```typescript
// Good: Structured with context
logger.error({
  message: 'Payment failed',
  orderId: '12345',
  amount: 99.99,
  currency: 'USD',
  errorCode: 'CARD_DECLINED',
  userId: 'user_abc',
  requestId: req.id
})

// Bad: Unstructured string
logger.error('Payment failed for order 12345, amount 99.99 USD')
```

---

## 3. What to Log

### Always Log

```toon
always_log[5]{event,fields}:
  Request start/end,method / path / duration / status
  Authentication,userId / success/failure / method
  Business events,eventType / entityId / outcome
  Errors,message / stack / context
  External calls,service / endpoint / duration / status
```

### Never Log

```toon
never_log[6]{data_type,reason}:
  Passwords,Security
  API tokens/keys,Security
  Credit card numbers,PCI compliance
  Full SSN/ID numbers,Privacy
  Session tokens,Security
  PII in production,GDPR/Privacy
```

### Sanitization
```typescript
function sanitize(data: Record<string, unknown>) {
  const sensitive = ['password', 'token', 'apiKey', 'ssn', 'creditCard']
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) =>
      sensitive.some(s => k.toLowerCase().includes(s))
        ? [k, '[REDACTED]']
        : [k, v]
    )
  )
}

// Usage
logger.info('User login', sanitize(req.body))
```

---

## 4. Request Correlation

```typescript
// Middleware to add requestId
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuid()
  res.setHeader('x-request-id', req.id)
  next()
})

// Include in all logs
logger.info('Processing request', {
  requestId: req.id,
  path: req.path
})
```

---

## 5. Error Logging

```typescript
// Complete error logging
logger.error({
  message: error.message,
  code: error.code || 'UNKNOWN',
  stack: error.stack,
  requestId: req.id,
  userId: req.user?.id,
  path: req.path,
  method: req.method,
  input: sanitize(req.body)
})

// Don't: Log error object directly
logger.error(error) // Loses context

// Don't: Swallow errors silently
try { ... } catch (e) { /* nothing */ }
```

---

## 6. Performance Logging

```typescript
// Request timing
const start = Date.now()
// ... operation ...
const duration = Date.now() - start

logger.info('Request completed', {
  path: req.path,
  method: req.method,
  status: res.statusCode,
  durationMs: duration
})

// Slow query detection
if (duration > 1000) {
  logger.warn('Slow operation', { durationMs: duration, operation: 'db.query' })
}
```

---

## 7. Environment-Specific

```toon
env_logging[3]{environment,level,format,output}:
  Development,DEBUG,Pretty,Console
  Staging,DEBUG,JSON,Console + File
  Production,INFO,JSON,Aggregator (DataDog etc.)
```

```typescript
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production'
    ? 'json'
    : 'pretty'
})
```

---

## 8. Logging Checklist

- [ ] Use appropriate log level
- [ ] Include correlation ID (requestId)
- [ ] Add relevant context fields
- [ ] Sanitize sensitive data
- [ ] Use structured format (JSON in prod)
- [ ] Log start and end of operations
- [ ] Include timing for external calls
- [ ] Log errors with stack trace

---

## Anti-Patterns

```typescript
// ❌ Console.log in production
console.log('debug info')

// ❌ Logging sensitive data
logger.info('Login', { email, password })

// ❌ Unstructured messages
logger.error(`Error: ${error} for user ${userId}`)

// ❌ Too verbose in production
logger.debug('Entering function X')  // Should be TRACE or removed

// ❌ Missing context
logger.error('Something failed')
```

---

## Best Practices

### Do's
- Use structured JSON logging
- Include correlation IDs
- Log at appropriate levels
- Sanitize sensitive data
- Include timestamps

### Don'ts
- Log passwords/tokens
- Use console.log in production
- Log entire request bodies
- Over-log in production
- Forget error context

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
