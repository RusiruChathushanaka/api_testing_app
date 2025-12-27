# AI Coding Instructions for API Testing App

## Project Overview

This is a modern API testing tool built with **Next.js 16 (App Router)**, **TypeScript 5**, **Tailwind CSS 4**, and **shadcn/ui**. It allows users to test REST APIs with features like request history, persistent storage via Supabase, and dark/light mode theming.

## Architecture & Component Structure

### Core Application Flow

- **Single-page app**: [app/page.tsx](app/page.tsx) renders the main `<ApiTester />` component
- **Monolithic state management**: [components/api-tester/api-tester.tsx](components/api-tester/api-tester.tsx) is the central component managing all state via React hooks (no external state management library)
- **Feature-based organization**: API tester components live in `components/api-tester/`, UI primitives in `components/ui/`, utilities in `lib/`

### Component Responsibilities

1. **ApiTester** (319 lines): Main container with all state (request config, response, history). Orchestrates child components and handles Supabase integration
2. **RequestPanel**: URL input, method selector, send button
3. **RequestTabs**: Tabbed interface for params, headers, body configuration
4. **ResponsePanel**: Displays status, timing, headers, formatted JSON body
5. **HistoryPanel**: Manages local (localStorage) and saved (Supabase) request history
6. **KeyValueEditor**: Reusable component for editing key-value pairs (params/headers) with enable/disable checkboxes

### Data Flow Pattern

```
User Input → ApiTester State → Child Components (via props)
                ↓
         sendRequest (lib/api-utils.ts)
                ↓
         Response → ApiTester State → ResponsePanel/History
                ↓
         Save to localStorage + optional Supabase
```

## Key Technical Patterns

### Client vs Server Components

- **ALL interactive components use `"use client"`** directive (Next.js 13+ App Router requirement)
- UI components from shadcn/ui are client components by default
- Server components only used for static layouts ([app/layout.tsx](app/layout.tsx))

### Type System ([lib/types.ts](lib/types.ts))

- Central type definitions: `HttpMethod`, `KeyValuePair`, `ApiRequest`, `ApiResponse`, `HistoryItem`
- **Important**: `KeyValuePair` includes an `enabled` boolean for toggling params/headers
- **HistoryItem** has optional `name` and `isSaved` flag to distinguish local vs Supabase history

### Supabase Integration ([lib/supabase.ts](lib/supabase.ts))

- **Graceful degradation**: App works without Supabase credentials (client is `null`)
- Check `if (supabase)` before any database operations
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Schema: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for table structure (`api_executions`)

### History Management Pattern

1. **Dual storage**: localStorage for last 50 local requests + Supabase for saved executions
2. **Load order**: Fetch Supabase first, then merge with localStorage (Supabase items first)
3. **Saved items** marked with `isSaved: true` and display bookmark icons
4. **Conversion**: `convertToHistoryItem()` transforms Supabase `SavedExecution` to `HistoryItem`

### Utility Functions ([lib/api-utils.ts](lib/api-utils.ts))

- `generateId()`: Simple client-side ID generation using `Math.random()`
- `buildUrl()`: Constructs URL with query params (only enabled ones)
- `buildHeaders()`: Filters enabled headers into Record<string, string>
- `sendRequest()`: Core fetch logic with timing, error handling, returns `ApiResponse`
- **Auto Content-Type**: Adds `application/json` if body exists and no Content-Type header set

## Development Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run ESLint
```

## UI Component Standards

### shadcn/ui Integration

- Components are in `components/ui/` and managed via CLI (`npx shadcn@latest add`)
- **Import pattern**: `import { Button } from "@/components/ui/button"`
- Theme integration via `next-themes` with ThemeProvider in layout
- **Icon usage**: Hugeicons via `@hugeicons/react` and `@hugeicons/core-free-icons`

### Theming

- Dark/light mode via `next-themes` with system detection
- Theme switcher component: [components/theme-switcher.tsx](components/theme-switcher.tsx)
- Tailwind class-based theming (`dark:` prefix)

### Notifications

- Use `sonner` library: `import { toast } from "sonner"`
- `<Toaster />` already included in layout
- Pattern: `toast.success()`, `toast.error()`, `toast.loading()`

## Project-Specific Conventions

### Path Aliases

- **Always use `@/` imports**: `@/components`, `@/lib`, `@/hooks`
- Configured in [tsconfig.json](tsconfig.json): `"@/*": ["./*"]`

### Component Exports

- Feature modules use barrel exports ([components/api-tester/index.ts](components/api-tester/index.ts))
- Import pattern: `import { ApiTester } from "@/components/api-tester"`

### State Management

- No Redux, Zustand, or Context API needed
- Lift state to `ApiTester` component, pass down as props
- History persisted in localStorage (key: `api-history`, max 50 items)

### Form Handling

- Native React state with controlled components
- No form libraries (React Hook Form, Formik)
- KeyValueEditor handles dynamic form arrays

## Common Modifications

### Adding New Request Features

1. Add state in `ApiTester` component
2. Create/update child component to render UI
3. Pass state + setState via props
4. Update `sendRequest()` in [lib/api-utils.ts](lib/api-utils.ts) if needed

### Adding UI Components

```bash
npx shadcn@latest add [component-name]
```

Components auto-install to `components/ui/` with proper theming

### Database Changes

1. Update SQL in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. Modify `SavedExecution` interface in [lib/supabase.ts](lib/supabase.ts)
3. Update `convertToHistoryItem()` in [components/api-tester/api-tester.tsx](components/api-tester/api-tester.tsx)

## Critical Dependencies

- **Next.js 16**: Use App Router patterns, not Pages Router
- **React 19**: Modern hooks, JSX transform
- **TypeScript**: Strict mode enabled
- **Supabase**: Optional but integrated throughout history features
- **Tailwind CSS 4**: PostCSS-based, no JIT configuration needed

## Known Patterns to Follow

- All client components need `"use client"` at top of file
- Status codes colored with conditional Tailwind classes (green 2xx, red 4xx/5xx)
- JSON formatting via `formatJson()` utility with try/catch for invalid JSON
- Empty key-value pairs auto-added to allow user to start typing
- Response bodies support syntax highlighting for JSON (plain text otherwise)
