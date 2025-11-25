# Skill: Form Handling Patterns

**Category:** Dev Expert  
**Priority:** High  
**Used By:** All dev agents

---

## Overview

Best practices for building robust, validated forms with excellent UX.

---

## React Hook Form (React/React Native)

### 1. Basic Setup

```typescript
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface LoginForm {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(8).required('Password is required')
})

function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  
  const onSubmit = async (data: LoginForm) => {
    await loginUser(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <input
            {...field}
            type="email"
            placeholder="Email"
          />
        )}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <input
            {...field}
            type="password"
            placeholder="Password"
          />
        )}
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
```

### 2. Dynamic Forms

```typescript
import { useFieldArray } from 'react-hook-form'

interface AddressForm {
  addresses: Array<{
    street: string
    city: string
    zipCode: string
  }>
}

function AddressForm() {
  const { control, handleSubmit } = useForm<AddressForm>({
    defaultValues: {
      addresses: [{ street: '', city: '', zipCode: '' }]
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses'
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            control={control}
            name={`addresses.${index}.street`}
            render={({ field }) => <input {...field} />}
          />
          
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ street: '', city: '', zipCode: '' })}
      >
        Add Address
      </button>
    </form>
  )
}
```

### 3. Dependent Fields

```typescript
function RegistrationForm() {
  const { control, watch } = useForm()
  const userType = watch('userType')
  
  return (
    <form>
      <Controller
        control={control}
        name="userType"
        render={({ field }) => (
          <select {...field}>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        )}
      />
      
      {userType === 'business' && (
        <Controller
          control={control}
          name="companyName"
          render={({ field }) => (
            <input {...field} placeholder="Company Name" />
          )}
        />
      )}
    </form>
  )
}
```

---

## Validation Schemas

### Yup Validation

```typescript
import * as yup from 'yup'

// Basic schema
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().min(18, 'Must be 18+').required('Age is required'),
  website: yup.string().url('Invalid URL').nullable(),
  terms: yup.boolean().oneOf([true], 'Must accept terms')
})

// Conditional validation
const passwordSchema = yup.object({
  password: yup.string().min(8).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required()
})

// Array validation
const listSchema = yup.object({
  items: yup.array()
    .of(
      yup.object({
        name: yup.string().required(),
        quantity: yup.number().min(1).required()
      })
    )
    .min(1, 'At least one item required')
})

// Custom validation
const customSchema = yup.object({
  username: yup.string()
    .test('unique', 'Username already taken', async (value) => {
      if (!value) return true
      return await checkUsernameAvailable(value)
    })
})
```

---

## Vue.js Forms

### VeeValidate + Yup

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

const { values, errors, handleSubmit, defineField } = useForm({
  validationSchema: schema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  await loginUser(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <input
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      placeholder="Email"
    />
    <span v-if="errors.email">{{ errors.email }}</span>
    
    <input
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      placeholder="Password"
    />
    <span v-if="errors.password">{{ errors.password }}</span>
    
    <button type="submit">Login</button>
  </form>
</template>
```

---

## Laravel Forms

### Form Request Validation

```php
// app/Http/Requests/StoreUserRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'age' => 'required|integer|min:18',
            'profile.bio' => 'nullable|string|max:500',
            'addresses.*.street' => 'required|string',
            'addresses.*.city' => 'required|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name',
            'email.unique' => 'This email is already registered'
        ];
    }
}

// Controller
public function store(StoreUserRequest $request)
{
    $validated = $request->validated();
    $user = User::create($validated);
    return response()->json($user, 201);
}
```

---

## Error Display Patterns

### Inline Errors

```typescript
<input {...field} className={errors.email ? 'error' : ''} />
{errors.email && (
  <span className="error-message">{errors.email.message}</span>
)}
```

### Toast Notifications

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await submitForm(data)
    toast.success('Form submitted successfully!')
  } catch (error) {
    toast.error('Failed to submit form')
  }
}
```

### Summary List

```typescript
{Object.keys(errors).length > 0 && (
  <div className="error-summary">
    <h4>Please fix the following errors:</h4>
    <ul>
      {Object.entries(errors).map(([key, error]) => (
        <li key={key}>{error.message}</li>
      ))}
    </ul>
  </div>
)}
```

---

## Best Practices

### Do's ✅
- ✅ Validate on blur for better UX
- ✅ Show specific error messages
- ✅ Disable submit during submission
- ✅ Reset form after successful submit
- ✅ Use proper input types (email, tel, number)
- ✅ Implement debounced async validation
- ✅ Provide clear labels and placeholders
- ✅ Handle loading and error states

### Don'ts ❌
- ❌ Validate on every keystroke (annoying)
- ❌ Show generic error messages
- ❌ Allow multiple submissions
- ❌ Forget to handle errors
- ❌ Store passwords in plain text
- ❌ Skip server-side validation
- ❌ Make all fields required

---

## Accessibility

```typescript
<label htmlFor="email">
  Email *
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
  {...field}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}
```

---

**Used by dev agents for form implementation guidance.**

