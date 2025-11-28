# Command: api:design

**Command:** `api:design [feature]`
**Agents:** backend-nodejs, backend-python, backend-go
**Version:** 5.2.0

---

## 🎯 Purpose

Design RESTful or GraphQL API, generate OpenAPI/Swagger specification, define endpoints, request/response schemas.

---

## 📋 Usage

```bash
# Design REST API
api:design "user management"

# Design GraphQL API
api:design --graphql "user management"

# Generate from database schema
api:design --from-db users,posts
```

---

## 🔧 Output

### REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0

paths:
  /api/v1/users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  meta:
                    type: object
                    properties:
                      page: { type: integer }
                      total: { type: integer }

    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /api/v1/users/{id}:
    get:
      summary: Get user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Success
        '404':
          description: Not found

components:
  schemas:
    User:
      type: object
      properties:
        id: { type: integer }
        email: { type: string, format: email }
        name: { type: string }
        createdAt: { type: string, format: date-time }

    UserCreate:
      type: object
      required: [email, name, password]
      properties:
        email: { type: string, format: email }
        name: { type: string, minLength: 2 }
        password: { type: string, minLength: 8 }
```

### GraphQL Schema

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users(page: Int = 1, limit: Int = 20): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
}
```

---

## 📊 Deliverables

- OpenAPI/Swagger spec (`api/openapi.yaml`)
- API documentation (Markdown)
- Postman collection
- Request/response examples
- Authentication strategy

---

**Command:** api:design
**Version:** 5.2.0
