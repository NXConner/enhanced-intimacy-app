## Setup, Run, and Build Guide

This repository is a Next.js 14 app with Prisma (PostgreSQL), NextAuth (credentials provider), and Capacitor for Android builds. This guide covers installing dependencies, configuring environment variables, initializing the database, running in development and production, building Android APKs, and deploying.

### Prerequisites

- **Node.js**: 20.x (matches Netlify config)
- **npm**: 9+ (bundled with Node 20)
- **PostgreSQL**: any managed provider (Neon, Supabase, RDS) or local Postgres
- Optional for Android:
  - **Java JDK**: 17+
  - **Android SDK**: Platform Android 34, Build Tools 34.0.0

### 1) Clone and install

```bash
git clone <your-repo-url> app
cd app
npm install
```

### 2) Configure environment

Create a `.env` file at the repo root with at least the following:

```bash
# Database (required)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"

# NextAuth (recommended; required in production)
NEXTAUTH_SECRET="generate_a_strong_random_secret"
# If running the app at a non-localhost URL (prod), set this too:
# NEXTAUTH_URL="https://your-domain.com"

# Optional build/runtime knobs
NEXT_DIST_DIR=".next"                 # custom Next.js dist dir if desired
NEXT_OUTPUT_MODE=""                   # set to "export" only if doing static export

# Optional features
ABACUSAI_API_KEY=""                   # used by /app/api/ai-coach route
```

Notes:
- `DATABASE_URL` is consumed by Prisma (`prisma/schema.prisma`).
- `NEXTAUTH_SECRET` is required for production with NextAuth.
- Keep `NEXT_OUTPUT_MODE` empty for a normal server build. Only set `export` if you understand the static export limitations.

### 3) Initialize the database

With `.env` configured:

```bash
# Generate the Prisma client
npx prisma generate

# For local dev, create the schema. Choose ONE of the following:

# Option A: Create and track a migration (recommended for teams)
npx prisma migrate dev --name init

# Option B: Push schema without creating a migration (quick start)
# npx prisma db push

# Seed sample data (uses scripts/seed.ts)
npx prisma db seed
```

### 4) Run the app (development)

```bash
npm run dev
# App runs at http://localhost:3000
```

Optional: run the bundled Size Sync Studio demo (frontend + API) proxied by Next.js rewrites at `/studio`:

```bash
# Starts both the studio Vite app and its API server
npm run dev:studio:all

# Or run individually
# npm run dev:studio:api
# npm run dev:studio
```

The Next.js dev server proxies:
- **/studio** → Vite dev server (http://localhost:8080)
- **/studio/api** → Express API (http://localhost:3001)

### 5) Production build and start

Server build (recommended):

```bash
# Build
npm run build

# Start (after build completes)
npm run start
# By default listens on PORT=3000 (set PORT to override)
```

Static export (advanced/optional; limited Next.js features):

```bash
NEXT_OUTPUT_MODE=export npm run build
# Static assets will be placed in ./out
```

### 6) Android build with Capacitor (optional)

Capacitor is configured in `capacitor.config.ts` with a dev server URL pointing to `http://10.0.2.2:3000` (Android emulator loopback to host). Typical workflow:

```bash
# Ensure a production or dev build of the web app exists if you want offline assets
# For server-backed runtime, you can skip export and serve from your dev server.

# Copy web assets into native platforms
npm run cap:sync

# Build debug APK
npm run android:assembleDebug

# Build release APK (unsigned)
npm run android:assembleRelease

# Open Android project (optional)
npm run cap:open:android
```

APK outputs (Gradle default):
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release (unsigned): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

To ship fully offline, use static export (`NEXT_OUTPUT_MODE=export npm run build`), set `webDir: 'out'` in `capacitor.config.ts` (already set), and remove the `server` block.

### 7) Deploy

- **Netlify**: The repo includes `netlify.toml`:
  - **Build command**: `npm run build`
  - **Publish directory**: `.next`
  - **Node**: 20
  - Plugin: `@netlify/plugin-nextjs`
  - Set environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) in your Netlify site settings. Use a managed Postgres (e.g., Neon).

- **Custom Node server / Docker**:
  - Build with `npm run build`, then run `npm run start` behind your process manager/reverse proxy.
  - Ensure `DATABASE_URL`, `NEXTAUTH_SECRET`, and any other required env vars are provided.

### Troubleshooting

- **Database connection errors**: Verify `DATABASE_URL`, that the database is reachable, and run `npx prisma migrate dev` (or `db push`) followed by `npx prisma db seed`.
- **NextAuth errors in production**: Set `NEXTAUTH_SECRET` (and `NEXTAUTH_URL` if applicable).
- **Android SDK errors**: Create `android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk` and ensure Build Tools 34.0.0 are installed.
- **Static export issues**: Some Next.js features (dynamic routes, rewrites) are limited or unsupported when `output: 'export'` is used. Prefer server build unless you need static hosting.

---

If you run into anything missing from this guide, please open an issue or PR with improvements.

