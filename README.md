# Sofish - Social Gambling Platform

A complete full-stack social gambling platform built with Cloudflare Workers, D1, React, and Vite.

## Project Structure

```
sofish.io/
├── sofish-api/          # Backend API (Cloudflare Workers + Hono)
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Authentication, error handling
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript types
│   ├── migrations/      # D1 database migrations
│   └── wrangler.toml    # Cloudflare Workers configuration
│
└── sofish-frontend/     # Frontend (React + Vite)
    ├── src/
    │   ├── components/  # React components (AdSense, etc.)
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Page components
    │   └── utils/       # Utility functions
    └── index.html       # Entry HTML with AdSense integration
```

## Features

- **Authentication**: JWT-based auth with PBKDF2 password hashing (310,000 iterations)
- **Games**: Slots game with configurable betting
- **Leaderboards**: Real-time leaderboards with caching
- **Daily Bonuses**: Streak-based daily rewards
- **Ad Rewards**: Token rewards for watching ads
- **Google AdSense**: Integrated with pub-4626165154390205
- **Rate Limiting**: Protection against abuse
- **Security**: Secure headers, CORS, CSP

## Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (free tier works)
- Wrangler CLI

## Backend Setup (sofish-api)

### 1. Install dependencies

```bash
cd sofish-api
npm install
```

### 2. Create D1 Database

```bash
npx wrangler d1 create sofish-db
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "sofish-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

### 3. Create KV Namespaces

```bash
# Create SESSIONS namespace
npx wrangler kv:namespace create SESSIONS

# Create CACHE namespace
npx wrangler kv:namespace create CACHE
```

Update `wrangler.toml` with the IDs from the output:

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "YOUR_SESSIONS_KV_ID"
preview_id = "YOUR_SESSIONS_PREVIEW_KV_ID"

[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_CACHE_KV_ID"
```

### 4. Run Database Migrations

```bash
# Local development
npx wrangler d1 migrations apply sofish-db --local

# Production
npx wrangler d1 migrations apply sofish-db --remote
```

### 5. Set Production Secrets

```bash
# Set JWT secret
npx wrangler secret put JWT_SECRET
# Enter a strong random secret when prompted

# Set AdSense ID (optional for backend)
npx wrangler secret put ADSENSE_ID
# Enter: pub-4626165154390205
```

### 6. Local Development

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### 7. Deploy to Production

```bash
npm run deploy
```

## Frontend Setup (sofish-frontend)

### 1. Install dependencies

```bash
cd sofish-frontend
npm install
```

### 2. Update Environment Variables

Edit `.env` file:

```
VITE_API_URL=https://your-api-worker.workers.dev/api  # Update with your deployed API URL
VITE_ADSENSE_ID=pub-4626165154390205
```

### 3. Local Development

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name=sofish
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Games
- `POST /api/games/slots/spin` - Spin the slots (requires auth)
- `GET /api/games/leaderboard/:period` - Get leaderboard (daily/weekly/all)

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `GET /api/users/balance` - Get user balance (requires auth)
- `GET /api/users/history` - Get game history (requires auth)

### Rewards
- `POST /api/rewards/daily-bonus` - Claim daily bonus (requires auth)
- `POST /api/rewards/ad-watched` - Claim ad reward (requires auth)

## Database Schema

### users
- `id` (TEXT, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `username` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `token_balance` (INTEGER, default: 1000)
- `created_at` (INTEGER)
- `last_login` (INTEGER)
- `daily_bonus_claimed` (INTEGER)

### game_history
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `game_type` (TEXT)
- `bet` (INTEGER)
- `win` (INTEGER)
- `result` (TEXT, JSON)
- `created_at` (INTEGER)

### daily_bonuses
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `bonus_amount` (INTEGER)
- `claimed_at` (INTEGER)
- `streak_days` (INTEGER)

### ad_rewards
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `reward_amount` (INTEGER)
- `ad_type` (TEXT)
- `viewed_at` (INTEGER)

## Google AdSense Setup

### 1. AdSense Account
Your AdSense ID is already integrated: `pub-4626165154390205`

### 2. Cloudflare Configuration
In Cloudflare Dashboard → Security → WAF:
- Create rule: "Allow AdSense Crawlers"
- Field: User Agent
- Operator: Contains
- Value: `Mediapartners-Google`
- Action: Allow

### 3. Disable Rocket Loader and Mirage
In Cloudflare Dashboard → Speed → Optimization:
- Turn OFF "Rocket Loader" (causes revenue drops)
- Turn OFF "Mirage" (interferes with ad loading)

### 4. Create Ad Units
1. Go to Google AdSense Dashboard
2. Create ad units
3. Copy the `data-ad-slot` IDs
4. Update in `src/pages/SlotsGame.tsx`:
   ```tsx
   <AdSenseUnit adSlot="YOUR_ACTUAL_AD_SLOT_ID" />
   ```

## Cost Estimates

### Free Tier (Suitable for MVP/Testing)
- Workers: 100,000 requests/day
- D1: 5M rows read/day, 100K rows written/day
- KV: 100K reads/day, 1K writes/day
- Pages: Unlimited static requests

**Can handle**: ~3,000-5,000 daily active users

### Paid Plan (~$29-35/month for 50,000 MAU)
- Workers: $5 base + usage
- D1: Minimal costs with proper indexing
- KV: ~$3/month for session storage
- Durable Objects: $15/month with hibernation (if using real-time features)

## Production Checklist

- [ ] Set production JWT_SECRET via `wrangler secret put`
- [ ] Apply D1 migrations to remote database
- [ ] Update wrangler.toml with actual KV and D1 IDs
- [ ] Configure custom domain in Pages dashboard
- [ ] Update VITE_API_URL in frontend .env
- [ ] Set up Cloudflare WAF rule for AdSense
- [ ] Disable Rocket Loader and Mirage
- [ ] Create actual AdSense ad units and update slot IDs
- [ ] Test authentication flow end-to-end
- [ ] Verify CORS settings for production domain
- [ ] Enable Cloudflare Analytics

## Security Features

- PBKDF2 password hashing (310,000 iterations per OWASP 2024)
- JWT tokens with 2-hour expiration
- Rate limiting (100 req/min general, 10 req/min for games)
- Secure headers (CSP, HSTS, X-Frame-Options)
- CORS protection
- SQL injection protection via prepared statements
- Input validation with Zod

## Development Commands

### Backend
```bash
npm run dev           # Local development
npm run deploy        # Deploy to production
npm run types         # Generate TypeScript types
npm run db:migrate:local   # Apply migrations locally
npm run db:migrate:remote  # Apply migrations to production
```

### Frontend
```bash
npm run dev           # Local development
npm run build         # Build for production
npm run preview       # Preview production build
npm run deploy        # Deploy to Cloudflare Pages
```

## Troubleshooting

### "Insufficient tokens" error
- Check user balance in database
- Ensure migrations ran successfully
- Default balance is 1000 tokens

### AdSense not showing
- Verify Rocket Loader is disabled
- Check browser console for errors
- Ensure 150px spacing from game controls
- Wait 24-48 hours for new ad units to activate

### Database errors
- Verify D1 database ID in wrangler.toml
- Check migrations applied: `npx wrangler d1 migrations list sofish-db`
- Ensure proper indexes are created

### CORS errors
- Update CORS origins in `src/index.ts`
- Add your production domain to allowed origins

## License

MIT

## Support

For issues related to Cloudflare Workers, see: https://developers.cloudflare.com/workers/
For AdSense support: https://support.google.com/adsense
