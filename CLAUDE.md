# CLAUDE.md — Nexo

## Cursor

In Cursor, scoped rules derived from this file live in `.cursor/rules/`. Treat this document as the source of truth; when project context changes here, update the rules to match.

## What is Nexo

Nexo is an AI-native, multilingual personal finance SaaS platform. Its purpose is to help individuals and families make better financial decisions — not just record transactions. It targets a complete financial operating system covering accounts, transactions, credit cards, loans, assets, liabilities, budgets, goals, reports, and AI-powered insights.

Full product documentation lives in `docs/product/`. Read in this order:

- `docs/product/vision.md` — why Nexo exists
- `docs/product/principles.md` — how every decision is evaluated
- `docs/product/scope.md` — what is and is not in scope
- `docs/product/modules.md` — official module boundaries (read before touching any domain code)
- `docs/product/roadmap.md` — what gets built and when
- `docs/product/domain-model.md` — bounded contexts, aggregates, domain events, and invariants
- `docs/product/architecture.md` — folder structure, tech stack decisions, engineering standards

---

## Architecture

Nexo is a **Modular Monolith** using **Hexagonal Architecture** and **Domain-Driven Design**.

Three layers. Dependencies always point upward — lower layers never depend on higher layers:

```
Business Capabilities      →  Insights (Reports, AI)
        ▲
Core Financial Domain      →  Finance, Planning, Portfolio
        ▲
Platform Services          →  Identity, Administration, Integrations
```

- Core Financial Domain never depends on Business Capabilities
- Platform Services never contain business rules
- Business Capabilities consume the Core Financial Domain but never own financial data

Each module is internally structured into three layers: **Domain** (pure business logic) → **Application** (use cases) → **Infrastructure** (Prisma, external adapters). See `docs/product/architecture.md` for the full breakdown.

---

## Module Map

The codebase is organized into seven modules, one per Bounded Context. Every business concept belongs to exactly one module.

| Module           | Layer                 | Contains                                                              |
| ---------------- | --------------------- | --------------------------------------------------------------------- |
| `identity`       | Platform Services     | User, authentication (Clerk ACL), authorization, preferences          |
| `administration` | Platform Services     | Notifications, audit log, feature flags, configuration, observability |
| `integrations`   | Platform Services     | External institution connectors, import/export jobs _(future)_        |
| `finance`        | Core Financial Domain | Accounts, Transactions, Categories, Tags, Merchants                   |
| `planning`       | Core Financial Domain | Budgets, Goals, Cash Flow Plans                                       |
| `portfolio`      | Core Financial Domain | Assets, Liabilities, Credit Cards, Loans                              |
| `insights`       | Business Capabilities | Reports, Dashboard, AI Conversations, Recommendations, Insights       |

For the full list of aggregates, entities, and value objects owned by each module, see `docs/product/domain-model.md`.

---

## Non-Negotiable Invariants

These rules must never be violated. If a feature would require breaking one, raise it explicitly.

### Financial History

- Financial history is immutable. Transactions are never edited or deleted.
- Corrections are represented as new Transactions, never by rewriting existing ones.
- Transactions are append-only.

### AI Behavior

- AI never modifies financial records automatically.
- Every AI suggestion requires explicit user confirmation before being applied.
- AI failures must never interrupt core business operations.
- Every AI recommendation must be explainable.

### Module Ownership

- Every business concept belongs to exactly one module.
- No module may directly modify another module's state.
- No module may access another module's database tables directly.
- Shared ownership is forbidden.

### Financial Calculations

- Account balances are derived from Transactions, never stored as independent values.
- Budgets never modify financial records — they read from Transactions.
- Goals never modify financial records — they read from existing financial information.
- Reports never modify business data and never query transactional aggregates directly.
- Tags and Merchants never affect financial calculations.

### Accounts

- Archived accounts cannot receive new Transactions.
- Every account has exactly one base currency.

### Credit Cards

- Available credit cannot exceed the credit limit.
- Closed statements are immutable.
- Purchases belong to exactly one statement.

### Loans

- Outstanding balance cannot become negative.
- Closed loans cannot receive payments.

### Liabilities

- Outstanding balance cannot become negative.
- Settled liabilities cannot receive new payments.
- Liabilities are independent from the Portfolio Loans sub-domain.

### Categories and Tags

- Tags are independent from categories.
- System categories cannot be deleted.
- Category hierarchy cannot contain cycles.
- Archived categories remain available for historical records.

---

## Dependency Rules

### Allowed

- Core Financial Modules may use Platform Services.
- Business Capabilities may consume Core Financial Modules.
- Any module may use Platform Services.

