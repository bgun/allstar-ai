# Railway Deployment Guide

This guide will help you deploy Allstar AI to Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- eBay Developer credentials (get from https://developer.ebay.com/)
- Supabase project set up

## Deployment Steps

### Option 1: Deploy via Railway CLI (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway project**
   ```bash
   railway init
   ```
   - Choose "Create a new project"
   - Name your project (e.g., "allstar-ai")

4. **Set environment variables**
   ```bash
   # Supabase (Frontend)
   railway variables set VITE_SUPABASE_URL=your-supabase-url
   railway variables set VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Supabase (Backend)
   railway variables set SUPABASE_URL=your-supabase-url
   railway variables set SUPABASE_API_KEY=your-supabase-anon-key

   # eBay API (use production credentials, not sandbox)
   railway variables set EBAY_APP_ID=your-ebay-app-id
   railway variables set EBAY_CERT_ID=your-ebay-cert-id
   railway variables set EBAY_DEV_ID=your-ebay-dev-id

   # Node environment
   railway variables set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Generate a domain**
   ```bash
   railway domain
   ```
   This will give you a public URL like `https://allstar-ai-production.up.railway.app`

### Option 2: Deploy via GitHub Integration

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create Railway project from GitHub**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the configuration

3. **Set environment variables in Railway Dashboard**
   - Go to your project settings
   - Navigate to "Variables" tab
   - Add all the environment variables from `.env.example`:
     - VITE_SUPABASE_URL
     - VITE_SUPABASE_ANON_KEY
     - SUPABASE_URL
     - SUPABASE_API_KEY
     - EBAY_APP_ID
     - EBAY_CERT_ID
     - EBAY_DEV_ID
     - NODE_ENV (set to "production")

4. **Deploy**
   - Railway will automatically build and deploy
   - Get your public URL from the "Settings" → "Domains" section

## Production Configuration

### eBay Production Credentials

For production, you need to switch from sandbox to production:

1. Get production credentials from eBay Developer Portal
2. Update `server/lib/ebayClient.js`:
   ```javascript
   // Change from:
   const OAUTH_BASE_URL = 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
   const API_BASE_URL = 'https://api.sandbox.ebay.com'

   // To:
   const OAUTH_BASE_URL = 'https://api.ebay.com/identity/v1/oauth2/token'
   const API_BASE_URL = 'https://api.ebay.com'
   ```

### Environment Variables Summary

Required environment variables for Railway:

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_SUPABASE_URL | Supabase project URL (frontend) | https://xxx.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase anon key (frontend) | eyJ... |
| SUPABASE_URL | Supabase project URL (backend) | https://xxx.supabase.co |
| SUPABASE_API_KEY | Supabase anon key (backend) | eyJ... |
| EBAY_APP_ID | eBay App ID / Client ID | YourApp-YourApp-PRD-... |
| EBAY_CERT_ID | eBay Cert ID / Client Secret | PRD-... |
| EBAY_DEV_ID | eBay Developer ID | Your dev ID |
| NODE_ENV | Node environment | production |
| PORT | Server port (auto-set by Railway) | Auto-assigned |

## Build Process

Railway will automatically:
1. Install dependencies: `npm install`
2. Build the frontend: `npm run build`
3. Start the server: `npm start` (runs `node server/index.js`)

The Express server will:
- Serve the API endpoints at `/api/*`
- Serve the built React app for all other routes

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Application Doesn't Start
- Check that PORT environment variable is being used
- Verify NODE_ENV is set to "production"
- Check server logs for errors

### eBay API Not Working
- Ensure you're using production credentials (not sandbox)
- Verify the API URLs in `server/lib/ebayClient.js` are production URLs
- Check eBay API credentials are correct

### Database Connection Fails
- Verify Supabase environment variables are set correctly
- Check Supabase project is accessible from Railway
- Ensure database migrations have been run

## Monitoring

After deployment, monitor your application:
- Railway Dashboard: View logs, metrics, and deployments
- Railway Logs: `railway logs`
- Application health: Check `/api/search` endpoint

## Scaling

Railway auto-scales based on traffic. For custom scaling:
- Go to Railway Dashboard → Settings → Resources
- Adjust CPU and Memory allocation as needed

## Cost Optimization

- Railway has a free tier with $5/month credit
- Monitor usage in Railway Dashboard
- Consider implementing caching for search results
- Optimize eBay API calls to reduce costs

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- eBay API Documentation: https://developer.ebay.com/docs
