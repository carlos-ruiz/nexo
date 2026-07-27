---
title: Architecture
status: Approved
version: 1.0.0

owner: Carlos Ruiz

authors:
  - Carlos Ruiz
  - Claude (Principal Software Architect)

last_updated: 2026-07-26

depends_on:
  - vision.md
  - principles.md
  - scope.md
  - modules.md
  - domain-model.md

related:
  - domain-model.md

supersedes: null

superseded_by: null

tags:
  - architecture
  - engineering
---

# Architecture

> This document defines how Nexo is structured, how its parts communicate, and how all engineering decisions are made.

---

# 1. Purpose

This document establishes the technical architecture of Nexo.

It defines the architectural style, system layers, folder structure, technology stack, module communication patterns, testing strategy, and engineering standards.

All code written for Nexo must comply with the decisions documented here.

Changes to this document require an Architecture Decision Record (ADR).

---

# 2. Architectural Style

Nexo is built using three complementary disciplines:

- **Modular Monolith** — a single deployable unit organized around explicit module boundaries
- **Hexagonal Architecture** — a structure that isolates business logic from infrastructure concerns
- **Domain-Driven Design** — a design approach centered on business concepts

These three disciplines reinforce each other. DDD defines what the modules contain. Hexagonal Architecture defines how each module is internally structured. The Modular Monolith defines how they are deployed together.

---

## 2.1 Modular Monolith

Nexo is a single deployable application. It is not a distributed system and does not use microservices.

Each business capability is organized into an explicit module with clear boundaries. Modules communicate only through defined public contracts — never through direct database access or internal implementation details.

The Modular Monolith was chosen because:

- It is simpler to build, test, and operate than a distributed system.
- Module boundaries are preserved by convention and tooling, not by network latency.
- It can be refactored or split later without an architectural rewrite.
- It aligns with team size and development velocity during Phase 0 and Phase 1.

---

## 2.2 Hexagonal Architecture

Each module is internally organized following the Hexagonal Architecture pattern, also known as Ports and Adapters.

The objective is to keep business logic completely independent from frameworks, databases, and external services.

Three internal layers exist within every module.

---

### Domain Layer

The innermost layer. Contains pure business logic with zero framework dependencies.

Includes:

- Aggregate roots, entities, and value objects
- Domain services
- Domain event definitions
- Repository interfaces (outbound ports)

The Domain Layer must never import from the Application Layer, Infrastructure Layer, or any external framework.

---

### Application Layer

Orchestrates domain objects to fulfill use cases.

Includes:

- Command handlers — write operations
- Query handlers — read operations
- Domain event handlers — reactions to events published by other modules
- Application service interfaces — inbound ports callable by other modules or the presentation layer

The Application Layer may import from the Domain Layer and the Shared Kernel. It must never import from the Infrastructure Layer directly.

---

### Infrastructure Layer

Connects the application to the outside world.

Includes:

- Repository implementations using Prisma
- Domain event publishers
- External service adapters (Clerk, email providers)
- Read model projectors

The Infrastructure Layer implements the interfaces defined in the Domain Layer. It is the only layer that may reference frameworks, databases, or external providers.

---

## 2.3 Domain-Driven Design

The business domain is organized into seven Bounded Contexts as defined in `domain-model.md`.

Each module in the codebase corresponds to one Bounded Context.

DDD principles applied throughout:

- **Ubiquitous Language** — terminology in code must match terminology in business documentation.
- **Aggregate Roots** — modules expose aggregates as public entry points. Internal entities are never exposed directly.
- **Domain Events** — cross-context communication happens through events, not through direct calls into another module's internals.
- **Shared Kernel** — a minimal set of shared primitives available to all modules.

---

# 3. System Layers

At the system level, Nexo is organized into three horizontal layers.

Dependencies always point upward. Lower layers never depend on higher layers.

```
Business Capabilities
  └─ Insights
        ▲
Core Financial Domain
  └─ Finance, Planning, Portfolio
        ▲
Platform Services
  └─ Identity, Administration, Integrations
```

---

## Platform Services

Provide cross-cutting capabilities consumed by all other layers.

Platform Services contain no business rules.

| Module                  | Responsibility                                                        |
| ----------------------- | --------------------------------------------------------------------- |
| Identity                | User authentication, authorization, and preferences                   |
| Administration          | Notifications, audit log, feature flags, configuration, observability |
| Integrations _(Future)_ | External financial institution connectors, data import and export     |

---

## Core Financial Domain

Own the business rules, financial records, and planning capabilities.

