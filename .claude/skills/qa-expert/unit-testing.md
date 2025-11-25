# Skill: Unit Testing Patterns

**Category:** QA Expert  
**Priority:** High  
**Used By:** qa-automation

---

## Overview

Comprehensive unit testing strategies for different frameworks and languages.

---

## Jest + React Testing Library (React/React Native)

### 1. Component Testing

```typescript
// components/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  }
  
  it('renders user information', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn()
    render(<UserCard user={mockUser} onEdit={handleEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(handleEdit).toHaveBeenCalledWith(mockUser.id)
  })
  
  it('shows loading state', () => {
    render(<UserCard user={mockUser} isLoading={true} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

### 2. Hook Testing

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })
  
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
  
  it('respects max limit', () => {
    const { result } = renderHook(() => useCounter({ max: 5 }))
    
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.increment()
      }
    })
    
    expect(result.current.count).toBe(5)
  })
})
```

### 3. Async Testing

```typescript
// api/userService.test.ts
import { userService } from './userService'
import { server } from '../mocks/server'
import { rest } from 'msw'

describe('userService', () => {
  it('fetches users successfully', async () => {
    const users = await userService.getAll()
    
    expect(users).toHaveLength(3)
    expect(users[0]).toHaveProperty('name')
  })
  
  it('handles error response', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    await expect(userService.getAll()).rejects.toThrow('Server error')
  })
  
  it('retries on failure', async () => {
    let attempts = 0
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        attempts++
        if (attempts < 3) {
          return res(ctx.status(500))
        }
        return res(ctx.json([{ id: 1, name: 'John' }]))
      })
    )
    
    const users = await userService.getAll()
    expect(attempts).toBe(3)
    expect(users).toHaveLength(1)
  })
})
```

---

## Vitest (Vue.js)

```typescript
// components/UserCard.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  it('renders user information', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: { name: 'John Doe', email: 'john@example.com' }
      }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
  
  it('emits edit event', async () => {
    const wrapper = mount(UserCard, {
      props: { user: { id: 1, name: 'John' } }
    })
    
    await wrapper.find('[data-testid="edit-button"]').trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([1])
  })
})
```

---

## PHPUnit (Laravel)

```php
// tests/Unit/UserServiceTest.php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\UserService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    protected UserService $userService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userService = new UserService();
    }

    public function test_creates_user_successfully()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        $user = $this->userService->create($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_throws_exception_for_duplicate_email()
    {
        User::factory()->create(['email' => 'john@example.com']);

        $this->expectException(\Exception::class);

        $this->userService->create([
            'name' => 'Jane Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ]);
    }

    public function test_updates_user()
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $updated = $this->userService->update($user->id, ['name' => 'New Name']);

        $this->assertEquals('New Name', $updated->name);
    }
}
```

---

## Mocking Strategies

### 1. Mock Functions

```typescript
// Mock implementation
const mockFetch = jest.fn()
global.fetch = mockFetch

mockFetch.mockResolvedValue({
  json: async () => ({ data: 'test' })
})

// Spy on function
const spy = jest.spyOn(console, 'error').mockImplementation()
```

### 2. Mock Modules

```typescript
// __mocks__/api.ts
export const fetchUser = jest.fn()

// test file
jest.mock('../api')
import { fetchUser } from '../api'

fetchUser.mockResolvedValue({ id: 1, name: 'John' })
```

### 3. MSW (Mock Service Worker)

```typescript
// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ])
    )
  }),
  
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.json({ id: 3, ...req.body }))
  })
]

// mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// jest.setup.ts
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Test Coverage

### Coverage Configuration

```json
// jest.config.js
{
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.tsx",
    "!src/index.tsx"
  ],
  "coverageThresholds": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Best Practices

### Do's ✅
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Test behavior, not implementation
- ✅ Use descriptive test names
- ✅ Keep tests independent
- ✅ Mock external dependencies
- ✅ Test edge cases and errors
- ✅ Aim for 80%+ coverage
- ✅ Use test IDs for reliability

### Don'ts ❌
- ❌ Test implementation details
- ❌ Share state between tests
- ❌ Write flaky tests
- ❌ Mock everything
- ❌ Ignore failing tests
- ❌ Test third-party libraries
- ❌ Skip error scenarios

---

## Test Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Card.test.tsx
│   ├── hooks/
│   │   └── useAuth.test.ts
│   └── utils/
│       └── formatDate.test.ts
├── integration/
└── e2e/
```

---

**Used by QA agent for unit test implementation.**

