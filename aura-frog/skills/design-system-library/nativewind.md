# NativeWind - Implementation Guide

**Design System:** NativeWind v4
**Based On:** Tailwind CSS for React Native
**Platforms:** React Native, Expo
**Package:** `nativewind`, `tailwindcss`

---

## Key Concept

NativeWind allows you to use Tailwind CSS utility classes in React Native. It compiles Tailwind classes to React Native StyleSheet at build time.

---

## Installation

### Expo Project

```bash
npx expo install nativewind tailwindcss

# Initialize Tailwind
npx tailwindcss init
```

### React Native CLI

```bash
npm install nativewind
npm install --save-dev tailwindcss

# Initialize Tailwind
npx tailwindcss init
```

---

## Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
        },
      },
      fontFamily: {
        sans: ['Inter'],
        heading: ['Poppins'],
      },
    },
  },
  plugins: [],
}
```

### global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

### metro.config.js

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

### app/_layout.tsx (Expo Router)

```tsx
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

### nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

---

## Component Patterns

### Basic Usage

```tsx
import { View, Text, Pressable } from 'react-native';

export function Card() {
  return (
    <View className="bg-white rounded-xl p-4 shadow-md">
      <Text className="text-lg font-semibold text-gray-900">
        Card Title
      </Text>
      <Text className="text-gray-600 mt-2">
        Card description goes here.
      </Text>
    </View>
  );
}
```

### Buttons

```tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';

// Primary Button
export function PrimaryButton({ children, onPress, loading, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        bg-blue-600 rounded-lg py-3 px-6 flex-row items-center justify-center
        active:bg-blue-700 disabled:opacity-50
      `}
    >
      {loading && <ActivityIndicator color="white" className="mr-2" />}
      <Text className="text-white font-semibold text-base">
        {children}
      </Text>
    </Pressable>
  );
}

// Secondary Button
export function SecondaryButton({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="border border-gray-300 rounded-lg py-3 px-6 active:bg-gray-50"
    >
      <Text className="text-gray-700 font-semibold text-base text-center">
        {children}
      </Text>
    </Pressable>
  );
}

// Ghost Button
export function GhostButton({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="py-2 px-4 active:bg-gray-100 rounded-lg"
    >
      <Text className="text-gray-600 font-medium text-center">
        {children}
      </Text>
    </Pressable>
  );
}

// Icon Button
export function IconButton({ icon: Icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
    >
      <Icon className="w-5 h-5 text-gray-600" />
    </Pressable>
  );
}
```

### Form Inputs

```tsx
import { View, Text, TextInput, Pressable } from 'react-native';

// Text Input
export function Input({ label, error, ...props }) {
  return (
    <View className="space-y-1">
      {label && (
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
      )}
      <TextInput
        className={`
          border rounded-lg px-4 py-3 text-base text-gray-900
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:border-blue-500
        `}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500">{error}</Text>
      )}
    </View>
  );
}

