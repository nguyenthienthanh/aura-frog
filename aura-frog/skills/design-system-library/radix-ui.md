# Radix UI - Implementation Guide

**Design System:** Radix UI Primitives
**Type:** Headless UI Component Library
**Platforms:** React
**Package:** `@radix-ui/react-*`

---

## Key Concept

Radix UI provides unstyled, accessible UI primitives. You bring your own styles (Tailwind, CSS, styled-components, etc.). This gives maximum flexibility while ensuring accessibility.

---

## Installation

Install individual primitives as needed:

```bash
# Dialog/Modal
npm install @radix-ui/react-dialog

# Dropdown Menu
npm install @radix-ui/react-dropdown-menu

# Popover
npm install @radix-ui/react-popover

# Select
npm install @radix-ui/react-select

# Tabs
npm install @radix-ui/react-tabs

# Tooltip
npm install @radix-ui/react-tooltip

# Accordion
npm install @radix-ui/react-accordion

# Toggle
npm install @radix-ui/react-toggle

# Checkbox
npm install @radix-ui/react-checkbox

# Radio Group
npm install @radix-ui/react-radio-group

# Switch
npm install @radix-ui/react-switch

# Slider
npm install @radix-ui/react-slider
```

---

## Component Patterns (with Tailwind)

### Dialog (Modal)

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

export function Modal({ trigger, title, children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-2">
            {/* Optional description */}
          </Dialog.Description>

          <div className="mt-4">
            {children}
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Usage
<Modal
  trigger={<button className="btn-primary">Open Modal</button>}
  title="Edit Profile"
>
  <form>
    {/* Form content */}
  </form>
</Modal>
```

### Dropdown Menu

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';

export function Dropdown({ trigger, items }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={5}
        >
          {items.map((item, index) => {
            if (item.type === 'separator') {
              return <DropdownMenu.Separator key={index} className="h-px bg-gray-200 my-1" />;
            }

            if (item.type === 'label') {
              return (
                <DropdownMenu.Label key={index} className="px-2 py-1.5 text-xs font-medium text-gray-500">
                  {item.label}
                </DropdownMenu.Label>
              );
            }

            return (
              <DropdownMenu.Item
                key={index}
                className="flex items-center px-2 py-2 text-sm text-gray-700 rounded-md cursor-pointer outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                onSelect={item.onSelect}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
                {item.shortcut && (
                  <span className="ml-auto text-xs text-gray-400">{item.shortcut}</span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Checkbox item
<DropdownMenu.CheckboxItem
  className="flex items-center px-2 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-100"
  checked={showStatusBar}
  onCheckedChange={setShowStatusBar}
>
  <DropdownMenu.ItemIndicator className="mr-2">
    <CheckIcon className="w-4 h-4" />
  </DropdownMenu.ItemIndicator>
  Show Status Bar
</DropdownMenu.CheckboxItem>

// Sub menu
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger className="flex items-center px-2 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-100">
    More Tools
    <ChevronRightIcon className="w-4 h-4 ml-auto" />
  </DropdownMenu.SubTrigger>
  <DropdownMenu.Portal>
    <DropdownMenu.SubContent className="min-w-[180px] bg-white rounded-lg shadow-lg border p-1">
      <DropdownMenu.Item>Save Page As...</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Portal>
</DropdownMenu.Sub>
```

### Select

```tsx
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';

export function SelectInput({ placeholder, options, value, onChange }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex items-center px-2 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:opacity-50"
                disabled={option.disabled}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="ml-auto">
                  <CheckIcon className="w-4 h-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// Grouped select
<Select.Group>
  <Select.Label className="px-2 py-1.5 text-xs font-medium text-gray-500">
    Fruits
  </Select.Label>
  <Select.Item value="apple">Apple</Select.Item>
  <Select.Item value="banana">Banana</Select.Item>
</Select.Group>
```

### Tabs

```tsx
import * as Tabs from '@radix-ui/react-tabs';

export function TabsComponent({ tabs }) {
  return (
    <Tabs.Root defaultValue={tabs[0].value}>
      <Tabs.List className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 outline-none"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="py-4 outline-none"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
```

### Checkbox

```tsx
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

export function CheckboxInput({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-5 h-5 rounded border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      >
        <Checkbox.Indicator className="flex items-center justify-center text-white">
          <CheckIcon className="w-3.5 h-3.5" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
}
```

### Radio Group

```tsx
import * as RadioGroup from '@radix-ui/react-radio-group';

export function RadioGroupInput({ options, value, onChange }) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="flex flex-col gap-2"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroup.Item
            value={option.value}
            id={option.value}
            className="w-5 h-5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue-600" />
          </RadioGroup.Item>
          <label htmlFor={option.value} className="text-sm text-gray-700 cursor-pointer">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup.Root>
  );
}
```

### Switch

```tsx
import * as Switch from '@radix-ui/react-switch';

export function SwitchInput({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
}
```

### Tooltip

```tsx
import * as Tooltip from '@radix-ui/react-tooltip';

export function TooltipWrapper({ children, content, side = 'top' }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            className="px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-md animate-in fade-in-0 zoom-in-95 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// Usage
<TooltipWrapper content="Add to favorites">
  <button className="p-2 rounded-full hover:bg-gray-100">
    <HeartIcon className="w-5 h-5" />
  </button>
</TooltipWrapper>
```

### Accordion

```tsx
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';

export function AccordionComponent({ items }) {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-gray-200 border rounded-lg">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 group">
              {item.title}
              <ChevronDownIcon className="w-4 h-4 text-gray-500 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 pb-3 text-sm text-gray-600 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            {item.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
```

---

## Data Attributes for Styling

Radix components expose data attributes for styling different states:

```css
/* State-based styling */
[data-state="open"] { }
[data-state="closed"] { }
[data-state="checked"] { }
[data-state="unchecked"] { }
[data-state="active"] { }
[data-state="inactive"] { }

/* Side/alignment */
[data-side="top"] { }
[data-side="bottom"] { }
[data-side="left"] { }
[data-side="right"] { }
[data-align="start"] { }
[data-align="center"] { }
[data-align="end"] { }

/* Other */
[data-disabled] { }
[data-highlighted] { }
[data-placeholder] { }
```

---

## Tailwind Animation Classes

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
}
```

---

## Best Practices

### DO

```tsx
// Use asChild to compose with your own components
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>

// Use Portal for overlays
<Dialog.Portal>
  <Dialog.Overlay />
  <Dialog.Content />
</Dialog.Portal>

// Handle focus properly
<Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>

// Use data attributes for styling
className="data-[state=checked]:bg-blue-600"
```

### DON'T

```tsx
// Don't forget accessibility
// Always include proper labels and descriptions

// Don't skip Portal for overlays (causes z-index issues)
<Dialog.Overlay />  // Without Portal - BAD

// Don't ignore keyboard navigation
// Radix handles this, but test it
```

---

## Available Primitives

**Overlay:** Dialog, Alert Dialog, Popover, Hover Card, Tooltip, Context Menu, Dropdown Menu
**Forms:** Checkbox, Radio Group, Select, Switch, Slider, Toggle, Toggle Group
**Navigation:** Tabs, Navigation Menu, Menubar
**Layout:** Accordion, Collapsible, Scroll Area, Separator
**Utility:** Avatar, Aspect Ratio, Label, Progress, Toolbar, Visually Hidden

---

**Last Updated:** 2025-12-04
**Radix UI Version:** Latest