### Forbidden

- Core Financial Modules depending on Business Capabilities.
- Circular dependencies between modules.
- Direct cross-module database access.
- Business logic inside Platform Services.
- Shared ownership of any business concept.

Violations require an Architecture Decision Record (ADR) in `docs/adr/`.

---

## Module Communication

Modules communicate only through explicit public contracts. Preferred mechanisms in order:

1. **Public Application Services** — call a module's exposed application service
2. **Domain Events** — publish/subscribe to business events
3. **Read Models** — pre-built projections consumed by Insights
4. **Query Services** — public read-only queries exposed by a module

Direct access to another module's persistence layer is strictly forbidden.

---

## Shared Kernel

The Shared Kernel lives at `src/shared-kernel/` and contains exactly four primitives:

- `Money` — amount and currency pair
- `Currency` — ISO 4217 currency code and symbol
- `DateRange` — start and end date pair
- `UserId` — stable reference to an authenticated user

The Shared Kernel must never contain business logic. It must never import from any module. When in doubt, do not put code there.

---

## Tech Stack

| Concern                  | Technology     | Decision                                                                          |
| ------------------------ | -------------- | --------------------------------------------------------------------------------- |
| Framework                | Next.js        | **App Router** — not Pages Router                                                 |
| Language                 | TypeScript     | Strict mode enabled. No `any` in domain or application code                       |
| Database                 | PostgreSQL     | One database, ACID transactions, immutable financial history                      |
| ORM                      | Prisma         | Infrastructure layer only — never in domain or application code                   |
| Authentication           | Clerk          | Anti-corruption layer in `identity` module. `UserId` is the only shared reference |
| Styling                  | Tailwind CSS   |                                                                                   |
| UI Components            | shadcn/ui      | Components copied to `src/components/ui/` — no runtime dependency                 |
| Internationalization     | next-intl      | Presentation layer only. Never in domain or application code                      |
| Progressive Web App      | PWA support    |                                                                                   |
| Linting                  | ESLint         | Errors block CI                                                                   |
| Formatting               | Prettier       | Applied automatically on commit via Husky                                         |
| Git hooks                | Husky          |                                                                                   |
| Unit + Integration tests | Vitest         |                                                                                   |
| End-to-end tests         | Playwright     |                                                                                   |
| CI/CD                    | GitHub Actions |                                                                                   |

---

## Engineering Standards

### Directory Structure

```
src/
├── app/                    # Next.js App Router — presentation layer
├── modules/               # One folder per Bounded Context
│   └── {module}/
│       ├── domain/        # Aggregates, value objects, domain services, port interfaces
│       ├── application/   # Commands, queries, event handlers
│       └── infrastructure/# Prisma repositories, external adapters
├── shared-kernel/          # Money, Currency, DateRange, UserId only
├── components/             # Shared UI components
└── lib/                    # Framework configuration utilities
```

Full directory structure is defined in `docs/product/architecture.md` Section 5.

---

### Commit Conventions

Nexo follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <description>
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`

**Scopes**: `finance`, `planning`, `portfolio`, `insights`, `identity`, `administration`, `shared-kernel`, `app`, `infra`, `docs`

Example: `feat(finance): add transaction reversal command`

---

### Branch Strategy

Nexo uses **GitHub Flow**:

- `main` is always deployable.
- All work happens on short-lived branches: `feat/`, `fix/`, `docs/`, `chore/`
- Changes merge to `main` via pull request after review and CI passage.

---

### Testing

| Level       | Scope                          | Framework  | Rule                                                      |
| ----------- | ------------------------------ | ---------- | --------------------------------------------------------- |
| Unit        | Domain layer only              | Vitest     | No DB, no network, no framework. Every invariant covered. |
| Integration | Application layer with real DB | Vitest     | Real PostgreSQL — mocks not permitted.                    |
| E2E         | Critical user flows            | Playwright | Runs against staging.                                     |

Unit and integration tests are co-located inside the module directory. E2E tests live in `tests/e2e/`.

---

## Codebase Language

All code, comments, database schemas, environment variables, and documentation are written in **English**.

UI copy is English and Spanish. Localization is handled exclusively at the presentation layer — never in business logic.

---

## Multi-Currency

Currency support is a core domain capability, not a formatting concern. The platform supports MXN, USD, and CAD at minimum. Never hardcode currency assumptions into business logic.

---

## Pending (Phase 0)

The following will be defined as part of the development environment setup:

- Environment variables and `.env.example` structure
- How to run the project locally
