# NativeWind Component Generator

**Category:** Mobile Development
**Version:** 5.2.0
**Dependencies:** React Native, Expo, NativeWind, Tailwind CSS

---

## Purpose

Generate React Native components styled with NativeWind (Tailwind CSS) for cross-platform mobile applications.

---

## When to Use

- Creating new React Native components
- Converting Figma designs to code (Phase 3)
- Building responsive Phone/Tablet variants
- Rapid prototyping with utility classes

---

## NativeWind Best Practices

### Utility-First Styling

```tsx
// ✅ Preferred: NativeWind
<View className="flex-1 bg-white p-4 rounded-lg shadow-md">
  <Text className="text-xl font-bold text-gray-900">Hello</Text>
</View>

// ❌ Avoid: Manual StyleSheet
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

### Responsive Design

```tsx
<View className={`p-4 ${isTablet ? 'flex-row' : 'flex-col'}`}>
  <Text className={isTablet ? 'text-2xl' : 'text-lg'}>Responsive</Text>
</View>
```

### Dark Mode

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Dark Mode Ready</Text>
</View>
```

### Pressable States

```tsx
<Pressable
  className={({ pressed }) => `p-4 rounded-lg ${pressed ? 'bg-gray-200' : 'bg-white'}`}
>
  <Text>Pressable</Text>
</Pressable>
```

---

## Component Templates

### Screen Component

```tsx
// UserProfile.phone.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfileProps {
  userId: string;
  onEdit?: () => void;
}

export const UserProfilePhone: React.FC<UserProfileProps> = ({ onEdit }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <ScrollView className="flex-1">
      <View className="bg-white px-4 py-6 items-center">
        <Text className="text-2xl font-bold text-gray-900">John Doe</Text>
        <Text className="text-base text-gray-500">john@example.com</Text>
      </View>
      <View className="p-4">
        <TouchableOpacity
          onPress={onEdit}
          className="bg-blue-500 px-6 py-4 rounded-lg active:bg-blue-600"
        >
          <Text className="text-white text-center font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
```

### Form Component

```tsx
// LoginForm.tsx
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View className="bg-white rounded-2xl p-6 shadow-xl">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
        />
      </View>

      <TouchableOpacity
        onPress={() => onSubmit(email, password)}
        disabled={loading}
        className={`py-4 rounded-lg ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
      >
        {loading ? <ActivityIndicator color="white" /> : (
          <Text className="text-white text-center font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
```

---

## Common Patterns

| Pattern | NativeWind Class |
|---------|------------------|
| Flex container | `flex-1` |
| Padding 16px | `p-4` |
| Margin top 8px | `mt-2` |
| Background white | `bg-white` |
| Text 16px | `text-base` |
| Font bold | `font-bold` |
| Center items | `items-center` |
| Border radius 8px | `rounded-lg` |
| Shadow | `shadow-md` |

### Quick Patterns

```tsx
// List Item
<View className="bg-white border-b border-gray-200 p-4">
  <Text className="text-base font-semibold">Title</Text>
</View>

// Card with Shadow
<View className="bg-white rounded-xl shadow-lg p-6 mb-4" />

// Badge
<View className="bg-blue-100 px-3 py-1 rounded-full">
  <Text className="text-blue-800 text-xs font-medium">New</Text>
</View>

// Flex Row
<View className="flex-row justify-between items-center">
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

---

## File Structure

```
components/
├── UserProfile/
│   ├── UserProfile.tsx          # Main (shared logic)
│   ├── UserProfile.phone.tsx    # Phone layout
│   ├── UserProfile.tablet.tsx   # Tablet layout
│   └── index.ts                 # Barrel export
```

---

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  content: ["./App.{js,tsx}", "./src/**/*.{js,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#0ea5e9', 600: '#0284c7' },
        success: { 500: '#10b981' },
        error: { 500: '#ef4444' }
      }
    }
  }
};
```

---

## Success Criteria

- ✅ Utility classes for 90%+ of styling
- ✅ Responsive across Phone/Tablet
- ✅ TypeScript types for all props
- ✅ Proper accessibility labels
- ✅ Minimal StyleSheet usage
- ✅ Unit tests included

---

**References:** [NativeWind](https://nativewind.dev) | [Tailwind CSS](https://tailwindcss.com)
**Version:** 5.2.0 | **Last Updated:** 2025-11-28
