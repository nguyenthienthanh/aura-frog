# shadcn/ui - Implementation Guide

**Design System:** shadcn/ui
**Based On:** Radix UI Primitives + Tailwind CSS
**Platforms:** React, Next.js
**Package:** `shadcn-ui` (CLI), components copied to your project

---

## Key Concept

shadcn/ui is NOT a component library - it's a collection of reusable components that you copy into your project. You own the code and can customize it freely.

---

## Installation

### Next.js (App Router)

```bash
npx shadcn@latest init
```

**Configuration prompts:**
```
Would you like to use TypeScript? › yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › app/globals.css
Do you want to use CSS variables for colors? › yes
Are you using a custom tailwind prefix? › (blank)
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › yes
```

### Adding Components

```bash
# Add specific components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add table

# Add multiple at once
npx shadcn@latest add button card input label

# Add all components
npx shadcn@latest add --all
```

---

## Project Structure

```
project/
├── components/
│   └── ui/           # shadcn components live here
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   └── utils.ts      # cn() utility function
└── components.json   # shadcn configuration
```

---

## Theme Configuration

### CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

---

## Component Patterns

### Button

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon className="h-4 w-4" /></Button>

// With icon
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Login with Email
</Button>

// Loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>

// As child (for routing)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

### Form with React Hook Form + Zod

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Create Project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name of your project" />
        </div>
      </div>
    </form>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" value="John Doe" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Data Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.id}>
        <TableCell className="font-medium">{invoice.id}</TableCell>
        <TableCell>
          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
            {invoice.status}
          </Badge>
        </TableCell>
        <TableCell>{invoice.method}</TableCell>
        <TableCell className="text-right">{invoice.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Sheet (Side Panel)

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Settings</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>
        Configure your application settings.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Settings content */}
    </div>
  </SheetContent>
</Sheet>
```

### Toast/Sonner

```tsx
// Using Sonner (recommended)
import { toast } from "sonner"

// Success
toast.success("Event has been created")

// Error
toast.error("Something went wrong")

// With description
toast("Event Created", {
  description: "Your event has been scheduled.",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
})

// Promise
toast.promise(fetchData(), {
  loading: 'Loading...',
  success: 'Data loaded!',
  error: 'Error loading data',
})
```

### Command (Command Palette)

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

## Common Patterns

### Responsive Sidebar Layout

```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 lg:pl-72">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### Loading States

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Card loading skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-[125px] w-full rounded-xl" />
  </CardContent>
</Card>

// Table loading
<TableRow>
  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
</TableRow>
```

---

## Dark Mode Setup

```tsx
// Install next-themes
npm install next-themes

// app/providers.tsx
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

// Theme toggle component
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

---

## Best Practices

### DO

```tsx
// Use the cn() utility for conditional classes
import { cn } from "@/lib/utils"

<div className={cn(
  "flex items-center",
  isActive && "bg-primary text-primary-foreground",
  className
)}>

// Extend components properly
const CustomButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cn("custom-class", className)} {...props} />
))
```

### DON'T

```tsx
// Don't modify ui/ files directly (they'll be overwritten on update)
// Instead, extend them in your own components

// Don't use inline styles
<Button style={{ backgroundColor: 'red' }} />  // BAD
```

---

## Component List

**Layout:** Aspect Ratio, Card, Scroll Area, Separator
**Forms:** Button, Checkbox, Form, Input, Label, Radio Group, Select, Slider, Switch, Textarea
**Data Display:** Avatar, Badge, Calendar, Table
**Feedback:** Alert, Alert Dialog, Progress, Skeleton, Toast/Sonner
**Navigation:** Breadcrumb, Command, Dropdown Menu, Menubar, Navigation Menu, Tabs
**Overlay:** Dialog, Drawer, Hover Card, Popover, Sheet, Tooltip

---

**Last Updated:** 2025-12-04
**shadcn/ui Version:** Latest
