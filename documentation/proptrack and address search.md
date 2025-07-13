## PropTrack API Implementation Guide

### Overview
The PropTrack API integration is **fully implemented and production-ready** with comprehensive OAuth 2.0 authentication, token management, and all required endpoints. This guide provides technical details for maintenance and enhancement.

### Authentication Architecture

#### OAuth 2.0 Client Credentials Flow
```typescript
// Token Management (src/server/proptrack-proxy.ts:55-115)
- Automatic token refresh with expiry tracking
- Base64 encoded credentials: `Basic base64(api_key:api_secret)`
- Token endpoint: https://data.proptrack.com/oauth2/token
- Bearer token authentication for all API calls
```

#### Environment Configuration
```bash
# Required environment variables
PROPTRACK_AUTH_HEADER=Basic base64(api_key:api_secret)
VITE_PROPTRACK_API_KEY=your_api_key
VITE_PROPTRACK_API_SECRET=your_api_secret
```

#### Token Management Implementation
- **Location**: `src/server/proptrack-proxy.ts:55-115`
- **Features**: Automatic refresh, expiry tracking, error handling
- **Security**: Tokens stored in server memory only, not exposed to frontend
- **Fallback**: Comprehensive error handling with detailed logging

### API Endpoints Implementation

#### 1. Address Suggestions (`/api/address/suggest`)
```typescript
// Frontend: propTrackAPI.getAddressSuggestions(query)
// Backend: GET /api/v2/address/suggest
// Upstream: https://data.proptrack.com/api/v2/address/suggest
```
- **Purpose**: Property address autocomplete
- **Parameters**: `q` (query string)
- **Returns**: Array of AddressSuggestion objects
- **Usage**: Primary address search in PropertyDetails components

#### 2. Property Summary (`/api/properties/:propertyId/summary`)
```typescript
// Frontend: propTrackAPI.getPropertySummary(propertyId)
// Backend: GET /api/properties/:propertyId/summary
// Upstream: https://data.proptrack.com/api/v2/properties/{propertyId}/summary
```
- **Purpose**: Property details, attributes, images
- **Returns**: PropertySummary object with bedrooms, bathrooms, land area, etc.
- **Usage**: Property cards and detail views

#### 3. Property Listings (`/api/properties/:propertyId/listings`)
```typescript
// Frontend: propTrackAPI.getPropertyListings(propertyId)
// Backend: GET /api/properties/:propertyId/listings
// Upstream: https://data.proptrack.com/api/v2/properties/{propertyId}/listings
```
- **Purpose**: Current and historical property listings
- **Returns**: Array of PropertyListing objects
- **Usage**: Market analysis and pricing information

#### 4. Property Valuations (`/api/properties/:propertyId/valuations/sale`)
```typescript
// Frontend: propTrackAPI.getPropertyValuation(propertyId)
// Backend: GET /api/properties/:propertyId/valuations/sale
// Upstream: https://data.proptrack.com/api/v1/properties/{propertyId}/valuations/sale
```
- **Purpose**: Automated property valuations
- **Returns**: PropertyValuation object with estimated value and confidence
- **Usage**: Property value estimates and ranges

#### 5. Market Data Endpoints
```typescript
// Median Sale Price
GET /api/v2/market/sale/historic/median-sale-price
// Median Days on Market
GET /api/v2/market/sale/historic/median-days-on-market
// Supply & Demand
GET /api/v2/market/supply-and-demand/potential-buyers
```
- **Purpose**: Market analysis and trends
- **Parameters**: suburb, state, postcode, propertyTypes, startDate, endDate
- **Usage**: Market trends charts and analysis

### Error Handling & Resilience

#### Backend Error Handling
- **Token Refresh**: Automatic retry on 401 errors
- **Request Logging**: Comprehensive request/response logging
- **Status Codes**: Proper HTTP status code propagation
- **Fallback**: Graceful degradation on API failures

#### Frontend Error Handling
- **Network Errors**: Axios interceptors for error handling
- **Loading States**: Comprehensive loading indicators
- **User Feedback**: Error messages and retry mechanisms
- **Graceful Degradation**: UI continues to function without API data

### Testing & Validation

