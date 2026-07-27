# 0002 — Hexagonal Architecture

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo is built as a Modular Monolith (see [ADR 0001](0001-modular-monolith.md)). Each of the seven modules needs a consistent internal structure that keeps business logic independent from the infrastructure it runs on.

The core problem with traditional layered architectures in financial software is that business rules end up coupled to the database schema, ORM models, or framework conventions. When the database model changes, business logic breaks. When the ORM is swapped, the entire codebase needs to change. This coupling makes testing expensive — real database connections are required to test any business rule.

Nexo has strict non-negotiable invariants (see `domain-model.md`) that must be enforced reliably and tested exhaustively. The architecture must make those tests cheap to write and fast to run.

---

## Decision

Every module is internally organized using **Hexagonal Architecture** (Ports and Adapters), with three layers:

1. **Domain Layer** — the innermost layer. Contains pure business logic with zero external dependencies. Includes aggregate roots, entities, value objects, domain services, domain event definitions, and repository interfaces (outbound ports). This layer has no knowledge of databases, HTTP, or frameworks.

2. **Application Layer** — orchestrates domain objects to fulfill use cases. Contains command handlers, query handlers, domain event handlers, and inbound port interfaces callable by other modules or the presentation layer. May import from the Domain Layer only.

3. **Infrastructure Layer** — connects the application to the outside world. Contains Prisma repository implementations, domain event publishers, and external service adapters (e.g., Clerk). This is the only layer that may reference frameworks, ORMs, or external providers.

Dependencies flow inward only: Infrastructure → Application → Domain. The Domain Layer never imports from Application or Infrastructure.

---

## Rationale

Hexagonal Architecture ensures that Nexo's business rules can be tested without spinning up a database, without mocking an HTTP client, and without instantiating a framework. The Domain Layer is just TypeScript classes and functions — plain objects with methods.

This matters for a financial application because:

- Domain invariants are tested at the unit level with no infrastructure overhead.
- The database schema (Prisma models) can change without touching business logic.
- Infrastructure components (ORM, auth provider, email service) can be replaced without rewriting use cases.
- The same domain logic can be exercised through different entry points (Server Action, API route, CLI, test) without duplication.

The boundary between the Application Layer and Infrastructure Layer is enforced by requiring that the Application Layer depends only on interfaces (ports) defined in the Domain Layer. Infrastructure provides the concrete implementations (adapters) at runtime.

---

## Alternatives Considered

| Alternative                                         | Why rejected                                                                                                                                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Traditional n-tier (Presentation / Business / Data) | Business logic in the "Business" layer still depends on data models from the "Data" layer. Database changes propagate into business code. Testing requires real database connections.                                                                  |
| Clean Architecture                                  | Functionally equivalent to Hexagonal Architecture but with different naming conventions and more prescribed circles. Hexagonal Architecture is more widely understood in the Node.js ecosystem and maps more naturally to the module structure chosen. |
| Anemic Domain Model with service layer              | Business logic lives in services rather than domain objects. Invariants cannot be enforced by the domain itself — every caller must remember to validate. This approach does not scale with Nexo's complexity.                                         |
| No explicit internal structure                      | Easy to start, impossible to maintain. Business rules leak into infrastructure. Untestable.                                                                                                                                                            |

---

## Consequences

**Easier**:

- Domain invariants are unit-testable with no DB, no network, no framework.
- Infrastructure can be replaced (e.g., Prisma → raw SQL) without touching domain or application code.
- Each layer's responsibilities are unambiguous. New contributors know exactly where to put new code.
- Application layer use cases are independently testable with a fake repository.

**Harder / requires attention**:

- Every aggregate requires a repository interface in the Domain Layer and a Prisma implementation in the Infrastructure Layer. This is more boilerplate than a simple Active Record pattern.
- Domain objects and Prisma models are separate types. Repositories must map between them. This mapping code must be maintained.
- The boundary between Application and Infrastructure must be actively enforced. There is no compiler-enforced rule that prevents an Application Layer class from importing a Prisma model directly — only convention and code review.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 2.2: Hexagonal Architecture, Section 5.3: Module Internal Structure
- [ADR 0001](0001-modular-monolith.md) — Modular Monolith
- [ADR 0003](0003-domain-driven-design.md) — Domain-Driven Design
