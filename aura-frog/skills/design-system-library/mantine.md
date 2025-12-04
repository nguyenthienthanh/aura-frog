# Mantine - Implementation Guide

**Design System:** Mantine v7+
**Type:** Full-Featured Component Library
**Platforms:** React, Next.js, Remix, Gatsby
**Package:** `@mantine/core`, `@mantine/hooks`, `@mantine/form`

---

## Installation

```bash
# Core (required)
npm install @mantine/core @mantine/hooks

# Form handling
npm install @mantine/form

# Notifications
npm install @mantine/notifications

# Modals manager
npm install @mantine/modals

# Charts
npm install @mantine/charts recharts

# Code highlight
npm install @mantine/code-highlight

# Dates
npm install @mantine/dates dayjs
```

---

## Setup

### Next.js App Router

```tsx
// app/layout.tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'; // if using notifications

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
```

### With Custom Theme

```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  defaultRadius: 'md',
  colors: {
    brand: [
      '#e6f7ff',
      '#bae7ff',
      '#91d5ff',
      '#69c0ff',
      '#40a9ff',
      '#1890ff',
      '#096dd9',
      '#0050b3',
      '#003a8c',
      '#002766',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* App content */}
    </MantineProvider>
  );
}
```

---

## Component Patterns

### Buttons

```tsx
import { Button, ActionIcon, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

// Variants
<Button>Filled (default)</Button>
<Button variant="light">Light</Button>
<Button variant="outline">Outline</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="transparent">Transparent</Button>
<Button variant="white">White</Button>

// Colors
<Button color="blue">Blue</Button>
<Button color="red">Red</Button>
<Button color="green">Green</Button>

// Sizes
<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD (default)</Button>
<Button size="lg">LG</Button>
<Button size="xl">XL</Button>

// With icons
<Button leftSection={<IconPlus size={16} />}>Add Item</Button>
<Button rightSection={<IconArrowRight size={16} />}>Next</Button>

// Loading
<Button loading>Loading</Button>
<Button loading loaderProps={{ type: 'dots' }}>Loading</Button>

// Action icon
<ActionIcon variant="filled" color="red">
  <IconTrash size={16} />
</ActionIcon>

// Button group
<Button.Group>
  <Button variant="default">First</Button>
  <Button variant="default">Second</Button>
  <Button variant="default">Third</Button>
</Button.Group>
```

### Forms

```tsx
import { TextInput, PasswordInput, Select, Checkbox, Radio, Textarea, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';

// Using Mantine Form
const form = useForm({
  initialValues: {
    email: '',
    password: '',
    remember: false,
  },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
  },
});

<form onSubmit={form.onSubmit(handleSubmit)}>
  <TextInput
    label="Email"
    placeholder="you@example.com"
    {...form.getInputProps('email')}
  />

  <PasswordInput
    label="Password"
    placeholder="Your password"
    mt="md"
    {...form.getInputProps('password')}
  />

  <Checkbox
    label="Remember me"
    mt="md"
    {...form.getInputProps('remember', { type: 'checkbox' })}
  />

  <Button type="submit" fullWidth mt="xl">
    Sign in
  </Button>
</form>

// Select
<Select
  label="Role"
  placeholder="Select role"
  data={[
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
  ]}
/>

// Searchable select
<Select
  label="Country"
  placeholder="Search country"
  searchable
  data={countries}
/>

// Multi-select
<MultiSelect
  label="Tags"
  placeholder="Select tags"
  data={['React', 'Angular', 'Vue', 'Svelte']}
/>

// Number input
<NumberInput
  label="Quantity"
  min={0}
  max={100}
  defaultValue={1}
/>
```

### Cards

```tsx
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

// Basic card
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Card.Section>
    <Image src="/image.jpg" height={160} alt="Norway" />
  </Card.Section>

  <Group justify="space-between" mt="md" mb="xs">
    <Text fw={500}>Norway Fjord Adventures</Text>
    <Badge color="pink">On Sale</Badge>
  </Group>

  <Text size="sm" c="dimmed">
    With Fjord Tours you can explore more of the amazing fjords.
  </Text>

  <Button color="blue" fullWidth mt="md" radius="md">
    Book classic tour now
  </Button>
</Card>

// Stats card
<Card withBorder radius="md" padding="xl">
  <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
    Monthly Revenue
  </Text>
  <Text fz="lg" fw={500}>
    $13,456
  </Text>
  <Text fz="xs" c="teal" mt="sm">
    +18% this month
  </Text>
</Card>
```

### Modals

```tsx
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Modal</Button>

<Modal opened={opened} onClose={close} title="Authentication" centered>
  <TextInput label="Email" placeholder="Your email" />
  <PasswordInput label="Password" placeholder="Your password" mt="md" />
  <Button fullWidth mt="xl" onClick={close}>
    Sign in
  </Button>
</Modal>

// Sizes
<Modal size="xs">Extra small</Modal>
<Modal size="sm">Small</Modal>
<Modal size="md">Medium (default)</Modal>
<Modal size="lg">Large</Modal>
<Modal size="xl">Extra large</Modal>
<Modal fullScreen>Full screen</Modal>
```

### Notifications

