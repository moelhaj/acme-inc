# Copilot Instructions for Acme-Inc

## Project Overview

**Acme-Inc** is a Next.js-based project management application for developers. It features project and issue tracking with a Kanban board UI, user authentication, and real-time data management backed by PostgreSQL.

### Tech Stack

- **Framework**: Next.js 16 with React 19 (App Router, Server Components)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: PostgreSQL via `postgres` driver
- **UI Components**: Radix UI + shadcn custom components
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit (for Kanban board)
- **Package Manager**: pnpm

## Architecture & Data Flow

### Three-Layer Structure

1. **Server Actions** (`actions/`): "use server" functions that run on the server
    - Handle form submissions and data mutations
    - Return `State` objects with `errors` and `message` fields
    - Use Zod schemas for validation before DB operations
    - Call `revalidatePath()` to refresh cached data after mutations

2. **Components** (`app/` and `components/`): UI rendered as Server or Client Components
    - **Server Components**: Table views, layouts, data fetching (default)
    - **"use client"**: Interactive UI (Kanban, modals, forms, hooks)
    - Use Suspense boundaries with fallbacks for async data
    - Pass `searchParams` as Promise objects in page props

3. **Database**: PostgreSQL with typed schemas
    - User, Project, Issue entities with timestamps
    - Types defined in `lib/definitions.ts`
    - Direct SQL queries via `postgres` driver
    - Connection via `process.env.POSTGRES_URL`

### Critical Data Patterns

- **User Types**: `admin` | `user` (role-based)
- **Issue Status**: `"todo" | "in_progress" | "in_review" | "done"` (Kanban column mapping)
- **Issue Priority**: `"low" | "medium" | "high" | "urgent"`
- **Issue Type**: `"bug" | "feature" | "improvement"`
- Use `@/lib/definitions.ts` for type definitions and `Statuses`/`Priorities`/`IssueType` enums

## Key Workflows

### Build & Run

```bash
pnpm dev       # Start dev server (localhost:3000)
pnpm build     # Production build
pnpm start     # Run production server
pnpm lint      # ESLint check
```

### Form Handling Pattern

1. Define schema in `actions/` using Zod with validation messages
2. Create form in component with `useFormState` (Server Action pattern)
3. Handle `State.errors` object for field-level errors
4. After success, display `State.message` via Toaster
5. Call `revalidatePath("/path")` to refresh cached UI

Example: [actions/issues.tsx](actions/issues.tsx) → [app/projects/components/create-issue.tsx](app/projects/components/create-issue.tsx)

### Authentication

- Session stored in HTTP-only cookie with JWT (12-hour expiry)
- Auth helpers: `getSession()`, `encrypt()`, `decrypt()` in `lib/auth.ts`
- Sign in/out actions in `actions/auth.ts` use `bcryptjs` for password comparison
- No middleware file needed; layout loads session context

### Client-Side State Management

- **AppContext** hook (`hooks/use-app.tsx`): Pinned projects stored in localStorage
- **Kanban board**: Local state for column organization, DnD handled by @dnd-kit
- Use `useContext(AppContext)` to access pinned projects
- Safe localStorage handling with try/catch for private browsing

## UI & Styling Conventions

### Component Structure

- Use `components/ui/` for base components (button, card, dialog, etc.)
- Page-specific components in `app/[feature]/components/`
- All UI components accept `className` prop for Tailwind customization

### Tailwind Patterns

- Use `cn()` utility from `lib/utils.ts` to merge class names safely
- Component variants: Use `clsx` + `twMerge` pattern (see `cn()`)
- Spacing: Use `p-4`, `gap-4` for consistent padding/gaps
- Responsive: Add breakpoints for mobile (`xl:hidden` for desktop-only)
- Color system: Use Tailwind defaults (rose, yellow, indigo, green for statuses)

### Icons

- Import from `lucide-react` (e.g., `GripVertical`, `Activity`)
- Pair with components for affordances (drag handle, visual cues)

## Database & Server Action Conventions

### Query Pattern

```typescript
const result = await sql`SELECT * FROM table WHERE id=${id}`;
const item = result[0] as EntityType | undefined;
```

### Form State Type

```typescript
export type State = {
	errors?: Record<string, string[]>;
	message?: string | null;
};
```

### Validation & Error Handling

- Parse form data with Zod before DB access
- Return structured errors for client-side display
- Throw errors for unexpected failures (logged server-side)
- Always provide user-friendly error messages in `State`

## Common File Locations

| Purpose          | Location                                |
| ---------------- | --------------------------------------- |
| Type definitions | `lib/definitions.ts`                    |
| Auth utilities   | `lib/auth.ts`                           |
| Form actions     | `actions/issues.tsx`, `actions/auth.ts` |
| Page layouts     | `app/[feature]/page.tsx`                |
| UI components    | `components/ui/`                        |
| Page components  | `app/[feature]/components/`             |
| Hooks            | `hooks/use-*.tsx`                       |
| Utilities        | `lib/utils.ts`                          |
| Database queries | In-server action or async functions     |

## Development Notes

- **No API routes**: Data flows through Server Actions + Server Components
- **Path alias**: `@/` points to project root (configured in `tsconfig.json`)
- **Next.js 16 patterns**: Use `searchParams` as Promise in page props (RSC)
- **Timestamps**: Always include `created_at` and `updated_at` in schema (use ISO strings)
- **Environment**: Set `POSTGRES_URL` and `SECRET` in `.env.local`
