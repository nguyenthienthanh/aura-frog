# Tailwind CSS - Implementation Guide

**Design System:** Tailwind CSS v3.4+
**Type:** Utility-First CSS Framework
**Platforms:** All (React, Vue, Angular, Svelte, HTML)
**Package:** `tailwindcss`

---

## Installation

### React/Next.js

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Vite (React/Vue)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          // Custom secondary colors
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### CSS Setup

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg
           hover:bg-primary-700 focus:ring-2 focus:ring-primary-500
           focus:ring-offset-2 transition-colors;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## Component Patterns

### Buttons

```tsx
// Primary Button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg
                   hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
                   focus:ring-offset-2 transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed">
  Primary Button
</button>

// Secondary/Outline Button
<button className="border border-gray-300 text-gray-700 px-4 py-2
                   rounded-lg hover:bg-gray-50 focus:ring-2
                   focus:ring-gray-500 focus:ring-offset-2 transition-colors">
  Secondary
</button>

// Destructive Button
<button className="bg-red-600 text-white px-4 py-2 rounded-lg
                   hover:bg-red-700 focus:ring-2 focus:ring-red-500">
  Delete
</button>

// Ghost Button
<button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100
                   px-4 py-2 rounded-lg transition-colors">
  Ghost
</button>

// Icon Button
<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
  <svg className="w-5 h-5 text-gray-600" />
</button>

// Loading Button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg
                   flex items-center gap-2" disabled>
  <svg className="animate-spin h-4 w-4" />
  Loading...
</button>
```

### Forms

```tsx
// Text Input
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="block w-full rounded-lg border border-gray-300 px-3 py-2
               text-gray-900 placeholder:text-gray-400
               focus:border-blue-500 focus:ring-1 focus:ring-blue-500
               disabled:bg-gray-50 disabled:text-gray-500"
    placeholder="you@example.com"
  />
  <p className="text-sm text-red-600">Error message here</p>
</div>

// Select
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">Role</label>
  <select className="block w-full rounded-lg border border-gray-300
                     px-3 py-2 text-gray-900 focus:border-blue-500
                     focus:ring-1 focus:ring-blue-500">
    <option value="">Select a role</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </select>
</div>

// Checkbox
<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox"
         className="h-4 w-4 rounded border-gray-300 text-blue-600
                    focus:ring-blue-500" />
  <span className="text-sm text-gray-700">Remember me</span>
</label>

// Radio Group
<fieldset className="space-y-2">
  <legend className="text-sm font-medium text-gray-700">Plan</legend>
  {['Free', 'Pro', 'Enterprise'].map((plan) => (
    <label key={plan} className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="plan" value={plan.toLowerCase()}
             className="h-4 w-4 border-gray-300 text-blue-600
                        focus:ring-blue-500" />
      <span className="text-sm text-gray-700">{plan}</span>
    </label>
  ))}
</fieldset>

// Textarea
<textarea
  rows={4}
  className="block w-full rounded-lg border border-gray-300 px-3 py-2
             text-gray-900 placeholder:text-gray-400
             focus:border-blue-500 focus:ring-1 focus:ring-blue-500
             resize-none"
  placeholder="Enter your message..."
/>
```

### Cards

```tsx
// Basic Card
<div className="bg-white rounded-xl border border-gray-200 p-6
                shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="mt-2 text-gray-600">Card description goes here.</p>
</div>

// Card with Image
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden
                shadow-sm hover:shadow-md transition-shadow">
  <img src="/image.jpg" alt="" className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
    <p className="mt-2 text-gray-600">Description text</p>
    <div className="mt-4 flex gap-2">
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        Learn more
      </button>
    </div>
  </div>
</div>

// Stats Card
<div className="bg-white rounded-xl border border-gray-200 p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">Total Users</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">12,345</p>
    </div>
    <div className="p-3 bg-blue-50 rounded-xl">
      <UsersIcon className="h-6 w-6 text-blue-600" />
    </div>
  </div>
  <p className="mt-4 text-sm text-green-600">
    <span className="font-medium">+12%</span> from last month
  </p>
</div>
```

### Navigation

