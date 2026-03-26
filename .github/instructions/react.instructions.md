---
applyTo: "copilot-demo.Web.React/**/*.{ts,tsx,js,jsx}"
description: "React best practices and patterns for TypeScript components, TanStack Query, React Hook Form, Tailwind CSS, and shadcn/ui. Use when: creating React components, API integrations, forms, styling, or refactoring frontend code."
---

# React Project Instructions

## Stack

- **React 19** with **TypeScript 5.9**
- **Vite 8** — dev server and build tool
- **TanStack Query v5** — server state management
- **React Hook Form 7** + **Zod 4** — form validation
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling
- **shadcn/ui** — Radix UI component primitives with CVA variants
- **Sonner** — toast notifications

---

## Code Conventions

### General TypeScript

- **Strict mode enabled** — all nullable types must be explicitly handled
- **Use `type`** for simple aliases, `interface` for objects that may be extended
- **Prefer `const`** for all variables unless mutation is required
- **Arrow functions** for components and inline callbacks
- **Template literals** for string interpolation
- **Optional chaining** and **nullish coalescing** for safe property access

### Components

- **Functional components only** — never use class components
- **Named exports** for components (not default exports, except for `App.tsx` and page components)
- **Props interface** defined immediately before the component:
  ```tsx
  interface ProductCardProps {
    product: ProductDto
    onEdit: (id: string) => void
    className?: string
  }

  export function ProductCard({ product, onEdit, className }: ProductCardProps) {
    // ...
  }
  ```
- **Destructure props** in the function signature
- **`children` type** — use `React.ReactNode` for components that accept children
- **Default props** — use default parameter values, not `Component.defaultProps`
- **Event handlers** — name as `handle<Event>` (e.g., `handleClick`, `handleSubmit`)
- **Callback props** — name as `on<Event>` (e.g., `onClick`, `onSubmit`, `onOpenChange`)

### Imports

- **Absolute imports** using `@/` alias for all internal modules:
  ```tsx
  import { Button } from '@/components/ui/button'
  import { useProducts } from '@/hooks/useProducts'
  import type { ProductDto } from '@/api/types'
  ```
- **Import order**:
  1. React and external packages
  2. Internal components and hooks (using `@/` alias)
  3. Types (using `import type`)
  4. Relative imports (if unavoidable)
- **Type-only imports** — always use `import type` for types and interfaces
- **Group imports** — separate groups with a blank line

### File Organization

```
src/
├── api/              ← API client functions + types
│   ├── products.ts   ← Typed fetch functions
│   └── types.ts      ← DTOs and request/response types
├── components/
│   ├── <feature>/    ← Feature-specific components (e.g., products/)
│   └── ui/           ← shadcn/ui primitives (button, dialog, etc.)
├── hooks/            ← Custom React hooks
├── layouts/          ← Layout components (AppLayout, etc.)
├── lib/              ← Utilities (utils.ts with `cn` helper)
└── pages/            ← Top-level page components
```

**Rules**:
- One component per file (except tightly coupled components)
- Components in feature folders (`components/products/`) should be specific to that feature
- Shared/reusable components go in `components/` root or appropriate subfolder
- API functions are grouped by domain (`api/products.ts`, `api/orders.ts`)

---

## TanStack Query Patterns

### Custom Hooks

Wrap all TanStack Query hooks in custom hooks in `hooks/`:

```tsx
// hooks/useProducts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listProducts, createProduct } from '@/api/products'
import type { CreateProductRequest } from '@/api/types'

const PRODUCTS_KEY = ['products'] as const

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: listProducts,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  })
}
```

**Rules**:
- Query keys are `const` arrays using `as const`
- Mutations invalidate related queries via `queryClient.invalidateQueries()`
- Hook names match the API function names (`useListProducts`, `useCreateProduct`)
- Type the mutation function parameters explicitly

### Component Usage

```tsx
export function ProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const createMutation = useCreateProduct()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <button onClick={() => createMutation.mutate({ name: 'New', price: 10 })}>
        Add Product
      </button>
      {products?.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

**Rules**:
- Always destructure `data`, `isLoading`, `error` from query hooks
- Use optional chaining when accessing `data` (it may be `undefined`)
- Check `isLoading` and `error` states before rendering data
- Access mutation state via `mutation.isPending`, `mutation.isError`, etc.

---

## Forms with React Hook Form + Zod

### Schema-First Validation

Define Zod schema at the top of the component file:

```tsx
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0.01, {
      message: 'Price must be at least $0.01',
    }),
})

