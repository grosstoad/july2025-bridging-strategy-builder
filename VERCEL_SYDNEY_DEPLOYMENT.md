# Vercel Sydney deployment configuration

## Background

PropTrack API requires requests to come from Australian IP addresses. This was causing 403 Forbidden errors when deploying to Vercel's default US regions.

## Solution

We've configured Vercel to deploy the serverless functions to the Sydney (syd1) region by adding the following to `vercel.json`:

```json
{
  "regions": ["syd1"]
}
```

This ensures that:
1. API requests to PropTrack come from Australian IP addresses
2. Lower latency for Australian users
3. Compliance with PropTrack's geographic restrictions

## Important notes

- The Sydney region deployment may help with the IP blocking issue, but there's still a possibility that PropTrack's Akamai protection blocks Vercel's data center IPs even from Sydney
- If issues persist, consider using a proxy service with Australian residential IPs
- Monitor the Vercel dashboard to ensure functions are actually deployed to syd1

## Verification

After deployment, check:
1. Vercel dashboard → Functions tab → Should show "syd1" region
2. Test the API endpoints to see if PropTrack accepts requests
3. Check function logs for the actual IP addresses being used

## Alternative solutions if Sydney deployment doesn't work

1. **Proxy services with Australian IPs**:
   - BrightData (formerly Luminati) - offers Australian residential proxies
   - Smartproxy - Australian datacenter and residential IPs
   - Oxylabs - Australian proxy options

2. **Alternative hosting in Australia**:
   - AWS Lambda with Sydney region (ap-southeast-2)
   - Google Cloud Functions in Sydney
   - Azure Functions in Australia East

3. **Australian VPS providers**:
   - VentraIP
   - Vultr Sydney
   - DigitalOcean Sydney