```tsx
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

// Simple
notifications.show({
  title: 'Success',
  message: 'Your action was successful',
});

// With icon and color
notifications.show({
  title: 'Success',
  message: 'Your profile has been saved',
  color: 'green',
  icon: <IconCheck size={16} />,
});

// Error
notifications.show({
  title: 'Error',
  message: 'Something went wrong',
  color: 'red',
  icon: <IconX size={16} />,
});

// Loading then update
const id = notifications.show({
  loading: true,
  title: 'Saving...',
  message: 'Please wait',
  autoClose: false,
});

// Later...
notifications.update({
  id,
  color: 'green',
  title: 'Saved',
  message: 'Your data has been saved',
  icon: <IconCheck size={16} />,
  loading: false,
  autoClose: 2000,
});
```

### Tables

```tsx
import { Table, Badge, Group, Text, ActionIcon } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

<Table striped highlightOnHover>
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Email</Table.Th>
      <Table.Th>Status</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    {users.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Text fw={500}>{user.name}</Text>
        </Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>
          <Badge color={user.active ? 'green' : 'gray'}>
            {user.active ? 'Active' : 'Inactive'}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon variant="subtle" color="blue">
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red">
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ))}
  </Table.Tbody>
</Table>
```

### Navigation

```tsx
import { AppShell, Burger, NavLink, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconSettings, IconUser } from '@tabler/icons-react';

const [opened, { toggle }] = useDisclosure();

<AppShell
  header={{ height: 60 }}
  navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
  padding="md"
>
  <AppShell.Header>
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Text fw={700}>My App</Text>
    </Group>
  </AppShell.Header>

  <AppShell.Navbar p="md">
    <NavLink
      label="Home"
      leftSection={<IconHome size={16} />}
      active
    />
    <NavLink
      label="Users"
      leftSection={<IconUser size={16} />}
    />
    <NavLink
      label="Settings"
      leftSection={<IconSettings size={16} />}
    />
  </AppShell.Navbar>

  <AppShell.Main>
    {/* Main content */}
  </AppShell.Main>
</AppShell>
```

---

## Layout & Spacing

```tsx
import { Box, Container, Flex, Grid, Group, Stack, Space } from '@mantine/core';

// Container
<Container size="md">Content</Container>
<Container size="xl">Larger content</Container>

// Flex (inline flex with common props)
<Flex gap="md" align="center" justify="space-between">
  <div>Left</div>
  <div>Right</div>
</Flex>

// Group (horizontal with gap)
<Group gap="md">
  <Button>One</Button>
  <Button>Two</Button>
</Group>

// Stack (vertical with gap)
<Stack gap="md">
  <div>First</div>
  <div>Second</div>
</Stack>

// Grid
<Grid>
  <Grid.Col span={6}>Half</Grid.Col>
  <Grid.Col span={6}>Half</Grid.Col>
</Grid>

// Responsive grid
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>Responsive</Grid.Col>
</Grid>

// Box with style props
<Box p="md" bg="gray.1" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
  Content
</Box>
```

---

## Dark Mode

```tsx
import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="outline"
      size="lg"
    >
      {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
```

---

## Hooks

```tsx
import {
  useDisclosure,
  useLocalStorage,
  useMediaQuery,
  useClickOutside,
  useDebouncedValue,
  useClipboard,
} from '@mantine/hooks';

// Disclosure (for modals, drawers)
const [opened, { open, close, toggle }] = useDisclosure(false);

// Local storage
const [value, setValue] = useLocalStorage({ key: 'my-key', defaultValue: '' });

// Media query
const isMobile = useMediaQuery('(max-width: 768px)');

// Click outside
const ref = useClickOutside(() => setOpened(false));

// Debounced value
const [debouncedSearch] = useDebouncedValue(search, 300);

// Clipboard
const clipboard = useClipboard({ timeout: 500 });
clipboard.copy('Hello');
```

---

## Best Practices

### DO

```tsx
// Use theme values
<Text c="dimmed" fz="sm">

// Use consistent spacing props
<Stack gap="md">

// Use compound components
<Card.Section>

// Use built-in hooks
const [opened, { toggle }] = useDisclosure();
```

### DON'T

```tsx
// Don't use inline styles for theme values
<Box style={{ color: '#666' }}>  // BAD

// Don't skip the required CSS import
// @mantine/core/styles.css must be imported
```

---

## Common Imports

```tsx
// Layout
import { AppShell, Container, Flex, Grid, Group, Stack, Box } from '@mantine/core';

// Typography
import { Text, Title, Anchor, Highlight, Code } from '@mantine/core';

// Forms
import { TextInput, PasswordInput, Select, Checkbox, Radio, Textarea } from '@mantine/core';

// Buttons
import { Button, ActionIcon, CopyButton, FileButton } from '@mantine/core';

// Data Display
import { Table, Badge, Avatar, Card, Image, ThemeIcon } from '@mantine/core';

// Overlay
import { Modal, Drawer, Menu, Popover, Tooltip, HoverCard } from '@mantine/core';

// Feedback
import { Alert, Loader, Progress, Skeleton, Notification } from '@mantine/core';

// Navigation
import { Tabs, NavLink, Breadcrumbs, Pagination, Stepper } from '@mantine/core';

// Hooks
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';
```

---

**Last Updated:** 2025-12-04
**Mantine Version:** 7.x
