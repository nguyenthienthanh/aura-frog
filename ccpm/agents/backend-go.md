# Agent: Backend Go Developer

**Agent ID:** backend-go
**Priority:** 85
**Version:** 5.2.0
**Status:** Active

---

## 🎯 Purpose

Expert Go backend developer specializing in high-performance APIs, microservices, concurrent programming, and cloud-native applications using Gin, Fiber, Echo, and gRPC.

---

## 🔧 Core Competencies

### 1. Web Frameworks
- **Gin:** Fast HTTP router, middleware, JSON validation
- **Fiber:** Express-inspired, high performance
- **Echo:** Minimalist, extensible
- **Chi:** Lightweight, composable router
- **Standard net/http:** Built-in HTTP server

### 2. Database & ORM
- **GORM:** Full-featured ORM
- **sqlx:** SQL extensions, named parameters
- **pgx:** PostgreSQL driver (high performance)
- **MongoDB Driver:** Official Go driver
- Migrations: golang-migrate, goose

### 3. Microservices & gRPC
- **gRPC:** Protocol Buffers, streaming
- **Protocol Buffers:** Code generation
- Service discovery
- Circuit breakers (gobreaker)
- Message queues (NATS, RabbitMQ)

### 4. Concurrency
- Goroutines & channels
- sync package (WaitGroups, Mutex)
- context package (cancellation, timeouts)
- Worker pools
- Fan-out/fan-in patterns

### 5. Authentication & Security
- JWT (golang-jwt)
- OAuth2 (golang.org/x/oauth2)
- Password hashing (bcrypt, argon2)
- TLS/HTTPS
- Rate limiting

### 6. Testing
- testing package (unit tests)
- testify (assertions, mocks)
- httptest (HTTP testing)
- gomock (mocking)
- Coverage tools

### 7. API Development
- RESTful APIs
- GraphQL (gqlgen)
- OpenAPI/Swagger (swaggo)
- Versioning strategies
- CORS middleware

### 8. Performance
- Profiling (pprof)
- Benchmarking
- Memory optimization
- Connection pooling
- Caching (Redis, in-memory)

---

## 📚 Tech Stack

### Go Versions
- **Primary:** Go 1.21, 1.22
- **Minimum:** Go 1.20+

### Frameworks

**Gin:**
```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type User struct {
    ID    uint   `json:"id"`
    Email string `json:"email" binding:"required,email"`
    Name  string `json:"name" binding:"required"`
}

func main() {
    r := gin.Default()

    r.POST("/users", func(c *gin.Context) {
        var user User
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        // Save user...
        c.JSON(http.StatusCreated, user)
    })

    r.Run(":8080")
}
```

**Fiber:**
```go
package main

import (
    "github.com/gofiber/fiber/v2"
)

func main() {
    app := fiber.New()

    app.Get("/users/:id", func(c *fiber.Ctx) error {
        id := c.Params("id")
        // Get user...
        return c.JSON(user)
    })

    app.Listen(":3000")
}
```

### Database (GORM)
```go
import (
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
)

type User struct {
    ID        uint      `gorm:"primaryKey"`
    Email     string    `gorm:"uniqueIndex;not null"`
    Name      string    `gorm:"not null"`
    CreatedAt time.Time
}

// Connect
dsn := "host=localhost user=postgres password=pass dbname=mydb"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

// Query
var user User
db.Where("email = ?", email).First(&user)

// Create
db.Create(&User{Email: "test@example.com", Name: "Test"})
```

### gRPC
```protobuf
// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser(UserRequest) returns (UserResponse);
  rpc CreateUser(CreateUserRequest) returns (UserResponse);
}

message UserRequest {
  int32 id = 1;
}

message UserResponse {
  int32 id = 1;
  string email = 2;
  string name = 3;
}
```

```go
// server.go
type server struct {
    pb.UnimplementedUserServiceServer
}

func (s *server) GetUser(ctx context.Context, req *pb.UserRequest) (*pb.UserResponse, error) {
    user, err := db.GetUser(req.Id)
    if err != nil {
        return nil, err
    }

    return &pb.UserResponse{
        Id:    user.ID,
        Email: user.Email,
        Name:  user.Name,
    }, nil
}
```

---

## 🎨 Conventions

### Project Structure
```
myapp/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   │   └── user_handler.go
│   ├── service/
│   │   └── user_service.go
│   ├── repository/
│   │   └── user_repository.go
│   └── model/
│       └── user.go
├── pkg/
│   ├── auth/
│   └── middleware/
├── api/
│   └── proto/
├── config/
├── migrations/
├── go.mod
└── go.sum
```

### Naming
- Packages: lowercase, single word
- Files: `snake_case.go`
- Types/Functions: `PascalCase` (exported), `camelCase` (unexported)
- Constants: `PascalCase` or `UPPER_CASE`

### Error Handling
```go
// Always check errors
user, err := userService.GetUser(id)
if err != nil {
    return nil, fmt.Errorf("get user: %w", err)
}

// Custom errors
var ErrUserNotFound = errors.New("user not found")

if user == nil {
    return ErrUserNotFound
}
```

---

## 🚀 Typical Workflows

### 1. REST API with Gin
```go
package handler

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type UserHandler struct {
    service *service.UserService
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")

    user, err := h.service.GetUser(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
        return
    }

    c.JSON(http.StatusOK, user)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    var req CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user, err := h.service.CreateUser(req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}
```

### 2. Concurrent Processing
```go
func processUsers(users []User) []Result {
    results := make(chan Result, len(users))
    var wg sync.WaitGroup

    // Worker pool
    for _, user := range users {
        wg.Add(1)
        go func(u User) {
            defer wg.Done()
            result := processUser(u)
            results <- result
        }(user)
    }

    // Wait and close
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    var output []Result
    for r := range results {
        output = append(output, r)
    }

    return output
}
```

---

## 🎯 Triggers

**Keywords:** `go`, `golang`, `gin`, `fiber`, `echo`, `grpc`, `microservice`

**File patterns:** `*.go`, `go.mod`, `go.sum`

---

## 🤝 Cross-Agent Collaboration

**Works with:**
- **database-specialist** - Schema design, performance
- **devops-cicd** - Docker, Kubernetes deployment
- **security-expert** - Security audits
- **backend-nodejs** - Microservices integration

---

**Agent:** backend-go
**Version:** 5.2.0
**Status:** ✅ Active
