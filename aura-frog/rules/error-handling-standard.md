# Error Handling Standard

**Category:** Code Quality
**Priority:** Critical
**Version:** 1.0.0
**Applies To:** All code, especially Phase 5b (Implementation)

---

## Overview

Consistent, structured error handling improves debugging, user experience, and system reliability. Handle errors at the right level with appropriate responses.

---

## Error Class Hierarchy

```typescript
// Base error class with structured information
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`, 'NOT_FOUND', 404)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403)
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}
```

---

## Error Codes Standard

```toon
error_codes[8]{code,http_status,when_to_use}:
  VALIDATION_ERROR,400,Invalid input data
  UNAUTHORIZED,401,Missing/invalid authentication
  FORBIDDEN,403,Authenticated but not authorized
  NOT_FOUND,404,Resource doesn't exist
  CONFLICT,409,Duplicate or state conflict
  RATE_LIMITED,429,Too many requests
  INTERNAL_ERROR,500,Unexpected server error
  SERVICE_UNAVAILABLE,503,Dependency failure
```

---

## Error Handling Patterns

### 1. API/Backend Errors

```typescript
// Express/Node.js error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log all errors
  logger.error({
    error: err.message,
    code: err instanceof AppError ? err.code : 'INTERNAL_ERROR',
    stack: err.stack,
    path: req.path,
    method: req.method
  })

  // Operational errors: send to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && { fields: err.fields })
      }
    })
  }

  // Programming errors: hide details
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  })
})
```

### 2. Service Layer Errors

```typescript
class UserService {
  async getUser(id: string): Promise<User> {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User', id)
    }
    return user
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    // Validate
    const errors = this.validate(data)
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid user data', errors)
    }

    // Check duplicate
    const existing = await this.repository.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('User with this email already exists')
    }

    return this.repository.create(data)
  }
}
```

### 3. Frontend Error Handling

```typescript
// API client with error transformation
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(error.error.message, error.error.code, response.status)
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError('Network error', 'NETWORK_ERROR', 0)
  }
}

// React hook with error handling
function useUsers() {
  const [error, setError] = useState<ApiError | null>(null)

  const fetchUsers = async () => {
    try {
      setError(null)
      return await apiRequest<User[]>('/api/users')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err)
        // Handle specific errors
        if (err.code === 'UNAUTHORIZED') {
          redirectToLogin()
        }
      }
      throw err
    }
  }

  return { fetchUsers, error }
}
```

### 4. React Native Error Boundary

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    errorTracker.capture(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}
```

---

## Error Response Format

### API Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "fields": {
      "email": "Invalid email format",
      "password": "Must be at least 8 characters"
    }
  }
}
```

### Internal Error (Production)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### Internal Error (Development)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Cannot read property 'id' of undefined",
    "stack": "TypeError: Cannot read property...",
    "path": "/api/users/123"
  }
}
```

---

## User-Friendly Messages

```toon
user_messages[5]{error_code,technical,user_friendly}:
  VALIDATION_ERROR,Field X failed regex,Please enter a valid X
  NOT_FOUND,Entity not found,This item doesn't exist
  UNAUTHORIZED,JWT expired,Please log in again
  RATE_LIMITED,429 Too Many Requests,Please wait before trying again
  INTERNAL_ERROR,NullPointerException,Something went wrong. Please try again
```

---

## Logging Standards

**See:** `rules/logging-standards.md` for comprehensive logging guide.

Quick rules: Include error code, message, stack, requestId, userId. Never log passwords/tokens/PII.

---

## Error Handling Checklist

### For Every Error-Prone Operation

- [ ] Wrap in try/catch or .catch()
- [ ] Throw appropriate error type
- [ ] Include actionable error message
- [ ] Log with sufficient context
- [ ] Return user-friendly message

### For API Endpoints

- [ ] Validate input before processing
- [ ] Handle all expected error cases
- [ ] Use consistent error response format
- [ ] Don't leak sensitive information
- [ ] Log errors with request context

---

## Anti-Patterns to Avoid

```typescript
// ❌ Silent failure
try {
  await riskyOperation()
} catch (e) {
  // Do nothing
}

// ❌ Generic catch-all
catch (e) {
  console.log('error')
}

// ❌ Throwing strings
throw 'Something went wrong'

// ❌ Exposing internal details
res.status(500).json({ error: error.stack })

// ❌ Not handling async errors
async function handler() {
  riskyOperation()  // Missing await, error lost
}
```

---

## Best Practices

### Do's ✅
- Use typed error classes
- Handle errors at the appropriate level
- Provide user-friendly messages
- Log with context for debugging
- Fail fast on programming errors

### Don'ts ❌
- Swallow errors silently
- Expose stack traces in production
- Use generic error messages internally
- Log sensitive data
- Catch errors you can't handle

---

**Version:** 1.0.0 | **Last Updated:** 2025-11-28
