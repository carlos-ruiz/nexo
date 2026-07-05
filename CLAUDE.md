# CLAUDE.md — Nexo

## What is Nexo

Nexo is an AI-native, multilingual personal finance SaaS platform. Its purpose is to help individuals and families make better financial decisions — not just record transactions. It targets a complete financial operating system covering accounts, transactions, credit cards, loans, assets, liabilities, budgets, goals, reports, and AI-powered insights.

Full product documentation lives in `docs/product/`. Read in this order:
- `docs/product/vision.md` — why Nexo exists
- `docs/product/principles.md` — how every decision is evaluated
- `docs/product/scope.md` — what is and is not in scope
- `docs/product/modules.md` — official module boundaries (read before touching any domain code)
- `docs/product/roadmap.md` — what gets built and when

---

## Architecture

Nexo is a **Modular Monolith** using **Hexagonal Architecture** and **Domain-Driven Design**.

Three layers. Dependencies always point downward — never upward:

```
Business Capabilities      →  Reports, AI
        ▲
Core Financial Domain      →  Accounts, Financial Events, Categories, Tags,
                               Merchants, Credit Cards, Loans, Assets,
                               Liabilities, Budgets, Goals
        ▲
Platform Services          →  Identity, Authorization, Localization,
                               Notifications, Audit, Configuration,
                               Feature Flags, Logging, Observability
```

- Core Financial Domain never depends on Business Capabilities
- Platform Services never contain business rules
- Business Capabilities consume the Core Financial Domain but never own financial data

---

## Module Map

Every business concept belongs to exactly one module. When writing code, place it in the module that owns the concept.

### Core Financial Domain

| Module | Owns |
|---|---|
| **Accounts** | Account, Account Balance, Account Status, Account Currency |
| **Financial Events** | Financial Event, Financial Movement, Event Metadata |
| **Categories** | Category, Category Tree |
| **Tags** | Tag |
| **Merchants** | Merchant, Merchant Name (normalized) |
| **Credit Cards** | Credit Card, Statement, Billing Cycle, Available Credit |
| **Loans** | Loan, Payment Schedule, Outstanding Balance |
| **Assets** | Asset, Asset Valuation, Asset Type |
| **Liabilities** | Liability, Liability Balance, Liability Counterparty |
| **Budgets** | Budget, Budget Period, Budget Target |
| **Goals** | Goal, Goal Progress, Goal Milestone |

### Business Capabilities

| Module | Owns |
|---|---|
| **Reports** | Dashboard, Report Definition, Saved Report, Read Model, KPI |
| **AI** | AI Conversation, AI Recommendation, AI Insight, Prompt Template, AI Feedback |

### Platform Services

Identity, Authorization, Localization, Notifications, Audit, Configuration, Feature Flags, Logging, Observability.

---

## Non-Negotiable Invariants

These rules must never be violated. If a feature would require breaking one, raise it explicitly.

### Financial History
- Financial history is immutable. Records are never edited or deleted.
- Corrections are represented as new Financial Events, never by rewriting existing ones.
- Financial Events are append-only.

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
- Account balances are derived from Financial Events, never stored as independent values.
- Budgets never modify financial records — they read from Financial Events.
- Goals never modify financial records — they read from existing financial information.
- Reports never modify business data and never query transactional models directly.
- Tags and Merchants never affect financial calculations.

### Accounts
- Archived accounts cannot receive new Financial Events.
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
- Liabilities are independent from the Loans module.

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

Violations require an Architecture Decision Record (ADR).

---

## Module Communication

Modules communicate only through explicit public contracts. Preferred mechanisms in order:

1. **Public Application Services** — call a module's exposed service
2. **Domain Events** — publish/subscribe to business events
3. **Read Models** — pre-built projections consumed by Reports and AI
4. **Query Services** — public read-only queries exposed by a module

Direct access to another module's persistence layer is strictly forbidden.

---

## Shared Kernel

A minimal Shared Kernel may exist for cross-module primitives. It must only contain:
- Shared interfaces
- Primitive value objects
- Domain-independent utilities
- Common result types
- Error abstractions

The Shared Kernel must never contain business logic. When in doubt, do not put code there.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Clerk |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Internationalization | next-intl |
| Progressive Web App | PWA support |
| Linting | ESLint |
| Formatting | Prettier |
| Git hooks | Husky |

---

## Codebase Language

All code, comments, database schemas, environment variables, and documentation are written in **English**.

UI copy is English and Spanish. Localization is handled exclusively at the presentation layer — never in business logic.

---

## Multi-Currency

Currency support is a core domain capability, not a formatting concern. The platform supports MXN, USD, and CAD at minimum. Never hardcode currency assumptions into business logic.

---

## What is Not Yet Defined (Phase 0)

The following will be established during Phase 0 and this file will be updated:

- Folder and directory structure
- Module directory conventions
- Testing frameworks and strategy (unit, integration, E2E)
- Commit message format and conventions
- Branch strategy
- CI/CD platform and pipeline
- Next.js router choice (App Router vs Pages Router)
- Environment variables and local setup instructions
- How to run the project locally
