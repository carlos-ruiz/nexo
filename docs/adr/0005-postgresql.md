# 0005 — PostgreSQL as Primary Database

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo manages financial records. The central invariant of the entire platform is that financial history is immutable — transactions are never deleted or modified, only appended. Account balances are derived from the transaction history, not stored separately. Cross-module data integrity (e.g., a payment on a loan must reference a real transaction) must be enforceable at the database level.

The database technology must satisfy:

- **ACID transactions**: financial operations that touch multiple tables must succeed or fail atomically. Partial writes corrupt financial history.
- **Strong consistency**: a user viewing their account balance must see the same value regardless of which server handled their request.
- **Referential integrity**: foreign key constraints must be enforceable so that orphaned records cannot exist.
- **Mature operational story**: backups, point-in-time recovery, connection pooling, and managed hosting options must be well-established.
- **TypeScript integration**: the database must integrate cleanly with the ORM chosen (see ADR 0006).

---

## Decision

Nexo uses **PostgreSQL** as its sole, primary relational database.

One database. One schema per environment (development, staging, production). Migrations are version-controlled using Prisma Migrate (see ADR 0006).

All modules share the same database. Cross-module isolation is enforced at the application level — not at the database level. Tables are named with module prefixes to reflect ownership:

- `finance_accounts`, `finance_transactions`, `finance_categories`
- `planning_budgets`, `planning_goals`
- `portfolio_assets`, `portfolio_credit_cards`, `portfolio_loans`
- `identity_users`
- `administration_notifications`, `administration_audit_logs`

No module may query another module's tables directly. Cross-module data access must go through public application services or domain events.

---

## Rationale

PostgreSQL is the most capable open-source relational database for financial applications. It provides full ACID compliance, mature foreign key enforcement, row-level security, and a proven operational track record.

For Nexo specifically:

- Immutable financial history (append-only transactions) is naturally modeled as insert-only rows in a relational table.
- Aggregate balance queries (sum of debits and credits on an account) are efficient in PostgreSQL with proper indexing.
- A single relational database with a shared schema allows ACID transactions to span multiple modules when necessary — for example, atomically recording a transaction and updating a budget's consumed amount.

The single-database approach is consistent with the Modular Monolith decision (ADR 0001). The database is one logical unit; module isolation is a software concern, not a database concern.

---

## Alternatives Considered

| Alternative                 | Why rejected                                                                                                                                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MySQL / MariaDB             | Viable relational option, but PostgreSQL has stronger support for advanced data types (JSONB, arrays, ranges), better default isolation levels, and broader ecosystem support in the Node.js community.                                 |
| MongoDB                     | Document databases lack foreign key constraints and multi-document ACID transactions in all scenarios. Inappropriate for financial data where referential integrity is a requirement, not a preference.                                 |
| SQLite                      | Not suitable for production multi-user SaaS. Single-writer concurrency model would create bottlenecks under normal web traffic.                                                                                                         |
| Supabase (managed Postgres) | Supabase runs PostgreSQL under the hood. Supabase as a managed service is a deployment/infrastructure decision, not a database technology decision. PostgreSQL is the technology; Supabase, Neon, or Railway are valid hosting options. |
| CockroachDB                 | Distributed SQL database with PostgreSQL compatibility. Unnecessary complexity for a system that intentionally chose a Modular Monolith architecture. Distributed transactions introduce latency that is not justified at this stage.   |

---

## Consequences

**Easier**:

- ACID transactions ensure financial operations are all-or-nothing.
- Foreign key constraints prevent orphaned records at the database level.
- Prisma Migrate tracks schema history. Schema changes are reproducible across environments.
- Point-in-time recovery is available on all major managed PostgreSQL providers.
- Rich ecosystem of tools: pgAdmin, psql, pg_dump, and managed hosting (Neon, Supabase, Railway, RDS).

**Harder / requires attention**:

- PostgreSQL requires a running server (local or managed). Developers need Docker or a managed database for local development.
- Schema migrations must be coordinated. Since all modules share one schema, a migration in one module deploys with the full application.
- Module isolation at the database level is not enforced by the database itself. A developer can write a Prisma query that reaches across module boundaries. This must be prevented through code review.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 5.5: Database Schema, Section 6: Technology Stack
- [ADR 0001](0001-modular-monolith.md) — Modular Monolith
- [ADR 0006](0006-prisma-orm.md) — Prisma ORM
