# Bootstrap - Implementation Guide

**Design System:** Bootstrap v5.3+
**Type:** CSS Framework
**Platforms:** All (React, Vue, Angular, vanilla HTML)
**Package:** `bootstrap`, `react-bootstrap`, `bootstrap-vue-next`

---

## Installation

### Vanilla / General

```bash
npm install bootstrap
```

### React (react-bootstrap)

```bash
npm install react-bootstrap bootstrap
```

### Vue (bootstrap-vue-next)

```bash
npm install bootstrap-vue-next bootstrap
```

---

## Setup

### React

```tsx
// main.tsx or App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

// Optional: Import Bootstrap JS for dropdowns, modals, etc.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### With react-bootstrap

```tsx
// main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import { Button, Container, Row, Col } from 'react-bootstrap';
```

### Vue

```typescript
// main.ts
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
```

---

## Customization (SCSS)

```scss
// custom.scss

// Override variables before importing Bootstrap
$primary: #0d6efd;
$secondary: #6c757d;
$success: #198754;
$danger: #dc3545;
$warning: #ffc107;
$info: #0dcaf0;

$font-family-sans-serif: 'Inter', system-ui, sans-serif;
$border-radius: 0.5rem;
$border-radius-lg: 0.75rem;
$border-radius-sm: 0.25rem;

$spacer: 1rem;

// Import Bootstrap
@import 'bootstrap/scss/bootstrap';
```

---

## Component Patterns

### Buttons

```tsx
import { Button, ButtonGroup } from 'react-bootstrap';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="light">Light</Button>
<Button variant="dark">Dark</Button>

// Outline variants
<Button variant="outline-primary">Outline Primary</Button>

// Sizes
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>

// States
<Button disabled>Disabled</Button>
<Button active>Active</Button>

// With spinner (loading)
<Button disabled>
  <Spinner size="sm" animation="border" className="me-2" />
  Loading...
</Button>

// Button group
<ButtonGroup>
  <Button variant="outline-primary">Left</Button>
  <Button variant="outline-primary">Middle</Button>
  <Button variant="outline-primary">Right</Button>
</ButtonGroup>
```

### Forms

```tsx
import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';

// Basic form
<Form onSubmit={handleSubmit}>
  <Form.Group className="mb-3" controlId="email">
    <Form.Label>Email address</Form.Label>
    <Form.Control
      type="email"
      placeholder="name@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      isInvalid={!!errors.email}
    />
    <Form.Control.Feedback type="invalid">
      {errors.email}
    </Form.Control.Feedback>
  </Form.Group>

  <Form.Group className="mb-3" controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Check
      type="checkbox"
      id="remember"
      label="Remember me"
    />
  </Form.Group>

  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>

// Floating labels
<FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
  <Form.Control type="email" placeholder="name@example.com" />
</FloatingLabel>

// Input group
<InputGroup className="mb-3">
  <InputGroup.Text>@</InputGroup.Text>
  <Form.Control placeholder="Username" />
</InputGroup>

// Select
<Form.Select>
  <option>Select option</option>
  <option value="1">One</option>
  <option value="2">Two</option>
</Form.Select>
```

### Cards

```tsx
import { Card, Button } from 'react-bootstrap';

// Basic card
<Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="/image.jpg" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>

// Card with header/footer
<Card>
  <Card.Header>Featured</Card.Header>
  <Card.Body>
    <Card.Title>Special title treatment</Card.Title>
    <Card.Text>Description text here.</Card.Text>
    <Button variant="primary">Action</Button>
  </Card.Body>
  <Card.Footer className="text-muted">2 days ago</Card.Footer>
</Card>

// Card group
<CardGroup>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</CardGroup>
```

### Modals

```tsx
import { Modal, Button } from 'react-bootstrap';

const [show, setShow] = useState(false);

<Button variant="primary" onClick={() => setShow(true)}>
  Open Modal
</Button>

