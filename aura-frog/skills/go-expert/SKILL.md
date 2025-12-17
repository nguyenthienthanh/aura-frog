---
name: go-expert
description: "Go/Golang backend expert. PROACTIVELY use when working with Go, Gin, Echo, Fiber frameworks. Triggers: golang, go, gin, echo, fiber"
autoInvoke: true
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

Expert-level Go patterns for API development, concurrency, and idiomatic Go code.

---

## Auto-Detection

This skill activates when:
- Working with Go projects
- Detected `go.mod` file
- Working with `*.go` files
- Using Gin, Echo, Fiber, or standard net/http

---

## 1. Project Structure

### Standard Layout

```
project/
├── cmd/
│   └── api/
│       └── main.go        # Entry point
├── internal/
│   ├── handlers/          # HTTP handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Data access
│   ├── models/            # Domain models
│   └── middleware/        # HTTP middleware
├── pkg/                   # Public packages
├── config/                # Configuration
├── migrations/            # DB migrations
├── go.mod
└── go.sum
```

---

## 2. Error Handling

### Custom Errors

```go
// ✅ GOOD - Typed errors
type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Status  int    `json:"-"`
}

func (e *AppError) Error() string {
    return e.Message
}

var (
    ErrNotFound     = &AppError{Code: "NOT_FOUND", Message: "Resource not found", Status: 404}
    ErrUnauthorized = &AppError{Code: "UNAUTHORIZED", Message: "Unauthorized", Status: 401}
    ErrValidation   = &AppError{Code: "VALIDATION", Message: "Validation failed", Status: 400}
)

// ✅ GOOD - Wrap errors with context
func (s *UserService) GetUser(id string) (*User, error) {
    user, err := s.repo.FindByID(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("failed to get user: %w", err)
    }
    return user, nil
}
```

### Error Checking

```go
// ❌ BAD - Ignoring errors
user, _ := service.GetUser(id)

// ✅ GOOD - Always handle errors
user, err := service.GetUser(id)
if err != nil {
    if errors.Is(err, ErrNotFound) {
        return c.JSON(404, gin.H{"error": "User not found"})
    }
    return c.JSON(500, gin.H{"error": "Internal error"})
}
```

---

## 3. Gin Framework Patterns

### Handler Structure

```go
// ✅ GOOD - Handler with dependency injection
type UserHandler struct {
    userService *UserService
}

func NewUserHandler(us *UserService) *UserHandler {
    return &UserHandler{userService: us}
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")

    user, err := h.userService.GetUser(id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            c.JSON(404, gin.H{"error": "User not found"})
            return
        }
        c.JSON(500, gin.H{"error": "Internal error"})
        return
    }

    c.JSON(200, gin.H{"data": user})
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    user, err := h.userService.CreateUser(&req)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(201, gin.H{"data": user})
}
```

### Request Validation

```go
// ✅ GOOD - Struct tags for validation
type CreateUserRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Name     string `json:"name" binding:"required,min=2,max=100"`
    Password string `json:"password" binding:"required,min=8"`
}
```

### Middleware

```go
// ✅ GOOD - Authentication middleware
func AuthMiddleware(secret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(401, gin.H{"error": "Missing token"})
            return
        }

        claims, err := validateToken(token, secret)
        if err != nil {
            c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
            return
        }

        c.Set("user_id", claims.UserID)
        c.Next()
    }
}
```

---

## 4. Concurrency Patterns

### Goroutines with WaitGroup

```go
// ✅ GOOD - Wait for multiple goroutines
func processItems(items []Item) error {
    var wg sync.WaitGroup
    errChan := make(chan error, len(items))

    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            if err := process(item); err != nil {
                errChan <- err
            }
        }(item)
    }

    wg.Wait()
    close(errChan)

    // Collect errors
    var errs []error
    for err := range errChan {
        errs = append(errs, err)
    }

    if len(errs) > 0 {
        return fmt.Errorf("processing failed: %v", errs)
    }
    return nil
}
```

### Context with Timeout

```go
// ✅ GOOD - Timeout handling
func fetchWithTimeout(url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
```

### Worker Pool

```go
// ✅ GOOD - Bounded concurrency
func processWithWorkers(jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup

    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                result := processJob(job)
                results <- result
            }
        }()
    }

    wg.Wait()
    close(results)
}
```

### Channels for Communication

```go
// ✅ GOOD - Select for channel operations
func fetchAll(urls []string) []Response {
    results := make(chan Response, len(urls))

    for _, url := range urls {
        go func(url string) {
            data, err := fetch(url)
            results <- Response{URL: url, Data: data, Err: err}
        }(url)
    }

    var responses []Response
    for i := 0; i < len(urls); i++ {
        responses = append(responses, <-results)
    }

    return responses
}
```

