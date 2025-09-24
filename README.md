# Enhanced Intimacy App — Android (Capacitor)

This repo is configured to build Android APKs using Capacitor.

- Debug APK: `app-debug.apk` (at repo root)
- Release APK (unsigned): `app-release.apk` (at repo root)

## Setup guide

For installing dependencies, environment setup, running, and building the web app, see [SETUP.md](./SETUP.md).

## Prerequisites

- Java 17+ (JDK). The Gradle wrapper will handle Gradle version.
- Android SDK with:
  - Platform: Android 34
  - Build Tools: 34.0.0

If building in a fresh environment, install the Android SDK CLI tools and accept licenses.

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

## APK output paths

- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release (unsigned): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

This workflow copies outputs to the repo root as `app-debug.apk` and `app-release.apk` for convenience.

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