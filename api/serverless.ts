import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { propTrackRouter } from '../src/server/proptrack-proxy';

// Load environment variables
dotenv.config({ path: '.env.local' });

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

// Mount PropTrack routes
app.use('/api', propTrackRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Export for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  await new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};