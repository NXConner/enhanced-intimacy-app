# Enhanced Intimacy App — Android (Capacitor)

This repo is configured to build Android APKs using Capacitor.

- Debug APK: `app-debug.apk` (at repo root)
- Release APK (unsigned): `app-release.apk` (at repo root)

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


## Windows (PowerShell) quick guide

This section summarizes Windows-specific steps using PowerShell. For full details, see the general guide above.

### Prerequisites

- **Node.js 18+** (LTS recommended). Optional: `nvm` for Windows
- **Git**
- (Optional, for Android builds) **Android SDK** with Build-Tools 34.0.0 and Platform 34

Verify tools:

```powershell
node -v
npm -v
git --version
```

For Android builds also set `ANDROID_SDK_ROOT` and accept licenses using the SDK Manager.

### Clone and configure environment

```powershell
git clone <YOUR_REPO_URL>.git app-repo
cd app-repo

Copy-Item .env.example .env -Force
notepad .env  # Fill in NEXTAUTH_SECRET and DATABASE_URL at minimum
```

Minimum variables:

- `NEXTAUTH_SECRET`: a secure random string
- `DATABASE_URL`: PostgreSQL URL, e.g. `postgresql://postgres:postgres@localhost:5432/app?schema=public`

### Use the helper PowerShell script

The repo includes `scripts/install-run-build.ps1` to automate common tasks. Run PowerShell as Administrator or ensure script execution is allowed:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Common invocations:

```powershell
# Install dependencies
./scripts/install-run-build.ps1 -Task install

# Prepare database (Prisma generate + push, optional seed)
./scripts/install-run-build.ps1 -Task db:prepare -EnvFile .env

# Start dev server (Next.js on http://localhost:3000)
./scripts/install-run-build.ps1 -Task dev -EnvFile .env

# Build the web app
./scripts/install-run-build.ps1 -Task build:web -EnvFile .env

# Build Android debug APK (requires Android SDK)
./scripts/install-run-build.ps1 -Task build:android:debug

# Build Android release APK (unsigned unless signing configured)
./scripts/install-run-build.ps1 -Task build:android:release

# Do everything: install, db prepare, build web, build Android debug
./scripts/install-run-build.ps1 -Task all -EnvFile .env
```

Optional parameters:

- `-NodeVersion <semver>`: If you use `nvm` on Windows, the script will switch Node (e.g., `-NodeVersion 18.20.4`).
- `-EnvFile <path>`: Load env from a non-default file.

### Manual commands (alternative)

```powershell
npm ci --no-audit --no-fund

# Prisma (requires DATABASE_URL)
npx --yes prisma generate
npx --yes prisma db push
npx --yes tsx --require dotenv/config scripts/seed.ts  # optional seed

# Dev
npm run dev

# Build web
npm run build

# Capacitor / Android
npm run cap:sync
npm run android:assembleDebug
npm run android:assembleRelease
```

### Android outputs

- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release (unsigned): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

If signing is configured in Gradle, the signed APK or AAB will appear under the same outputs directory.

### Scripts reference

From `package.json`:

```11:24:/workspace/package.json
  "scripts": {
    "dev": "next dev",
    "dev:studio": "cd external/size-sync-studio && npm install && VITE_APP_BASENAME=/studio VITE_API_BASE=/studio/api npm run dev",
    "dev:studio:api": "cd external/size-sync-studio && npm run server",
    "dev:studio:all": "concurrently \"npm run dev:studio:api\" \"npm run dev:studio\"",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cap:init": "npx --yes cap init app app.com.example --web-dir=out",
    "cap:add:android": "npx --yes cap add android",
    "cap:sync": "npx --yes cap sync",
    "cap:open:android": "npx --yes cap open android",
    "cap:copy": "npx --yes cap copy",
    "cap:assets": "npx --yes cap copy android",
    "cap:doctor": "npx --yes cap doctor",
    "android:assembleDebug": "cd android && ./gradlew assembleDebug | cat",
    "android:assembleRelease": "cd android && ./gradlew assembleRelease | cat"
  }
```


## Capacitor config

Capacitor is set to use a server URL fallback for Android emulator to load the web app from your dev server at `http://10.0.2.2:3000`.

```1:12:capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.com.example',
  appName: 'app',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};

export default config;
```

- To ship fully offline, export the Next.js app to `out/` and remove the `server` block.
- Note: Next.js `rewrites` do not work with static export; update routes or keep server mode.

## Common commands

- Sync Capacitor (copies web assets and updates native project):

```bash
npm run cap:sync
```

- Build debug APK:

```bash
npm run android:assembleDebug
```

- Build release APK (unsigned by default):

```bash
npm run android:assembleRelease
```

- Open Android project in Android Studio (optional):

```bash
npm run cap:open:android
```



## Signing a release APK

To distribute on Play, sign and align the release build. Two options:

### Option A: Configure Gradle signing (recommended)

1) Generate a keystore:

```bash
keytool -genkeypair -v \
  -keystore android/release.keystore \
  -alias app-release \
  -keyalg RSA -keysize 2048 -validity 10000
```

2) Create `android/release-signing.properties` (do not commit):

```properties
storeFile=release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=app-release
keyPassword=YOUR_KEY_PASSWORD
```

3) In `android/app/build.gradle`, add a `signingConfigs.release` that reads this properties file and set `buildTypes.release.signingConfig = signingConfigs.release`.

4) Build:

```bash
npm run android:assembleRelease
```

Signed APK will be in `android/app/build/outputs/apk/release/`.

### Option B: Sign the unsigned APK

After `assembleRelease`, sign and align manually:

```bash
# Zipalign (if needed)
$ANDROID_SDK_ROOT/build-tools/34.0.0/zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  app-release-aligned.apk

# Apksigner
$ANDROID_SDK_ROOT/build-tools/34.0.0/apksigner sign \
  --ks android/release.keystore \
  --ks-key-alias app-release \
  app-release-aligned.apk
```

## Troubleshooting

- SDK location not found: create `android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk`.
- Emulator cannot reach dev server: use `10.0.2.2` as host for Android emulator.
- Static export errors: fix build issues (e.g., JSX parse issues) and re-run `NEXT_OUTPUT_MODE=export npm run build` to populate `out/`.

## Notes

- `.gitignore` excludes large artifacts: `node_modules/`, `.next/`, `out/`, and Android build outputs.
- The Android platform is under `android/`; Capacitor config is in `capacitor.config.ts`.