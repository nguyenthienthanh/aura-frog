# Skill: Design System Implementation

**Category:** Design Expert  
**Priority:** High  
**Used By:** ui-designer, mobile-react-native, web-reactjs, web-vuejs, web-nextjs

---

## Overview

Building consistent, scalable design systems with reusable components and design tokens.

---

## Design Tokens

### Token Structure

```typescript
// tokens/colors.ts
export const colors = {
  // Brand
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Main
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1'
  },
  
  // Neutrals
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  
  // Semantic
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
}

// tokens/spacing.ts
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
}

// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace"
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem'     // 48px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
}

// tokens/shadows.ts
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
}
```

---

## Component Library Structure

```
components/
├── atoms/              # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── Button.styles.ts
│   ├── Input/
│   ├── Text/
│   └── Icon/
│
├── molecules/          # Simple combinations
│   ├── FormField/
│   ├── Card/
│   └── SearchBar/
│
├── organisms/          # Complex components
│   ├── Header/
│   ├── Footer/
│   └── DataTable/
│
└── templates/          # Page layouts
    ├── DashboardLayout/
    └── AuthLayout/
```

---

## Button Component Example

### TypeScript Implementation

```typescript
// components/atoms/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { colors, spacing } from '@/tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && leftIcon && <span className="btn__icon">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {!isLoading && rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </button>
  )
}

// components/atoms/Button/Button.styles.ts
import styled, { css } from 'styled-components'
import { colors, spacing, typography } from '@/tokens'

const variantStyles = {
  primary: css`
    background: ${colors.primary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${colors.primary[600]};
    }
  `,
  
  secondary: css`
    background: ${colors.gray[200]};
    color: ${colors.gray[900]};
    
    &:hover:not(:disabled) {
      background: ${colors.gray[300]};
    }
  `,
  
  outline: css`
    background: transparent;
    border: 1px solid ${colors.primary[500]};
    color: ${colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${colors.primary[50]};
    }
  `,
  
  ghost: css`
    background: transparent;
    color: ${colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${colors.gray[100]};
    }
  `
}

const sizeStyles = {
  sm: css`
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${typography.fontSize.sm};
  `,
  
  md: css`
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSize.base};
  `,
  
  lg: css`
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.fontSize.lg};
  `
}
```

---

## Storybook Integration

```typescript
// components/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { PlusIcon } from '@/icons'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <PlusIcon />,
    children: 'Add Item'
  }
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Loading...'
  }
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

---

## Theme Provider

```typescript
// providers/ThemeProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '@/tokens/theme'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const themeObject = theme === 'light' ? lightTheme : darkTheme
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={themeObject}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

## React Native Design System

```typescript
// components/Button/Button.tsx (React Native)
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, spacing, typography } from '@/tokens'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        (disabled || isLoading) && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : colors.primary[500]} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  primary: {
    backgroundColor: colors.primary[500]
  },
  
  secondary: {
    backgroundColor: colors.gray[200]
  },
  
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm
  },
  
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },
  
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg
  },
  
  text: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium
  },
  
  text_primary: {
    color: 'white'
  },
  
  text_secondary: {
    color: colors.gray[900]
  },
  
  disabled: {
    opacity: 0.5
  }
})
```

---

## Documentation

```markdown
# Button Component

## Usage

```tsx
import { Button } from '@/components'

function MyComponent() {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => console.log('Clicked')}
    >
      Click me
    </Button>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Shows loading spinner |
| leftIcon | ReactNode | - | Icon before text |
| rightIcon | ReactNode | - | Icon after text |
| disabled | boolean | false | Disables button |

## Examples

### With Icon
```tsx
<Button leftIcon={<PlusIcon />}>Add Item</Button>
```

### Loading State
```tsx
<Button isLoading>Submitting...</Button>
```

## Accessibility
- Uses semantic `<button>` element
- Keyboard accessible
- Screen reader friendly
- Disabled state properly announced
```

---

## Best Practices

### Do's ✅
- ✅ Use design tokens for consistency
- ✅ Document all components
- ✅ Write Storybook stories
- ✅ Implement proper TypeScript types
- ✅ Follow atomic design principles
- ✅ Make components composable
- ✅ Support dark mode
- ✅ Ensure accessibility

### Don'ts ❌
- ❌ Hardcode colors/spacing
- ❌ Create one-off components
- ❌ Skip documentation
- ❌ Ignore accessibility
- ❌ Make components too specific
- ❌ Forget responsive design
- ❌ Skip tests

---

**Used by UI Designer and dev agents for consistent design implementation.**