Depend on Platform Services only.

| Module    | Responsibility                                      |
| --------- | --------------------------------------------------- |
| Finance   | Accounts, transactions, categories, tags, merchants |
| Planning  | Budgets, goals, cash flow planning                  |
| Portfolio | Assets, liabilities, credit cards, loans            |

---

## Business Capabilities

Derive value from the Core Financial Domain without owning financial data.

Depend on Core Financial Domain and Platform Services.

| Module   | Responsibility                                                   |
| -------- | ---------------------------------------------------------------- |
| Insights | Reports, dashboards, AI conversations, recommendations, insights |

---

## Layer Dependency Rules

| From                  | To                    | Allowed                                  |
| --------------------- | --------------------- | ---------------------------------------- |
| Platform Services     | Core Financial Domain | No                                       |
| Platform Services     | Business Capabilities | No                                       |
| Core Financial Domain | Platform Services     | Yes                                      |
| Core Financial Domain | Business Capabilities | No                                       |
| Business Capabilities | Core Financial Domain | Yes — read only, through public services |
| Business Capabilities | Platform Services     | Yes                                      |
| Any layer             | Shared Kernel         | Yes                                      |

Violations require an ADR.

---

# 4. Module Map

Each Bounded Context maps to one module in the codebase.

| Module           | System Layer          | Bounded Context         |
| ---------------- | --------------------- | ----------------------- |
| `identity`       | Platform Services     | Identity                |
| `administration` | Platform Services     | Administration          |
| `integrations`   | Platform Services     | Integrations _(Future)_ |
| `finance`        | Core Financial Domain | Finance                 |
| `planning`       | Core Financial Domain | Planning                |
| `portfolio`      | Core Financial Domain | Portfolio               |
| `insights`       | Business Capabilities | Insights                |

---

# 5. Directory Structure

The following structure defines how the codebase is organized.

---

## 5.1 Project Root

```
nexo/
├── src/
│   ├── app/                        # Next.js App Router — presentation layer
│   ├── modules/                    # Business modules — one per Bounded Context
│   ├── shared-kernel/              # Cross-module primitives only
│   ├── components/                 # Shared UI components
│   └── lib/                        # Framework configuration utilities
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Migration history
│
├── messages/                       # next-intl translation files
│   ├── en.json
│   └── es.json
│
├── tests/
│   └── e2e/                        # End-to-end tests
│
└── docs/
    ├── product/                    # Product documentation
    └── adr/                        # Architecture Decision Records
```

---

## 5.2 Presentation Layer

The `src/app/` directory contains all Next.js App Router routes, layouts, and API endpoints.

```
src/app/
├── (auth)/                         # Unauthenticated routes — sign in, sign up
├── (dashboard)/                    # Authenticated application routes
│   ├── layout.tsx                  # Root authenticated layout
│   ├── page.tsx                    # Dashboard home
│   ├── accounts/
│   ├── transactions/
│   ├── budgets/
│   ├── goals/
│   ├── portfolio/
│   └── reports/
└── api/                            # API routes — webhooks and integrations only
```

Server Actions within App Router pages call directly into the Application Layer of the relevant module.

API routes are reserved for webhook endpoints and external integration callbacks.

---

## 5.3 Module Internal Structure

Every module follows the same three-layer internal structure.

```
src/modules/{module-name}/
├── domain/
│   ├── {aggregate}.ts              # Aggregate root with entities and value objects
│   ├── services/                   # Domain services
│   ├── events/                     # Domain event definitions
│   └── ports/                      # Repository interfaces and outbound port contracts
├── application/
│   ├── commands/                   # Write operation handlers
│   ├── queries/                    # Read operation handlers
│   └── event-handlers/             # Domain event subscribers from other modules
└── infrastructure/
    ├── persistence/                # Prisma repository implementations
    └── adapters/                   # External service adapters
```

Unit and integration tests are co-located with the code they test, within the module directory.

---

## 5.4 Shared Kernel

The Shared Kernel lives at `src/shared-kernel/`.

It contains exactly four primitives as defined in `domain-model.md`:

```
src/shared-kernel/
├── money.ts                        # Amount and currency pair
├── currency.ts                     # ISO 4217 currency code and symbol
├── date-range.ts                   # Start and end date pair
└── user-id.ts                      # Stable reference to an authenticated user
```

The Shared Kernel must never import from any module.

It must never contain business logic.

---

## 5.5 Database Schema

Nexo uses a single `schema.prisma` file.

All modules share one database. Cross-module isolation is enforced at the application level — not at the database level.

