# Rule: Smart Commenting - Avoid Redundant Comments

**Priority:** High  
**Enforcement:** Code Review Phase  
**Applies To:** All code (React Native, Vue.js, React.js, Next.js, Laravel)

---

## 🎯 Core Principle

**Comments should explain WHY, not WHAT.**

❌ **Bad:** Code that describes what the code obviously does  
✅ **Good:** Code that explains complex logic, business rules, or non-obvious decisions

---

## 🚫 What NOT to Comment

### 1. Self-Explanatory Code

❌ **BAD:**
```typescript
// Set user name to John
const userName = 'John';

// Loop through users
users.forEach(user => {
  // Print user name
  console.log(user.name);
});

// Check if user is active
if (user.isActive) {
  // Return true
  return true;
}
```

✅ **GOOD:**
```typescript
const userName = 'John';

users.forEach(user => {
  console.log(user.name);
});

if (user.isActive) {
  return true;
}
```

### 2. Obvious Variable Names

❌ **BAD:**
```typescript
// User email
const userEmail = user.email;

// Total price
const totalPrice = calculateTotal(items);

// Is loading state
const isLoading = true;
```

✅ **GOOD:**
```typescript
const userEmail = user.email;
const totalPrice = calculateTotal(items);
const isLoading = true;
```

### 3. Standard Patterns

❌ **BAD:**
```typescript
// useEffect hook to fetch data on mount
useEffect(() => {
  fetchUserData();
}, []);

// useState hook for loading state
const [loading, setLoading] = useState(false);

// Try-catch for error handling
try {
  await saveData();
} catch (error) {
  console.error(error);
}
```

✅ **GOOD:**
```typescript
useEffect(() => {
  fetchUserData();
}, []);

const [loading, setLoading] = useState(false);

try {
  await saveData();
} catch (error) {
  console.error(error);
}
```

### 4. Divider Comments (Noise)

❌ **BAD:**
```typescript
// ===== IMPORTS =====
import { useState } from 'react';

// ===== CONSTANTS =====
const MAX_ITEMS = 10;

// ===== COMPONENT =====
export const MyComponent = () => {
  // ===== STATE =====
  const [count, setCount] = useState(0);
  
  // ===== HANDLERS =====
  const handleClick = () => {};
  
  // ===== RENDER =====
  return <div />;
};
```

✅ **GOOD:**
```typescript
import { useState } from 'react';

const MAX_ITEMS = 10;

export const MyComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {};
  
  return <div />;
};
```

### 5. Commented-Out Code

❌ **BAD:**
```typescript
const UserProfile = () => {
  // const oldLogic = () => {
  //   return user.name;
  // };
  
  // return <OldComponent />;
  
  return <NewComponent />;
};
```

✅ **GOOD:**
```typescript
const UserProfile = () => {
  return <NewComponent />;
};

// Use git history for old code
```

---

## ✅ When TO Comment

### 1. Complex Business Logic

✅ **GOOD:**
```typescript
// PH region requires additional KYC verification for policies > 1M PHP
// This is a regulatory requirement as per BSP Circular No. 950
if (region === 'PH' && policyAmount > 1_000_000) {
  await performEnhancedKYC(user);
}

// Calculate proration based on policy start date
// Formula: (daysRemaining / totalDays) * premium
// Special case: If policy starts mid-month, use calendar month days
const proratedAmount = calculateProration(startDate, premium);
```

### 2. Non-Obvious Workarounds

✅ **GOOD:**
```typescript
// WORKAROUND: React Native Android doesn't support nested Text with onPress
// Issue: https://github.com/facebook/react-native/issues/12345
// TODO: Remove when fixed in RN 0.75+
const TextButton = Platform.OS === 'android' 
  ? TouchableOpacity 
  : Text;

// FIX: iOS SafeAreaView causes layout shift on iPhone 14 Pro
// Manually calculate safe area to prevent animation jank
const topInset = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
```

### 3. Magic Numbers/Constants

✅ **GOOD:**
```typescript
// API timeout set to 30s for slow 3G connections in rural areas
const API_TIMEOUT = 30000;

// Buffer of 100px to trigger infinite scroll before reaching bottom
// Provides smoother UX on slow devices
const SCROLL_THRESHOLD = 100;

// Retry 3 times with exponential backoff (1s, 2s, 4s)
// Based on backend SLA: 99.9% success within 3 attempts
const MAX_RETRIES = 3;
```

### 4. Performance Optimizations

✅ **GOOD:**
```typescript
// Memoize to prevent re-render cascade to 500+ child components
// Profiler showed this component re-rendered 50+ times per second
const MemoizedList = memo(ExpensiveList, (prev, next) => {
  return prev.items.length === next.items.length;
});

// Debounce to reduce API calls from 100+ to 1 per user interaction
// Backend can't handle more than 10 req/s per user
const debouncedSearch = useMemo(
  () => debounce(search, 300),
  []
);
```