#### Contract Tests
- **Location**: `src/services/__tests__/proptrack.contract.test.ts`
- **Coverage**: Address suggestions endpoint validation
- **Purpose**: Ensure API response structure compatibility

#### Integration Testing
- **Location**: `src/server/__tests__/market-proxy.contract.test.ts`
- **Coverage**: All market data endpoints
- **Purpose**: Validate error handling and response formats

### Performance Considerations

#### Current Implementation
- **Token Caching**: Tokens cached in server memory until expiry
- **Request Concurrency**: Parallel API calls with Promise.all
- **Rate Limiting**: No current rate limiting (PropTrack has generous limits)

#### Recommended Enhancements
1. **Response Caching**: Implement Redis/memory caching for property data
2. **Request Batching**: Batch multiple property requests
3. **Retry Logic**: Exponential backoff for failed requests
4. **Rate Limiting**: Implement client-side rate limiting

### Security Best Practices

#### Current Implementation
✅ **API keys in environment variables only**
✅ **Backend proxy prevents credential exposure**
✅ **Proper CORS configuration**
✅ **No API keys in frontend code**
✅ **Token management in server memory only**

#### Security Considerations
- **Environment Variables**: Never commit API keys to repository
- **Token Storage**: Tokens only stored in server memory, not persisted
- **Request Logging**: Sensitive data filtered from logs
- **HTTPS**: All API calls over HTTPS in production

### Backend Server Management

#### Server Architecture
The backend server is an **Express.js application** that serves as a secure API proxy between the frontend and external services (PropTrack, Australia Post). 

#### Server Configuration Files
- **Main Server**: `src/server/index.ts` - Express app setup and middleware
- **API Proxy**: `src/server/proptrack-proxy.ts` - All API endpoint handlers
- **Build Config**: `tsconfig.server.json` - TypeScript configuration for server
- **Environment**: `.env` - Server configuration variables

#### Environment Variables Configuration
```bash
# Server Configuration
PORT=3100                              # Server port (default: 3100)
NODE_ENV=development                   # Environment mode
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004

# PropTrack API Authentication  
PROPTRACK_AUTH_HEADER=Basic base64(api_key:api_secret)  # Pre-encoded credentials
VITE_PROPTRACK_API_KEY=your_api_key                    # API key (for reference)
VITE_PROPTRACK_API_SECRET=your_api_secret              # API secret (for reference)

# Australia Post PAC API
VITE_AUSPOST_API_KEY=your_auspost_api_key             # Official PAC API key

# Optional Overrides
VITE_API_BASE_URL=https://data.proptrack.com          # PropTrack base URL override
```

#### Server Startup Process
```typescript
// src/server/index.ts startup sequence:
1. Load environment variables via dotenv.config()
2. Initialize Express app with CORS middleware
3. Mount proptrack-proxy router on '/api' path
4. Start server on specified PORT (default: 3100)
5. Only listen in non-production environments (serverless in production)
```

#### CORS Configuration
```typescript
// Dynamic CORS setup (src/server/index.ts:12)
app.use(cors({ 
  origin: true,           // Allows all origins in development
  credentials: true       // Supports cookies/auth headers
}));

// Environment-specific CORS
// Development: Allow localhost ports 3000-3004
// Production: Set CORS_ORIGIN to your domain
```

#### API Proxy Architecture
```typescript
// All API routes mounted under /api prefix
app.use('/api', proptrackProxy);

// Route mapping:
Frontend Request          →  Backend Proxy           →  External API
/api/address/suggest     →  proptrack-proxy.ts:118  →  PropTrack OAuth + API
/api/properties/:id      →  proptrack-proxy.ts:259  →  PropTrack OAuth + API  
/api/auspost/search      →  proptrack-proxy.ts:354  →  Australia Post API
```

#### Token Management System
```typescript
// In-memory token storage (src/server/proptrack-proxy.ts:55-58)
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

// Automatic token refresh logic:
1. Check if current token exists and is not expired
2. If expired/missing, request new token via OAuth 2.0
3. Store token and expiry in server memory
4. Use Bearer token for all subsequent API calls
```

#### Server Logging & Monitoring
```typescript
// Request logging middleware (src/server/index.ts:18-22)
- Logs all incoming requests with timestamp, method, URL
- Detailed API request/response logging in proptrack-proxy.ts
- Token management logging with partial token display for security
```

