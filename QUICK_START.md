# Sofish Quick Start Guide

Get your Sofish platform running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Cloudflare account (free tier works)

## Quick Setup

### 1. Install Wrangler globally
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Backend Setup (5 commands)
```bash
cd sofish-api
npm install

# Create database and get ID
npx wrangler d1 create sofish-db
# Copy the database_id and update wrangler.toml

# Create KV namespaces
npx wrangler kv:namespace create SESSIONS
npx wrangler kv:namespace create CACHE
# Copy the IDs and update wrangler.toml

# Run migrations
npx wrangler d1 migrations apply sofish-db --local

# Set JWT secret
npx wrangler secret put JWT_SECRET
# Enter: your-super-secret-jwt-key-here

# Start dev server
npm run dev
```

Backend is now running at `http://localhost:8787`

### 4. Frontend Setup (3 commands)
```bash
cd ../sofish-frontend
npm install

# Update .env with your API URL
# VITE_API_URL=http://localhost:8787/api

# Start dev server
npm run dev
```

Frontend is now running at `http://localhost:3000`

## Test It Out

1. Open `http://localhost:3000`
2. Click "Get Started" → Register
3. Create an account
4. Go to "Slots Game"
5. Place a bet and spin!

## Deploy to Production

### Backend
```bash
cd sofish-api
npm run deploy
```

### Frontend
```bash
cd sofish-frontend
npm run build
npx wrangler pages deploy dist --project-name=sofish
```

## Important Configuration Updates

After creating resources, update these files:

### sofish-api/wrangler.toml
Replace placeholder IDs with actual values:
- `database_id` (from d1 create command)
- `SESSIONS` KV id and preview_id
- `CACHE` KV id

### sofish-frontend/.env
Update with deployed API URL:
```
VITE_API_URL=https://sofish-api.your-subdomain.workers.dev/api
```

## Need Help?

See the full README.md for:
- Detailed setup instructions
- API documentation
- Troubleshooting guide
- Production checklist
- AdSense configuration

## Common Issues

**"Invalid JWT" errors**: Make sure JWT_SECRET is set via `wrangler secret put`

**CORS errors**: Update allowed origins in `sofish-api/src/index.ts`

**Database not found**: Verify database_id in wrangler.toml matches the created database

**AdSense not showing**: Disable Rocket Loader in Cloudflare dashboard