type FormValues = z.infer<typeof schema>
```

### useForm Setup

```tsx
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', price: '' },
})
```

**Rules**:
- Use `zodResolver` for all forms
- Type `FormValues` using `z.infer<typeof schema>`
- Always provide `defaultValues`
- Use `reset()` to clear form or populate for editing

### Form JSX

```tsx
<form onSubmit={handleSubmit(onValid)} className="space-y-5">
  <div className="space-y-1.5">
    <Label htmlFor="name">Product Name</Label>
    <Input id="name" placeholder="e.g. Wireless Headphones" {...register('name')} />
    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
  </div>
  <Button type="submit" disabled={isLoading}>
    {isLoading ? 'Saving…' : 'Save'}
  </Button>
</form>
```

**Rules**:
- Spread `{...register('fieldName')}` on `Input` components
- Display validation errors conditionally below each field
- Disable submit button during mutation (`isLoading` or `mutation.isPending`)
- Use `handleSubmit(onValid)` wrapper for form submission

---

## API Client Layer

### Typed Functions

All API functions are in `api/<domain>.ts` and return strongly typed promises:

```tsx
// api/products.ts
import type { ProductDto, CreateProductRequest } from './types'

const BASE = '/products'

export async function listProducts(): Promise<ProductDto[]> {
  const res = await fetch(BASE)
  return handleResponse<ProductDto[]>(res)
}

export async function createProduct(data: CreateProductRequest): Promise<ProductDto> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<ProductDto>(res)
}
```

### Error Handling

```tsx
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
```

**Rules**:
- All API functions are `async` and return typed `Promise<T>`
- Base URLs are constants (`const BASE = '/products'`)
- Use a shared `handleResponse<T>()` helper for error handling
- Throw errors — TanStack Query handles them via `error` state
- Type request and response bodies with DTOs from `api/types.ts`

---

## Styling with Tailwind CSS

### Utility Classes

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
  <Button className="ml-auto">Add Product</Button>
</div>
```

**Rules**:
- Use utility classes inline via `className` prop
- Group related utilities logically (layout → spacing → colors → typography)
- Use Tailwind's color scale (`gray-900`, `indigo-600`) — no hex colors
- Responsive prefixes (`sm:`, `md:`, `lg:`) for breakpoints
- State variants (`hover:`, `focus:`, `disabled:`)

### Conditional Classes with `cn()`

```tsx
import { cn } from '@/lib/utils'

<Button
  className={cn(
    'px-4 py-2',
    isActive && 'bg-indigo-600 text-white',
    !isActive && 'bg-gray-100 text-gray-700'
  )}
/>
```

**Rules**:
- Import `cn` from `@/lib/utils` (it's `clsx` + `tailwind-merge`)
- Use `cn()` for conditional classes — never use string templates for this
- Base classes first, then conditional classes

---

## shadcn/ui Component Patterns

### Component Structure

All shadcn/ui components follow this pattern:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'base-classes', // shared classes
  {
    variants: {
      variant: { default: '...', destructive: '...' },
      size: { default: '...', sm: '...', lg: '...' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Rules**:
- Use `cva` (Class Variance Authority) for variant-based styling
- Extend native HTML element props (`React.ButtonHTMLAttributes<HTMLButtonElement>`)
- Use `React.forwardRef` to allow ref forwarding
- Export both the component and the variants function
- Set `displayName` for better DevTools debugging
- Support `asChild` prop for polymorphic rendering (via Radix `Slot`)

### Customization

When customizing shadcn/ui components:
- Modify the `cva` variants, **not** the base classes
- Add new variants to the variants object
- Override via `className` prop when using the component
- Never modify `node_modules` — copy and edit in `components/ui/`

---

## React Router Patterns

### Route Definition

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router'

<BrowserRouter>
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/:id" element={<ProductDetailPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Rules**:
- Use `BrowserRouter` (not `HashRouter` or `Router`)
- Layout routes use `element={<AppLayout />}` without a `path`
- Nested routes render via `<Outlet />` in the layout
- Index route (`index` prop) matches the parent path

### Navigation

```tsx
import { Link, useNavigate } from 'react-router'

// Declarative
<Link to="/products" className="text-indigo-600 hover:underline">
  View Products
</Link>

// Programmatic
const navigate = useNavigate()
navigate('/products')
```

**Rules**:
- Prefer `<Link>` for declarative navigation
- Use `useNavigate()` for programmatic navigation after actions
- Relative paths work from the current route

---

## TypeScript Patterns

### Typing Props

```tsx
interface ProductCardProps {
  product: ProductDto
  onEdit?: (id: string) => void  // optional callback
  className?: string             // optional styling override
  children?: React.ReactNode     // optional children
}
```

### Typing Events

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
  // ...
}

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value)
}
```

### Importing Types from APIs

```tsx
// api/types.ts
export interface ProductDto {
  id: string
  name: string
  price: number
}

export interface CreateProductRequest {
  name: string
  price: number
}

// components/ProductCard.tsx
import type { ProductDto } from '@/api/types'
```

---

## State Management

### Local State

Use `useState` for component-local UI state:

```tsx
const [isOpen, setIsOpen] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
```

### Server State

Use TanStack Query for all server data (queries and mutations) — **never use `useState` + `useEffect` for fetching**.

### Derived State

Compute derived values inline — don't store in state:

```tsx
const products = useProducts()
const inStockProducts = products.data?.filter((p) => p.inStock) ?? []  // ✅
```

**Avoid**:
```tsx
const [inStockProducts, setInStockProducts] = useState([])  // ❌
useEffect(() => {
  setInStockProducts(products.data?.filter(p => p.inStock) ?? [])
}, [products.data])
```

---

## Performance

### Memoization

Only use `useMemo` and `useCallback` for expensive operations or to prevent child re-renders:

```tsx
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.name.localeCompare(b.name)),
  [products]
)

