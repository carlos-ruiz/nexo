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

## Git Hooks

Husky runs the following hooks automatically:

| Hook         | Trigger      | What it does                                                                                                                                                                                |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | Every commit | Runs `lint-staged` — ESLint + Prettier on staged files only. Fixes auto-fixable issues and re-stages them. Aborts the commit if ESLint finds an error it cannot fix.                        |
| `commit-msg` | Every commit | Validates the commit message against Conventional Commits via `commitlint`. Aborts if the format is wrong.                                                                                  |
| `pre-push`   | Every push   | Runs `pnpm audit --audit-level=high`. Aborts the push if any `high` or `critical` severity vulnerability is found in the dependency tree. Fix or override the vulnerability before pushing. |

Direct pushes to `main` are also blocked by the `pre-push` hook — all changes must go through a pull request.

## Notes

- Keep pnpm-lock.yaml committed and up to date.
- CI uses pnpm with frozen lockfile to guarantee reproducible installs.
- `package-lock.json` is intentionally not used in this repository.
- `pnpm-workspace.yaml` serves two purposes:
  - `onlyBuiltDependencies`: allowlist of packages permitted to run install scripts (e.g. `postinstall`). Any package not listed here will have its build scripts silently skipped by pnpm, preventing supply-chain attacks from arbitrary script execution during `pnpm install`.
  - `overrides`: forces minimum safe versions for transitive dependencies that carry known CVEs, ensuring nested packages are patched even when their direct parents have not yet released an update.
