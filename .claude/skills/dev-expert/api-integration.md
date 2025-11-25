# Skill: API Integration Patterns

**Category:** Dev Expert  
**Priority:** High  
**Used By:** All dev agents

---

## Overview

Best practices for integrating with REST APIs, GraphQL, and managing API communication.

---

## REST API Integration

### 1. Axios Configuration

```typescript
// api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const newToken = await refreshToken()
      error.config.headers.Authorization = `Bearer ${newToken}`
      return apiClient(error.config)
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### 2. API Service Pattern

```typescript
// api/userService.ts
import apiClient from './client'

export const userService = {
  getAll: () => apiClient.get('/users'),
  
  getById: (id: string) => apiClient.get(`/users/${id}`),
  
  create: (data: CreateUserDto) => apiClient.post('/users', data),
  
  update: (id: string, data: UpdateUserDto) => 
    apiClient.patch(`/users/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/users/${id}`)
}
```

### 3. React Query Integration

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/api/userService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
```

---

## Error Handling

```typescript
// types/api.ts
export interface ApiError {
  message: string
  code: string
  status: number
}

// utils/apiError.ts
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500
    }
  }
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500
  }
}

// Usage
try {
  await userService.create(data)
} catch (error) {
  const apiError = handleApiError(error)
  toast.error(apiError.message)
}
```

---

## Request Optimization

### 1. Debouncing

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

const { data } = useQuery({
  queryKey: ['users', debouncedSearch],
  queryFn: () => userService.search(debouncedSearch),
  enabled: debouncedSearch.length > 2
})
```

### 2. Request Cancellation

```typescript
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/users', { signal: controller.signal })
    .then(handleResponse)
    .catch(handleError)
  
  return () => controller.abort()
}, [])
```

---

## GraphQL Integration

```typescript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache()
})

// Query
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

// Mutation
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`

// Usage
const { data, loading } = useQuery(GET_USERS)
const [createUser] = useMutation(CREATE_USER)
```

---

## Best Practices

### Do's ✅
- ✅ Use typed API responses
- ✅ Implement proper error handling
- ✅ Cache API responses
- ✅ Cancel requests on unmount
- ✅ Use loading states
- ✅ Implement retry logic
- ✅ Validate API responses

### Don'ts ❌
- ❌ Hardcode API URLs
- ❌ Ignore network errors
- ❌ Make unnecessary requests
- ❌ Forget to handle loading states
- ❌ Store sensitive data in localStorage
- ❌ Skip request timeouts

---

**Used by all dev agents for API integration guidance.**

