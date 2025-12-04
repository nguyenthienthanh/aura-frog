# Chakra UI - Implementation Guide

**Design System:** Chakra UI v2+
**Based On:** Styled System + Emotion
**Platforms:** React, Next.js
**Package:** `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`

---

## Installation

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Next.js App Router Setup

```tsx
// app/providers.tsx
'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // Custom theme here
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
```

---

## Theme Configuration

```tsx
// theme/index.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80cbff',
      300: '#4db5ff',
      400: '#1a9fff',
      500: '#0080e6',  // Primary
      600: '#0066b3',
      700: '#004d80',
      800: '#00334d',
      900: '#001a1a',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          _hover: {
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
        },
      },
    },
  },
})

export default theme
```

---

## Component Patterns

### Buttons

```tsx
import { Button, IconButton, ButtonGroup } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

// Variants
<Button colorScheme="blue">Primary</Button>
<Button colorScheme="gray" variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD</Button>
<Button size="lg">LG</Button>

// With icons
<Button leftIcon={<AddIcon />} colorScheme="teal">Add Item</Button>
<Button rightIcon={<ArrowForwardIcon />}>Next</Button>

// Icon button
<IconButton aria-label="Delete" icon={<DeleteIcon />} colorScheme="red" />

// Loading
<Button isLoading colorScheme="blue">Loading</Button>
<Button isLoading loadingText="Submitting" colorScheme="blue">Submit</Button>

// Disabled
<Button isDisabled>Disabled</Button>

// Button group
<ButtonGroup spacing={2}>
  <Button colorScheme="blue">Save</Button>
  <Button variant="outline">Cancel</Button>
</ButtonGroup>
```

### Forms

```tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'

// Text input with validation
<FormControl isInvalid={!!errors.email}>
  <FormLabel>Email</FormLabel>
  <Input
    type="email"
    placeholder="you@example.com"
    {...register('email')}
  />
  {errors.email ? (
    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
  ) : (
    <FormHelperText>We'll never share your email.</FormHelperText>
  )}
</FormControl>

// Select
<FormControl>
  <FormLabel>Country</FormLabel>
  <Select placeholder="Select country">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </Select>
</FormControl>

// Checkbox
<Checkbox colorScheme="green" defaultChecked>
  Remember me
</Checkbox>

// Radio group
<FormControl>
  <FormLabel>Plan</FormLabel>
  <RadioGroup defaultValue="free">
    <Stack direction="row" spacing={4}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </Stack>
  </RadioGroup>
</FormControl>

// Textarea
<FormControl>
  <FormLabel>Message</FormLabel>
  <Textarea placeholder="Enter your message" resize="vertical" />
</FormControl>
```

### Cards

```tsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
} from '@chakra-ui/react'

// Basic card
<Card>
  <CardHeader>
    <Heading size="md">Card Title</Heading>
  </CardHeader>
  <CardBody>
    <Text>Card content goes here.</Text>
  </CardBody>
  <CardFooter>
    <Button colorScheme="blue">Action</Button>
  </CardFooter>
</Card>

// Card with image
<Card maxW="sm">
  <CardBody>
    <Image
      src="/image.jpg"
      alt="Description"
      borderRadius="lg"
    />
    <Stack mt="6" spacing="3">
      <Heading size="md">Product Title</Heading>
      <Text>Description text here.</Text>
      <Text color="blue.600" fontSize="2xl">
        $450
      </Text>
    </Stack>
  </CardBody>
  <CardFooter>
    <ButtonGroup spacing="2">
      <Button variant="solid" colorScheme="blue">Buy now</Button>
      <Button variant="ghost" colorScheme="blue">Add to cart</Button>
    </ButtonGroup>
  </CardFooter>
</Card>

// Card variants
<Card variant="outline">Outline card</Card>
<Card variant="filled">Filled card</Card>
<Card variant="elevated">Elevated card</Card>
```

### Modal

```tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

const { isOpen, onOpen, onClose } = useDisclosure()

<Button onClick={onOpen}>Open Modal</Button>

<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Modal Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Text>Modal content goes here.</Text>
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" mr={3} onClick={onClose}>
        Cancel
      </Button>
      <Button colorScheme="blue">Save</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Layout

```tsx
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Container,
  Stack,
  HStack,
  VStack,
  Spacer,
  Center,
} from '@chakra-ui/react'

// Box with style props
<Box bg="gray.100" p={4} borderRadius="lg">
  Content
