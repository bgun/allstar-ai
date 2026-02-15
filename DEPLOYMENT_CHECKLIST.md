# Railway Deployment Checklist

Quick checklist to deploy Allstar AI to Railway.

## Pre-Deployment

- [ ] eBay Production credentials ready (not sandbox)
  - [ ] EBAY_APP_ID (production)
  - [ ] EBAY_CERT_ID (production)
  - [ ] EBAY_DEV_ID

- [ ] Supabase project configured
  - [ ] Database migrations run
  - [ ] Environment variables ready

## Deployment Steps

### Option A: Railway CLI (Fastest)

```bash
# 1. Login to Railway
railway login

# 2. Initialize project
railway init

# 3. Set environment variables
railway variables set NODE_ENV=production
railway variables set VITE_SUPABASE_URL=your-url
railway variables set VITE_SUPABASE_ANON_KEY=your-key
railway variables set SUPABASE_URL=your-url
railway variables set SUPABASE_API_KEY=your-key
railway variables set EBAY_APP_ID=your-production-app-id
railway variables set EBAY_CERT_ID=your-production-cert-id
railway variables set EBAY_DEV_ID=your-dev-id

# 4. Deploy
railway up

# 5. Generate public domain
railway domain
```

### Option B: GitHub Integration

1. Push code to GitHub
2. Go to https://railway.app
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Set environment variables in Railway dashboard
6. Deploy automatically

## Post-Deployment

- [ ] Test the deployment URL
- [ ] Verify eBay API is working (should see production listings)
- [ ] Test search functionality
- [ ] Test save/hide functionality
- [ ] Check Railway logs for errors

## Environment Variables Required

```
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=eyJ...
EBAY_APP_ID=YourApp-YourApp-PRD-...
EBAY_CERT_ID=PRD-...
EBAY_DEV_ID=your-dev-id
```

## Verification

After deployment, test these URLs (replace with your Railway domain):

- [ ] Homepage: https://your-app.railway.app/
- [ ] Search page: https://your-app.railway.app/search
- [ ] API health: https://your-app.railway.app/api/search (POST)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Railway logs, verify package.json scripts |
| eBay API returns no results | Verify production credentials, check API mode in logs |
| Database connection fails | Verify Supabase environment variables |
| 500 errors | Check Railway logs for server errors |

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Monitor usage and costs
- [ ] Set up alerts for errors
- [ ] Configure auto-deployments from GitHub
