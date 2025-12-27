# API Testing App Constitution

## Core Principles

### I. Component-First Architecture

Every feature must be built as reusable, self-contained React components following TypeScript best practices. Components must be modular, independently maintainable, and properly typed. Each component should have a single, clear responsibility following the Single Responsibility Principle.

### II. Type Safety & Data Integrity

All data structures must be strongly typed using TypeScript interfaces. Request/response data, configuration, and state must have explicit type definitions. Type safety ensures reliability and prevents runtime errors in API interactions.

### III. User Experience & Accessibility

The application must provide an intuitive, responsive interface following modern UX principles. Support both light and dark themes with system detection. Implement proper loading states, error handling, and user feedback (toast notifications). The UI must be mobile-responsive and accessible.

### IV. Data Persistence Strategy

Implement dual-layer data persistence:

- **Local Storage**: Browser localStorage for temporary request history (last 50 items)
- **Cloud Storage**: Optional Supabase integration for persistent, cross-device saved executions with custom naming

The app must function fully without cloud storage configured.

### V. Code Organization & Maintainability

Follow clear separation of concerns:

- **Components**: Isolated UI components in `/components` directory
- **Utilities**: Business logic in `/lib` directory
- **Types**: Centralized type definitions in `/lib/types.ts`
- **Styling**: Tailwind CSS with shadcn/ui component library

Use descriptive naming conventions and maintain consistent code style.

## Technology Stack Standards

### Required Technologies

- **Framework**: Next.js 16+ with App Router architecture
- **Language**: TypeScript 5+ with strict mode enabled
- **Styling**: Tailwind CSS 4+ with shadcn/ui component system
- **UI Libraries**: Base UI, Radix UI for accessible primitives
- **Icons**: Hugeicons for consistent iconography
- **State Management**: React hooks (useState, useEffect) for local state
- **Database**: Supabase (PostgreSQL) for optional cloud persistence
- **Theme**: next-themes for dark/light mode support
- **Notifications**: Sonner for toast notifications

### Component Architecture

All UI components must follow the established patterns:

- Use Base UI/Radix UI primitives when available
- Apply shadcn/ui styling conventions
- Implement proper TypeScript prop interfaces
- Export components with named exports
- Use `"use client"` directive for client components

## Development Standards

### API Testing Core Features

The application must support:

1. **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
2. **Request Configuration**:
   - URL input with validation
   - Query parameters with enable/disable toggles
   - Custom headers with key-value pairs
   - JSON request body editor
3. **Response Handling**:
   - Status code with color-coded badges
   - Response time and size metrics
   - JSON formatting and syntax highlighting
   - Response headers viewer
   - Copy to clipboard functionality
4. **History Management**:
   - Automatic local history (50 items max)
   - Optional cloud-saved executions with custom names
   - Visual distinction between local and saved items
   - Restore previous requests
   - Delete individual items

### Code Quality Standards

- **Error Handling**: All async operations must implement try-catch blocks with user-friendly error messages
- **Performance**: Keep bundle size optimized; lazy-load heavy components when possible
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Documentation**: README.md must be up-to-date with setup instructions and usage examples

### State Management Patterns

- Use React hooks for local component state
- Implement proper cleanup in useEffect hooks
- Separate concerns: UI state vs. data state
- Avoid prop drilling; use component composition
- Handle loading, error, and success states explicitly

## Security & Privacy Standards

### Client-Side Security

- **Environment Variables**: Store sensitive credentials (Supabase keys) in environment variables
- **CORS**: Handle CORS properly for API requests
- **Input Validation**: Validate user inputs before processing
- **Error Messages**: Do not expose sensitive information in error messages

### Data Privacy

- **Local Storage**: User data stored locally remains in browser only
- **Supabase**: Optional cloud storage requires explicit user action (save button)
- **No Tracking**: No analytics or tracking without explicit user consent

## Governance

### Architecture Decisions

- Constitution supersedes all other development practices
- Major architectural changes require documentation updates
- New dependencies must be justified and documented
- Breaking changes require version bumps and migration guides

### Quality Gates

- TypeScript must compile without errors
- ESLint must pass without warnings
- All user-facing features must be responsive and accessible
- Changes must maintain backward compatibility with local storage format

### Release Standards

- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update README.md with new features and changes
- Test cloud storage integration when Supabase features change
- Maintain compatibility with Node.js 20+

**Version**: 1.0.0 | **Ratified**: December 27, 2025 | **Last Amended**: December 27, 2025