### Deployment Configuration

#### Development Server Management
```bash
# Method 1: Full development environment
npm run dev                    # Starts both frontend (port 3000) + backend (port 3100)

# Method 2: Individual services  
npm run dev:proxy             # Backend proxy only (port 3100)
npm run dev:frontend          # Frontend only (port 3000) - proxy configured to port 3100

# Method 3: Build and run server manually
npm run build:server         # Compile TypeScript server code
node dist/server/index.js    # Run compiled server directly
```

#### Development Proxy Configuration
```typescript
// Frontend proxy setup (vite.config.ts)
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3100',    // Routes /api/* to backend server
      changeOrigin: true,
      secure: false
    }
  }
}
```

### Environment-Specific Deployment Guide

#### Local Development Environment
```bash
# .env configuration for local development
PORT=3100
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004
PROPTRACK_AUTH_HEADER=Basic base64(api_key:api_secret)
VITE_PROPTRACK_API_KEY=your_dev_api_key
VITE_PROPTRACK_API_SECRET=your_dev_api_secret
VITE_AUSPOST_API_KEY=your_dev_auspost_key

# Local server startup process:
1. npm install                           # Install dependencies
2. cp .env.example .env                  # Copy environment template
3. # Configure .env with your API keys
4. npm run dev                          # Start both frontend + backend
   # OR
   npm run dev:proxy & npm run dev:frontend  # Start separately

# Local architecture:
Frontend (Vite): http://localhost:3000  →  Proxy /api/* requests to backend
Backend (Express): http://localhost:3100  →  Handles OAuth + external API calls
```

#### Test Environment (Staging/Preview)
```bash
# Test environment configuration (.env.test or staging environment)
PORT=3100
NODE_ENV=test                           # or 'staging'
CORS_ORIGIN=https://your-test-domain.vercel.app,https://your-staging-domain.com
PROPTRACK_AUTH_HEADER=Basic base64(test_api_key:test_api_secret)
VITE_PROPTRACK_API_KEY=your_test_api_key
VITE_PROPTRACK_API_SECRET=your_test_api_secret
VITE_AUSPOST_API_KEY=your_test_auspost_key

# Test deployment process:
1. Create test/staging branch
2. Configure environment variables in hosting provider
3. Deploy to staging URL (e.g., Vercel preview deployments)
4. Test API functionality at /auspost-test route
5. Validate PropTrack authentication and data flow

# Test environment characteristics:
- Uses test API keys (separate quota/limits)
- Staging domain with HTTPS
- Same serverless architecture as production
- Full API functionality testing available
```

#### Production Deployment (Serverless)
```bash
# Production environment variables (set in hosting provider dashboard):
NODE_ENV=production
PROPTRACK_AUTH_HEADER=Basic base64(prod_api_key:prod_api_secret)
VITE_PROPTRACK_API_KEY=your_production_api_key
VITE_PROPTRACK_API_SECRET=your_production_api_secret  
VITE_AUSPOST_API_KEY=your_production_auspost_key
CORS_ORIGIN=https://yourdomain.com

# Production deployment architecture:
Frontend: Static site deployment (Vercel/Netlify/CDN)
Backend: Serverless functions (Vercel Functions/AWS Lambda/Azure Functions)
API Routes: /api/* → serverless function handlers
Database: None required (stateless API proxy)
```

### Vercel Deployment Configuration

#### Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "src/server/index.ts": {
      "runtime": "@vercel/node"                    // Node.js serverless runtime
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",                      // All /api/* requests
      "destination": "/src/server/index.ts"       // Routed to serverless function
    }
  ]
}
```

#### Vercel Deployment Process
```bash
# Deploy to Vercel (production)
1. Connect GitHub repo to Vercel project
2. Configure environment variables in Vercel dashboard
3. Set production domain and CORS_ORIGIN
4. Deploy via git push to main branch
5. Vercel automatically builds frontend + serverless functions

