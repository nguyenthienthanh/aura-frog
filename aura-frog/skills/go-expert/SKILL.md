---
name: go-expert
description: "Go/Golang backend expert. PROACTIVELY use when working with Go, Gin, Echo, Fiber frameworks. Triggers: golang, go, gin, echo, fiber"
autoInvoke: false
priority: high
triggers:
  - "golang"
  - "go"
  - "gin"
  - "echo"
  - "fiber"
  - "goroutine"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Go Expert Skill

Go patterns: API development, concurrency, idiomatic Go.

---

## 1. Project Structure

```
project/
├── cmd/api/main.go       # Entry point
├── internal/             # handlers, services, repositories, models, middleware
├── pkg/                  # Public packages
├── config/               # Configuration
├── migrations/
├── go.mod / go.sum
```

---

## 2. Error Handling

**Always handle errors.** Wrap with context using `fmt.Errorf("context: %w", err)`. Use `errors.Is()` for matching.

```go
type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Status  int    `json:"-"`
}
func (e *AppError) Error() string { return e.Message }

var ErrNotFound = &AppError{Code: "NOT_FOUND", Message: "Resource not found", Status: 404}
```

---

## 3. Gin Framework

**Handler with DI:** Struct with service field, constructor, handler methods.

```go
func (h *UserHandler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(400, gin.H{"error": err.Error()}); return }
    user, err := h.userService.CreateUser(&req)
    if err != nil { c.JSON(500, gin.H{"error": err.Error()}); return }
    c.JSON(201, gin.H{"data": user})
}
```

**Validation:** Struct tags `binding:"required,email"`. **Middleware:** Return `gin.HandlerFunc`, use `c.AbortWithStatusJSON` + `c.Set/c.Get` + `c.Next()`.

---

## 4. Concurrency

- **WaitGroup + errChan:** Fan-out goroutines, collect errors
- **context.WithTimeout:** Always for external calls, `defer cancel()`
- **Worker pool:** Bounded goroutines reading from `jobs` channel
- **Select:** For multiplexing channel operations

```go
func processItems(items []Item) error {
    var wg sync.WaitGroup
    errChan := make(chan error, len(items))
    for _, item := range items {
        wg.Add(1)
        go func(item Item) { defer wg.Done(); if err := process(item); err != nil { errChan <- err } }(item)
    }
    wg.Wait(); close(errChan)
    // collect errors from errChan
}
```

---

## 5. Database

**sqlx:** `db.Get`, `db.NamedExec` for named queries.
**GORM:** `Preload("Posts")`, `db.Transaction(func(tx *gorm.DB) error { ... })`.

---

## 6. Interfaces

Small, focused interfaces. Compose with embedding. Accept interfaces, return structs.

```go
type UserReader interface { FindByID(id string) (*User, error) }
type UserWriter interface { Create(user *User) error }
type UserRepository interface { UserReader; UserWriter }
```

---

## 7. Configuration

Struct-based config with `env` tags + `envDefault`. `env.Parse(&cfg)` to load.

---

## 8. Testing

**Table-driven tests:** `[]struct{name, input, wantErr}` with `t.Run`.
**HTTP tests:** `httptest.NewRequest` + `httptest.NewRecorder` + `router.ServeHTTP`.
**Mocking:** Interface-based with function fields.

---

## 9. Logging

Structured logging with zerolog/zap: `log.Info().Str("key", val).Msg("message")`.

---

## Quick Reference

```toon
checklist[12]{pattern,best_practice}:
  Errors,Always check errors wrap with %w
  Interfaces,Small focused accept interface return struct
  Goroutines,WaitGroup + errgroup for coordination
  Context,WithTimeout for cancellation
  Channels,Buffered for async unbuffered for sync
  Testing,Table-driven tests + httptest
  Config,Struct with env tags
  DB,Prepared statements + transactions
  Logging,Structured with zerolog/zap
  Validation,Struct tags for binding
  Middleware,gin.HandlerFunc pattern
  DI,Constructor injection
```

---
