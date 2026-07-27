# 0004 — Next.js with App Router

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo is a full-stack web application. It needs a framework that handles routing, server-side rendering, API endpoints, authentication integration, and deployment — while fitting the Hexagonal Architecture defined in ADR 0002.

The presentation layer must remain strictly separate from the domain and application layers. Framework conventions must not bleed into business logic.

Nexo targets both desktop and mobile (via PWA). It requires:

- Server-rendered views for fast initial loads on data-heavy dashboards.
- Form submissions that write financial data with minimal round-trip complexity.
- A clear separation between the UI and the Application Layer it calls into.
- TypeScript support throughout.
- Strong ecosystem and long-term viability.

An additional constraint: authentication is handled by Clerk, which provides first-class integration with the framework chosen.

---

## Decision

Nexo uses **Next.js** as its web application framework, specifically the **App Router** (introduced in Next.js 13, stable in Next.js 14).

The **Pages Router is not used** and must not be mixed into the codebase.

**TypeScript** is used throughout in strict mode. `any` types are not permitted in domain or application layer code.

The App Router directory lives at `src/app/`. Server Actions within App Router pages call directly into the Application Layer of the relevant module. API routes (under `src/app/api/`) are reserved for webhook endpoints and external integration callbacks only — not for application logic.

---

## Rationale

**App Router over Pages Router**

The App Router is the strategic direction from Vercel and the React team. The Pages Router is in maintenance mode. Choosing the App Router ensures long-term support and alignment with the React ecosystem's evolution.

The App Router's React Server Components are a strong fit for financial dashboards:

- Server Components render data-heavy views (account summaries, transaction lists, reports) without sending unnecessary JavaScript to the client.
- Streaming renders progressive UI as data resolves, improving perceived performance on dashboards with multiple KPIs.
- Nested layouts enable efficient navigation between financial sections without full page reloads.
- Server Actions simplify form submissions and write operations — a form submitting a new transaction calls a Server Action that invokes the Application Layer command handler directly, without a separate REST endpoint.

**Next.js over alternatives**

Next.js is the most widely adopted React framework with the largest ecosystem, strongest TypeScript support, and the best Clerk integration. It handles production concerns (image optimization, caching, edge deployments) without custom configuration.

---

## Alternatives Considered

| Alternative             | Why rejected                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js Pages Router    | In maintenance mode. Lacks React Server Components and Server Actions. Choosing it now would require migration to App Router later.                                   |
| Remix                   | Strong routing model, good server-side story. Less mature ecosystem and Clerk integration compared to Next.js. React Server Components are not first-class.           |
| SvelteKit               | Different language (Svelte), different component model. Would require the team to maintain expertise in both React (for potential future native app) and Svelte.      |
| Vanilla React + Express | Full control but requires assembling routing, SSR, bundling, and deployment from scratch. Significant ongoing maintenance overhead with no benefit for this use case. |

---

## Consequences

**Easier**:

- Server Actions provide a direct path from form submission to Application Layer command handlers with no API boilerplate.
- React Server Components reduce client-side JavaScript for data-heavy financial views.
- Clerk's Next.js SDK integrates seamlessly with App Router middleware for session management.
- Built-in image optimization, font loading, and static asset handling.
- Deployment to Vercel is trivial; other Node.js hosting works equally well.

**Harder / requires attention**:

- The App Router has a steeper learning curve than Pages Router, particularly around caching behavior (`revalidate`, `cache`, `no-store`) and the distinction between Server Components and Client Components.
- Server Components cannot use React hooks or browser APIs. Components that need interactivity must be explicitly marked `"use client"`. This boundary must be maintained consciously.
- API routes must not be used as a general-purpose backend. All business logic goes through the Application Layer via Server Actions, not through API routes.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 5.2: Presentation Layer, Section 6: Technology Stack
- [ADR 0007](0007-clerk-authentication.md) — Clerk Authentication
