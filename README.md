# Arcange Personal Portfolio

A modern, colorful, full-stack personal portfolio and content management platform for Mukamyi Izere Arcange.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Google OAuth
- REST API
- Vercel (web)
- Render (API)

## Apps
- `apps/web` — public portfolio
- `apps/admin` — secure admin dashboard
- `apps/api` — backend API

## Production URLs
- Web: https://arcange-portfolio.vercel.app
- API: https://arcange-portfolio-api.onrender.com
- Health check: https://arcange-portfolio-api.onrender.com/api/health

## Environment variables
### Vercel — `apps/web`
Set:
- `VITE_API_URL=https://arcange-portfolio-api.onrender.com`

See `apps/web/.env.example` for the template.

### Render — `apps/api`
Set:
- `MONGODB_URI`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_EMAIL`
- `NODE_ENV=production`
- `WEB_URL=https://arcange-portfolio.vercel.app`
- `ADMIN_URL=https://arcange-portfolio.vercel.app/admin`

See `apps/api/.env.example` for the template. Never commit real secrets, OAuth credentials, database passwords, or production `.env` files.

## Frontend → API connection
The web app reads `VITE_API_URL` and requests public content from:
`/api/content/public`

The Express API allows the configured `WEB_URL` and `ADMIN_URL` through CORS and stores sessions in MongoDB.

## Security
Admin access uses Google authentication plus an authorized-email allowlist. Secrets must remain in deployment environment variables and must never be committed to Git.

## Development
From the repository root:

```bash
npm install
```

Run the web app and API using the workspace scripts/configuration in the repository.

## Deployment
1. Push changes to `main` on GitHub.
2. Vercel builds `apps/web`.
3. Render builds and starts `apps/api`.
4. Configure production environment variables in Vercel and Render.
5. Verify the API health endpoint and then test the portfolio in the browser.