Tables are organized within the schema file using module-prefixed naming to reflect ownership:

- `finance_accounts`, `finance_transactions`, `finance_categories`
- `planning_budgets`, `planning_goals`
- `portfolio_assets`, `portfolio_credit_cards`, `portfolio_loans`
- `identity_users`
- `administration_notifications`, `administration_audit_logs`

Each module's repository implementations own their tables. No module may query another module's tables directly.

---

# 6. Technology Stack

The following technologies compose Nexo's Phase 0 stack.

Changes to the stack require an ADR.

---

## Next.js — App Router

**Role**: Web application framework. Presentation layer.

**Decision**: The **App Router** is the chosen routing strategy. The Pages Router is not used.

**Why App Router**:

- React Server Components reduce client-side JavaScript for data-heavy financial views.
- Streaming improves perceived performance for dashboards with multiple KPIs.
- Nested layouts enable efficient navigation between financial sections.
- Server Actions simplify form submissions and write operations without API boilerplate.

---

## TypeScript

**Role**: Primary programming language across the full stack.

**Why**: Type safety is non-negotiable for financial software. TypeScript enables value objects, discriminated unions for transaction types, and domain invariant enforcement at compile time.

**Rules**:

- Strict mode is enabled.
- `any` types are not permitted in domain or application layer code.
- Domain types are never inferred from database models — they are defined independently.

---

## PostgreSQL

**Role**: Primary relational database.

**Why**: PostgreSQL provides ACID transactions, foreign key constraints, and strong consistency guarantees appropriate for immutable financial records. It is production-grade and widely supported.

One database. One schema per environment. Migrations are version-controlled using Prisma Migrate.

---

## Prisma

**Role**: ORM and database migration tool.

**Why**: Prisma generates a type-safe query builder from the schema, integrates cleanly with TypeScript, and manages migration history. It is the bridge between the Infrastructure Layer and PostgreSQL.

**Rules**:

- Prisma is an infrastructure concern. It belongs exclusively in `infrastructure/persistence/`.
- Prisma types must never appear in the domain or application layers.
- Domain aggregates are never Prisma models. Repositories map between the two.

---

## Clerk

**Role**: Authentication and session management provider.

**Why**: Clerk handles user registration, login, and session lifecycle. It allows Nexo to avoid building authentication infrastructure while remaining secure and compliant.

**Integration rules**:

- The Identity module defines an anti-corruption layer that translates Clerk concepts into Nexo's domain.
- All other modules reference users only through `UserId` from the Shared Kernel.
- Clerk-specific identifiers must never appear outside the Identity module's infrastructure layer.

---

## Tailwind CSS

**Role**: CSS utility framework.

**Why**: Tailwind enables rapid, consistent UI development. It eliminates the need for a custom CSS architecture and integrates well with shadcn/ui.

---

## shadcn/ui

**Role**: UI component library.

**Why**: shadcn/ui provides accessible, composable components built on Radix UI primitives. Components are copied into `src/components/ui/` and owned by the project — not imported as a runtime package.

This approach allows full control over styling and behavior without being tied to a library's release cycle.

---

## next-intl

**Role**: Internationalization framework.

**Why**: next-intl supports locale detection, translation file loading, and number and date formatting. It is designed for the Next.js App Router.

**Rules**:

- Translation keys and localization logic must never appear in the domain or application layers.
- Localization is strictly a presentation-layer concern.
- Supported locales at launch: `en` (English), `es` (Spanish).

Translation files live in `messages/{locale}.json`.

---

## PWA Support

**Role**: Progressive Web App capabilities.

**Why**: PWA enables installation on mobile home screens and offline capability without a native mobile app. This broadens accessibility without a separate native build.

---

# 7. Module Communication

Modules communicate through four mechanisms, listed in order of preference.

Direct access to another module's internal aggregates, repositories, or database tables is strictly forbidden.

---

## 1. Public Application Services

The preferred mechanism for synchronous cross-module requests.

Each module exposes a set of application services as its public API. These are the only entry points other modules may call.

Example: The Insights module calls `FinanceQueryService.getAccountSummary(userId)` — a public query service defined and owned by Finance.

---

## 2. Domain Events

Used for asynchronous cross-context notifications.

When a business event occurs in one module, that module publishes a domain event. Interested modules subscribe and react independently. Neither the publisher nor the subscriber knows about the other's internal structure.

Example: Finance publishes `ExpenseRegistered`. Portfolio subscribes and updates the credit card Statement balance. Planning subscribes and recalculates Budget progress. Portfolio and Planning have no direct dependency on each other.