<Modal show={show} onHide={() => setShow(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Modal content goes here.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShow(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSave}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

// Sizes
<Modal size="lg">Large</Modal>
<Modal size="sm">Small</Modal>
<Modal fullscreen>Fullscreen</Modal>
```

### Navigation

```tsx
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

<Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="/">Brand</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/" active>Home</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="/action1">Action</NavDropdown.Item>
          <NavDropdown.Item href="/action2">Another action</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/action3">Something else</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

// Dark navbar
<Navbar bg="dark" variant="dark" expand="lg">
```

### Layout

```tsx
import { Container, Row, Col } from 'react-bootstrap';

// Container
<Container>Full width until lg breakpoint</Container>
<Container fluid>Full width always</Container>
<Container fluid="md">Full width until md</Container>

// Grid
<Container>
  <Row>
    <Col>1 of 2</Col>
    <Col>2 of 2</Col>
  </Row>
  <Row>
    <Col xs={12} md={6} lg={4}>Responsive</Col>
    <Col xs={12} md={6} lg={8}>Columns</Col>
  </Row>
</Container>

// Gutter
<Row className="g-4">  {/* gap-4 */}
  <Col>...</Col>
</Row>
```

### Tables

```tsx
import { Table, Badge } from 'react-bootstrap';

<Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <Badge bg={user.active ? 'success' : 'secondary'}>
            {user.active ? 'Active' : 'Inactive'}
          </Badge>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

### Alerts & Toasts

```tsx
import { Alert, Toast, ToastContainer } from 'react-bootstrap';

// Alert
<Alert variant="success" dismissible onClose={() => setShow(false)}>
  <Alert.Heading>Success!</Alert.Heading>
  <p>Your action was successful.</p>
</Alert>

// Toast
<ToastContainer position="top-end" className="p-3">
  <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
    <Toast.Header>
      <strong className="me-auto">Notification</strong>
      <small>Just now</small>
    </Toast.Header>
    <Toast.Body>Hello, world!</Toast.Body>
  </Toast>
</ToastContainer>
```

---

## Utility Classes

### Spacing

```html
<!-- Margin -->
<div class="m-3">margin all sides</div>
<div class="mt-3">margin top</div>
<div class="mx-auto">center horizontally</div>

<!-- Padding -->
<div class="p-3">padding all sides</div>
<div class="py-4">padding y-axis</div>

<!-- Values: 0, 1, 2, 3, 4, 5 (0 = 0, 1 = 0.25rem, 5 = 3rem) -->
```

### Display & Flex

```html
<div class="d-flex justify-content-between align-items-center">
  <span>Left</span>
  <span>Right</span>
</div>

<div class="d-none d-md-block">Hidden on mobile</div>
<div class="d-md-none">Only on mobile</div>

<div class="flex-column flex-md-row">Stack on mobile, row on desktop</div>
```

### Colors

```html
<p class="text-primary">Primary text</p>
<p class="text-muted">Muted text</p>
<div class="bg-primary text-white">Primary background</div>
<div class="bg-light">Light background</div>
```

### Text

```html
<p class="fs-1">Font size 1 (largest)</p>
<p class="fs-6">Font size 6 (smallest)</p>
<p class="fw-bold">Bold text</p>
<p class="text-center">Centered text</p>
<p class="text-truncate">Truncated...</p>
```

---

## Responsive Breakpoints

- `xs`: < 576px
- `sm`: >= 576px
- `md`: >= 768px
- `lg`: >= 992px
- `xl`: >= 1200px
- `xxl`: >= 1400px

```tsx
// Usage
<Col xs={12} sm={6} md={4} lg={3}>Responsive column</Col>

<div className="d-none d-md-block">Hidden below md</div>
<div className="d-md-none">Visible only below md</div>
```

---

## Best Practices

### DO

```tsx
// Use utility classes for common styling
<div className="d-flex justify-content-between align-items-center p-3">

// Use variants consistently
<Button variant="primary">
<Alert variant="danger">

// Use responsive grid
<Row>
  <Col md={6}>Half on desktop</Col>
  <Col md={6}>Half on desktop</Col>
</Row>
```

### DON'T

```tsx
// Don't mix inline styles with Bootstrap classes
<div style={{ marginTop: '20px' }} className="mb-3">  // BAD

// Don't use arbitrary spacing values
<div style={{ padding: '17px' }}>  // BAD, use p-3 or p-4
```

---

## Common Imports (react-bootstrap)

```tsx
// Layout
import { Container, Row, Col, Stack } from 'react-bootstrap';

// Forms
import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';

// Navigation
import { Navbar, Nav, NavDropdown, Breadcrumb, Tabs, Tab } from 'react-bootstrap';

// Components
import { Card, Table, ListGroup, Accordion } from 'react-bootstrap';

// Overlay
import { Modal, Offcanvas, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';

// Feedback
import { Alert, Toast, Spinner, ProgressBar } from 'react-bootstrap';

// Content
import { Badge, Image, Figure, Carousel } from 'react-bootstrap';
```

---

**Last Updated:** 2025-12-04
**Bootstrap Version:** 5.3.x
