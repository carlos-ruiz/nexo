# 0011 — Playwright for End-to-End Testing

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Unit tests (ADR 0010) cover domain invariants. Integration tests cover the Application Layer with a real database. Neither test type verifies that a user can actually complete a critical workflow end-to-end: logging in, viewing their accounts, recording a transaction, tracking a budget.

End-to-end (E2E) tests close this gap. They drive a real browser against the deployed application, verifying that the full stack — presentation, application, domain, and database — works together correctly from the user's perspective.

E2E tests are expensive to maintain and must be focused on high-value, critical user flows. They run against the staging environment, not against local development.

Requirements:

- Real browser automation (not JSDOM simulation).
- Cross-browser support (Chromium at minimum; Firefox and WebKit for confidence).
- Reliable, deterministic selectors that are resilient to UI refactoring.
- Debugging capabilities: trace files, screenshots, and video on failure.
- CI integration.

---

## Decision

Nexo uses **Playwright** for end-to-end testing.

E2E tests live in `tests/e2e/`. They are not co-located with module code — they are user-flow-level tests, not module-level tests.

E2E tests run exclusively against the **staging environment**. They do not run against local development or production.

Critical user flows covered by E2E tests at a minimum:

- Authentication (sign up, sign in, sign out)
- Account creation and viewing
- Transaction recording and listing
- Budget creation and progress display
- Dashboard summary accuracy

Test isolation is handled by creating dedicated test user accounts and cleaning them up after each test run.

---

## Rationale

Playwright is the current standard for web E2E testing. It outperforms Cypress and Selenium on all relevant dimensions for a Next.js application:

- **True multi-browser support**: Playwright drives Chromium, Firefox, and WebKit using separate browser engines. This is not emulation — it is real browser execution.
- **Auto-wait**: Playwright automatically waits for elements to be actionable before interacting. This eliminates the flakiness caused by explicit `sleep` calls or overly cautious `waitFor` calls.
- **Trace viewer**: Failed test runs produce a trace file that records every action, network request, and screenshot. Debugging E2E failures is a matter of replaying the trace — not reproducing the issue locally.
- **Codegen**: Playwright can generate test code by recording user interactions. This speeds up writing new E2E tests for new flows.
- **App Router compatibility**: Playwright works against any HTTP server. Next.js App Router has no special requirements for Playwright.

Playwright is also the framework recommended by Vercel for Next.js E2E testing.

---

## Alternatives Considered

| Alternative          | Why rejected                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cypress              | Good developer experience and test runner UI. However: true cross-browser support requires Cypress Cloud (paid). Test isolation in Cypress is weaker than Playwright. Playwright's trace viewer is superior for debugging. |
| Selenium / WebDriver | Industry-standard protocol, but significantly more verbose setup. Flakiness is a known challenge. Playwright is the modern replacement with a better developer experience.                                                 |
| Puppeteer            | Chromium-only. Does not support Firefox or WebKit. Playwright is built on the same underlying architecture as Puppeteer but with multi-browser support and a higher-level API.                                             |
| Vitest browser mode  | Vitest's browser mode is designed for component-level testing, not full user-flow E2E testing against a deployed application. Not a replacement for Playwright.                                                            |

---

## Consequences

**Easier**:

- Auto-wait eliminates most flakiness without explicit wait conditions.
- Trace files make failed CI runs debuggable without local reproduction.
- Multi-browser coverage (Chromium, Firefox, WebKit) is available in the same test suite.
- Playwright's `page.getByRole()`, `getByLabel()`, and `getByText()` selectors encourage accessible markup and are resilient to DOM structure changes.
- CI integration with GitHub Actions is well-documented and straightforward.

**Harder / requires attention**:

- E2E tests require a running staging environment. They cannot be run in isolation without the full stack.
- Test data management is important. Each E2E test must create its own test data and clean up after itself to remain isolated and repeatable.
- E2E tests are slower than unit and integration tests. They must be run selectively (not on every commit) or parallelized in CI.
- The `tests/e2e/` directory must be kept focused on critical user flows only. E2E tests that duplicate integration test coverage add maintenance burden with no additional confidence.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 6: Technology Stack, Testing Strategy
- [ADR 0010](0010-vitest.md) — Vitest for Unit and Integration Testing
