# rEBOOtBlood — Advanced EBOO & Plasmapheresis Blood Therapy

A conversion-focused medical wellness website for an EBOO & Plasmapheresis blood therapy clinic.

## Quick Start

```bash
# Prerequisites: Node.js 22+, pnpm 10+
pnpm install
cp .env.example .env   # Fill in your secrets
pnpm run dev           # http://localhost:3000
```

## Tech Stack

- **Frontend:** React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend:** Express 4 + tRPC 11
- **Database:** MySQL/TiDB (Drizzle ORM)
- **Auth:** Manus OAuth
- **Email:** Nodemailer + Google Workspace SMTP
- **Testing:** Vitest (96 tests)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Express + Vite HMR) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run all tests |
| `pnpm db:push` | Push schema changes to database |
| `pnpm exec tsc --noEmit` | TypeScript check |

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. See the file for descriptions of each variable.

## GitHub Secrets Required for CI

Add these as repository secrets (Settings → Secrets and variables → Actions):

- `DATABASE_URL`
- `JWT_SECRET`
- `PHI_ENCRYPTION_KEY`
- `SMTP_USER`
- `SMTP_APP_PASSWORD`
- `LINKARTEMIS_API_KEY`
- `GODADDY_API_KEY`
- `GODADDY_API_SECRET`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `OWNER_OPEN_ID`
- `OWNER_NAME`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `VITE_FRONTEND_FORGE_API_KEY`
- `VITE_FRONTEND_FORGE_API_URL`
- `VITE_APP_TITLE`
- `VITE_APP_LOGO`

## Project Structure

```
client/src/pages/       # Route-level React components
client/src/components/  # Reusable UI (shadcn/ui + site-specific)
client/src/hooks/       # Custom hooks (useSeo, useTierCta, etc.)
client/src/lib/         # Utilities, tRPC client, article content
server/_core/           # Framework infra (auth, email, APIs, middleware)
server/routers/         # tRPC procedure routers
server/db.ts            # Database query helpers
shared/                 # Code shared between client & server
drizzle/                # Database schema & migrations
```

## Compliance

- PHI encrypted at rest (AES-256-GCM)
- Admin-only access with full audit logging
- Email notifications exclude health-screening data
- Medical disclaimer on all educational content

## License

Private — All rights reserved.

