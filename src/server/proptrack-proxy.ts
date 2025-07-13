import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const router = express.Router();

// PropTrack API configuration
const PROPTRACK_BASE_URL = 'https://data.proptrack.com';
const PROPTRACK_AUTH_HEADER = process.env.PROPTRACK_AUTH_HEADER;

// Token management
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry.getTime()) {
    return accessToken;
  }

  try {
    console.log('Requesting new PropTrack access token...');
    console.log('Auth header exists:', !!PROPTRACK_AUTH_HEADER);
    console.log('Auth header starts with Basic:', PROPTRACK_AUTH_HEADER?.startsWith('Basic'));
    
    const response = await fetch(`${PROPTRACK_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': PROPTRACK_AUTH_HEADER!,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
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

// PropTrack API proxy middleware
async function propTrackApiProxy(req: express.Request, res: express.Response) {
  try {
    const token = await getAccessToken();
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    
    // Use originalUrl to preserve the full path including /api/v1 or /api/v2
    // Keep the /api prefix for PropTrack API
    const apiPath = req.originalUrl.split('?')[0];
    const url = `${PROPTRACK_BASE_URL}${apiPath}${queryString ? '?' + queryString : ''}`;

    console.log(`Proxying to: ${url}`);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      console.error(`PropTrack API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'PropTrack API error',
        status: response.status,
        message: response.statusText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Australia Post API proxy (for suburb/postcode search)
async function ausPostApiProxy(req: express.Request, res: express.Response) {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const ausPostApiKey = process.env.VITE_AUSPOST_API_KEY;
    
    if (!ausPostApiKey || ausPostApiKey === 'your_auspost_api_key_here') {
      console.error('AusPost API: No valid API key configured');
      return res.status(500).json({ 
        error: 'Australia Post API not configured',
        message: 'Please set VITE_AUSPOST_API_KEY in .env.local'
      });
    }
    
    // Try the postcode search API instead
    const searchUrl = `https://digitalapi.auspost.com.au/postcode/search.json?q=${encodeURIComponent(query)}`;
    
    console.log(`AusPost API request: ${searchUrl}`);
    console.log(`Using API key: ${ausPostApiKey.substring(0, 8)}...`);

    const response = await fetch(searchUrl, {
      headers: {
        'auth-key': ausPostApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AusPost API error:', response.status, response.statusText, errorText);
      throw new Error(`Australia Post API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    console.log('AusPost API response:', JSON.stringify(data, null, 2));
    
    // Transform the response to match our expected format
    if (data?.localities?.locality) {
      const localities = Array.isArray(data.localities.locality) 
        ? data.localities.locality 
        : [data.localities.locality];
      
      // Filter out Post Office Boxes, only keep Delivery Areas
      const transformedData = {
        localities: localities
          .filter((loc: any) => loc.category === 'Delivery Area')
          .map((locality: any) => ({
            name: locality.location,
            state: locality.state,
            postcode: String(locality.postcode),
            latitude: locality.latitude,
            longitude: locality.longitude,
            category: 'Suburb'
          }))
      };
      
      res.json(transformedData);
    } else {
      // No results found
      res.json({ localities: [] });
    }
  } catch (error) {
    console.error('AusPost API error:', error);
    res.status(500).json({
      error: 'Australia Post API error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Route handlers

// PropTrack address suggestions
router.get('/v2/address/suggest', propTrackApiProxy);

// PropTrack property endpoints
router.get('/v2/properties/:propertyId/summary', propTrackApiProxy);
router.get('/v2/properties/:propertyId/listings', propTrackApiProxy);
router.get('/v1/properties/:propertyId/valuations/sale', propTrackApiProxy);
router.post('/v1/properties/valuations/sale', propTrackApiProxy); // Correct endpoint for property valuations

// PropTrack market data endpoints
router.get('/v2/market/sale/historic/median-sale-price', propTrackApiProxy);
router.get('/v2/market/sale/historic/median-days-on-market', propTrackApiProxy);
router.get('/v2/market/supply-and-demand/potential-buyers', propTrackApiProxy);

// Australia Post suburb/postcode search
router.get('/auspost/search', ausPostApiProxy);

export default router;