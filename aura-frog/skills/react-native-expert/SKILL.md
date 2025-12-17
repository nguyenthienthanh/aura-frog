---
name: react-native-expert
description: "React Native best practices expert. PROACTIVELY use when working with React Native, mobile apps, Expo. Triggers: react-native, expo, mobile, iOS, Android, NativeWind"
autoInvoke: true
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

Expert-level React Native patterns, mobile-specific optimizations, navigation, and platform handling.

---

## Auto-Detection

This skill activates when:
- Working with React Native projects
- Detected `react-native` or `expo` in package.json
- Building mobile components
- Platform-specific code needed

---

## 1. Project Structure

### Recommended Structure

```
src/
├── components/           # Shared components
│   ├── ui/              # Base UI components
│   └── common/          # Business components
├── screens/             # Screen components
├── navigation/          # Navigation config
├── hooks/               # Custom hooks
├── services/            # API services
├── stores/              # State management
├── utils/               # Utilities
├── constants/           # App constants
├── types/               # TypeScript types
└── assets/              # Images, fonts
```

---

## 2. Component Patterns

### Adaptive Styling Detection

```typescript
// ✅ GOOD - Detect and use project's styling approach
// Check package.json for: nativewind, emotion, styled-components, or use StyleSheet

// NativeWind (Tailwind)
import { styled } from 'nativewind';
const StyledView = styled(View);
<StyledView className="flex-1 bg-white p-4" />

// StyleSheet (default)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
});
<View style={styles.container} />

// Emotion
import styled from '@emotion/native';
const Container = styled.View`flex: 1; background-color: white;`;
```

### Performance-Optimized Components

```tsx
// ✅ GOOD - Memoized list item
const ListItem = React.memo(function ListItem({ item, onPress }: Props) {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <Pressable onPress={handlePress}>
      <Text>{item.title}</Text>
    </Pressable>
  );
});

// ✅ GOOD - Pressable over TouchableOpacity
<Pressable
  onPress={handlePress}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed
  ]}
  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
>
  <Text>Press Me</Text>
</Pressable>
```

---

## 3. FlatList Optimization

### Required Optimizations

```tsx
// ✅ GOOD - Optimized FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  getItemLayout={getItemLayout} // If fixed height
  // Memoized functions
  ListEmptyComponent={EmptyComponent}
  ListHeaderComponent={HeaderComponent}
  ListFooterComponent={FooterComponent}
  // Prevent re-renders
  extraData={selectedId}
/>

// ✅ GOOD - Memoized renderItem
const renderItem = useCallback(({ item }: { item: Item }) => (
  <ListItem item={item} onPress={handlePress} />
), [handlePress]);

// ✅ GOOD - Stable keyExtractor
const keyExtractor = useCallback((item: Item) => item.id, []);

// ✅ GOOD - getItemLayout for fixed height items
const getItemLayout = useCallback((
  _data: Item[] | null | undefined,
  index: number
) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
}), []);
```

### FlashList Alternative

```tsx
// ✅ BETTER - Use FlashList for large lists
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={ITEM_HEIGHT}
  keyExtractor={keyExtractor}
/>
```

---

## 4. Navigation (React Navigation)

### Type-Safe Navigation

```tsx
// ✅ GOOD - Define navigation types
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { section?: string };
};

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

// ✅ GOOD - Type-safe navigation hook
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MyComponent() {
  const navigation = useNavigation<NavigationProp>();

  const goToProfile = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };
}
```

### Deep Linking

```tsx
// ✅ GOOD - Configure deep linking
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Profile: 'user/:userId',
      Settings: 'settings',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

---

## 5. Platform-Specific Code

### Platform Selection

```tsx
import { Platform, StyleSheet } from 'react-native';

// ✅ GOOD - Platform.select
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }),
});

// ✅ GOOD - Platform-specific files
// Button.ios.tsx
// Button.android.tsx
// Button.tsx (fallback)
import Button from './Button'; // Auto-selects platform
```

### Safe Area Handling

```tsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ GOOD - SafeAreaView for screens
function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <Content />
    </SafeAreaView>
  );
}

// ✅ GOOD - useSafeAreaInsets for custom handling
function CustomHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <HeaderContent />
    </View>
  );
}
```

---

## 6. Image Handling

### Optimized Images

```tsx
import FastImage from 'react-native-fast-image';

// ✅ GOOD - Use FastImage for network images
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>

// ✅ GOOD - Preload images
FastImage.preload([
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
]);

// ✅ GOOD - Local images with require
<Image source={require('./assets/logo.png')} />
```

---

## 7. Animations

### Reanimated Best Practices

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

// ✅ GOOD - Worklet-based animations
function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Content />
      </Animated.View>
    </Pressable>
  );
}
```

### Gesture Handler

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// ✅ GOOD - Gesture-based interactions
function SwipeableCard() {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Card />
      </Animated.View>
    </GestureDetector>
  );
}
```

---

## 8. Storage & Persistence

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// ✅ GOOD - AsyncStorage for non-sensitive data
async function saveSettings(settings: Settings) {
  await AsyncStorage.setItem('settings', JSON.stringify(settings));
}

// ✅ GOOD - SecureStore for sensitive data
async function saveToken(token: string) {
  await SecureStore.setItemAsync('authToken', token);
}

// ✅ GOOD - MMKV for performance-critical storage
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
storage.set('user.name', 'John');
const name = storage.getString('user.name');
```

---

## 9. Testing

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// ✅ GOOD - Component testing
describe('LoginButton', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<LoginButton onPress={onPress} />);

    fireEvent.press(getByText('Login'));
    expect(onPress).toHaveBeenCalled();
  });
});

// ✅ GOOD - Async testing
it('shows loading then content', async () => {
  const { getByTestId, queryByTestId } = render(<DataScreen />);

  expect(getByTestId('loading')).toBeTruthy();

  await waitFor(() => {
    expect(queryByTestId('loading')).toBeNull();
    expect(getByTestId('content')).toBeTruthy();
  });
});
```

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

**Version:** 1.2.5
