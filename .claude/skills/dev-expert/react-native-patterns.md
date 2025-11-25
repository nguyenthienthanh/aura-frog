# Skill: React Native Patterns

**Category:** Dev Expert (React Native)  
**Level:** Advanced  
**Use In:** Phase 2, Phase 5 (Implementation)

---

## 🎯 Skill Overview

Master patterns for scalable React Native applications with TypeScript, hooks, and best practices.

---

## 🪝 Hook Patterns

### Custom Hook Structure
```typescript
// ✅ Good: Reusable, testable hook
export function useSocialMediaShare() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);

  const share = useCallback(async (platform: Platform, content: ShareContent) => {
    setStatus('loading');
    setError(null);
    
    try {
      const result = await shareApi.post(platform, content);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err as Error);
      setStatus('error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, share, reset };
}

// Usage
const { status, error, share } = useSocialMediaShare();
```

### Data Fetching Pattern
```typescript
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Usage
const { data: user, isLoading, error } = useUserProfile('123');
```

---

## 🎨 Component Patterns

### Container/Presentational Pattern
```typescript
// Presentational (UI only)
interface ShareButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

export const ShareButton: FC<ShareButtonProps> = ({ 
  onPress, 
  loading, 
  disabled 
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? <Spinner /> : <Text>Share</Text>}
  </TouchableOpacity>
);

// Container (logic)
export const ShareButtonContainer: FC = () => {
  const { share, status } = useSocialMediaShare();
  const handlePress = () => share('facebook', content);
  
  return (
    <ShareButton
      onPress={handlePress}
      loading={status === 'loading'}
      disabled={status === 'loading'}
    />
  );
};
```

### Render Props Pattern
```typescript
interface ShareProviderProps {
  children: (shareState: ShareState) => ReactNode;
}

export const ShareProvider: FC<ShareProviderProps> = ({ children }) => {
  const shareState = useSocialMediaShare();
  return <>{children(shareState)}</>;
};

// Usage
<ShareProvider>
  {({ share, status }) => (
    <Button onPress={() => share()} disabled={status === 'loading'} />
  )}
</ShareProvider>
```

---

## 💾 State Management Patterns

### Zustand Slice Pattern
```typescript
// types.ts
export interface ShareSlice {
  recentShares: Share[];
  draftShare: DraftShare | null;
  
  addShare: (share: Share) => void;
  saveDraft: (draft: DraftShare) => void;
  clearDraft: () => void;
}

// shareSlice.ts
export const createShareSlice: StateCreator<ShareSlice> = (set, get) => ({
  recentShares: [],
  draftShare: null,
  
  addShare: (share) => set((state) => ({
    recentShares: [share, ...state.recentShares].slice(0, 10)
  })),
  
  saveDraft: (draft) => set({ draftShare: draft }),
  
  clearDraft: () => set({ draftShare: null }),
});

// useBoundStore.ts
export const useBoundStore = create<ShareSlice>()(
  persist(
    immer((...a) => ({
      ...createShareSlice(...a),
    })),
    {
      name: 'app-storage',
      partialize: (state) => ({
        recentShares: state.recentShares,
      }),
    }
  )
);
```

---

## 🔄 Performance Patterns

### Memoization
```typescript
// useMemo for expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.timestamp - b.timestamp);
}, [items]);

// useCallback for function stability
const handlePress = useCallback((id: string) => {
  navigation.navigate('Detail', { id });
}, [navigation]);

// React.memo for component optimization
export const UserCard = React.memo<UserCardProps>(({ user }) => (
  <View>
    <Text>{user.name}</Text>
  </View>
), (prev, next) => prev.user.id === next.user.id);
```

### List Optimization
```typescript
// FlatList with optimization
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  windowSize={10}
  
  // Memoized callbacks
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.5}
  
  // Empty/Loading states
  ListEmptyComponent={<EmptyState />}
  ListFooterComponent={loading ? <Spinner /> : null}
/>
```

---

## 🎯 Navigation Patterns

### Type-Safe Navigation
```typescript
// types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Share: { content?: ShareContent };
};

// Component
type Props = NativeStackScreenProps<RootStackParamList, 'Share'>;

export const ShareScreen: FC<Props> = ({ route, navigation }) => {
  const { content } = route.params || {};
  
  const navigateToProfile = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };
  
  return <View>{/* ... */}</View>;
};
```

---

## 🎨 Styling Patterns

### Theme-Based Styling
```typescript
// theme.ts
export const theme = {
  colors: {
    primary: '#0066FF',
    text: '#1A1A1A',
    border: '#E5E5E5',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
  },
} as const;

// Component
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
});
```

### Responsive Styling
```typescript
import { useDeviceType } from 'hooks/useDeviceType';

const Component = () => {
  const deviceType = useDeviceType(); // 'phone' | 'tablet'
  
  return (
    <View style={deviceType === 'phone' ? styles.phone : styles.tablet}>
      {/* content */}
    </View>
  );
};

const styles = StyleSheet.create({
  phone: {
    width: '100%',
    padding: 16,
  },
  tablet: {
    width: '60%',
    padding: 24,
  },
});
```

---

## 📝 Form Patterns

### React Hook Form Integration
```typescript
interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
}).required();

export const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Email"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}
      
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
```

---

## 🧪 Testing Patterns

### Component Testing
```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('ShareButton', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ShareButton onPress={onPress} loading={false} disabled={false} />
    );
    
    fireEvent.press(getByText('Share'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('shows spinner when loading', () => {
    const { getByTestId, queryByText } = render(
      <ShareButton onPress={jest.fn()} loading={true} disabled={false} />
    );
    
    expect(getByTestId('spinner')).toBeTruthy();
    expect(queryByText('Share')).toBeNull();
  });
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react-hooks';

describe('useSocialMediaShare', () => {
  it('updates status on share', async () => {
    const { result } = renderHook(() => useSocialMediaShare());
    
    expect(result.current.status).toBe('idle');
    
    act(() => {
      result.current.share('facebook', content);
    });
    
    expect(result.current.status).toBe('loading');
    
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
  });
});
```

---

## 💡 Best Practices

```typescript
// ✅ DO: Use TypeScript strict mode
// ✅ DO: Memoize expensive computations
// ✅ DO: Use controlled components
// ✅ DO: Extract reusable hooks
// ✅ DO: Type navigation params
// ✅ DO: Use theme for styling

// ❌ DON'T: Use inline functions in render
// ❌ DON'T: Mutate state directly
// ❌ DON'T: Use any type
// ❌ DON'T: Put business logic in components
// ❌ DON'T: Forget error boundaries
```

---

**Skill Level:** Advanced  
**For:** Mobile React Native Agent  
**Prerequisites:** React, TypeScript, React Native basics

