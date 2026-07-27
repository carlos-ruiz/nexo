# 0003 — Domain-Driven Design

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Personal finance is a domain with complex business rules, strict invariants, and rich terminology. Concepts like "account", "transaction", "budget", and "statement" mean something precise in the financial domain — and that precision must be reflected in the code.

Without a deliberate modeling approach, the codebase accumulates a mix of technical vocabulary (database column names, framework conventions, ORM types) and business vocabulary, until neither accurately describes what the system actually does. This gap between code and business intent is a primary source of bugs in financial software.

Nexo also spans multiple distinct problem areas — tracking, planning, investment, credit, and insights — that share some concepts but must not blur their boundaries. Without explicit boundaries, the model becomes a single large ball of mud where every concept is connected to every other.

---

## Decision

Nexo is modeled using **Domain-Driven Design (DDD)** principles throughout the codebase.

The following DDD patterns are applied:

**Bounded Contexts**: The domain is divided into seven Bounded Contexts. Each context has its own ubiquitous language. The same word (e.g., "account") may mean different things in different contexts, and that difference is intentional and preserved.

**Ubiquitous Language**: Terminology in code (class names, method names, variable names, event names) must match the terminology used in the product documentation exactly. No technical synonyms are invented. If the domain says "Transaction", the code says `Transaction` — not `Entry`, `Record`, or `Event`.

**Aggregate Roots**: Each Bounded Context exposes its business concepts as aggregates. An aggregate is a cluster of related objects treated as a single unit for the purposes of data changes. Aggregates enforce their own invariants. External code only interacts with an aggregate through its root.

**Value Objects**: Concepts that are defined by their value rather than their identity are modeled as value objects. `Money`, `Currency`, `DateRange`, and `UserId` are in the Shared Kernel. Domain-specific value objects (e.g., `AccountNumber`, `TransactionAmount`) are defined within their module.

**Domain Events**: When something meaningful happens in one Bounded Context that other contexts need to know about, a Domain Event is published. The publisher does not know who is listening. This decouples contexts while preserving the business meaning of cross-context interactions.

**Shared Kernel**: A minimal set of cross-context primitives lives at `src/shared-kernel/`: `Money`, `Currency`, `DateRange`, and `UserId`. Nothing else belongs there.

---

## Rationale

DDD aligns code with business intent. For a financial platform, this alignment is not optional — it is the mechanism by which bugs are prevented. An invariant like "outstanding loan balance cannot become negative" is modeled as a method on the `Loan` aggregate that throws a domain exception, not as a database constraint or a service-level guard that can be bypassed.

DDD also prevents context bleed. The `finance` module owns transactions. The `planning` module owns budgets. Budgets are derived from transaction data but do not own it. Without explicit bounded contexts, these concepts naturally merge — and once merged, they cannot be separated without a full rewrite.

The combination of DDD + Hexagonal Architecture (ADR 0002) means that business rules live in pure domain objects, those objects enforce invariants by construction, and the infrastructure layer is responsible only for persistence and translation.

---

## Alternatives Considered

| Alternative          | Why rejected                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transaction Script   | Business logic lives in service functions (procedures) rather than domain objects. Simple to start, but invariants must be re-enforced in every procedure. As complexity grows, rules are duplicated or missed. Unsuitable for a domain with strict financial invariants. |
| Active Record / CRUD | Domain objects are thin wrappers around database rows. Business logic lives nowhere specific. The model drifts toward the database schema rather than the business domain. Invariants are enforced externally, inconsistently.                                            |
| Anemic Domain Model  | Objects exist but have no behavior — they are data bags with getters/setters. Logic lives in service classes. Structurally similar to Transaction Script but with an object graph. The same invariant-enforcement problems apply.                                         |

---

## Consequences

**Easier**:

- Business invariants are enforced by the aggregate itself, not by callers.
- Code is readable to anyone who understands the financial domain — not just the original author.
- Cross-context concerns are explicit. Any interaction between modules is visible as a public service call or a domain event subscription.
- New developers can orient themselves using the product documentation and find the corresponding code immediately.

**Harder / requires attention**:

- DDD requires upfront investment in modeling. The domain model must be understood before implementation begins.
- The ubiquitous language must be actively maintained. If the product documentation uses a different term than the code, one of them is wrong and must be corrected.
- Aggregate design is the hardest part. Aggregate boundaries that are too wide create contention; too narrow creates anemia. These boundaries must be revised as the domain is better understood.
- Junior developers unfamiliar with DDD need onboarding. The patterns are not obvious from the code alone without understanding the reasoning behind them.

---

## Related Documents

- [Domain Model](../product/domain-model.md) — Full bounded context definitions, aggregates, value objects, domain events, and invariants
- [Architecture](../product/architecture.md) — Section 2.3: Domain-Driven Design
- [Modules](../product/modules.md) — Module boundaries per Bounded Context
- [ADR 0001](0001-modular-monolith.md) — Modular Monolith
- [ADR 0002](0002-hexagonal-architecture.md) — Hexagonal Architecture