# Deploy to Vercel (preview/test)
1. Push to feature branch or create PR
2. Vercel auto-generates preview URL
3. Uses same environment variables as production
4. Test all functionality before merging to main
```

### Multi-Environment Architecture Comparison

#### Local Development
```
┌─────────────────┐    HTTP Proxy     ┌─────────────────┐    HTTPS/OAuth    ┌─────────────────┐
│   Frontend      │ ────────────────► │   Backend       │ ─────────────────► │   External APIs │
│   (Vite Dev)    │    /api/* → :3100 │   (Express)     │    Token Refresh   │   PropTrack     │
│   Port 3000     │                   │   Port 3100     │    Error Handling  │   Australia Post│
└─────────────────┘                   └─────────────────┘                    └─────────────────┘

Characteristics:
✅ Hot reload for both frontend and backend
✅ Real-time debugging with console logs  
✅ Environment variables from .env file
✅ Full API testing via /auspost-test route
✅ CORS allows multiple localhost ports
```

#### Test/Staging Environment
```
┌─────────────────┐    HTTPS/CDN      ┌─────────────────┐    HTTPS/OAuth    ┌─────────────────┐
│   Frontend      │ ────────────────► │   Backend       │ ─────────────────► │   External APIs │
│   (Static Site) │    /api/* → func  │   (Serverless)  │    Token Refresh   │   PropTrack     │
│   CDN/Vercel    │                   │   Vercel Func   │    Error Handling  │   Australia Post│
└─────────────────┘                   └─────────────────┘                    └─────────────────┘

Characteristics:
✅ Production-like architecture
✅ Test API keys and separate quotas
✅ HTTPS with staging domain
✅ Preview URLs for feature testing
✅ Full serverless function testing
```

#### Production Environment  
```
┌─────────────────┐    HTTPS/CDN      ┌─────────────────┐    HTTPS/OAuth    ┌─────────────────┐
│   Frontend      │ ────────────────► │   Backend       │ ─────────────────► │   External APIs │
│   (Static Site) │    /api/* → func  │   (Serverless)  │    Token Refresh   │   PropTrack     │
│   Global CDN    │                   │   Multi-Region  │    Error Handling  │   Australia Post│
└─────────────────┘                   └─────────────────┘                    └─────────────────┘

Characteristics:
✅ Global CDN distribution
✅ Auto-scaling serverless functions
✅ Production API keys with full quotas
✅ HTTPS with custom domain
✅ Production monitoring and analytics
```

### Environment-Specific Server Behavior

#### Development Server Behavior
```typescript
// src/server/index.ts behavior in development:
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3100;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);    // Local server logs
  });
}

// Features available in development:
- Real-time server restart via tsx watch
- Detailed console logging for all requests
- CORS allows multiple localhost ports
- Hot reload for server code changes
- Direct server access at http://localhost:3100
```

#### Test Environment Server Behavior
```typescript
// Serverless function behavior in test/staging:
export default app;  // Express app exported for serverless handler

// Features in test environment:
- Serverless function cold start behavior
- Environment variables from hosting provider
- HTTPS-only API access
- Production-like token management
- Staging domain CORS restrictions
```

#### Production Server Behavior
```typescript
// Production serverless function characteristics:
- Zero-downtime deployments
- Auto-scaling based on demand  
- Global edge function distribution
- Production error handling and logging
- Strict CORS policy for security
- Token caching optimized for serverless
```

### Server Management Commands by Environment

#### Local Development
```bash
# Start development server
npm run dev                          # Full stack (frontend + backend)
npm run dev:proxy                    # Backend only
./start-server.sh                    # Direct server start with watch mode

# Debug server
tsx watch src/server/index.ts        # Direct TypeScript execution with watch
NODE_DEBUG=* npm run dev:proxy       # Node.js debug mode
DEBUG=* npm run dev:proxy            # Debug library logging

# Test server manually
curl http://localhost:3100/api/health  # Health check (if enabled)
```

#### Test/Staging Environment
```bash
# Deploy to test environment
git push origin test-branch          # Trigger preview deployment
vercel --prod --scope=test           # Deploy to staging with test config

# Test deployed functionality
curl https://your-test-app.vercel.app/api/auspost/search?q=sydney
curl https://your-test-app.vercel.app/api/address/suggest?q=123+main
```

#### Production Environment
```bash
# Deploy to production
git push origin main                 # Auto-deploy via Vercel GitHub integration
vercel --prod                       # Manual production deployment

# Monitor production
vercel logs                         # View serverless function logs
vercel domains                      # Manage custom domains
```

### Troubleshooting by Environment

#### Local Development Issues
```bash
# Common local issues and solutions:
1. Port 3100 already in use:
   lsof -ti:3100 | xargs kill -9    # Kill process on port 3100
   
2. Environment variables not loaded:
   ls -la .env                      # Check .env file exists
   cat .env | grep PROPTRACK        # Verify PropTrack config
   
3. CORS errors:
   # Check vite.config.ts proxy configuration
   # Verify backend server is running on port 3100
   
4. API authentication failures:
   # Check .env PROPTRACK_AUTH_HEADER format
   # Verify base64 encoding of api_key:api_secret
```

#### Test Environment Issues
```bash
# Test environment troubleshooting:
1. Deployment failures:
   vercel logs --follow             # Watch deployment logs in real-time
   
2. Environment variable issues:
   vercel env ls                    # List configured environment variables
   vercel env add VARIABLE_NAME     # Add missing environment variables
   
3. CORS issues in staging:
   # Update CORS_ORIGIN in Vercel dashboard
   # Add staging domain to allowed origins
   
4. API functionality testing:
   # Use /auspost-test route in staging environment
   # Test all API endpoints with staging URL
```

#### Production Environment Issues
```bash
# Production troubleshooting:
1. Function timeout issues:
   # Check Vercel function timeout limits
   # Optimize API request performance
   
2. CORS policy violations:
   # Ensure CORS_ORIGIN matches production domain
   # Check custom domain configuration
   
3. API rate limiting:
   # Monitor PropTrack API usage in dashboard
   # Implement request caching if needed
   
4. Performance monitoring:
   # Use Vercel Analytics for function performance
   # Monitor API response times and error rates
```

#### Server Health & Status
```typescript
// Health monitoring endpoints (commented in src/server/index.ts:16)
// app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Server status indicators:
- Console logs show server startup on specified port
- PropTrack token status logged on each request
- Australia Post API fallback status logged
- Request/response timing and status codes logged
```

#### Local Development Server Commands
```bash
# Start development servers
./start-server.sh            # Shell script to start backend proxy
npm run dev:proxy            # Direct npm script for backend

# Server build commands  
npm run build:server         # TypeScript compilation for server
tsc --project tsconfig.server.json  # Direct TypeScript compilation

# Debug server
NODE_ENV=development DEBUG=* npm run dev:proxy  # Enable debug logging
```

#### Server Error Handling
```typescript
// Comprehensive error handling in proptrack-proxy.ts:
1. OAuth token failures → detailed error logging + retry logic
2. API request failures → status code propagation to frontend  
3. Network timeouts → configurable timeout handling
4. Invalid requests → proper HTTP status responses
5. Environment issues → startup warnings and fallback behavior
```

#### Performance & Scalability Considerations
```typescript
// Current server optimizations:
- In-memory token caching (no database required)
- Concurrent request handling via Node.js event loop
- Stateless design (suitable for serverless deployment)
- Minimal memory footprint
- No persistent connections or sessions

// Production considerations:
- Horizontal scaling via multiple serverless instances
- Token caching shared across instances (consider Redis)
- Request rate limiting implementation
- Response caching for frequently accessed data
```

### Troubleshooting Guide

#### Common Issues
1. **Authentication Failures**
   - Check `PROPTRACK_AUTH_HEADER` format
   - Verify API key and secret are correct
   - Check token expiry in logs

2. **CORS Errors**
   - Verify backend proxy is running on port 3100
   - Check frontend proxy configuration in vite.config.ts

3. **Network Errors**
   - Check internet connectivity
   - Verify PropTrack API endpoints are accessible
   - Review server logs for detailed error messages

#### Debug Mode
```typescript
// Enable debug logging in src/services/proptrack.ts
const DEBUG = true;
// Check browser console for detailed API logs
```

## Address Suggestion Implementation Guide

### Overview
The address suggestion system implements a **hybrid approach** combining PropTrack property addresses with Australia Post suburb/postcode data, providing comprehensive address search capabilities.

### Architecture Components

#### 1. PropTrack Property Addresses
- **Source**: PropTrack API `/api/v2/address/suggest`
- **Use Case**: Specific property address autocomplete
- **Trigger**: Queries with numbers (street addresses)
- **Component**: `AddressAutocomplete.tsx`

#### 2. Australia Post Suburb/Postcode Search
- **Source**: Australia Post PAC API + fallback to auspostie.com
- **Use Case**: Suburb and postcode search
- **Trigger**: All text queries
- **Component**: `EnhancedAddressAutocomplete.tsx`

#### 3. Hybrid Combined Search
- **Component**: `EnhancedAddressAutocomplete.tsx`
- **Logic**: Combines both PropTrack and AusPost results
- **Priority**: Property addresses first, then suburbs
- **UI**: Sectioned results with icons and labels

### Implementation Details

#### Australia Post Integration

##### Authentication & Endpoints
```typescript
// Official API (with fallback)
Primary: https://digitalapi.auspost.com.au/postcode/search.json
Fallback: https://auspostie.com/{query}.json
Authentication: auth-key header with VITE_AUSPOST_API_KEY
```

##### Advanced Search Features
```typescript
// State filtering
searchSuburbs(query: string, state?: string)
// Post box exclusion
searchSuburbsExcludingPostBoxes(query: string, state?: string)
// Geographic data included (lat/lng when available)
```

##### Fallback Strategy
```typescript
// Automatic fallback implementation (src/server/proptrack-proxy.ts:353-447)
1. Try official Australia Post PAC API
2. If fails (network/auth), try auspostie.com fallback
3. Transform fallback response to match official API format
4. Apply same filters (state, post box exclusion) to fallback data
```

##### Response Transformation
```typescript
// Official API Response
interface AusPostResponse {
  localities: {
    locality: AusPostLocalityItem[]
  }
}

// Fallback Response Transformation
auspostie.com → transformed to AusPostResponse format
```

#### PropTrack Address Integration

##### Address Suggestion Flow
```typescript
// Frontend: propTrackAPI.getAddressSuggestions(query)
// Trigger: query.length >= 3 && /\d/.test(query)
// Returns: AddressSuggestion[] with propertyId and full address details
```

##### Address Data Structure
```typescript
interface AddressSuggestion {
  id: string;
  propertyId?: string;
  address: {
    fullAddress: string;
    unitNumber: string | null;
    streetNumber: string;
    streetName: string;
    streetType: string;
    suburb: string;
    state: string;
    postcode: string;
  };
}
```

### Component Architecture

#### 1. Basic Address Autocomplete (`AddressAutocomplete.tsx`)
- **Purpose**: Simple property address search
- **Features**: Debounced search, keyboard navigation, highlight matching
- **Usage**: Single-purpose address fields

#### 2. Enhanced Address Autocomplete (`EnhancedAddressAutocomplete.tsx`)
- **Purpose**: Combined property + suburb search
- **Features**: Sectioned results, icons, dual API integration
- **Usage**: Main address search in PropertyDetails

#### 3. Test Page (`AusPostTestPage.tsx`)
- **Purpose**: API testing and validation
- **Features**: Manual testing, state filtering, API status monitoring
- **Usage**: Development and debugging

### Search Logic Implementation

#### Combined Search Strategy
```typescript
// Enhanced search logic (EnhancedAddressAutocomplete.tsx:78-119)
1. Always fetch suburb suggestions from Australia Post
2. Only fetch property addresses if query has numbers
3. Combine results with proper sorting
4. Limit results: 5 properties + 3 suburbs max
```

#### Debouncing & Performance
```typescript
// Debounce implementation
const debouncedValue = useDebounce(value, 400);
// Prevents excessive API calls
// 400ms delay for optimal UX
```

#### Keyboard Navigation
```typescript
// Full keyboard support
- ArrowUp/ArrowDown: Navigate suggestions
- Enter: Select focused suggestion
- Escape: Close suggestions
- Tab: Move to next field
```

### User Experience Features

#### Visual Differentiation
```typescript
// Property addresses: Red location icon
<LocationOnIcon sx={{ color: '#F43F5E' }} />
// Suburbs: Green map icon
<MapIcon sx={{ color: '#059669' }} />
// Area chips for suburbs
<Chip label="Area" sx={{ bgcolor: '#ECFDF5', color: '#059669' }} />
```

#### Sectioned Results
```typescript
// Results are grouped by type
1. "Property Addresses" section (with property icon)
2. "Areas & Postcodes" section (with map icon)
3. Visual dividers between sections
```

#### Search Highlighting
```typescript
// Query text highlighted in results
const highlightMatch = (text: string, query: string) => {
  // Highlights matching text with bold + color
  fontWeight: 700, color: '#F43F5E'
}
```

### State Management Integration

#### PropertyContext Integration
```typescript
// Address selection updates context
interface AddressInfo {
  fullAddress: string;
  suburb: string;
  state: string;
  postcode: string;
}

// Dual address management
- currentAddress / targetAddress
- currentAddressInput / targetAddressInput
- activeAutocomplete state management
```

#### UI State Management
```typescript
// Controlled by PropertyContext
- activeAutocomplete: 'current' | 'target' | null
- Address input synchronization
- Loading states and error handling
```

### Testing & Validation

#### Test Page Features
- **Manual Testing**: Direct API query testing
- **State Filtering**: Test Australia Post state filtering
- **Post Box Exclusion**: Test post box filtering
- **API Status Monitoring**: Official vs fallback API usage
- **Enhanced Autocomplete**: Live testing of hybrid search

#### Test Scenarios
1. **Property Address Search**: "123 Main St Sydney"
2. **Suburb Search**: "Parramatta"
3. **Postcode Search**: "2000"
4. **State Filtering**: "Melbourne VIC"
5. **Mixed Results**: "123 Smith" (numbers + text)

### Performance Optimization

#### Current Optimizations
- **Debounced Search**: 400ms delay prevents excessive API calls
- **Concurrent API Calls**: Promise.all for parallel API requests
- **Result Limiting**: Maximum 8 total results displayed
- **Intelligent Triggering**: Property search only when appropriate

#### Recommended Enhancements
1. **Caching**: Cache suburb results for common queries
2. **Prefetching**: Prefetch popular suburbs
3. **Virtualization**: For large result sets
4. **Request Deduplication**: Prevent duplicate concurrent requests

### Error Handling & Fallbacks

#### Comprehensive Error Handling
```typescript
// Three-tier fallback system
1. PropTrack API (for property addresses)
2. Australia Post official API (for suburbs)
3. auspostie.com fallback (if official API fails)
```

#### User Experience During Failures
- **Graceful Degradation**: Show available results even if one API fails
- **Error Messages**: Clear user feedback on failures
- **Retry Logic**: Automatic retry for transient failures
- **Loading States**: Proper loading indicators

### Development & Debugging

#### Debug Mode
```typescript
// Enable detailed logging
const DEBUG = true;
// Check browser console for API request/response details
```

#### API Testing Route
```
# Access test page during development
http://localhost:3000/auspost-test
```

#### Environment Variables
```bash
# Australia Post API
VITE_AUSPOST_API_KEY=your_auspost_api_key
# PropTrack API (for property addresses)
VITE_PROPTRACK_API_KEY=your_proptrack_api_key
VITE_PROPTRACK_API_SECRET=your_proptrack_api_secret
```

### Future Enhancement Opportunities

#### Enhanced Features
1. **Geolocation Integration**: GPS-based address suggestions
2. **Recent Searches**: Cache and display recent address searches
3. **Favorites**: Save frequently used addresses
4. **Bulk Address Processing**: Handle multiple addresses simultaneously
5. **Advanced Filtering**: Property type, price range filters

#### Performance Improvements
1. **Service Worker Caching**: Offline suburb data
2. **CDN Integration**: Cached suburb/postcode data
3. **GraphQL**: Optimized data fetching
4. **Real-time Updates**: WebSocket for live address updates

### Production Considerations

#### Scalability
- **Rate Limiting**: Implement client-side rate limiting
- **Caching Strategy**: Redis for frequently accessed data
- **CDN**: Static suburb data distribution
- **Load Balancing**: Multiple backend instances

#### Monitoring & Analytics
- **API Usage Tracking**: Monitor API call patterns
- **Error Rate Monitoring**: Track API failure rates
- **User Behavior**: Address search patterns and success rates
- **Performance Metrics**: Response times and success rates