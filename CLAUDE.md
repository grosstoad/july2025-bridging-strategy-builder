# Bridging Strategy Builder - Development Guidelines

## Project Overview
A digital experience that provides recommended property strategies based on provided inputs, collected data and logic. The platform helps users determine the best approach for buying and selling properties through intelligent analysis of their specific situation.

## Technical Stack
- React 18 with TypeScript
- Material-UI (MUI) v5 for UI components
- React Router v6 for navigation
- React Hook Form for form management
- PropTrack API for property data
- Australia Post API for address/suburb search
- Express.js backend server for API proxy
- OAuth 2.0 authentication for PropTrack API
- Inter font family for typography

## Architecture Principles

### SPA Architecture
- Single Page Application (SPA) built with React
- Client-side routing using React Router
- Route-based code splitting for optimal performance
- Proper loading states for route transitions
- Deep linking and browser history support

### Backend Architecture
- Express.js server for secure API proxy functionality
- OAuth 2.0 Client Credentials Flow for PropTrack authentication
- In-memory token management with automatic refresh
- Serverless deployment support (Vercel Functions)
- Environment-specific configuration for development/staging/production
- CORS configuration for cross-origin requests
- Comprehensive error handling and logging

### Code Organization

#### File Naming and Structure
- All components use named exports (no default exports)
- PascalCase for component files (e.g., `Button.tsx`)
- Lowercase for directories
- One component per file
- `.test.tsx` suffix for test files
- No index file grouping

#### Directory Structure
```
src/
├── pages/
│   └── [Top-level application pages and route components]
├── components/
│   ├── inputs/
│   │   ├── base/
│   │   │   └── [Foundational input components]
│   │   └── [Domain-specific input components]
│   ├── layout/
│   │   └── [Layout components (headers, footers, page shells)]
│   └── [Other reusable UI components organized by domain]
├── contexts/
│   └── [React context providers for state management]
├── hooks/
│   └── [Custom React hooks for business logic and data fetching]
├── types/
│   └── [TypeScript type definitions - single type per file preferred]
├── logic/
│   └── [Pure business logic functions - single function per file preferred]
└── server/
    ├── index.ts [Main server entry point and Express app setup]
    └── proptrack-proxy.ts [API proxy handlers and OAuth management]
```

## Development Guidelines

### Requirements Analysis & Planning
- Always start by thoroughly analyzing the requirements document
- Break down complex requirements into smaller, manageable tasks
- Identify dependencies and potential technical challenges early
- Ask clarifying questions if requirements are ambiguous

### Code Research & Architecture
- Study reference implementations thoroughly
- Identify key patterns, architecture decisions, and best practices
- Use semantic search to find relevant code patterns and examples
- Leverage existing codebase patterns when available

### Code Generation & Structure
- Generate code that follows the project's established conventions
- Write self-documenting code with clear naming conventions
- Use meaningful variable and function names
- Break complex logic into single-responsibility functions
- Structure code for clear organization and readability

### Implementation Strategy
- Start with basic functionality implementation
- Set up data management and persistence structure early
- Implement interface considerations from the beginning
- Implement error handling and edge cases

### Quality Assurance & Review
- Review and refine based on requirements
- Verify reference implementation patterns are properly applied
- Confirm code generation best practices are followed
- Check code quality standards are met
- Validate development process steps are completed

## Component Guidelines

### TypeScript Requirements
- Strict type checking enabled
- No implicit any types
- Proper interface definitions for props and state
- Type-safe component implementations
- All components should be functional components using TypeScript

### Form Handling
- Use React Hook Form for all form implementations
- No additional validation libraries should be used
- Leverage React Hook Form's built-in validation capabilities
- Implement form state persistence using session storage
- Support cross-tab synchronization for form data

### API Integration Patterns

#### Custom Hook Structure
Custom API hooks should return four main elements:
- `results`: Stores the API response data as an array or object
- `error`: Handles error messages (string or null)
- `isLoading`: Tracks the loading state (boolean)
- `action`: Function to trigger the API call (e.g. search, fetch, submit)

