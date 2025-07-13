import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proptrackProxy from '../../api/proptrack-proxy.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3100;

// CORS configuration - allow all origins in development
app.use(cors({ 
  origin: true,           // Allows all origins in development
  credentials: true       // Supports cookies/auth headers
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount all API routes under /api prefix
app.use('/api', proptrackProxy);

// Only start server in development (serverless in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`PropTrack proxy server running on port ${PORT}`);
    console.log(`CORS enabled for all origins`);
    
    if (!process.env.PROPTRACK_AUTH_HEADER) {
      console.warn('WARNING: PROPTRACK_AUTH_HEADER not set');
    } else {
      console.log('PropTrack auth header configured');
    }
  });
}

// Export for serverless deployment
export default app;