</Box>

// Flex layout
<Flex align="center" justify="space-between">
  <Box>Left</Box>
  <Spacer />
  <Box>Right</Box>
</Flex>

// Stack (vertical by default)
<Stack spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>

// HStack (horizontal)
<HStack spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</HStack>

// Grid
<Grid templateColumns="repeat(3, 1fr)" gap={6}>
  <GridItem>1</GridItem>
  <GridItem>2</GridItem>
  <GridItem>3</GridItem>
</Grid>

// Responsive grid
<Grid
  templateColumns={{
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
  }}
  gap={6}
>
  {items.map(item => <GridItem key={item.id}>...</GridItem>)}
</Grid>

// Container
<Container maxW="container.xl" py={8}>
  Content
</Container>
```

### Navigation

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'

// Breadcrumb
<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/products">Products</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink>Details</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>

// Tabs
<Tabs colorScheme="blue">
  <TabList>
    <Tab>Account</Tab>
    <Tab>Settings</Tab>
    <Tab>Billing</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Account content</TabPanel>
    <TabPanel>Settings content</TabPanel>
    <TabPanel>Billing content</TabPanel>
  </TabPanels>
</Tabs>
```

### Toast

```tsx
import { useToast, Button } from '@chakra-ui/react'

function ToastExample() {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Account created.',
          description: "We've created your account.",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })
      }
    >
      Show Toast
    </Button>
  )
}

// Toast statuses: success, error, warning, info, loading
toast({ status: 'error', title: 'Error occurred' })
toast({ status: 'warning', title: 'Warning message' })
toast({ status: 'info', title: 'Information' })
toast({ status: 'loading', title: 'Loading...' })
```

---

## Style Props

Chakra UI uses style props for styling:

```tsx
<Box
  // Spacing
  p={4}           // padding
  m={2}           // margin
  px={4}          // padding horizontal
  py={2}          // padding vertical
  mt={4}          // margin top

  // Colors
  bg="blue.500"
  color="white"
  borderColor="gray.200"

  // Layout
  w="100%"        // width
  h="200px"       // height
  maxW="md"       // max-width (sizes: sm, md, lg, xl, 2xl, etc.)

  // Flexbox
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  gap={4}

  // Border
  border="1px"
  borderRadius="lg"

  // Shadow
  boxShadow="md"

  // Responsive (mobile first)
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  flexDirection={{ base: 'column', md: 'row' }}
>
  Content
</Box>
```

---

## Dark Mode

```tsx
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Toggle theme"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
    />
  )
}

// Use color mode values
function Card() {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box bg={bg} borderColor={borderColor} borderWidth="1px" p={4}>
      Content
    </Box>
  )
}
```

---

## Best Practices

### DO

```tsx
// Use theme tokens
<Box bg="blue.500" color="white" p={4}>

// Use responsive arrays/objects
<Box fontSize={{ base: 'sm', md: 'md' }}>

// Use Stack for consistent spacing
<Stack spacing={4}>
  <Item />
  <Item />
</Stack>

// Use semantic components
<Heading as="h1" size="xl">Title</Heading>
<Text fontSize="lg">Paragraph</Text>
```

### DON'T

```tsx
// Avoid inline styles
<Box style={{ backgroundColor: 'blue' }}>  // BAD

// Avoid hardcoded values
<Box p="17px">  // BAD, use theme values

// Don't skip aria labels on icon buttons
<IconButton icon={<DeleteIcon />} />  // BAD - missing aria-label
```

---

## Common Imports

```tsx
// Layout
import { Box, Flex, Grid, Stack, Container, Center } from '@chakra-ui/react'

// Typography
import { Heading, Text, Code } from '@chakra-ui/react'

// Forms
import { Input, Select, Checkbox, Radio, Button, FormControl } from '@chakra-ui/react'

// Feedback
import { Alert, Toast, Spinner, Progress, Skeleton } from '@chakra-ui/react'

// Overlay
import { Modal, Drawer, Menu, Popover, Tooltip } from '@chakra-ui/react'

// Data Display
import { Badge, Tag, Avatar, Table, List, Card } from '@chakra-ui/react'

// Icons
import { AddIcon, DeleteIcon, EditIcon, CloseIcon } from '@chakra-ui/icons'

// Hooks
import { useDisclosure, useToast, useColorMode } from '@chakra-ui/react'
```

---

**Last Updated:** 2025-12-04
**Chakra UI Version:** 2.x
