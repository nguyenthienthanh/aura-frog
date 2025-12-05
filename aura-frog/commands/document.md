# Command: document

**Purpose:** Create feature documentation (specs, guides, API docs)  
**Aliases:** `doc`, `docs`, `create document`, `generate docs`

---

## 🎯 Overview

Generate professional documentation for features, APIs, or components without full workflow execution.

**Use when:**
- Need documentation for existing code
- Creating specs before implementation
- Documenting APIs
- Writing user guides

---

## 📋 Usage

```bash
# Document a feature
document feature "User Authentication"

# Document an API
document api "src/api/authApi.ts"

# Document a component
document component "src/components/UserProfile.tsx"

# Create technical spec
document spec "Add dark mode support"

# Create user guide
document guide "How to use authentication"
```

---

## 📝 Document Types

### 1. Feature Documentation

```bash
document feature "User Authentication"
```

**Generates:**

```markdown
# Feature: User Authentication

**Version:** 1.0.0  
**Date:** 2025-11-24  
**Status:** Implemented

---

## 📋 Overview

JWT-based authentication system for mobile app with automatic token refresh and secure storage.

---

## 🎯 Features

### Core Features
- ✅ User login with email/password
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Secure token storage
- ✅ Logout functionality

### Security
- ✅ Token encryption
- ✅ Secure storage (iOS Keychain, Android KeyStore)
- ✅ Auto-refresh before expiry
- ✅ Session timeout handling

---

## 🏗️ Architecture

```
┌─────────────┐
│  Login UI   │
└──────┬──────┘
       │
┌──────▼──────┐
│ Auth Context│ ← State management
└──────┬──────┘
       │
┌──────▼──────┐
│  Auth API   │ ← Backend calls
└──────┬──────┘
       │
┌──────▼──────┐
│ Secure Store│ ← Token storage
└─────────────┘
```

---

## 📂 File Structure

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginScreen.tsx
│       │   ├── LoginForm.tsx
│       │   └── __tests__/
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useLogin.ts
│       ├── services/
│       │   ├── authApi.ts
│       │   └── secureStorage.ts
│       └── types/
│           └── auth.types.ts
```

---

## 🔌 API Reference

### Login

```typescript
POST /api/auth/login

Request:
{
  email: string;
  password: string;
}

Response:
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

### Refresh Token

```typescript
POST /api/auth/refresh

Request:
{
  refreshToken: string;
}

Response:
{
  accessToken: string;
  refreshToken: string;
}
```

---

## 💻 Usage Examples

### Basic Login

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function LoginScreen() {
  const { login, loading, error } = useAuth();
  
  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123'
    });
  };
  
  return (
    <LoginForm 
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  );
}
```

### Check Auth Status

```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return <Dashboard user={user} />;
}
```

---

## 🧪 Testing

**Coverage:** 89%

**Test Files:**
- LoginScreen.test.tsx (95%)
- AuthContext.test.tsx (87%)
- authApi.test.ts (92%)
- secureStorage.test.ts (84%)

**Test Scenarios:**
- Successful login
- Invalid credentials
- Network errors
- Token refresh
- Logout flow
- Concurrent requests

---

## 🚀 Deployment

**Environment Variables:**
```env
AUTH_API_URL=https://api.example.com
TOKEN_EXPIRY=3600
REFRESH_THRESHOLD=300
```

**Setup:**
```bash
# Install dependencies
yarn add @react-native-community/async-storage
yarn add react-native-keychain

# Link native modules
cd ios && pod install
```

---

## 📊 Metrics

**Performance:**
- Login time: ~500ms
- Token refresh: ~200ms
- Storage read: ~50ms

**Success Rates:**
- Login success: 99.2%
- Token refresh: 99.8%
- Auto-refresh: 100%

---

## 🐛 Known Issues

None

---

## 🔮 Future Enhancements

- [ ] Biometric authentication
- [ ] Social login (Google, Apple)
- [ ] Multi-factor authentication
- [ ] Remember me feature

---

**Last Updated:** 2025-11-24  
**Maintained By:** Auth Team
```

### 2. API Documentation

```bash
document api "src/api/authApi.ts"
```

**Generates:**

```markdown
# API: Auth Service

**File:** `src/api/authApi.ts`  
**Version:** 1.0.0  
**Base URL:** `/api/auth`

---

## 🔌 Endpoints

### POST /login

**Description:** Authenticate user with credentials

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

**Errors:**
- `400` - Invalid credentials
- `429` - Too many attempts
- `500` - Server error