#### Key Features
- Empty input handling: Clear results and stop loading when inputs are invalid
- Debounced requests: Minimize network calls during rapid user input
- Request cancellation: Cancel in-flight requests to prevent stale data
- Unified state management: Consistent state interface across all hooks
- Robust error handling: Distinguish between network errors and cancelled requests
- Type-safe mapping: Use interfaces for API responses with domain transforms
- Graceful fallbacks: Provide sensible defaults for missing data

#### HTTP Client Standards
- Use native fetch API for simplicity and broad browser support
- URL encoding: Always encode dynamic URL parameters properly
- Response validation: Check response status and handle errors appropriately
- Type safety: Define clear interfaces for API responses and hook returns
- Data transformation: Normalize API data before setting component state
- Request coordination: Use debouncing and cancellation to avoid race conditions
- Empty state handling: Clear results when queries become invalid
- Error logging: Log technical errors while showing user-friendly messages

## Styling Guidelines

### Core Layout & Structure
- Use Material-UI's styling system as the primary styling solution
- Avoid overriding MUI's color palette or spacing scale unless absolutely necessary
- Avoid custom CSS/SCSS files unless necessary
- Use appropriate layout components (Flex containers, responsive containers, width-constrained containers)
- Never add visible containers or wrappers to content
- Never use decorative containers with visual properties when grouping static content
- Never use interactive components (Cards, Papers) for static content

### Visual Hierarchy & Typography
- Create visual hierarchy using only typography (font sizes and weights) and spacing (margins and padding)
- Maintain consistent text styles across the application
- Use default text color for all text
- Never use colored text for any purpose
- Use whitespace to create clear visual sections
- Use bold and left-aligned styling for all headings
- Use sentence case (first word capitalized only) for all headings and titles

### Color & Visual Elements
- Use color only for interactive elements (buttons, links)
- Use icons sparingly and only in interactive controls
- Never use icons for decorative purposes or to replace text labels
- All icons must be accompanied by clear text labels

### Form Controls
- Display related options horizontally on desktop
- Allow natural wrapping when space is constrained
- Use appropriate layout components for horizontal arrangement
- Ensure proper spacing between options for touch targets

### Buttons
- Use prominent, filled buttons for primary actions (e.g., Next, Submit)
- Use outlined or secondary buttons for secondary actions (e.g., Back, Edit)
- Ensure buttons are clearly labeled and have sufficient touch/click targets
- Avoid full-width buttons to maintain proper visual hierarchy
- Disable elevation on contained buttons
- Use sentence case for button labels

### Interactive Cards
- Use card components only for clickable/interactive elements
- Include proper interactive areas for clickable cards
- Avoid decorative borders
- Use standard interaction patterns and hover states
- Do not customize or override default interaction behaviors

### Alerts & Feedback
- Use alert components for important information
- Display validation errors inline, near the relevant input fields
- Use appropriate severity levels (error, warning, info, success)
- Keep alert messages concise and actionable
- Position alerts at the top of the content area

## Accessibility
- Follow WAI-ARIA guidelines for all interactive elements
- Ensure full keyboard navigation support (Tab, Shift+Tab, Enter/Space activation)
- Provide descriptive `aria-label`s or `aria-labelledby` for icons and unlabeled controls
- Maintain a logical heading hierarchy (do not skip heading levels)
- Follow Material-UI's accessibility guidelines
- Implement proper ARIA attributes
- Ensure keyboard navigation support

## Error Handling
- Implement error boundaries at appropriate levels
- Provide user-friendly error messages
- Include reload functionality for error recovery
- Comprehensive error handling with detailed logging
- Three-tier fallback system for API calls
- Graceful degradation: Show available results even if one API fails
- Clear user feedback on failures
- Automatic retry for transient failures

## PropTrack API Integration

### Authentication Architecture
- OAuth 2.0 Client Credentials Flow
- Automatic token refresh with expiry tracking
- Base64 encoded credentials for authentication
- Backend proxy prevents credential exposure
- Token management in server memory only

### Available Endpoints
- Address suggestions (`/api/v2/address/suggest`)
- Property summary (`/api/v2/properties/{propertyId}/summary`)
- Property listings (`/api/v2/properties/{propertyId}/listings`)
- Property valuations (`/api/v1/properties/{propertyId}/valuations/sale`)
- Market data endpoints (median prices, days on market, supply & demand)

