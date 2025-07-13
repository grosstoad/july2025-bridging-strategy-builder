# Vite proxy configuration

This guide provides a basic Vite configuration for setting up a proxy server. This is useful for avoiding CORS issues during development when your frontend application needs to make requests to a backend proxy server that handles PropTrack API authentication.

## Configuration

The following configuration sets up a proxy for any requests to `/api/` to be redirected to a local backend proxy server running on port 3100. The backend proxy handles PropTrack API authentication and forwards requests to the PropTrack API.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## PropTrack API proxy architecture

The proxy setup involves three layers:

1. **Frontend (Vite dev server)**: Serves the React application on port 3000 (or similar)
2. **Backend proxy server**: Runs on port 3100, handles PropTrack OAuth authentication
3. **PropTrack API**: The actual PropTrack API at `https://data.proptrack.com`

### Request flow

```
Frontend → Vite proxy → Backend proxy → PropTrack API
```

Example request path:
- Frontend makes request to: `/api/v2/address/suggest?q=sydney`
- Vite proxy forwards to: `http://localhost:3100/api/v2/address/suggest?q=sydney`
- Backend proxy adds authentication and forwards to: `https://data.proptrack.com/api/v2/address/suggest?q=sydney`

## Key options

- `target`: The backend proxy server URL (typically `http://localhost:3100`)
- `changeOrigin`: Sets the `Host` header of the request to the target URL
- `secure`: Set to `false` to allow proxying to HTTP backend during development
- `open`: Set to `true` to automatically open the application in your browser when the development server starts

## Environment setup

For the proxy to work properly, you need:

1. **Backend proxy server** running on port 3100 with PropTrack authentication
2. **PropTrack API credentials** configured in the backend proxy environment variables
3. **Frontend development server** with this proxy configuration

> **Note**: `vite.config.ts` is a tooling file, not a React component. Using a default export here is acceptable and does not violate the *no default exports for components* rule.
