# PropTrack API 403 Forbidden Error on Vercel - Troubleshooting Guide

## Issue Summary

The PropTrack API is returning a 403 Forbidden error when attempting to obtain an OAuth token from Vercel Functions:

```
Access Denied
You don't have permission to access "http://data.proptrack.com/oauth2/token" on this server.
Reference #18.cd69dc17.1752407555.94686824
```

This error indicates an Akamai/EdgeSuite security block rather than invalid authentication credentials.

## Root Cause Analysis

### 1. Akamai Bot Detection

The error message format and reference number indicate this is an Akamai EdgeSuite security block. Akamai is a CDN/WAF (Web Application Firewall) service that PropTrack uses to protect their API from unauthorized access.

### 2. IP-Based Blocking

Vercel Functions run on shared infrastructure with dynamic IP addresses. These IPs may be:
- Previously flagged for suspicious activity by other users
- Classified as data center IPs (which are often blocked by WAFs)
- Not on PropTrack's IP allowlist

### 3. Missing Browser-Like Headers

The initial implementation was missing several headers that browsers typically send, which can trigger bot detection systems.

## Implemented Improvements

The API handler has been updated with:

1. **Comprehensive Headers**: Added browser-like headers including User-Agent, Accept-Language, Accept-Encoding, etc.
2. **Better Error Detection**: Specific detection for Akamai blocks with helpful error messages
3. **Enhanced Logging**: More detailed logging for debugging purposes

## Alternative Solutions

### Option 1: Proxy Service with Static IP (Recommended)

Use a proxy service that provides static IP addresses that can be whitelisted by PropTrack:

**Popular Services:**
- **QuotaGuard Static**: $19-39/month, provides static IPs
- **Fixie**: $5-500/month based on usage
- **IPburger**: Various pricing tiers

**Implementation Example with QuotaGuard:**

```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxyUrl = process.env.QUOTAGUARD_URL; // e.g., http://username:password@proxy.quotaguard.com:9293

async function getAccessToken(): Promise<string> {
  const agent = new HttpsProxyAgent(proxyUrl);
  
  const response = await fetch(`${PROPTRACK_BASE_URL}/oauth2/token`, {
    method: 'POST',
    agent: agent as any, // Type assertion needed for fetch
    headers: {
      'Authorization': PROPTRACK_AUTH_HEADER,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  // ... rest of the implementation
}
```

### Option 2: Alternative Hosting Providers

Deploy to a hosting provider that offers static IPs or better reputation:

1. **AWS Lambda with Elastic IP**
   - Deploy as Lambda function
   - Use NAT Gateway with Elastic IP
   - More complex but reliable

2. **Digital Ocean Apps/Functions**
   - Better IP reputation than Vercel
   - Static IP available with droplets

3. **Railway.app**
   - Simpler deployment than AWS
   - Better for APIs with IP restrictions

4. **Self-hosted VPS**
   - Complete control over IP
   - Can be whitelisted by PropTrack
   - Requires more maintenance

### Option 3: Edge Runtime with Proxy

Use Vercel Edge Functions with a proxy worker:

```typescript
// api/proptrack-edge.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Use a proxy service URL
  const PROXY_URL = process.env.PROXY_SERVICE_URL;
  
  // Forward request through proxy
  // Implementation depends on proxy service
}
```

### Option 4: Backend Service Architecture

Instead of serverless functions, use a persistent backend service:

1. **Dedicated Backend Server**
   - Node.js/Express server on a VPS
   - Static IP that can be whitelisted
   - Can cache tokens effectively

2. **Microservice on Kubernetes**
   - Deploy on a K8s cluster with egress IP
   - More scalable than single VPS

## Immediate Next Steps

1. **Contact PropTrack Support**
   - Explain you're using Vercel Functions
   - Ask if they can whitelist Vercel's IP ranges
   - Request alternative authentication methods

2. **Test with Proxy Service**
   - Sign up for QuotaGuard free trial
   - Test if requests work through their proxy
   - Measure latency impact

3. **Consider Hybrid Approach**
   - Keep non-PropTrack APIs on Vercel
   - Move only PropTrack proxy to different provider
   - Use environment variables to switch endpoints

## Testing the Current Implementation

Deploy the updated code and check the logs for more detailed error information:

```bash
# View Vercel function logs
vercel logs --follow

# Test the API endpoint directly
curl https://your-app.vercel.app/api/health

# Test with debug endpoint
curl https://your-app.vercel.app/api/debug
```

## Long-term Recommendations

1. **Implement Caching**: Cache PropTrack responses to minimize API calls
2. **Use CDN**: Put a CDN in front of your API to improve IP reputation
3. **Monitor IP Reputation**: Use services like IPQualityScore to monitor your IPs
4. **Implement Retry Logic**: Add exponential backoff for transient failures
5. **Consider API Gateway**: Use AWS API Gateway or similar for better control

## Environment Variables for Proxy Services

If using a proxy service, add these to your Vercel environment:

```bash
# QuotaGuard example
QUOTAGUARD_URL=http://username:password@proxy.quotaguard.com:9293

# Fixie example
FIXIE_URL=http://username:password@proxy.fixie.com:80

# Custom proxy
PROXY_HOST=your-proxy.com
PROXY_PORT=8080
PROXY_USERNAME=username
PROXY_PASSWORD=password
```

## Conclusion

The 403 error is due to Akamai's security system blocking Vercel's IP addresses. While we've improved the request headers, the most reliable solution is to use a proxy service with static IPs or deploy the PropTrack integration to a different hosting provider that offers better IP control.