### 5. Security/Privacy Considerations

✅ **GOOD:**
```typescript
// SECURITY: Never log sensitive data in production
// PII (email, phone, NRIC) must be masked per PDPA requirements
if (__DEV__) {
  console.log('User data:', userData);
} else {
  console.log('User data:', maskSensitiveData(userData));
}

// Encrypt token before storing to comply with GDPR/PDPA
// Using AES-256 as per security audit requirement
const encryptedToken = await encryptWithAES256(token);
```

### 6. Complex Algorithms

✅ **GOOD:**
```typescript
/**
 * Calculate compound interest with monthly deposits
 * 
 * Formula: FV = P * [(1 + r)^n - 1] / r + PMT * [(1 + r)^n - 1] / r
 * 
 * Where:
 * - P = Principal amount
 * - r = Monthly interest rate (annual rate / 12)
 * - n = Number of months
 * - PMT = Monthly payment
 * 
 * Edge case: When r = 0, use simple formula: FV = P + (PMT * n)
 */
function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  months: number,
  monthlyPayment: number
): number {
  if (annualRate === 0) {
    return principal + (monthlyPayment * months);
  }
  
  const r = annualRate / 12 / 100;
  const n = months;
  const fv = principal * Math.pow(1 + r, n) 
           + monthlyPayment * ((Math.pow(1 + r, n) - 1) / r);
  
  return fv;
}
```

### 7. Temporary Hacks (with TODO)

✅ **GOOD:**
```typescript
// HACK: Temporary fix for MY region API returning wrong format
// TODO: Remove after backend deploys fix (ETA: 2025-12-01)
// Ticket: JIRA-1234
const normalizedData = region === 'MY' 
  ? transformMYFormat(data) 
  : data;

// TEMP: Disable validation for beta users
// TODO: Re-enable after beta testing (2 weeks)
// Stakeholder: John (PM)
if (!user.isBetaTester) {
  validateForm(data);
}
```

### 8. External Dependencies/Integrations

✅ **GOOD:**
```typescript
// Jira API requires specific header format
// Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
headers: {
  'Authorization': `Basic ${btoa(`${email}:${apiToken}`)}`,
  'Content-Type': 'application/json',
  // Required by Jira Cloud, will fail without this
  'X-Atlassian-Token': 'no-check'
}

// Figma webhook payload structure (as of API v1)
// Breaking changes expected in v2 (Q2 2026)
interface FigmaWebhook {
  event_type: 'FILE_UPDATE' | 'COMMENT_ADDED';
  file_key: string; // Not file_id!
  // ... rest of payload
}
```

---

## 📋 Comment Quality Checklist

Before adding a comment, ask:

1. ❓ **Would another developer understand this code without the comment?**
   - If YES → Don't comment
   - If NO → Consider better naming first, then comment

2. ❓ **Does the comment explain WHY, not WHAT?**
   - "Why this approach?" ✅
   - "What does this line do?" ❌

3. ❓ **Is this explaining complex business logic?**
   - Business rules ✅
   - Standard code ❌

4. ❓ **Is this a workaround or non-obvious solution?**
   - Workarounds ✅
   - Standard patterns ❌

5. ❓ **Will this comment become outdated quickly?**
   - If YES → Add TODO/date
   - If NO → Proceed

---

## 🎯 Good Comment Patterns

### Pattern 1: WHY + Context

```typescript
// Calculate insurance premium with MY region discount
// MY market requires 15% discount for first-time buyers (as per 2024 campaign)
// Other regions: No discount
const premium = region === 'MY' && user.isFirstTime
  ? basePremium * 0.85
  : basePremium;
```

### Pattern 2: Business Rule + Source

```typescript
// BUSINESS RULE: Users under 18 cannot purchase life insurance
// Source: Insurance Act 1996, Section 45
// Exception: Parent/guardian consent (not implemented yet)
if (user.age < 18) {
  throw new Error('Minimum age requirement not met');
}
```

### Pattern 3: Technical Constraint + Issue Link

```typescript
// WORKAROUND: iOS WKWebView doesn't support localStorage in iframe
// Issue: https://bugs.webkit.org/show_bug.cgi?id=123456
// Using postMessage instead
window.parent.postMessage({ type: 'SAVE', data }, '*');
```

### Pattern 4: Performance Note + Measurement

```typescript
// PERF: Virtualization required - list can contain 10,000+ items
// Without virtualization: 8s render time, 90% frame drops
// With virtualization: 200ms render time, smooth 60fps
<FlatList
  data={items}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={20}
/>
```

---

## 🚨 Red Flags (Remove These)

### 1. Apologetic Comments

❌ **BAD:**
```typescript
// I know this is ugly but it works
// Sorry for the messy code
// This is a quick hack
```

✅ **GOOD:** Fix the code or explain WHY it's necessary

### 2. Author Attribution

❌ **BAD:**
```typescript
// Written by John Doe on 2024-11-20
// Modified by Jane Smith
// @author: John
```

