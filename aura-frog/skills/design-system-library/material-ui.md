# Material UI (MUI) - Implementation Guide

**Design System:** Material UI v5+
**Based On:** Google Material Design 3
**Platforms:** React, Next.js
**Package:** `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`

---

## Installation

```bash
# Core
npm install @mui/material @emotion/react @emotion/styled

# Icons
npm install @mui/icons-material

# Data Grid (tables)
npm install @mui/x-data-grid

# Date Pickers
npm install @mui/x-date-pickers dayjs

# Next.js specific
npm install @mui/material-nextjs @emotion/cache
```

---

## Theme Setup

### Basic Theme Configuration

```typescript
// theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Disable uppercase
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // 1 unit = 8px
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
```

### Theme Provider Setup

```tsx
// app/providers.tsx (Next.js App Router)
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

---

## Component Patterns

### Buttons

```tsx
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

// Primary button
<Button variant="contained" color="primary">
  Save
</Button>

// Secondary/outlined
<Button variant="outlined" color="secondary">
  Cancel
</Button>

// Text button
<Button variant="text">Learn More</Button>

// With icon
<Button variant="contained" startIcon={<SaveIcon />}>
  Save
</Button>

// Loading state
<LoadingButton
  loading={isSubmitting}
  loadingPosition="start"
  startIcon={<SaveIcon />}
  variant="contained"
>
  Save
</LoadingButton>

// Icon button
<IconButton color="primary" aria-label="delete">
  <DeleteIcon />
</IconButton>
```

### Forms

```tsx
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Text input
<TextField
  label="Email"
  type="email"
  variant="outlined"
  fullWidth
  required
  error={!!errors.email}
  helperText={errors.email?.message}
  {...register('email')}
/>

// Select
<FormControl fullWidth>
  <InputLabel id="role-label">Role</InputLabel>
  <Select
    labelId="role-label"
    label="Role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <MenuItem value="admin">Admin</MenuItem>
    <MenuItem value="user">User</MenuItem>
    <MenuItem value="guest">Guest</MenuItem>
  </Select>
</FormControl>

// Checkbox
<FormControlLabel
  control={<Checkbox checked={agreed} onChange={handleChange} />}
  label="I agree to the terms"
/>
```

### Cards

```tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

<Card sx={{ maxWidth: 345 }}>
  <CardMedia
    component="img"
    height="140"
    image="/image.jpg"
    alt="Description"
  />
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      Card Title
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Card description goes here with supporting text.
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Share</Button>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>
```

### Data Table (MUI X)

```tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 250 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'Active' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box>
        <IconButton size="small"><EditIcon /></IconButton>
        <IconButton size="small"><DeleteIcon /></IconButton>
      </Box>
    ),
  },
];

<DataGrid
  rows={rows}
  columns={columns}
  initialState={{
    pagination: { paginationModel: { pageSize: 10 } },
  }}
  pageSizeOptions={[5, 10, 25]}
  checkboxSelection
  disableRowSelectionOnClick
/>
```

### Dialogs/Modals

```tsx
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to proceed?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm} variant="contained" color="primary">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

### Navigation

```tsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// AppBar
<AppBar position="fixed">
  <Toolbar>
    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      App Name
    </Typography>
    <IconButton color="inherit">
      <AccountCircle />
    </IconButton>
  </Toolbar>
</AppBar>

// Drawer
<Drawer
  variant="permanent"
  sx={{
    width: 240,
    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
  }}
>
  <Toolbar />
  <List>
    {menuItems.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton selected={item.active}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
</Drawer>
```

---

## Styling Approaches

### sx Prop (Recommended)

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2, // theme.spacing(2) = 16px
    p: 3,   // padding: 24px
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
    '&:hover': {
      boxShadow: 3,
    },
  }}
>
  <Typography variant="h6">Title</Typography>
</Box>
```

### styled() API

```tsx
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  transition: theme.transitions.create(['box-shadow', 'transform']),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));
```

---

## Best Practices

### DO

```tsx
// Use theme values
<Box sx={{ p: 2, gap: 2 }} />

// Use color tokens
<Typography color="text.secondary" />

// Use variants
<Button variant="contained" />

// Responsive values
<Box sx={{ display: { xs: 'none', md: 'block' } }} />
```

### DON'T

```tsx
// Avoid hardcoded values
<Box style={{ padding: '16px' }} />  // BAD

// Avoid inline colors
<Typography style={{ color: '#666' }} />  // BAD

// Avoid !important
sx={{ color: 'red !important' }}  // BAD
```

---

## Responsive Design

```tsx
// Breakpoints: xs, sm, md, lg, xl
<Box
  sx={{
    width: {
      xs: '100%',    // mobile
      sm: '50%',     // tablet
      md: '33.33%',  // desktop
    },
    display: {
      xs: 'none',
      md: 'block',
    },
  }}
/>

// Grid
import Grid from '@mui/material/Grid';

<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>
    <Card>...</Card>
  </Grid>
</Grid>
```

---

## Dark Mode

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}
```

---

## Common Imports Cheatsheet

```tsx
// Layout
import { Box, Container, Stack, Grid } from '@mui/material';

// Typography
import { Typography } from '@mui/material';

// Inputs
import { TextField, Select, Checkbox, Radio, Switch } from '@mui/material';

// Buttons
import { Button, IconButton, Fab } from '@mui/material';

// Navigation
import { AppBar, Toolbar, Drawer, Tabs, Tab } from '@mui/material';

// Surfaces
import { Card, Paper, Accordion } from '@mui/material';

// Feedback
import { Dialog, Snackbar, Alert, CircularProgress } from '@mui/material';

// Data Display
import { Table, List, Chip, Avatar, Badge } from '@mui/material';

// Icons
import { Add, Delete, Edit, Save, Close } from '@mui/icons-material';
```

---

**Last Updated:** 2025-12-04
**MUI Version:** 5.x / 6.x