const handleEdit = useCallback((id: string) => {
  // ...
}, [/* dependencies */])
```

**Rules**:
- Don't memoize by default — React is fast
- Use when profiling shows a performance issue
- Always specify dependencies correctly

### Key Prop

Always provide stable `key` when mapping over arrays:

```tsx
{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
```

**Never use index as key** unless the list is static and items have no IDs.

---

## Error Handling

### Query Errors

```tsx
const { data, isLoading, error } = useProducts()

if (error) {
  return <div className="text-red-600">Error: {error.message}</div>
}
```

### Mutation Errors

```tsx
const mutation = useCreateProduct()

mutation.mutate(data, {
  onError: (error) => {
    toast.error(`Failed to create product: ${error.message}`)
  },
  onSuccess: () => {
    toast.success('Product created successfully')
  },
})
```

### Toast Notifications

Use **Sonner** for user feedback:

```tsx
import { toast } from 'sonner'

toast.success('Product saved!')
toast.error('Failed to save product')
toast.loading('Saving...')
```

---

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<form>`)
- Include `aria-label` for icon-only buttons
- Ensure keyboard navigation works (focus states, tab order)
- Pair `<Label>` with form `<Input>` using `htmlFor` and `id`
- Use `<Dialog>` from shadcn/ui for accessible modals

---

## Testing Readiness

While tests aren't implemented yet, structure code for testability:
- Pure functions for utilities and helpers
- API functions are easily mockable
- Components accept data via props (not global state)
- Separate UI from business logic

---

## Anti-Patterns to Avoid

❌ **Don't fetch in `useEffect`** — use TanStack Query  
❌ **Don't use `any` type** — always type everything  
❌ **Don't mutate props or state** — treat as immutable  
❌ **Don't use `var`** — use `const` or `let`  
❌ **Don't use class components** — functional only  
❌ **Don't use default exports for components** (except pages and `App.tsx`)  
❌ **Don't inline styles** — use Tailwind classes  
❌ **Don't copy-paste shadcn components** — customize variants instead  

---

## Example Component

A complete example following all conventions:

```tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ProductFormDialog } from '@/components/products/ProductFormDialog'
import { useProducts, useCreateProduct } from '@/hooks/useProducts'
import type { ProductDto } from '@/api/types'

interface ProductsPageProps {
  className?: string
}

export function ProductsPage({ className }: ProductsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: products, isLoading, error } = useProducts()
  const createMutation = useCreateProduct()

  function handleCreate(name: string, price: number) {
    createMutation.mutate(
      { name, price },
      {
        onSuccess: () => {
          toast.success('Product created!')
          setIsDialogOpen(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">Error: {error.message}</div>

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
      </div>

      <div className="space-y-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}
```

---

## Summary

Follow these principles:
✅ **TypeScript strict mode** — type everything  
✅ **Functional components** with hooks  
✅ **TanStack Query** for server state  
✅ **React Hook Form + Zod** for forms  
✅ **Tailwind utilities** for styling  
✅ **shadcn/ui + CVA** for component variants  
✅ **Feature-based organization** for components  
✅ **Custom hooks** wrapping TanStack Query  
✅ **Typed API layer** with error handling  
✅ **Absolute imports** using `@/` alias  
