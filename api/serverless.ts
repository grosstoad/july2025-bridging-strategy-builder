import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import propTrackRouter from '../src/server/proptrack-proxy';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Log environment status for debugging
console.log('Serverless function starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('PropTrack auth configured:', !!process.env.PROPTRACK_AUTH_HEADER);
console.log('AusPost API key configured:', !!process.env.VITE_AUSPOST_API_KEY);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN?.split(',') || true
    : true,
  credentials: true
}));

app.use(express.json());

// Mount PropTrack routes at root (Vercel strips /api prefix)
app.use('/', propTrackRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Export for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await new Promise((resolve, reject) => {
      app(req as any, res as any, (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Function invocation failed',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'An error occurred'
    });
  }
};