**Example:**
```typescript
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### POST /refresh

**Description:** Refresh access token

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

**Errors:**
- `401` - Invalid refresh token
- `500` - Server error

**Example:**
```typescript
const response = await authApi.refresh({
  refreshToken: storedRefreshToken
});
```

---

## 🔧 Configuration

```typescript
const authApi = createApi({
  baseURL: process.env.AUTH_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## 📝 Types

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}
```

---

## 🧪 Testing

**Mock API:**
```typescript
import { mockAuthApi } from '@/api/__mocks__/authApi';

mockAuthApi.login.mockResolvedValue({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser
});
```

---

**Generated:** 2025-11-24
```

### 3. Component Documentation

```bash
document component "src/components/UserProfile.tsx"
```

**Generates:**

```markdown
# Component: UserProfile

**Path:** `src/components/UserProfile.tsx`  
**Type:** Container Component  
**Platform:** Mobile (Phone + Tablet)

---

## 📋 Overview

User profile display with editable fields, avatar upload, and settings access.

---

## 🎨 Props

```typescript
interface UserProfileProps {
  userId: string;
  onSave?: (data: UserData) => void;
  onBack?: () => void;
  editable?: boolean;
}
```

**Required:**
- `userId` - User ID to display

**Optional:**
- `onSave` - Callback when save button pressed
- `onBack` - Callback for back navigation
- `editable` - Enable edit mode (default: false)

---

## 🔧 Usage

### Basic

```typescript
import { UserProfile } from '@/components/UserProfile';

<UserProfile userId="user-123" />
```

### With Callbacks

```typescript
<UserProfile
  userId="user-123"
  editable
  onSave={(data) => console.log('Saved:', data)}
  onBack={() => navigation.goBack()}
/>
```

---

## 🏗️ Structure

```
UserProfile
├── UserProfileHeader
│   ├── Avatar
│   └── BackButton
├── UserProfileContent
│   ├── EditableField (name)
│   ├── EditableField (email)
│   └── EditableField (phone)
└── UserProfileFooter
    ├── SaveButton
    └── CancelButton
```

---

## 📊 State

```typescript
interface UserProfileState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  editing: boolean;
  isDirty: boolean;
}
```

---

## 🎯 Features

- ✅ Display user information
- ✅ Edit mode toggle
- ✅ Avatar upload
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Unsaved changes warning

---

## 🧪 Testing

**Test File:** `UserProfile.test.tsx`

**Coverage:** 92%

**Test Cases:**
- Renders user data
- Enters edit mode
- Validates form fields
- Saves changes
- Handles errors
- Shows loading state

---

## 🎨 Styling

**Theme:**
- Uses `@emotion/native`
- Responsive design
- Dark mode support

**Breakpoints:**
- Phone: < 768px
- Tablet: >= 768px

---

## ♿ Accessibility

- ✅ Screen reader labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ WCAG 2.1 AA compliant

---

## 📱 Platform Notes

**iOS:**
- Uses native image picker
- Haptic feedback on save

**Android:**
- Material Design components
- Bottom sheet for actions

---

**Last Updated:** 2025-11-24
```

### 4. Technical Specification

```bash
document spec "Add dark mode support"
```

Creates complete technical spec similar to Phase 2 output.

### 5. User Guide

```bash
document guide "How to use authentication"
```

Creates user-facing documentation with screenshots and step-by-step instructions.

---

## 📁 Output Location

```
.claude/logs/documents/
├── features/
│   └── user-authentication.md
├── api/
│   └── auth-api.md
├── components/
│   └── user-profile.md
├── specs/
│   └── dark-mode-spec.md
└── guides/
    └── authentication-guide.md
```

---

## 🎯 Options

### Format Options

```bash
# Markdown (default)
document feature "Auth" --format=markdown

# Confluence format
document feature "Auth" --format=confluence

# HTML
document feature "Auth" --format=html

# PDF
document feature "Auth" --format=pdf
```

### Detail Level

```bash
# Brief
document feature "Auth" --detail=brief

# Standard (default)
document feature "Auth"

# Comprehensive
document feature "Auth" --detail=full
```

### Include Options

```bash
# With code examples
document feature "Auth" --examples

# With diagrams
document feature "Auth" --diagrams

# With tests
document feature "Auth" --include-tests

# All
document feature "Auth" --all
```

---

## ✅ Success Criteria

✅ Documentation generated  
✅ Proper format applied  
✅ Code examples included  
✅ Diagrams created (if applicable)  
✅ Saved to documents folder  
✅ Ready to share  

---

**Command:** document  
**Version:** 1.0.0  
**Added:** Aura Frog v1.3