Events are defined in the publishing module. Subscribers are responsible for their own handlers.

---

## 3. Read Models

Used when Business Capabilities need to query pre-built data projections for reporting and AI.

Finance, Planning, and Portfolio publish Read Models optimized for analytical reads. Insights consumes these through the `ReadModelProjector` service.

Insights must never query transactional aggregates or database tables of other modules directly.

---

## 4. Query Services

Public read-only interfaces exposed by a module for targeted cross-context reads.

Used when a Read Model does not exist or is unnecessary for the query.

Query Services are part of a module's public application layer. They expose data without exposing internals.

---

# 8. Testing Strategy

Testing is organized into three levels with distinct purposes.

---

## Unit Tests

**Scope**: Domain layer — aggregate roots, value objects, domain services.

**Framework**: Vitest

**Rules**:

- No database.
- No network.
- No framework.
- Tests exercise business rules and invariants in isolation.
- Every domain invariant must have a corresponding test.

**Location**: Co-located with the domain code within the module directory.

---

## Integration Tests

**Scope**: Application layer — command handlers, query handlers, event handlers — with real repositories and a real PostgreSQL database.

**Framework**: Vitest

**Rules**:

- Use a real PostgreSQL database. Database mocks are not permitted.
- Each test sets up its own data and tears it down after.
- Tests verify that application services orchestrate the domain correctly end to end, including actual persistence behavior.

**Why a real database**: Mocked repositories pass when logic is correct but hide SQL behavior, constraint violations, and schema mismatches that only surface in production. Integration tests must catch these failures before deployment.

**Location**: Co-located with the application code within the module directory.

---

## End-to-End Tests

**Scope**: Critical user flows through the full application stack.

**Framework**: Playwright

**Rules**:

- Cover the most important financial paths: recording a transaction, creating a budget, viewing the dashboard, calculating net worth.
- Do not duplicate business-rule scenarios already covered by unit or integration tests.
- Run against a staging environment connected to a real database.

**Location**: `tests/e2e/`

---

# 9. Engineering Standards

---

## Coding Principles

The following principles apply to all code written in Nexo, at every layer.

They are not suggestions. Violations must be corrected before a pull request is merged.

---

### SOLID

**Single Responsibility**

Every class, module, and function has exactly one reason to change.

Aggregate roots are responsible for enforcing their own invariants — nothing else.
Command handlers execute one use case — nothing else.
Repository interfaces expose only the operations their aggregate requires — nothing else.

When a class starts doing two things, split it.

---

**Open / Closed**

Modules are open for extension and closed for modification.

New behavior is added by introducing new commands, queries, event handlers, or domain services — not by modifying existing ones.
Public application service contracts are stable once established. Breaking changes require a new service method, not a modification to an existing signature.

---

**Liskov Substitution**

Every implementation of an interface must be substitutable for that interface without altering the correctness of the program.

Repository implementations in the Infrastructure Layer must be interchangeable with the repository interfaces defined in the Domain Layer.
Fake repository implementations used in tests must behave identically to real ones for the operations they implement.

---

**Interface Segregation**

Interfaces are narrow and focused. No interface forces its implementors to depend on methods they do not use.

Port interfaces in the Domain Layer expose only the operations a specific aggregate or service requires.
A single large repository interface covering multiple aggregates is a violation of this principle.

---

**Dependency Inversion**

High-level modules do not depend on low-level modules. Both depend on abstractions.

The Application Layer depends on interfaces defined in the Domain Layer — never on Prisma types, external SDKs, or infrastructure implementations directly.
Dependencies are injected, not instantiated. Infrastructure implementations are wired at the composition root.

---

### DRY — Don't Repeat Yourself

Every piece of knowledge has a single, authoritative representation in the codebase.

Business rules live in exactly one place: the Domain Layer. They are never duplicated in command handlers, API routes, UI components, or database constraints.

If two places in the code enforce the same rule, one of them is wrong.

Mapping code in repositories (translating between domain aggregates and Prisma models) is the one accepted form of structural repetition. It serves an explicit architectural boundary and is not a violation of this principle.

---

### KISS — Keep It Simple

Prefer the simplest implementation that correctly models the domain and satisfies the requirement.

Avoid clever abstractions, premature generalization, and unnecessary indirection. If an implementation requires a comment to explain what it does, rewrite it until it does not.

Complexity is only introduced when it solves a concrete, present problem. Complexity introduced speculatively is technical debt from day one.

This principle applies especially to the Domain Layer, where clarity and correctness matter more than performance.

