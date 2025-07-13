
# Development Guidelines

## 1. Requirements Analysis & Planning
- Always start by thoroughly analyzing the requirements document or conversation
- Break down complex requirements into smaller, manageable tasks
- Identify dependencies and potential technical challenges early
- Ask clarifying questions if requirements are ambiguous

## 2. Code Research & Architecture
- Study reference implementations thoroughly
- Identify key patterns, architecture decisions, and best practices
- Use semantic search to find relevant code patterns and examples
- Leverage existing codebase patterns when available

## 3. Code Generation & Structure
- Generate code that follows the project's established conventions
- Write self-documenting code with clear naming conventions
- Use meaningful variable and function names
- Break complex logic into single-responsibility functions
- Structure code for clear organization and readability

## 4. Implementation Strategy
- Start with basic functionality implementation
- Set up data management and persistence structure early
- Implement interface considerations from the beginning
- Implement error handling and edge cases

## 5. Quality Assurance & Review
- Review and refine based on requirements
- Review requirements analysis and ensure all requirements are addressed
- Verify reference implementation patterns are properly applied
- Confirm code generation best practices are followed
- Check code quality standards are met
- Validate development process steps are completed

# Project rules and guidelines

## Technical stack
- React 18 with TypeScript
- Material-UI (MUI) v5 for UI components
- React Router v6 for navigation
- React Hook Form for form management
- Inter font family for typography

## SPA architecture
- This is a Single Page Application (SPA) built with React
- All routing should be handled client-side using React Router
- Implement proper route-based code splitting for optimal performance
- Maintain application state at appropriate levels (local, context, or global)
- Ensure smooth transitions between routes without full page reloads
- Handle deep linking and browser history properly
- Implement proper loading states for route transitions

## Code organization

### File naming and structure
- All components use named exports (no default exports)
- PascalCase for component files (e.g., `Button.tsx`)
- Lowercase for directories
- One component per file
- `.test.tsx` suffix for test files
- No index file grouping

### Directory structure
```
src/
├── pages/
│   └── [Top-level application pages and route components]
├── components/
│   ├── inputs/
│   │   ├── base/
│   │   │   └── [Foundational input components (InputAutocomplete, InputNumber, InputSelect, InputText, etc.)]
│   │   └── [Domain-specific input components (InputAddressSearch, InputSuburb, InputPostcode, InputState, etc.)]
│   ├── layout/
│   │   └── [Layout components (headers, footers, page shells)]
│   └── [Other reusable UI components organized by domain]
├── contexts/
│   └── [React context providers for state management]
├── hooks/
│   └── [Custom React hooks for business logic and data fetching]
├── types/
│   └── [TypeScript type definitions - single type per file preferred]
└── logic/
    └── [Pure business logic functions - single function per file preferred]
```

## Component structure
- All components should be functional components using TypeScript
- Use proper type definitions for props and state
- Implement error boundaries for error handling
- Follow Material-UI theming guidelines

## Form handling
- Use React Hook Form for all form implementations
- No additional validation libraries should be used
- Leverage React Hook Form's built-in validation capabilities

## Styling guidelines
- Use Material-UI's styling system as the primary styling solution
- Follow the established theme configuration
- Use the Inter font family for typography
- Maintain consistent spacing using MUI's spacing system

## Error handling
- Implement error boundaries at appropriate levels
- Provide user-friendly error messages
- Include reload functionality for error recovery

## TypeScript requirements
- Strict type checking enabled
- No implicit any types
- Proper interface definitions for props and state
- Type-safe component implementations

## Accessibility
- Follow Material-UI's accessibility guidelines
- Implement proper ARIA attributes
- Ensure keyboard navigation support
- Maintain proper heading hierarchy

## Development workflow
- Use Vite as the build tool
- Follow ESLint configuration
- Use TypeScript for type checking
- Maintain proper npm registry configuration