---

## 5. Database Patterns

### sqlx with Prepared Statements

```go
// ✅ GOOD - Named queries
type UserRepository struct {
    db *sqlx.DB
}

func (r *UserRepository) FindByID(id string) (*User, error) {
    var user User
    err := r.db.Get(&user, "SELECT * FROM users WHERE id = $1", id)
    if err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *UserRepository) Create(user *User) error {
    query := `INSERT INTO users (id, email, name, password_hash, created_at)
              VALUES (:id, :email, :name, :password_hash, :created_at)`
    _, err := r.db.NamedExec(query, user)
    return err
}
```

### GORM Patterns

```go
// ✅ GOOD - GORM with preloading
type User struct {
    ID        string    `gorm:"primaryKey"`
    Email     string    `gorm:"uniqueIndex"`
    Name      string
    Posts     []Post    `gorm:"foreignKey:AuthorID"`
    CreatedAt time.Time
}

func (r *UserRepository) FindWithPosts(id string) (*User, error) {
    var user User
    err := r.db.Preload("Posts").First(&user, "id = ?", id).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}

// ✅ GOOD - Transactions
func (r *UserRepository) CreateWithProfile(user *User, profile *Profile) error {
    return r.db.Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(user).Error; err != nil {
            return err
        }
        profile.UserID = user.ID
        if err := tx.Create(profile).Error; err != nil {
            return err
        }
        return nil
    })
}
```

---

## 6. Interface Design

```go
// ✅ GOOD - Small, focused interfaces
type UserReader interface {
    FindByID(id string) (*User, error)
    FindByEmail(email string) (*User, error)
}

type UserWriter interface {
    Create(user *User) error
    Update(user *User) error
    Delete(id string) error
}

type UserRepository interface {
    UserReader
    UserWriter
}

// ✅ GOOD - Accept interfaces, return structs
func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

---

## 7. Configuration

```go
// ✅ GOOD - Struct-based config
type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    JWT      JWTConfig
}

type ServerConfig struct {
    Port string `env:"PORT" envDefault:"8080"`
    Host string `env:"HOST" envDefault:"localhost"`
}

type DatabaseConfig struct {
    URL          string `env:"DATABASE_URL,required"`
    MaxOpenConns int    `env:"DB_MAX_OPEN_CONNS" envDefault:"25"`
    MaxIdleConns int    `env:"DB_MAX_IDLE_CONNS" envDefault:"5"`
}

func LoadConfig() (*Config, error) {
    var cfg Config
    if err := env.Parse(&cfg); err != nil {
        return nil, err
    }
    return &cfg, nil
}
```

---

## 8. Testing

### Table-Driven Tests

```go
// ✅ GOOD - Table-driven tests
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid email", "test@example.com", false},
        {"invalid format", "invalid", true},
        {"empty", "", true},
        {"missing domain", "test@", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail(%q) error = %v, wantErr %v", tt.email, err, tt.wantErr)
            }
        })
    }
}
```

### HTTP Handler Tests

```go
// ✅ GOOD - httptest for handlers
func TestGetUser(t *testing.T) {
    mockService := &MockUserService{
        GetUserFn: func(id string) (*User, error) {
            return &User{ID: id, Name: "Test"}, nil
        },
    }

    handler := NewUserHandler(mockService)
    router := gin.Default()
    router.GET("/users/:id", handler.GetUser)

    req := httptest.NewRequest("GET", "/users/123", nil)
    w := httptest.NewRecorder()

    router.ServeHTTP(w, req)

    if w.Code != 200 {
        t.Errorf("expected 200, got %d", w.Code)
    }
}
```

### Mocking with Interfaces

```go
// ✅ GOOD - Interface-based mocking
type MockUserRepository struct {
    FindByIDFn func(id string) (*User, error)
    CreateFn   func(user *User) error
}

func (m *MockUserRepository) FindByID(id string) (*User, error) {
    return m.FindByIDFn(id)
}

func (m *MockUserRepository) Create(user *User) error {
    return m.CreateFn(user)
}
```

---

## 9. Logging

```go
// ✅ GOOD - Structured logging with zerolog
import "github.com/rs/zerolog/log"

func (s *UserService) CreateUser(req *CreateUserRequest) (*User, error) {
    log.Info().
        Str("email", req.Email).
        Msg("Creating user")

    user, err := s.repo.Create(req)
    if err != nil {
        log.Error().
            Err(err).
            Str("email", req.Email).
            Msg("Failed to create user")
        return nil, err
    }

    log.Info().
        Str("user_id", user.ID).
        Msg("User created successfully")

    return user, nil
}
```

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

**Version:** 1.2.5
