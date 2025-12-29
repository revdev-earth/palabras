Palabras is a Next.js app for managing a personal word library, recognizing unknown words from text, and practicing with spaced repetition scoring.

## Features

- Text recognition: paste text and highlight known/unknown words with quick add.
- Word library: filter, tag, edit, and paginate entries.
- Practice flows: score updates and progress tracking.
- Auth + sync: user data and recognition history synced to Prisma.

## Tech Stack

- Next.js (App Router)
- Redux Toolkit
- Prisma (SQLite/libSQL or Postgres)

## Setup

1. Install deps

```bash
pnpm install
```

2. Env
   Create `.env` with at least:

```
DATABASE_URL=...
```

Optional:

```
SEED_PASSWORD=...
```

3. Prisma

```bash
pnpm db:generate
pnpm db:push
```

4. Seed (optional)

```bash
pnpm db:seed
```

5. Run dev

```bash
pnpm dev
```

Open http://localhost:3000

## Routes

- `/` Reconocimiento
- `/practicas`
- `/biblioteca`

## Notes

- Prisma schema auto-selects SQLite vs Postgres using `DATABASE_URL` in `prisma.config.ts`.
- Recognition text + history are stored in the `text_recognition` table per user.

## Build

```bash
pnpm build
pnpm start
```

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm db:generate`
- `pnpm db:push`
- `pnpm db:migrate`
- `pnpm db:seed`
