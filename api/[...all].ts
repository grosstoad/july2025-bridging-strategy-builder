import type { VercelRequest, VercelResponse } from '@vercel/node';

// Environment variables
const PROPTRACK_BASE_URL = 'https://data.proptrack.com';
const PROPTRACK_AUTH_HEADER = process.env.PROPTRACK_AUTH_HEADER;
const AUSPOST_API_KEY = process.env.VITE_AUSPOST_API_KEY;

// Token management
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

// Get or refresh PropTrack access token
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry.getTime()) {
    return accessToken;
  }

  if (!PROPTRACK_AUTH_HEADER) {
    throw new Error('PROPTRACK_AUTH_HEADER environment variable is not set');
  }

  try {
    console.log('Requesting new PropTrack access token...');
    
    const response = await fetch(`${PROPTRACK_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': PROPTRACK_AUTH_HEADER,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', response.status, errorText);
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const tokenData = await response.json() as any;
    accessToken = tokenData.access_token;
    tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 30000); // 30 second buffer

    console.log('PropTrack token refreshed successfully');
    
    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }
    
    return accessToken;
  } catch (error) {
    console.error('Failed to get PropTrack access token:', error);
    throw error;
  }
}

// Handle PropTrack API requests
async function handlePropTrackRequest(path: string, req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getAccessToken();
    
    // Build the full URL with query parameters
    const url = new URL(`${PROPTRACK_BASE_URL}/api/${path}`);
    if (req.query) {
      Object.entries(req.query).forEach(([key, value]) => {
        if (key !== 'all' && value) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log(`Proxying PropTrack request to: ${url.toString()}`);

    const propTrackResponse = await fetch(url.toString(), {
      method: req.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const responseData = await propTrackResponse.json();

    if (!propTrackResponse.ok) {
      console.error('PropTrack API error:', propTrackResponse.status, responseData);
      res.status(propTrackResponse.status).json({
        error: responseData.error || 'PropTrack API error',
        message: responseData.message || propTrackResponse.statusText,
      });
      return;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('PropTrack proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Handle Australia Post API requests
async function handleAusPostRequest(req: VercelRequest, res: VercelResponse) {
  try {
    if (!AUSPOST_API_KEY) {
      throw new Error('VITE_AUSPOST_API_KEY environment variable is not set');
    }

    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Missing search query parameter' });
      return;
    }

    const url = `https://digitalapi.auspost.com.au/postcode/search.json?q=${encodeURIComponent(q)}`;
    console.log(`Proxying AusPost request to: ${url}`);

    const response = await fetch(url, {
      headers: {
        'AUTH-KEY': AUSPOST_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AusPost API error:', response.status, errorText);
      res.status(response.status).json({
        error: `Australia Post API failed: ${response.status} ${response.statusText}`,
      });
      return;
    }

    const data = await response.json() as any;
    
    // Transform the response to match our expected format
    if (data?.localities?.locality) {
      const localities = Array.isArray(data.localities.locality) 
        ? data.localities.locality 
        : [data.localities.locality];
      
      // Filter out Post Office Boxes, only keep Delivery Areas
      const transformedData = {
        localities: localities
          .filter((loc: any) => loc.category === 'Delivery Area')
          .map((loc: any) => ({
            id: `${loc.postcode}-${loc.location}`,
            location: loc.location,
            postcode: loc.postcode,
            state: loc.state,
            category: loc.category,
            latitude: loc.latitude ? parseFloat(loc.latitude) : undefined,
            longitude: loc.longitude ? parseFloat(loc.longitude) : undefined,
          }))
      };
      
      res.status(200).json(transformedData);
    } else {
      res.status(200).json({ localities: [] });
    }
  } catch (error) {
    console.error('AusPost proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log for debugging
  console.log('API Route:', req.url);
  console.log('Query params:', req.query);
  console.log('Environment check - PropTrack auth:', !!PROPTRACK_AUTH_HEADER);
  console.log('Environment check - AusPost key:', !!AUSPOST_API_KEY);

  // Extract the path from the catch-all parameter
  const { all } = req.query;
  const fullPath = Array.isArray(all) ? all.join('/') : all || '';

  // Route to appropriate handler
  if (fullPath === 'health') {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'production',
      propTrackConfigured: !!PROPTRACK_AUTH_HEADER,
      ausPostConfigured: !!AUSPOST_API_KEY,
    });
  } else if (fullPath.startsWith('auspost/search')) {
    await handleAusPostRequest(req, res);
  } else if (fullPath.startsWith('v2/') || fullPath.startsWith('v1/')) {
    await handlePropTrackRequest(fullPath, req, res);
  } else {
    res.status(404).json({ error: 'Not found', path: fullPath });
  }
}