### Address Search Implementation
- Hybrid approach combining PropTrack property addresses with Australia Post suburb/postcode data
- PropTrack for specific property address autocomplete
- Australia Post for suburb and postcode search
- Combined results with proper sorting and visual differentiation
- Debounced search with 400ms delay
- Keyboard navigation support
- Request cancellation and error handling

## Environment Configuration

### Required Environment Variables
```bash
# Server Configuration
PORT=3100
NODE_ENV=development

# CORS Settings
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004

# PropTrack API Authentication
PROPTRACK_AUTH_HEADER=Basic [base64_encoded_credentials]
VITE_PROPTRACK_API_KEY=[api_key]
VITE_PROPTRACK_API_SECRET=[api_secret]
VITE_API_BASE_URL=https://data.proptrack.com

# Australia Post PAC API Authentication
VITE_AUSPOST_API_KEY=[auspost_api_key]
```

### Security Best Practices
- API keys in environment variables only
- Backend proxy prevents credential exposure
- Proper CORS configuration
- No API keys in frontend code
- Token management in server memory only
- Environment variables never committed to repository
- Tokens only stored in server memory, not persisted
- All API calls over HTTPS in production

## Documentation Standards

### Markdown Formatting
- All headings use sentence case (only first word and proper nouns capitalized)
- Headings follow logical, sequential order (never skip levels)
- Single blank line before and after every heading
- Use hyphen (-) for all unordered list items
- Specify language identifier for code blocks
- Use descriptive link text
- Three hyphens (---) for horizontal rules with blank lines before/after

### Code Documentation
- Write self-documenting code with clear naming
- Avoid unnecessary comments unless explaining complex business logic
- Use TypeScript interfaces and types for documentation
- Include examples in technical documentation
- Maintain consistency across all documentation files

## Development Workflow
- Use Vite as the build tool
- Follow ESLint configuration
- Use TypeScript for type checking
- Maintain proper npm registry configuration
- Implement proper route-based code splitting
- Ensure smooth transitions between routes
- Handle deep linking and browser history properly

## Backend Development

### Server Architecture
- **Main Server**: `src/server/index.ts` - Express app setup and middleware
- **API Proxy**: `src/server/proptrack-proxy.ts` - All API endpoint handlers
- **Environment**: `.env.local` - Server configuration variables
- **Build Config**: `tsconfig.server.json` - TypeScript configuration for server

### Environment Configuration
Required environment variables for development:
```bash
# Server Configuration
PORT=3100
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004

# PropTrack API Authentication
PROPTRACK_AUTH_HEADER=Basic [base64_encoded_credentials]
VITE_PROPTRACK_API_KEY=[api_key]
VITE_PROPTRACK_API_SECRET=[api_secret]
VITE_API_BASE_URL=https://data.proptrack.com

# Australia Post PAC API Authentication
VITE_AUSPOST_API_KEY=[auspost_api_key]
```

### Development Commands
```bash
# Full development environment
npm run dev                    # Starts both frontend (port 3000) + backend (port 3100)

# Individual services
npm run dev:proxy             # Backend proxy only (port 3100)
npm run dev:frontend          # Frontend only (port 3000)

# Server build and run
npm run build:server          # Compile TypeScript server code
node dist/server/index.js     # Run compiled server directly
```

### API Proxy Architecture
- All API routes mounted under `/api` prefix
- Frontend requests `/api/*` → Vite proxy → Backend server port 3100
- Backend handles OAuth 2.0 token management for PropTrack API
- Automatic token refresh with expiry tracking
- CORS configuration for cross-origin requests

### Deployment Environments

#### Local Development
- Express server on port 3100
- Vite dev server on port 3000 with proxy configuration
- Environment variables from `.env.local`
- Hot reload for both frontend and backend

#### Production (Serverless)
- Serverless functions (Vercel Functions/AWS Lambda)
- Static frontend deployment
- Environment variables from hosting provider
- `/api/*` routes handled by serverless function handlers