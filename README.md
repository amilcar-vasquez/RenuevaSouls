# Renueva Souls

Production-ready SvelteKit + SQLite application for collecting follow-up submissions from new believers during the Renueva evangelism event.

## Stack

- SvelteKit (latest stable 2.x)
- SQLite with `better-sqlite3`
- `bcrypt` password hashing
- `zod` validation
- Cookie-based session auth (HTTPOnly)
- CSV export
- In-memory rate limiting middleware (5 submissions / 10 min / IP)

## Project structure

```txt
.
├── scripts/
│   ├── create-admin.ts
│   └── init-db.ts
├── src/
│   ├── lib/
│   │   ├── validation.ts
│   │   └── server/
│   │       ├── auth.ts
│   │       ├── db.ts
│   │       └── rateLimit.ts
│   ├── routes/
│   │   ├── +page.server.ts
│   │   ├── +page.svelte
│   │   └── admin/
│   │       ├── +page.server.ts
│   │       ├── +page.svelte
│   │       ├── export.csv/+server.ts
│   │       ├── login/+page.server.ts
│   │       ├── login/+page.svelte
│   │       └── logout/+server.ts
│   ├── app.d.ts
│   ├── app.html
│   └── hooks.server.ts
├── .env.example
├── package.json
└── svelte.config.js
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   cp .env.example .env
   ```

3. Set a secure secret in `.env`:

   - `SESSION_SECRET`: long random string (32+ chars)
   - `DB_PATH`: SQLite file path (default: `./data/renueva.db`)

## Initialize database

```bash
npm run db:init
```

This creates:

- `submissions` table + indexes (`created_at DESC`, `wants_contact`)
- `admins` table

## Create first admin

```bash
npm run admin:create
```

Follow prompts for username and password.

## Run locally

```bash
npm run dev
```

- Public form: `http://localhost:5173/`
- Admin login: `http://localhost:5173/admin/login`
- Admin dashboard: `http://localhost:5173/admin`

## Production deployment

### Build and run

```bash
npm run build
npm run start
```

### Reverse proxy notes

Use Nginx/Caddy/Apache in front of Node and ensure forwarded IP headers are passed:

- `X-Forwarded-For`
- `X-Real-IP`

Rate limiting and IP logging use these headers.

## Backup SQLite file

If `DB_PATH=./data/renueva.db`, back up with:

```bash
cp ./data/renueva.db ./backups/renueva-$(date +%F-%H%M).db
```

Recommended: automate daily backups and store off-server.

## QR code instructions

Point your QR code to:

- `https://yourdomain.com`

Free generator example:

- https://www.qr-code-generator.com/ (paste your URL and download PNG/SVG)

Node library example:

```bash
npm install qrcode
node -e "import QRCode from 'qrcode'; await QRCode.toFile('renueva-qr.png', 'https://yourdomain.com')"
```

## Notes for expected load (100–400 submissions)

- SQLite with WAL mode is configured for reliable small/medium traffic.
- Inputs are validated on client and server.
- Sessions use signed cookies and HTTPOnly flags.
- CSV export supports admin filtering.
- Keep the app process managed with `systemd`, PM2, or Docker.
