# Property Strategy Builder

A digital experience that provides recommended property strategies based on provided inputs, collected data and logic, powered by PropTrack API.

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```

The PropTrack credentials are already configured in the example file.

### 3. Run the Application
Start both frontend and backend:
```bash
npm run dev:full
```

Or run separately:
```bash
# Terminal 1 - Backend proxy server
npm run server:dev

# Terminal 2 - Frontend development server  
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3100

## Features Implemented

### ✅ Landing Page
- Clean, centered design matching Figma specifications
- PropTrack branding and credibility markers
- Professional typography hierarchy
- Responsive layout for all devices

### ✅ Address Search
- PropTrack-powered address autocomplete
- Debounced search (400ms) for optimal performance
- Loading states and error handling
- Minimum 3 characters before search triggers
- Real-time property address suggestions

### ✅ PropTrack API Integration
- OAuth 2.0 client credentials flow
- Automatic token refresh and management
- Backend proxy server for secure credential handling
- Address suggestions endpoint (`/api/v2/address/suggest`)
- Property summary endpoint (`/api/v2/properties/{propertyId}/summary`)

### ✅ Technical Foundation
- React 18 + TypeScript + Material-UI v5
- Vite build system with hot reload
- ESLint and TypeScript strict mode
- Clean architecture with proper separation of concerns
- Custom hooks for API integration
- Type-safe PropTrack API responses

## Project Structure

```
src/
├── components/
│   ├── inputs/          # Form input components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript type definitions
└── contexts/            # React context providers

server/
├── server.ts           # Express proxy server
└── package.json        # Server dependencies
```

## Environment Variables

The following environment variables are configured in `.env.local`:

```bash
# Server Configuration
PORT=3100
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004

# PropTrack API (configured with your credentials)
PROPTRACK_AUTH_HEADER=Basic [base64_encoded_credentials]
VITE_PROPTRACK_API_KEY=[your_api_key]
VITE_PROPTRACK_API_SECRET=[your_api_secret]
VITE_API_BASE_URL=https://data.proptrack.com

# Australia Post API
VITE_AUSPOST_API_KEY=[your_auspost_api_key]
```

## API Endpoints

### Address Search
- **GET** `/api/v2/address/suggest?q={query}`
- Returns property address suggestions from PropTrack
- Minimum 3 characters required
- Debounced to prevent excessive API calls

### Property Summary
- **GET** `/api/v2/properties/{propertyId}/summary`
- Returns comprehensive property data including valuation, attributes, and market data
- Used for property analysis and recommendations

## Testing the Address Search

1. Open the application at http://localhost:3000
2. Type at least 3 characters in the address search field
3. Watch for real-time suggestions from PropTrack API
4. Select an address to see the property ID in the debug info
5. Check browser console for API request/response details

## Development Commands

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run frontend and backend together
npm run dev:full

# Run frontend only
npm run dev

# Run backend only  
npm run server:dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```

## Next Steps

The foundation is now ready for implementing the remaining requirements:

1. **Current Property Analysis Page** - Display PropTrack property data with editable attributes
2. **Target Property Selection** - Suburb search and property type selection
3. **Personal Circumstances** - Timeline and lifestyle preference collection
4. **Strategy Recommendations** - Multi-dimensional scoring algorithm and recommendations

## Technical Notes

- The backend proxy server handles PropTrack OAuth authentication securely
- All API credentials are properly secured and not exposed to the frontend
- The address autocomplete component is fully reusable and extensible
- Error handling includes network failures, API errors, and request cancellation
- The component architecture follows Material-UI best practices for accessibility