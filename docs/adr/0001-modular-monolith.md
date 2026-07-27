# 0001 — Modular Monolith

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo is a personal finance SaaS platform with a clearly bounded domain: accounts, transactions, budgets, goals, credit cards, loans, and AI-driven insights. The platform needs to be built and iterated on quickly by a small team while maintaining clear separation between business capabilities.

The central architectural question is how to physically organize the system: as a distributed set of services or as a single deployable application.

Key constraints:

- Team size is small. Distributed systems require significant operational overhead (service discovery, network partitioning, distributed tracing) that would slow development.
- Domain boundaries are well understood and stable. The seven Bounded Contexts defined in `domain-model.md` are unlikely to require independent scaling in the early phases.
- Financial data requires ACID transactions. Distributed transactions across service boundaries introduce complexity and failure modes that are inappropriate for financial software.
- The system must be refactorable. If the domain evolves significantly, the architecture must not require a full rewrite to adapt.

---

## Decision

Nexo is built as a **Modular Monolith**: a single deployable application organized into explicit, isolated modules — one per Bounded Context.

Module boundaries are enforced by convention and enforced through code review and tooling. Modules communicate only through defined public contracts. No module may access another module's internal implementation or database tables directly.

The seven modules are:

- `identity` — Platform Services
- `administration` — Platform Services
- `integrations` — Platform Services _(future)_
- `finance` — Core Financial Domain
- `planning` — Core Financial Domain
- `portfolio` — Core Financial Domain
- `insights` — Business Capabilities

---

## Rationale

A Modular Monolith provides the discipline of microservices — clear ownership, explicit interfaces, bounded contexts — without the operational overhead of a distributed system.

At this stage of the product, the boundaries between modules are well-defined but the exact shape of their contracts is still being discovered. A monolith allows those contracts to be refined through refactoring rather than through versioned APIs and cross-service deployments.

The key insight is that module isolation does not require network boundaries to be real. Conventions enforced in code are sufficient when the team is small and trust is high.

---

## Alternatives Considered

| Alternative           | Why rejected                                                                                                                                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Microservices         | Requires service discovery, distributed tracing, inter-service authentication, and complex deployment pipelines. The team is too small to absorb this overhead. ACID transaction boundaries become difficult to maintain across services. |
| Unstructured Monolith | No module boundaries means business concepts bleed across concerns freely. This creates an unmaintainable codebase as the domain grows.                                                                                                   |
| Serverless Functions  | Stateless functions do not map well to a domain-driven model. Aggregate consistency and transactional integrity are difficult to guarantee across function invocations.                                                                   |

---

## Consequences

**Easier**:

- Local development: a single `npm run dev` starts the entire application.
- Refactoring: module boundaries can be adjusted without re-deploying services.
- Transactions: cross-module operations that require ACID guarantees can use a single database transaction.
- Testing: integration tests run against a real local database without network mocking.

**Harder / requires attention**:

- Module boundary enforcement is not guaranteed by the runtime. It depends on developer discipline and code review.
- If a module needs to be extracted into a separate service in the future, the effort is proportional to how well the boundaries were maintained. Poor boundary discipline now creates migration debt later.
- Deployment is all-or-nothing. A breaking change in one module deploys with all other modules.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 2.1: Modular Monolith
- [Modules](../product/modules.md) — Full module boundary definitions
- [Domain Model](../product/domain-model.md) — Bounded Context definitions