✅ **GOOD:** Use git blame/history

### 3. Change Log Comments

❌ **BAD:**
```typescript
// 2024-11-20: Added validation
// 2024-11-21: Fixed bug
// 2024-11-22: Refactored
```

✅ **GOOD:** Use git commit history

### 4. Redundant Type Comments

❌ **BAD:**
```typescript
const userId: string = '123'; // string type
const count: number = 0; // number type
const isActive: boolean = true; // boolean type
```

✅ **GOOD:** TypeScript already shows types

---

## 🔍 Code Review Checklist

During Phase 6 (Code Review), check:

### For Each Comment, Ask:

- [ ] Does it explain WHY, not WHAT?
- [ ] Is it necessary? (Try removing it)
- [ ] Could better naming eliminate the need?
- [ ] Is it up-to-date?
- [ ] Does it add value?
- [ ] Is there a TODO with date/ticket?
- [ ] Is it properly formatted?

### Action Items:

**If comment is redundant:**
```diff
- // Set loading to true
  setLoading(true);
```

**If code needs better naming instead:**
```diff
- // Check if user has permission
- if (u.p && u.r === 'admin') {
+ if (user.hasPermission && user.role === 'admin') {
```

**If comment is valuable, keep it:**
```typescript
// GDPR: Delete user data after 30 days of account deletion
// Legal requirement, do not modify without legal approval
await scheduleDataDeletion(user.id, 30);
```

---

## 📊 Good vs Bad Ratio

### Target Metrics

- **Comment-to-Code Ratio:** < 10%
  - 1 line comment per 10 lines code
  - Focus on quality, not quantity

- **Meaningful Comments:** > 90%
  - 9 out of 10 comments should add value
  - Remove the rest

---

## 🎓 Examples from Real Code

### ❌ BEFORE (Too Many Comments)

```typescript
// Import React
import React from 'react';

// Component props interface
interface Props {
  // User name
  name: string;
  // User age
  age: number;
}

// User component
export const User: React.FC<Props> = ({ name, age }) => {
  // Return JSX
  return (
    // Main container
    <div>
      {/* User name */}
      <h1>{name}</h1>
      {/* User age */}
      <p>{age}</p>
    </div>
  );
};
```

**Issues:** 10 comments, 0 value added

### ✅ AFTER (Clean Code)

```typescript
import React from 'react';

interface UserProps {
  name: string;
  age: number;
}

export const User: React.FC<UserProps> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{age}</p>
    </div>
  );
};
```

**Result:** 0 comments, code is self-explanatory

### ✅ GOOD Example (Complex Logic)

```typescript
/**
 * Calculate policy premium with region-specific rules
 * 
 * PH: Base premium + 12% VAT + mandatory riders
 * MY: Base premium + 15% first-time discount
 * ID: Base premium + currency conversion (IDR)
 * 
 * IMPORTANT: Premium calculation affects commission
 * Do not modify without finance team approval
 */
export function calculatePremium(
  basePremium: number,
  region: Region,
  user: User
): number {
  switch (region) {
    case 'PH':
      // VAT is 12% as per TRAIN law
      const withVAT = basePremium * 1.12;
      // Mandatory riders: Accident (500 PHP) + Hospital (1000 PHP)
      return withVAT + 1500;
      
    case 'MY':
      // Campaign discount for first-time buyers only
      return user.isFirstTime ? basePremium * 0.85 : basePremium;
      
    case 'ID':
      // Convert to IDR using daily rate from central bank
      const rate = await getCurrencyRate('USD', 'IDR');
      return basePremium * rate;
      
    default:
      return basePremium;
  }
}
```

**Result:** Comments add real value, explain business rules

---

## 🎯 When in Doubt

### Ask These Questions:

1. **Can I rename variables/functions to make this clearer?** → Try that first
2. **Is this explaining standard code?** → Remove comment
3. **Is this explaining business logic?** → Keep comment
4. **Would I understand this in 6 months?** → If no, add comment
5. **Does this comment explain a hack/workaround?** → Keep + add TODO

---

## 🔗 Related Rules

- `code-quality.md` - General code quality standards
- `kiss-avoid-over-engineering.md` - Simplicity principles
- `naming-conventions.md` - Better naming reduces comment needs

---

## ✅ Enforcement

**Phase 6 (Code Review):**
- Automated linter checks for redundant comments
- Manual review of all comments
- Suggest removal or improvement
- Must pass before merge

**Linter Rules:**
```javascript
// ESLint config
rules: {
  'no-warning-comments': ['warn', { 
    terms: ['todo', 'fixme', 'hack'],
    location: 'start' 
  }],
  'spaced-comment': ['error', 'always'],
  'capitalized-comments': ['warn', 'always'],
}
```

---

**Rule:** smart-commenting  
**Version:** 1.0.0  
**Added:** CCPM v4.4  
**Priority:** High  
**Impact:** Code quality, maintainability