---

### YAGNI — You Aren't Gonna Need It

Do not build features, abstractions, or generalizations for hypothetical future requirements.

Build what the current use case requires. When a second concrete use case appears, generalize then — not before.

This principle applies with particular force to the Shared Kernel. Nothing is added to `src/shared-kernel/` speculatively. A primitive is added only when at least two modules demonstrably need it.

ADRs document the reasoning when a decision feels like it might violate YAGNI. If the reasoning cannot be written down clearly, the feature is not needed yet.

---

## Commit Conventions

Nexo follows [Conventional Commits](https://www.conventionalcommits.org/).

Format:

```
<type>(<scope>): <description>
```

**Types**:

| Type       | When to use                          |
| ---------- | ------------------------------------ |
| `feat`     | A new feature                        |
| `fix`      | A bug fix                            |
| `docs`     | Documentation only                   |
| `test`     | Adding or updating tests             |
| `refactor` | Code change with no behavior change  |
| `chore`    | Tooling, dependencies, configuration |
| `perf`     | Performance improvement              |

**Scopes** correspond to module names and top-level areas:

`finance`, `planning`, `portfolio`, `insights`, `identity`, `administration`, `shared-kernel`, `app`, `infra`, `docs`

Example: `feat(finance): add transaction reversal command`

---

## Branch Strategy

Nexo uses **GitHub Flow**.

- `main` is the only permanent branch and is always in a deployable state.
- All changes are developed on short-lived branches created from `main`.
- Branches are merged to `main` via pull request after review and CI passage.
- Branches are deleted after merge.

**Branch naming**:

| Type          | Format                      |
| ------------- | --------------------------- |
| Feature       | `feat/{short-description}`  |
| Bug fix       | `fix/{short-description}`   |
| Documentation | `docs/{short-description}`  |
| Chore         | `chore/{short-description}` |

---

## Code Review

Every change to `main` requires a pull request.

- At least one approval is required before merging.
- CI must pass before merge.
- The PR description must explain the change and link to any relevant ADRs or issues.

---

## Continuous Integration

CI runs on every pull request using **GitHub Actions**.

The CI pipeline must:

1. Install dependencies
2. Run type checking (`tsc --noEmit`)
3. Run linting (`eslint`)
4. Run unit tests
5. Run integration tests
6. Build the application

Merges to `main` are blocked when CI fails.

---

## Linting and Formatting

| Tool     | Role                                                                          |
| -------- | ----------------------------------------------------------------------------- |
| ESLint   | Enforces code quality rules. Errors block CI.                                 |
| Prettier | Enforces consistent code formatting. Applied automatically on commit.         |
| Husky    | Runs pre-commit hooks for linting and formatting before a commit is accepted. |

---

# 10. Architecture Decision Records

Significant architectural decisions are documented as Architecture Decision Records (ADRs).

An ADR is required when:

- Changing the architectural style or system layering.
- Adding, replacing, or removing a technology from the stack.
- Changing module boundaries or moving a concept between modules.
- Introducing a cross-module communication pattern not covered in this document.
- Granting an exception to any rule in this document or in `CLAUDE.md`.
- Violating a non-negotiable invariant from `domain-model.md`.

ADRs live in `docs/adr/`.

The ADR process is defined in `docs/adr/README.md`.

---

# 11. Non-Negotiable Constraints

The following constraints govern every technical decision in Nexo.

They are derived from `domain-model.md` and `CLAUDE.md`.

---

**Financial history is immutable.**

Transactions are never updated or deleted in the database. Corrections create new Transactions.

---

**Account balances are never stored.**

They are always derived from Transactions at query time via `AccountBalanceService`.

---

**Module isolation is enforced at the application level.**

No module may query another module's database tables directly. All cross-module data flows through public application services, domain events, or read models.

---

**AI never modifies financial records automatically.**

Every AI recommendation requires explicit user approval before being applied to any domain aggregate.

---

**Localization never enters the domain.**

Translation keys and locale logic must never appear in domain or application layer code.

---

**Clerk is isolated to the Identity module.**

Clerk-specific identifiers and types must never appear outside the Identity module's infrastructure layer. All other modules reference users through `UserId` only.

---

**Prisma is an infrastructure concern.**

Prisma clients, query builders, and generated types must never appear in domain or application layer code. Repositories are responsible for mapping between Prisma models and domain aggregates.

---

**The Shared Kernel is minimal.**

It contains only `Money`, `Currency`, `DateRange`, and `UserId`. No business logic. No module-specific concepts.
