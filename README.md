# Shëndet Përditë

Supplements shop in Albanian. Next.js 15 + Firebase rebuild of shendetperdite.com.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase emulators

Java 17+ is required (`firebase-tools` is pinned to v13 for JDK 17).

```bash
npm run dev:emulators
```

In another terminal:

```bash
npm run seed
npm run verify-catalog
```

Emulator UI: [http://127.0.0.1:4000](http://127.0.0.1:4000).

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run lighthouse` — production Lighthouse audit
- `npm run dev:emulators` — Firestore, Auth, Storage, Functions emulators
- `npm run seed` — catalog data (13 categories, 10 brands, 20 products)
- `npm run verify-catalog` — print catalog query results from the emulator
- `npm run verify-trigger` — confirm a variant stock change updates `totalStock`
- `npm test` — Zod schema unit tests
- `npm run test:rules` — Firestore rules tests (emulator must be running)

