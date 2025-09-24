## Windows PowerShell: Install, Run, and Build

This guide shows how to install dependencies, configure environment, run the web app, and build Android APKs from this repo using PowerShell.

### 1) Prerequisites

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

### 2) Clone and configure environment

```powershell
git clone <YOUR_REPO_URL>.git app-repo
cd app-repo

Copy-Item .env.example .env -Force
notepad .env  # Fill in NEXTAUTH_SECRET and DATABASE_URL at minimum
```

Minimum variables:

- `NEXTAUTH_SECRET`: a secure random string
- `DATABASE_URL`: PostgreSQL URL, e.g. `postgresql://postgres:postgres@localhost:5432/app?schema=public`

### 3) Use the helper PowerShell script

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

### 4) Manual commands (if you prefer)

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

### 5) Android outputs

- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release (unsigned): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

If signing is configured in Gradle, the signed APK or AAB will appear under the same outputs directory.

### 6) Troubleshooting

- `DATABASE_URL` missing: set it in `.env` and re-run `db:prepare`.
- Android SDK not found: set `ANDROID_SDK_ROOT` and ensure Build-Tools 34.0.0 installed.
- Port in use: stop other servers or change the port via `PORT` env var when running dev.
- Slow installs on CI: prefer `npm ci` over `npm install` for reproducible installs.

### 7) Scripts reference

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