```tsx
// Navbar
<nav className="bg-white border-b border-gray-200">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-8">
        <a href="/" className="text-xl font-bold text-gray-900">Logo</a>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Team</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <BellIcon className="h-5 w-5 text-gray-600" />
        </button>
        <img src="/avatar.jpg" alt="" className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
</nav>

// Sidebar
<aside className="w-64 min-h-screen bg-gray-900 text-white">
  <div className="p-4">
    <h1 className="text-xl font-bold">App Name</h1>
  </div>
  <nav className="mt-4 space-y-1 px-2">
    {menuItems.map((item) => (
      <a
        key={item.name}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-colors ${
          item.active
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </a>
    ))}
  </nav>
</aside>
```

### Modal/Dialog

```tsx
// Modal backdrop
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  {/* Modal content */}
  <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4
                  animate-in fade-in slide-in-from-bottom-4 duration-300">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold text-gray-900">Modal Title</h2>
      <button className="p-1 rounded-full hover:bg-gray-100">
        <XIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>

    {/* Body */}
    <div className="p-4">
      <p className="text-gray-600">Modal content goes here.</p>
    </div>

    {/* Footer */}
    <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Cancel
      </button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Tables

```tsx
<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500
                       uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500
                       uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500
                       uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500
                       uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {users.map((user) => (
        <tr key={user.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="h-10 w-10 rounded-full" />
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
            {user.email}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-medium
                              rounded-full ${
              user.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {user.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right">
            <button className="text-blue-600 hover:text-blue-800">Edit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Responsive Design

```tsx
// Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Responsive visibility
<div className="hidden md:block">Visible on md and up</div>
<div className="md:hidden">Visible only on mobile</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Content</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">Heading</h1>

// Responsive flex direction
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/3">Sidebar</div>
  <div className="w-full md:w-2/3">Content</div>
</div>
```

---

## Dark Mode

```tsx
// Enable in config: darkMode: 'class'

// Toggle dark mode on <html> element
document.documentElement.classList.toggle('dark')

// Dark mode classes
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
  <button className="bg-blue-600 dark:bg-blue-500 text-white">
    Action
  </button>
</div>

// Cards in dark mode
<div className="bg-white dark:bg-gray-800 border border-gray-200
                dark:border-gray-700 rounded-xl p-6">
  Content
</div>
```

---

## Best Practices

### DO

```tsx
// Group related utilities
<div className="flex items-center justify-between gap-4">

// Use semantic color names via config
<button className="bg-primary-600 hover:bg-primary-700">

// Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Use gap instead of margin
<div className="flex gap-4"> // GOOD
<div className="flex"><div className="mr-4">... // BAD

// Extract repeated patterns
@layer components {
  .btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded-lg; }
}
```

### DON'T

```tsx
// Avoid inline styles
<div style={{ padding: '16px' }}>  // BAD

// Avoid arbitrary values when design system exists
<div className="p-[17px]">  // BAD - use p-4 or define in config

// Don't over-use @apply
// Keep it for truly reusable components only
```

---

## Utility Reference

### Spacing
- Padding: `p-{0-96}`, `px-`, `py-`, `pt-`, `pr-`, `pb-`, `pl-`
- Margin: `m-{0-96}`, `mx-`, `my-`, `mt-`, `mr-`, `mb-`, `ml-`
- Gap: `gap-{0-96}`, `gap-x-`, `gap-y-`

### Layout
- Display: `block`, `flex`, `grid`, `hidden`, `inline-flex`
- Flex: `flex-row`, `flex-col`, `items-center`, `justify-between`
- Grid: `grid-cols-{1-12}`, `col-span-{1-12}`

### Sizing
- Width: `w-{0-96}`, `w-full`, `w-screen`, `w-1/2`, `w-1/3`
- Height: `h-{0-96}`, `h-full`, `h-screen`
- Max: `max-w-{xs-7xl}`, `max-h-{size}`

### Typography
- Size: `text-{xs-9xl}`
- Weight: `font-{thin-black}`
- Color: `text-{color}-{shade}`

### Colors
- Background: `bg-{color}-{shade}`
- Text: `text-{color}-{shade}`
- Border: `border-{color}-{shade}`

---

**Last Updated:** 2025-12-04
**Tailwind Version:** 3.4.x
