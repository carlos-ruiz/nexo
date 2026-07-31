# Contributing

## Package Manager

This repository uses pnpm as the single package manager.

## Runtime Requirements

- Node.js 24.x
- pnpm 10.x

For version policy and enforcement details, see [README.md](README.md) under Node.js Version Policy.

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a reachable PostgreSQL database.

## Local Setup

1. Install dependencies:
   pnpm install
2. Generate Prisma client:
   pnpm prisma:generate
3. Run typecheck:
   pnpm typecheck
4. Run lint:
   pnpm lint
5. Run migrations in development (when schema changes):
   pnpm prisma:migrate:dev
6. Start development server:
   pnpm dev
7. Run production build check:
   pnpm build

## Notes

- Keep pnpm-lock.yaml committed and up to date.
- CI uses pnpm with frozen lockfile to guarantee reproducible installs.
- `package-lock.json` is intentionally not used in this repository.
- `pnpm-workspace.yaml` serves two purposes:
  - `onlyBuiltDependencies`: allowlist of packages permitted to run install scripts (e.g. `postinstall`). Any package not listed here will have its build scripts silently skipped by pnpm, preventing supply-chain attacks from arbitrary script execution during `pnpm install`.
  - `overrides`: forces minimum safe versions for transitive dependencies that carry known CVEs, ensuring nested packages are patched even when their direct parents have not yet released an update.
