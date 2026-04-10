---
name: react-native-expert
description: "React Native best practices expert. PROACTIVELY use when working with React Native, mobile apps, Expo. Triggers: react-native, expo, mobile, iOS, Android, NativeWind"
autoInvoke: false
priority: high
triggers:
  - "react-native"
  - "react native"
  - "expo"
  - "mobile"
  - "nativewind"
  - "iOS"
  - "Android"
allowed-tools: Read, Grep, Glob, Edit, Write
---

# React Native Expert Skill

React Native patterns: mobile optimization, navigation, platform handling.

---

## 1. Project Structure

```
src/
├── components/{ui,common}/  # Shared + business components
├── screens/                 # Screen components
├── navigation/              # Nav config
├── hooks/ services/ stores/ utils/ constants/ types/ assets/
```

---

## 2. Components

**Detect styling approach** from package.json: NativeWind, StyleSheet, Emotion.

**Use Pressable** over TouchableOpacity. Memoize list items. Use `useCallback` for handlers.

```tsx
const ListItem = React.memo(function ListItem({ item, onPress }: Props) {
  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);
  return <Pressable onPress={handlePress}><Text>{item.title}</Text></Pressable>;
});
```

---

## 3. FlatList Optimization

```tsx
<FlatList
  data={items}
  renderItem={renderItem}        // useCallback
  keyExtractor={keyExtractor}    // useCallback: item => item.id
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
  getItemLayout={getItemLayout}  // if fixed height
/>
```

**FlashList** (`@shopify/flash-list`) is better for large lists -- needs only `estimatedItemSize`.

---

## 4. Navigation (React Navigation)

Type-safe: Define `RootStackParamList`, use `NativeStackScreenProps` and typed `useNavigation<NavigationProp>()`.

**Deep linking:** Configure `linking.config.screens` with URL patterns.

---

## 5. Platform-Specific

- `Platform.select({ ios: {...}, android: {...} })` for style differences
- Platform-specific files: `Button.ios.tsx` / `Button.android.tsx`
- `SafeAreaView` with edges, or `useSafeAreaInsets()` for custom handling

---

## 6. Images

Use **FastImage** for network images (priority, caching, preload). `require()` for local images.

---

## 7. Animations (Reanimated)

`useSharedValue` + `useAnimatedStyle` + `withSpring/withTiming`. Gesture Handler: `Gesture.Pan()` with `onUpdate/onEnd`.

---

## 8. Storage

- **AsyncStorage:** Non-sensitive data (settings)
- **SecureStore:** Sensitive data (tokens)
- **MMKV:** Performance-critical storage

---

## 9. Testing

`@testing-library/react-native`: `render`, `fireEvent.press`, `waitFor`.

---

## Quick Reference

```toon
checklist[12]{area,best_practice}:
  Lists,Use FlashList or optimized FlatList
  Images,Use FastImage for network images
  Navigation,Type-safe with RootStackParamList
  Styling,Detect project approach (NativeWind/StyleSheet)
  Platform,Use Platform.select for differences
  Safe area,Use SafeAreaView or useSafeAreaInsets
  Animations,Use Reanimated for 60fps
  Gestures,Use Gesture Handler
  Storage,SecureStore for tokens AsyncStorage for prefs
  Performance,Memoize components and callbacks
  Testing,React Native Testing Library
  Pressable,Use over TouchableOpacity
```

---