// Password Input
export function PasswordInput({ label, error, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="space-y-1">
      {label && (
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          className={`
            border rounded-lg px-4 py-3 pr-12 text-base text-gray-900
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          secureTextEntry={!visible}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        <Pressable
          onPress={() => setVisible(!visible)}
          className="absolute right-3 top-3"
        >
          {visible ? (
            <EyeOffIcon className="w-6 h-6 text-gray-400" />
          ) : (
            <EyeIcon className="w-6 h-6 text-gray-400" />
          )}
        </Pressable>
      </View>
      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
}

// Checkbox
export function Checkbox({ checked, onChange, label }) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-2"
    >
      <View
        className={`
          w-5 h-5 rounded border-2 items-center justify-center
          ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
        `}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </View>
      <Text className="text-gray-700">{label}</Text>
    </Pressable>
  );
}
```

### Cards

```tsx
import { View, Text, Image, Pressable } from 'react-native';

// Basic Card
export function Card({ title, description, children }) {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {title && (
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      )}
      {description && (
        <Text className="text-gray-600 mt-1">{description}</Text>
      )}
      {children && <View className="mt-4">{children}</View>}
    </View>
  );
}

// Card with Image
export function ImageCard({ image, title, description, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl overflow-hidden shadow-sm active:opacity-90"
    >
      <Image source={{ uri: image }} className="w-full h-40" />
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        <Text className="text-gray-600 mt-1">{description}</Text>
      </View>
    </Pressable>
  );
}

// Stats Card
export function StatsCard({ icon: Icon, title, value, change }) {
  const isPositive = change >= 0;

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </View>
        <View className="items-end">
          <Text className="text-2xl font-bold text-gray-900">{value}</Text>
          <Text className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}%
          </Text>
        </View>
      </View>
      <Text className="text-gray-500 mt-2">{title}</Text>
    </View>
  );
}
```

### Lists

```tsx
import { View, Text, FlatList, Pressable } from 'react-native';

// List Item
export function ListItem({ title, subtitle, onPress, leftIcon: LeftIcon, rightIcon: RightIcon }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 px-4 bg-white active:bg-gray-50"
    >
      {LeftIcon && (
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
          <LeftIcon className="w-5 h-5 text-gray-600" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {RightIcon && <RightIcon className="w-5 h-5 text-gray-400" />}
    </Pressable>
  );
}

// Divider
export function Divider() {
  return <View className="h-px bg-gray-200 mx-4" />;
}
```

### Navigation

```tsx
// Bottom Tab Bar
export function TabBar({ tabs, activeTab, onTabPress }) {
  return (
    <View className="flex-row bg-white border-t border-gray-200 pb-safe">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="flex-1 items-center py-2"
          >
            <tab.icon
              className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
            />
            <Text
              className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Header
export function Header({ title, leftAction, rightAction }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200 pt-safe">
      <View className="w-10">
        {leftAction}
      </View>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <View className="w-10 items-end">
        {rightAction}
      </View>
    </View>
  );
}
```

### Modal / Bottom Sheet

```tsx
import { Modal, View, Text, Pressable } from 'react-native';

export function BottomSheet({ visible, onClose, title, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-end"
      >
        <Pressable className="bg-white rounded-t-3xl">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3" />
          <View className="p-4">
            <Text className="text-xl font-semibold text-gray-900 text-center">
              {title}
            </Text>
          </View>
          <View className="px-4 pb-safe">{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

---

## Dark Mode

```tsx
// In tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}

// Usage
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Adapts to dark mode
  </Text>
</View>

// Toggle dark mode
import { useColorScheme } from 'nativewind';

function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable onPress={toggleColorScheme}>
      <Text>Current: {colorScheme}</Text>
    </Pressable>
  );
}
```

---

## Safe Area

```tsx
// Use safe area utilities
<View className="pt-safe">Header with top safe area</View>
<View className="pb-safe">Footer with bottom safe area</View>
<View className="px-safe">Content with horizontal safe area</View>
```

---

## Platform-Specific Styles

```tsx
import { Platform } from 'react-native';

// Using className with platform check
<View
  className={`
    rounded-lg p-4
    ${Platform.OS === 'ios' ? 'shadow-lg' : 'elevation-4'}
  `}
>
  Platform-specific shadow
</View>
```

---

## Best Practices

### DO

```tsx
// Use className for all styling
<View className="flex-1 bg-white p-4">

// Use consistent spacing from theme
<View className="gap-4 p-4">

// Use semantic color names
<Text className="text-primary-600">

// Group related classes logically
<Pressable
  className={`
    flex-row items-center gap-2
    bg-blue-600 rounded-lg py-3 px-4
    active:bg-blue-700
  `}
>
```

### DON'T

```tsx
// Don't mix StyleSheet and className
<View className="p-4" style={{ marginTop: 10 }}>  // BAD

// Don't use arbitrary values when theme values exist
<View className="p-[17px]">  // BAD

// Don't forget dark mode variants
<View className="bg-white">  // Add dark:bg-gray-900
```

---

## Common Utilities

### Layout
- `flex-1`, `flex-row`, `flex-col`
- `items-center`, `justify-center`, `justify-between`
- `gap-{n}`, `space-y-{n}`, `space-x-{n}`

### Spacing
- `p-{n}`, `px-{n}`, `py-{n}`, `pt-{n}`, `pb-{n}`
- `m-{n}`, `mx-{n}`, `my-{n}`, `mt-{n}`, `mb-{n}`

### Sizing
- `w-{n}`, `w-full`, `w-1/2`
- `h-{n}`, `h-full`, `h-screen`

### Typography
- `text-{size}`: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- `font-{weight}`: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- `text-{color}`: `text-gray-900`, `text-blue-600`

### Borders
- `rounded-{size}`: `rounded`, `rounded-lg`, `rounded-xl`, `rounded-full`
- `border`, `border-{n}`, `border-{color}`

### Interactive
- `active:bg-{color}` - Press state
- `disabled:opacity-50` - Disabled state

---

**Last Updated:** 2025-12-04
**NativeWind Version:** 4.x
