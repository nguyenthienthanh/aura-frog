# Command: api:test

**Command:** `api:test [endpoint]`
**Agent:** qa-automation
**Version:** 5.2.0

---

## 🎯 Purpose

Generate comprehensive API test suite (unit, integration, E2E) with automated testing for all endpoints.

---

## 📋 Usage

```bash
# Test all API endpoints
api:test

# Test specific endpoint
api:test POST /api/v1/users

# Generate test collection
api:test --postman

# Load testing
api:test --load --rps 100
```

---

## 🔧 Test Types

### 1. Unit Tests (Business Logic)
```javascript
// Jest (Node.js)
describe('UserService', () => {
  it('should create user with hashed password', async () => {
    const user = await userService.create({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(user.password).not.toBe('password123');
    expect(bcrypt.compareSync('password123', user.password)).toBe(true);
  });
});
```

### 2. Integration Tests (API Endpoints)
```javascript
// Supertest (Node.js)
describe('POST /api/v1/users', () => {
  it('should create new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        email: 'invalid',
        name: 'Test',
        password: 'password123'
      })
      .expect(400);
  });

  it('should return 409 for duplicate email', async () => {
    // Create first user
    await createUser({ email: 'test@example.com' });

    // Try to create duplicate
    await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        name: 'Test',
        password: 'pass'
      })
      .expect(409);
  });
});
```

### 3. E2E Tests (User Flows)
```javascript
// Playwright
test('user registration and login flow', async ({ request }) => {
  // Register
  const registerResponse = await request.post('/api/v1/auth/register', {
    data: {
      email: 'newuser@example.com',
      password: 'SecurePass123!'
    }
  });
  expect(registerResponse.ok()).toBeTruthy();

  // Login
  const loginResponse = await request.post('/api/v1/auth/login', {
    data: {
      email: 'newuser@example.com',
      password: 'SecurePass123!'
    }
  });
  const { token } = await loginResponse.json();

  // Access protected endpoint
  const profileResponse = await request.get('/api/v1/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(profileResponse.ok()).toBeTruthy();
});
```

### 4. Load Testing
```javascript
// k6
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '3m', target: 50 },   // Stay at 50 RPS
    { duration: '1m', target: 100 },  // Ramp to 100 RPS
    { duration: '3m', target: 100 },  // Stay at 100 RPS
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
  },
};

export default function() {
  const response = http.get('http://api.example.com/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## 📊 Output

```markdown
# API Test Report

## Coverage: 95%

### Endpoints Tested: 12/12

✅ GET /api/v1/users (3 tests)
✅ POST /api/v1/users (5 tests)
✅ GET /api/v1/users/:id (4 tests)
✅ PUT /api/v1/users/:id (5 tests)
✅ DELETE /api/v1/users/:id (3 tests)

### Test Results

**Unit Tests:** 45/45 passed
**Integration Tests:** 28/28 passed
**E2E Tests:** 12/12 passed

**Total:** 85/85 passed (100%)

### Performance

**Load Test (100 RPS):**
- Avg response time: 45ms
- p95 response time: 120ms
- p99 response time: 250ms
- Error rate: 0.1%
- Throughput: 99.9 RPS

### Issues Found: 0

## Deliverables

✅ Test suite (`tests/api/users.test.js`)
✅ Postman collection (`postman/api-tests.json`)
✅ Load test script (`k6/load-test.js`)
✅ Test coverage report
```

---

**Command:** api:test
**Version:** 5.2.0
