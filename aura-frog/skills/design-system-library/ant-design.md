# Ant Design - Implementation Guide

**Design System:** Ant Design v5+
**Based On:** Ant Design Language
**Platforms:** React, Vue (via ant-design-vue)
**Package:** `antd`, `@ant-design/icons`, `@ant-design/pro-components`

---

## Installation

```bash
# Core
npm install antd

# Icons
npm install @ant-design/icons

# Pro Components (enterprise features)
npm install @ant-design/pro-components

# Charts
npm install @ant-design/charts

# For Next.js
npm install @ant-design/nextjs-registry
```

---

## Theme Setup

### Basic Configuration

```tsx
// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // Background colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',

    // Text colors
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextDisabled: 'rgba(0, 0, 0, 0.25)',

    // Border
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,

    // Spacing & sizing
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Control height
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // Spacing
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,

    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
    },
    Input: {
      borderRadius: 6,
    },
  },
};
```

### ConfigProvider Setup

```tsx
// app/providers.tsx
'use client';

import { ConfigProvider, App } from 'antd';
import { themeConfig } from '@/theme/themeConfig';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={themeConfig}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
```

### Next.js App Router Setup

```tsx
// app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

---

## Component Patterns

### Buttons

```tsx
import { Button, Space } from 'antd';
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

// Primary
<Button type="primary">Primary</Button>

// Default
<Button>Default</Button>

// Dashed
<Button type="dashed">Dashed</Button>

// Text
<Button type="text">Text</Button>

// Link
<Button type="link">Link</Button>

// Danger
<Button danger>Danger</Button>
<Button type="primary" danger>Primary Danger</Button>

// With icons
<Button type="primary" icon={<PlusOutlined />}>Add New</Button>

// Loading
<Button type="primary" loading={isLoading}>Submit</Button>

// Icon only
<Button type="text" icon={<DeleteOutlined />} />

// Block (full width)
<Button type="primary" block>Full Width</Button>
```

### Forms

```tsx
import { Form, Input, Select, Checkbox, Radio, DatePicker, Button, message } from 'antd';

const [form] = Form.useForm();

<Form
  form={form}
  layout="vertical"
  onFinish={async (values) => {
    console.log(values);
    message.success('Form submitted!');
  }}
  onFinishFailed={({ errorFields }) => {
    message.error('Please check the form');
  }}
>
  <Form.Item
    label="Email"
    name="email"
    rules={[
      { required: true, message: 'Please input your email!' },
      { type: 'email', message: 'Please enter a valid email!' },
    ]}
  >
    <Input placeholder="Enter email" />
  </Form.Item>

  <Form.Item
    label="Password"
    name="password"
    rules={[
      { required: true, message: 'Please input your password!' },
      { min: 8, message: 'Password must be at least 8 characters!' },
    ]}
  >
    <Input.Password placeholder="Enter password" />
  </Form.Item>

  <Form.Item label="Role" name="role" rules={[{ required: true }]}>
    <Select placeholder="Select role">
      <Select.Option value="admin">Admin</Select.Option>
      <Select.Option value="user">User</Select.Option>
      <Select.Option value="guest">Guest</Select.Option>
    </Select>
  </Form.Item>

  <Form.Item label="Birth Date" name="birthDate">
    <DatePicker style={{ width: '100%' }} />
  </Form.Item>

  <Form.Item name="agree" valuePropName="checked">
    <Checkbox>I agree to the terms and conditions</Checkbox>
  </Form.Item>

  <Form.Item>
    <Space>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
      <Button htmlType="button" onClick={() => form.resetFields()}>
        Reset
      </Button>
    </Space>
  </Form.Item>
</Form>
```

### Table

```tsx
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const columns: ColumnsType<User> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" size="small">Edit</Button>
        <Popconfirm
          title="Delete user?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" danger size="small">Delete</Button>
        </Popconfirm>
      </Space>
    ),
  },
];

<Table
  columns={columns}
  dataSource={users}
  rowKey="id"
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} items`,
  }}
  loading={isLoading}
/>
```

### Modal

```tsx
import { Modal, Button, Form, Input } from 'antd';

const [isModalOpen, setIsModalOpen] = useState(false);
const [form] = Form.useForm();

<Button type="primary" onClick={() => setIsModalOpen(true)}>
  Open Modal
</Button>

<Modal
  title="Create User"
  open={isModalOpen}
  onOk={() => form.submit()}
  onCancel={() => {
    form.resetFields();
    setIsModalOpen(false);
  }}
  confirmLoading={isSubmitting}
  okText="Create"
  cancelText="Cancel"
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

### Cards

```tsx
import { Card, Avatar, Typography } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

