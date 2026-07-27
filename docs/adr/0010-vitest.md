# 0010 — Vitest for Unit and Integration Testing

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo has strict domain invariants (see `domain-model.md`) that must be exhaustively tested. Financial logic — account balance derivation, budget constraint enforcement, loan payment validation, statement immutability — cannot be left untested.

The testing strategy separates two distinct concerns:

**Unit tests** cover the Domain Layer exclusively. They verify that aggregates enforce their invariants correctly. They must run without a database, without a network, and without instantiating any framework. Speed is critical — developers run unit tests on every save.

**Integration tests** cover the Application Layer with a real database. They verify that command and query handlers interact correctly with Prisma repositories and that the full use case produces the expected side effects in PostgreSQL. Mocks are not permitted at this level — real behavior must be tested.

Both test types must have first-class TypeScript support, be co-located with the module they test, and run in CI.

---

## Decision

Nexo uses **Vitest** for both unit and integration testing.

Unit tests:

- Cover the Domain Layer only.
- No database, no network, no framework imports.
- Use in-memory fake repository implementations for any repository dependency.
- Co-located within the module directory: `src/modules/{module}/domain/**/*.test.ts`.

Integration tests:

- Cover the Application Layer with a real PostgreSQL instance.
- No mocks permitted for repositories or database interactions.
- Run against a dedicated test database that is reset between test suites.
- Co-located within the module directory: `src/modules/{module}/application/**/*.test.ts` and `src/modules/{module}/infrastructure/**/*.test.ts`.

Code coverage is reported in CI. Coverage thresholds are enforced for the domain layer.

---

## Rationale

Vitest is the natural choice for a Next.js + TypeScript project in 2024 and beyond:

- **Native ESM support**: Next.js uses ESM. Vitest handles ESM modules natively without the transformation overhead that Jest requires for ESM projects.
- **TypeScript without configuration**: Vitest works with TypeScript out of the box. No `ts-jest` or `babel-jest` preset is needed.
- **Speed**: Vitest's file-level parallelism and hot-module awareness make it significantly faster than Jest for large TypeScript projects.
- **Vite compatibility**: The entire toolchain (Vite, Vitest, shadcn/ui) shares a consistent build pipeline. Configuration is unified.
- **Jest-compatible API**: The `describe`, `it`, `expect`, `beforeEach`, `afterEach` API is identical to Jest, minimizing the learning curve.

The no-mocks rule for integration tests is deliberate. Mocking repositories in integration tests defeats their purpose — they exist to verify that the application layer correctly orchestrates real persistence. A test that uses a mock repository only verifies that the code calls the mock in the expected way, not that it actually works.

---

## Alternatives Considered

| Alternative                  | Why rejected                                                                                                                                                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jest                         | The de facto standard for years, but requires significant configuration for ESM and TypeScript in a Next.js project. Slower than Vitest for large TypeScript codebases. Vitest is the community's preferred replacement for new projects in the Vite/Next.js ecosystem. |
| Mocha + Chai                 | Highly configurable, but requires manually assembling the test runner, assertion library, coverage tool, and TypeScript transform. More setup with no benefit over Vitest.                                                                                              |
| Node.js built-in test runner | Available in recent Node.js versions but lacks a mature assertion library, coverage reporting, and the broad ecosystem support that Vitest provides.                                                                                                                    |

---

## Consequences

**Easier**:

- Unit tests for domain aggregates are simple TypeScript files with no configuration overhead.
- Vitest's watch mode provides near-instant feedback during TDD cycles.
- ESM imports work without transformation configuration.
- Coverage reports integrate with CI without additional tooling.
- The same `vitest.config.ts` supports both unit and integration test profiles (separated by file path patterns).

**Harder / requires attention**:

- Integration tests require a real PostgreSQL instance. Local development requires Docker (or a managed database). CI must provision a test database.
- Test database setup and teardown (migration running, data seeding, cleanup between suites) must be implemented and maintained.
- The co-location convention (tests next to the code they test) must be enforced. Tests placed outside the module directory violate the Hexagonal Architecture's module ownership principle.
- Vitest's configuration for Next.js requires a `vitest.config.ts` that handles Next.js-specific module aliases and the `server` vs `client` environment distinction.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 6: Technology Stack, Testing Strategy
- [ADR 0002](0002-hexagonal-architecture.md) — Hexagonal Architecture (Domain Layer isolation)
- [ADR 0005](0005-postgresql.md) — PostgreSQL (test database requirement)
- [ADR 0011](0011-playwright.md) — Playwright for End-to-End Testing
