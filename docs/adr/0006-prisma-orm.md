# 0006 — Prisma as ORM

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo uses PostgreSQL as its database (ADR 0005). The application layer needs to read and write database records from TypeScript code. It also needs a way to manage schema changes reliably across development, staging, and production environments.

The ORM choice must satisfy the following constraints:

- **Type safety**: database queries must be type-checked at compile time. Untyped SQL strings are not acceptable in a financial application.
- **Migration management**: schema changes must be versioned and reproducible. The migration history must be committed to source control.
- **Infrastructure isolation**: the ORM must be confined to the Infrastructure Layer of each module. Domain and application layers must never import ORM types.
- **TypeScript ecosystem fit**: the library must work seamlessly with Next.js and the rest of the stack.

---

## Decision

Nexo uses **Prisma** as its ORM and database migration tool.

Prisma's schema file lives at `prisma/schema.prisma`. Migrations live at `prisma/migrations/`.

**Critical constraint**: Prisma is an infrastructure concern exclusively. It belongs in `src/modules/{module}/infrastructure/persistence/` only.

The following rules are non-negotiable:

- Prisma types (generated `PrismaClient` models) must never appear in the domain or application layers.
- Domain aggregates are independent TypeScript classes — never Prisma models.
- Repository implementations in the Infrastructure Layer are responsible for mapping between domain aggregates and Prisma models.
- `PrismaClient` is instantiated once and injected as a dependency. It is never imported directly inside domain or application code.

---

## Rationale

Prisma generates a fully type-safe query builder from the schema definition. Every query — from a simple `findUnique` to a complex multi-table join — is type-checked against the schema at compile time. This eliminates a class of runtime errors (wrong column names, wrong types, missing fields) that are particularly dangerous in financial software.

Prisma Migrate manages the migration history as a versioned set of SQL files. Each migration is applied once and recorded. This makes schema evolution reproducible across all environments without manual SQL scripts.

Confining Prisma to the Infrastructure Layer preserves the Hexagonal Architecture guarantee: the Domain Layer can be tested without a database connection. Repository interfaces are defined in the Domain Layer. Repository implementations (which use Prisma) live in the Infrastructure Layer. Tests use in-memory fake implementations.

---

## Alternatives Considered

| Alternative              | Why rejected                                                                                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drizzle ORM              | More lightweight and closer to raw SQL. Strong TypeScript support. Less mature migration tooling compared to Prisma Migrate. Smaller ecosystem and fewer established patterns for the Hexagonal Architecture approach.                    |
| TypeORM                  | Decorator-based ORM with Active Record support. The Active Record pattern would violate the separation between domain aggregates and persistence models required by ADR 0002. TypeORM's type inference is also weaker than Prisma's.      |
| Kysely                   | Type-safe SQL query builder, not a full ORM. Provides no migration tooling. Requires more boilerplate for schema mapping. Good for projects where SQL control is the primary concern; Prisma's abstraction level is appropriate for Nexo. |
| Raw `pg` (node-postgres) | Maximum control, no abstraction. Requires manual type mapping for every query. Migration management must be built or bolted on separately. The maintenance burden outweighs the benefits at this stage.                                   |
| Sequelize                | Older ORM with weaker TypeScript support. Type definitions are less precise than Prisma's generated types.                                                                                                                                |

---

## Consequences

**Easier**:

- All database queries are type-checked against the schema at compile time.
- `prisma migrate dev` generates migrations automatically from schema changes during development.
- `prisma migrate deploy` applies pending migrations in production safely.
- Prisma Studio provides a visual database browser for local development and debugging.
- Schema changes are reviewed in pull requests as committed migration files.

**Harder / requires attention**:

- Prisma types must never escape the Infrastructure Layer. This requires active enforcement: every repository must expose domain types, never Prisma types.
- Domain-to-Prisma mapping code must be written and maintained for every aggregate. This is boilerplate but it is the correct price for the architectural separation.
- Prisma's generated client must be regenerated after schema changes (`prisma generate`). CI must run this step before type-checking.
- Prisma's connection pooling behavior must be configured correctly for serverless/edge deployments. A single `PrismaClient` instance should be used and reused across requests.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 5.3: Module Internal Structure, Section 5.5: Database Schema, Section 6: Technology Stack
- [ADR 0002](0002-hexagonal-architecture.md) — Hexagonal Architecture (Infrastructure Layer constraints)
- [ADR 0005](0005-postgresql.md) — PostgreSQL as Primary Database
