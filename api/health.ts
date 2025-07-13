import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasPropTrackAuth: !!process.env.PROPTRACK_AUTH_HEADER,
      hasAusPostKey: !!process.env.VITE_AUSPOST_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
}