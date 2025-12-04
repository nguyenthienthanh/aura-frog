# Headless UI - Implementation Guide

**Design System:** Headless UI
**Type:** Headless UI Component Library
**Platforms:** React, Vue
**Package:** `@headlessui/react`, `@headlessui/vue`
**From:** Tailwind Labs

---

## Key Concept

Headless UI provides completely unstyled, fully accessible UI components designed to integrate with Tailwind CSS. Unlike Radix, it's more opinionated about transitions and comes from Tailwind Labs.

---

## Installation

```bash
# React
npm install @headlessui/react

# Vue
npm install @headlessui/vue
```

---

## Component Patterns (React + Tailwind)

### Dialog (Modal)

```tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4">{children}</div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

### Menu (Dropdown)

```tsx
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export function Dropdown({ items }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
        Options
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="p-1">
            {items.map((item) => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                  >
                    {item.icon && (
                      <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                    )}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

// Usage
<Dropdown
  items={[
    { label: 'Edit', icon: PencilIcon, onClick: handleEdit },
    { label: 'Duplicate', icon: DocumentDuplicateIcon, onClick: handleDuplicate },
    { label: 'Delete', icon: TrashIcon, onClick: handleDelete },
  ]}
/>
```

### Listbox (Select)

```tsx
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export function Select({ options, value, onChange, label }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </Listbox.Label>
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <span className="block truncate">{value?.name || 'Select option'}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

// Usage
const [selected, setSelected] = useState(options[0]);
<Select
  label="Assign to"
  options={options}
  value={selected}
  onChange={setSelected}
/>
```

### Combobox (Autocomplete)

```tsx
import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export function Autocomplete({ options, value, onChange, label }) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <Combobox.Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </Combobox.Label>
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            displayValue={(option) => option?.name}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
            {filtered.length === 0 && query !== '' ? (
              <div className="px-4 py-2 text-gray-500">Nothing found.</div>
            ) : (
              filtered.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : ''}`}>
                        {option.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
```

### Tabs

```tsx
import { Tab } from '@headlessui/react';

export function Tabs({ tabs }) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
               ${
                 selected
                   ? 'bg-white text-blue-700 shadow'
                   : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
               }`
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, idx) => (
          <Tab.Panel
            key={idx}
            className="rounded-xl bg-white p-4 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

// Usage
<Tabs
  tabs={[
    { label: 'My Account', content: <AccountPanel /> },
    { label: 'Company', content: <CompanyPanel /> },
    { label: 'Team Members', content: <TeamPanel /> },
  ]}
/>
```

### Switch (Toggle)

```tsx
import { Switch } from '@headlessui/react';
import { useState } from 'react';

export function Toggle({ label, enabled, onChange }) {
  return (
    <Switch.Group>
      <div className="flex items-center gap-3">
        <Switch
          checked={enabled}
          onChange={onChange}
          className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'}
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${enabled ? 'translate-x-6' : 'translate-x-1'}
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
        <Switch.Label className="text-sm text-gray-700">{label}</Switch.Label>
      </div>
    </Switch.Group>
  );
}
```

### Disclosure (Accordion)

```tsx
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export function Accordion({ items }) {
  return (
    <div className="w-full space-y-2">
      {items.map((item) => (
        <Disclosure key={item.title}>
          {({ open }) => (
            <div className="rounded-lg border border-gray-200">
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50">
                <span>{item.title}</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-gray-500 transition-transform`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 py-3 text-sm text-gray-600">
                  {item.content}
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
```

### Popover

```tsx
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function PopoverMenu({ trigger, children }) {
  return (
    <Popover className="relative">
      <Popover.Button className="outline-none">{trigger}</Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
            <div className="relative bg-white p-4">{children}</div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
```

### Radio Group

```tsx
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

export function RadioCards({ options, value, onChange, label }) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <RadioGroup.Label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </RadioGroup.Label>
      <div className="space-y-2">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.value}
            value={option}
            className={({ checked }) =>
              `${checked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}
               relative flex cursor-pointer rounded-lg border px-4 py-3 focus:outline-none`
            }
          >
            {({ checked }) => (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`font-medium ${
                        checked ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {option.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={`inline ${
                        checked ? 'text-blue-700' : 'text-gray-500'
                      }`}
                    >
                      {option.description}
                    </RadioGroup.Description>
                  </div>
                </div>
                {checked && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
```

---

## Transition Component

Headless UI provides a `Transition` component for animations:

```tsx
import { Transition } from '@headlessui/react';

<Transition
  show={isShowing}
  enter="transition-opacity duration-150"
  enterFrom="opacity-0"
  enterTo="opacity-100"
  leave="transition-opacity duration-150"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
  <div>Content</div>
</Transition>

// With Fragment (for multiple children)
<Transition
  as={Fragment}
  show={isShowing}
  enter="..."
>
  <div>...</div>
</Transition>
```

---

## Render Props Pattern

All Headless UI components use render props to expose state:

```tsx
<Menu.Item>
  {({ active, disabled }) => (
    <button className={active ? 'bg-blue-500' : ''}>
      Menu Item
    </button>
  )}
</Menu.Item>

<Listbox.Option>
  {({ active, selected }) => (
    <div className={`${active ? 'bg-blue-100' : ''} ${selected ? 'font-bold' : ''}`}>
      Option
    </div>
  )}
</Listbox.Option>
```

---

## Best Practices

### DO

```tsx
// Use Transition for smooth animations
<Transition enter="..." leave="...">

// Use Fragment to avoid extra DOM elements
<Transition as={Fragment}>

// Handle keyboard navigation (built-in)
// Components are accessible by default

// Use render props for dynamic styling
{({ active }) => <button className={active ? '...' : '...'}>}
```

### DON'T

```tsx
// Don't forget to import Fragment
// import { Fragment } from 'react'

// Don't use inline styles when Tailwind works
style={{ backgroundColor: active ? 'blue' : 'white' }}  // BAD
```

---

## Available Components

**Menu & Selection:** Menu, Listbox, Combobox, Radio Group
**Overlay:** Dialog, Popover
**Layout:** Disclosure, Tab
**Forms:** Switch
**Utility:** Transition, FocusTrap, Portal

---

**Last Updated:** 2025-12-04
**Headless UI Version:** 2.x
