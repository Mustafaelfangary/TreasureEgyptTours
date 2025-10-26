# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands you’ll commonly use

### Web app (Next.js at repository root)
- Start dev server: `npm run dev`
- Build: `npm run build`
- Start production server: `npm start`
- Type-check only: `npx tsc --noEmit`
- Lint: `npx eslint . --ext .js,.jsx,.ts,.tsx`

Notes
- The README also documents starting the dev server and opening http://localhost:3000.
- There is no test runner configured at the root at this time.

### Database (Prisma, used by the web app)
- Generate client: `npx prisma generate`
- Push schema to dev DB: `npx prisma db push`
- Create a named migration: `npx prisma migrate dev --name <migration_name>`
- Open Prisma Studio: `npx prisma studio`
- Seed data (full): `npx tsx prisma/seed.ts`
- Seed data (minimal): `npx tsx prisma/seed-minimal.ts`
- Verify DB connectivity: `npx prisma db pull`

### Mobile app (Expo, mobile-app/)
- Change directory: `cd mobile-app`
- Start with Expo: `npm run start-expo`
- Run on Android (Expo): `npm run android-expo`
- Run on iOS (Expo): `npm run ios-expo`
- Web preview (Expo): `npm run web`
- Clean Metro cache: `npm run clean`

### React Native CLI app (final-android-app/)
- Change directory: `cd final-android-app`
- Start packager: `npm start`
- Run on Android: `npm run android`
- Lint: `npm run lint`
- Run all tests: `npm test`
- Run a single Jest test file: `npx jest path/to/test.test.ts`
- Run tests by name pattern: `npx jest -t "test name substring"`

### Native Android app (android-app/; Kotlin + Compose)
- Change directory: `cd android-app`
- Build debug APK: `./gradlew assembleDebug` (macOS/Linux) or `./gradlew.bat assembleDebug` (Windows)
- Build release APK: `./gradlew assembleRelease`
- Run unit tests: `./gradlew test`
- Example: run a single test class: `./gradlew test --tests com.dahabiyat.nilecruise.YourTestClass`

## High-level architecture and structure

This repository is a multi-app workspace combining a web application, two React Native apps, and a native Android app.

- Web application (repository root)
  - Next.js 15 (App Router), React 19, TypeScript (ESM). Styling and UI libraries installed include Tailwind CSS, Radix UI, and MUI.
  - Data layer uses Prisma with schema and migrations in prisma/. Seed scripts exist for both full and minimal datasets.
  - Linting is configured via Next’s ESLint presets (flat config and legacy config present). No root-level test runner is configured.

- Expo mobile app (mobile-app/)
  - React Native with Expo tooling and a tab/drawer navigation model (see mobile-app/README.md). Scripts are provided for starting and platform builds via Expo/EAS.

- React Native CLI app (final-android-app/)
  - Pure React Native (no Expo) with its own ESLint and Jest setup. Node >= 18 is required (see engines in package.json). Focused on Android with TS and RN 0.80.x.

- Native Android app (android-app/)
  - Kotlin + Jetpack Compose, MVVM, Hilt, Retrofit/OkHttp, Room, etc. Comes with Gradle wrappers and multiple build scripts (.bat/.sh/.ps1) and detailed docs for building and variants. Intended to mirror the site’s functionality with mobile-first UX.

Cross-app considerations
- Mobile apps consume the same API endpoints as the web application (see README.md, “Multi-Platform Development”).
- The shared theme and content model are reflected across apps; web data is modeled in Prisma with migrations and seeds.

## Additional repository notes for development
- ESLint at the root uses Next’s presets. Use the Lint command above when working on the web app; use the app-local lint/test scripts when working inside final-android-app.
- For Prisma workflows, prefer db push for local development, and named migrations for long-lived branches or promotion.
- Refer to each subproject’s README for platform-specific UX and structure details:
  - README.md (web root) for Next.js quickstart
  - mobile-app/README.md (Expo app)
  - final-android-app/README.md (RN CLI app)
  - android-app/README.md (native Android app)
