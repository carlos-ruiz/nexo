# 0007 — Clerk for Authentication

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo is a multi-user SaaS platform. Every user's financial data must be strictly isolated. Authentication and session management are required before any user-facing feature can be built.

Building authentication in-house means implementing:

- Secure password hashing and storage
- Session management and token rotation
- OAuth provider integrations (Google, Apple, etc.)
- Magic link / OTP flows
- Account recovery
- Multi-factor authentication
- Compliance with security standards (e.g., OWASP authentication guidelines)

This is a solved problem. Building it from scratch introduces security risk, maintenance burden, and delays building the actual product.

At the same time, the authentication provider must be treated as an external dependency — not as a first-class citizen of the domain model. Any provider-specific concept (Clerk user IDs, Clerk session tokens, Clerk organization IDs) must be isolated so that switching providers does not require changes throughout the codebase.

---

## Decision

Nexo uses **Clerk** as its authentication and session management provider.

Clerk is integrated exclusively within the `identity` module's infrastructure layer. An **anti-corruption layer (ACL)** in `src/modules/identity/infrastructure/adapters/` translates Clerk concepts into Nexo domain concepts.

The following rules are non-negotiable:

- Clerk-specific types, identifiers, and SDKs must never appear outside `src/modules/identity/infrastructure/`.
- All other modules reference authenticated users exclusively through `UserId` from the Shared Kernel.
- The `UserId` value object is the only cross-module reference to an authenticated user.
- Clerk's `userId` (a string like `user_2abc...`) is mapped to Nexo's `UserId` within the ACL and never exposed beyond it.

Clerk handles: user registration, login, session lifecycle, OAuth providers, MFA, and webhooks for user lifecycle events.

---

## Rationale

Clerk provides a production-ready authentication system with a first-class Next.js App Router integration. It handles the full authentication lifecycle — registration, login, session management, MFA, and OAuth — without requiring Nexo to build or operate any authentication infrastructure.

For a financial application, authentication must be secure by default. Clerk's managed service is regularly audited and updated. Using it reduces the attack surface compared to a custom implementation where every security detail must be implemented correctly by the Nexo team.

The anti-corruption layer is the critical architectural decision within this choice. Without it, Clerk's user IDs would appear throughout the codebase — in domain events, query handlers, database schemas, and service interfaces. If Clerk were ever replaced (by Auth.js, Supabase Auth, or a custom system), every one of those references would need to change. The ACL ensures that the `identity` module's infrastructure layer is the only place that knows about Clerk.

---

## Alternatives Considered

| Alternative               | Why rejected                                                                                                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth.js (NextAuth)        | Open-source, more control. However, it requires the team to manage session storage, database adapters, and provider configuration. More surface area for security issues. Clerk's managed service is more appropriate when authentication is not a core differentiator. |
| Supabase Auth             | Bundles authentication with database. Nexo already chose PostgreSQL independently (ADR 0005). Coupling authentication to a specific database hosting provider introduces unnecessary vendor lock-in at the infrastructure level.                                        |
| Firebase Auth             | Google-managed authentication. Strong product, but ties Nexo to the Google Cloud ecosystem. Less seamless Next.js App Router integration compared to Clerk.                                                                                                             |
| Custom JWT implementation | Full control, full responsibility. The security risks of a poorly implemented JWT system in a financial application outweigh any benefit. Not appropriate when a proven solution exists.                                                                                |

---

## Consequences

**Easier**:

- Authentication is operational from day one of Phase 0. The team builds financial features immediately rather than authentication infrastructure.
- Clerk's Next.js middleware handles session detection and route protection out of the box.
- MFA, social login, and magic links are available without custom implementation.
- Security updates to the authentication layer are managed by Clerk, not by the Nexo team.

**Harder / requires attention**:

- The anti-corruption layer must be maintained strictly. Any developer adding a new feature that references a user must use `UserId` from the Shared Kernel — never a Clerk-specific identifier.
- Clerk webhooks for user lifecycle events (user created, user deleted) must be handled in `identity/infrastructure` and translated into domain events before being published to other modules.
- Clerk is a paid service with usage-based pricing. Costs scale with monthly active users.
- If Clerk's SDK changes in a major version, the migration is contained to `identity/infrastructure` — but it still requires a dedicated effort.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 6: Technology Stack (Clerk section)
- [Domain Model](../product/domain-model.md) — Identity Bounded Context, `UserId` in Shared Kernel
- [Modules](../product/modules.md) — Identity module responsibilities
- [ADR 0004](0004-nextjs-app-router.md) — Next.js App Router