// Basic card
<Card title="Card Title" extra={<a href="#">More</a>} style={{ width: 300 }}>
  <p>Card content</p>
</Card>

// Card with cover and meta
<Card
  style={{ width: 300 }}
  cover={<img alt="example" src="/image.jpg" />}
  actions={[
    <SettingOutlined key="setting" />,
    <EditOutlined key="edit" />,
    <EllipsisOutlined key="ellipsis" />,
  ]}
>
  <Meta
    avatar={<Avatar src="/avatar.jpg" />}
    title="Card title"
    description="This is the description"
  />
</Card>

// Loading state
<Card loading={true} style={{ width: 300 }}>
  <Meta title="Card title" description="Description" />
</Card>
```

### Layout

```tsx
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

<Layout style={{ minHeight: '100vh' }}>
  <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
    <div className="logo" />
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      items={[
        { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '2', icon: <UserOutlined />, label: 'Users' },
        { key: '3', icon: <SettingOutlined />, label: 'Settings' },
      ]}
    />
  </Sider>
  <Layout>
    <Header style={{ padding: 0, background: '#fff' }} />
    <Content style={{ margin: '16px' }}>
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        Content
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      My App &copy; 2024
    </Footer>
  </Layout>
</Layout>
```

---

## Pro Components (Enterprise)

```tsx
import {
  ProTable,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProLayout,
  PageContainer,
} from '@ant-design/pro-components';

// ProTable - Advanced table with built-in features
<ProTable
  columns={columns}
  request={async (params) => {
    const data = await fetchData(params);
    return { data: data.list, total: data.total };
  }}
  rowKey="id"
  search={{ labelWidth: 'auto' }}
  pagination={{ pageSize: 10 }}
  toolBarRender={() => [
    <Button key="add" type="primary" icon={<PlusOutlined />}>
      Add New
    </Button>,
  ]}
/>

// ProForm - Advanced form
<ProForm
  onFinish={async (values) => {
    await handleSubmit(values);
    message.success('Submitted successfully');
  }}
>
  <ProFormText
    name="name"
    label="Name"
    rules={[{ required: true }]}
  />
  <ProFormSelect
    name="status"
    label="Status"
    options={[
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]}
  />
</ProForm>
```

---

## Notification & Messages

```tsx
import { message, notification, Modal } from 'antd';
import { App } from 'antd';

// Message (toast)
message.success('Success!');
message.error('Error!');
message.warning('Warning!');
message.loading('Loading...');

// Notification
notification.success({
  message: 'Success',
  description: 'Your action was successful.',
  placement: 'topRight',
});

// Confirmation modal
Modal.confirm({
  title: 'Are you sure?',
  content: 'This action cannot be undone.',
  okText: 'Yes',
  cancelText: 'No',
  onOk: () => handleDelete(),
});

// Using App context (recommended in v5)
const { message, notification, modal } = App.useApp();
message.success('Works with context!');
```

---

## Best Practices

### DO

```tsx
// Use token values for custom styling
const token = theme.useToken();
<div style={{ padding: token.paddingMD, color: token.colorText }}>

// Use Form with form instance
const [form] = Form.useForm();

// Use Space for consistent gaps
<Space size="middle">
  <Button>One</Button>
  <Button>Two</Button>
</Space>

// Use Flex for layouts (v5.15+)
<Flex gap="middle" wrap="wrap">
  <Card>...</Card>
</Flex>
```

### DON'T

```tsx
// Avoid hardcoded colors
<Button style={{ backgroundColor: '#1890ff' }} />  // BAD

// Avoid margin hacks
<Button style={{ marginRight: 8 }} />  // BAD, use Space

// Don't skip form validation
<Form onFinish={handleSubmit}>  // Make sure rules are defined
```

---

## Dark Mode

```tsx
import { ConfigProvider, theme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = theme;

<ConfigProvider
  theme={{
    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
    },
  }}
>
  {children}
</ConfigProvider>
```

---

## Common Imports

```tsx
// Layout
import { Layout, Space, Flex, Divider, Row, Col } from 'antd';

// Navigation
import { Menu, Breadcrumb, Pagination, Steps, Tabs } from 'antd';

// Data Entry
import { Form, Input, Select, Checkbox, Radio, DatePicker, Upload } from 'antd';

// Data Display
import { Table, List, Card, Descriptions, Tree, Avatar, Tag } from 'antd';

// Feedback
import { Modal, Drawer, message, notification, Progress, Spin } from 'antd';

// Icons
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
```

---

**Last Updated:** 2025-12-04
**Ant Design Version:** 5.x
