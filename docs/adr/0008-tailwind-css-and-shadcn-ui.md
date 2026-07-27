# 0008 — Tailwind CSS and shadcn/ui

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo is a financial SaaS with a dashboard-heavy UI: account overviews, transaction lists, budget progress bars, goal trackers, and reports. The UI must be:

- **Consistent**: the same visual language across all financial views.
- **Accessible**: financial tools are used daily by people with varying abilities.
- **Maintainable**: the team should be able to iterate on UI without fighting a complex CSS architecture.
- **Controllable**: the project must own its UI components fully. Upstream breaking changes in a component library must not block feature releases.

The UI stack must also integrate cleanly with Next.js App Router, including React Server Components.

---

## Decision

Nexo uses **Tailwind CSS** for styling and **shadcn/ui** for UI components.

**Tailwind CSS** is the primary styling mechanism. Utility classes are applied directly in JSX. No custom CSS architecture (BEM, CSS Modules, Styled Components) is used alongside it.

**shadcn/ui** components are copied into `src/components/ui/` at setup time. They are owned by the project — not imported as a runtime npm package. Components are based on Radix UI primitives and styled with Tailwind.

This means:

- `shadcn/ui` does not appear in `package.json` as a runtime dependency after setup.
- Any component from the shadcn/ui catalog is added by copying its source into `src/components/ui/` using the shadcn CLI.
- Once copied, a component is fully owned by the project. It can be modified freely without waiting for upstream releases.
- The project maintains its own `components.json` configuration for the shadcn CLI.

---

## Rationale

**Tailwind CSS**

Tailwind's utility-first approach eliminates the need to name CSS classes for every component and maintain a separate stylesheet. For a financial dashboard with many small, specific UI elements, this dramatically reduces styling overhead.

Tailwind integrates natively with Next.js and the App Router. It works in Server Components without any hydration concerns. Its design token system (spacing, color, typography) enforces visual consistency without a separate design system setup.

**shadcn/ui**

shadcn/ui solves the component library dilemma: pre-built accessible components versus full ownership of the code.

Traditional component libraries (MUI, Chakra UI, Mantine) are runtime dependencies. Upgrading them can introduce breaking changes that affect the entire application. Their styling systems often conflict with Tailwind or require workarounds.

shadcn/ui takes a different approach: components are templates that are copied into the project. The result is:

- No runtime dependency on an upstream library.
- Full control over every line of component code.
- Components styled with Tailwind — consistent with the rest of the application.
- Built on Radix UI primitives, which provide accessibility (keyboard navigation, ARIA attributes, focus management) out of the box.

For a financial application where accessibility and predictability matter, this is the right tradeoff.

---

## Alternatives Considered

| Alternative                           | Why rejected                                                                                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS Modules                           | Locally scoped styles. Requires maintaining separate `.module.css` files for every component. Works well but adds more files and naming overhead compared to Tailwind utility classes.    |
| Styled Components / Emotion           | CSS-in-JS with runtime overhead. Does not work in React Server Components without additional configuration. Not appropriate for the App Router.                                           |
| MUI (Material UI)                     | Comprehensive component library. Its styling system (MUI System / Emotion) conflicts with Tailwind. Large bundle size. Components cannot be easily modified without forking.              |
| Chakra UI                             | Good developer experience, but uses Emotion for styling. Same Server Component compatibility issues as other CSS-in-JS solutions.                                                         |
| Mantine                               | Strong component library with Tailwind support improving. Remains a runtime dependency; component internals cannot be modified without forking.                                           |
| Radix UI directly (without shadcn/ui) | Radix provides unstyled primitives. This is essentially what shadcn/ui is built on — but without the pre-styled templates, more design work is required to reach the same starting point. |

---

## Consequences

**Easier**:

- UI development uses a single styling system (Tailwind) with no parallel CSS architectures.
- Accessible, interactive components (dialogs, dropdowns, date pickers, comboboxes) are available immediately via shadcn/ui without building from scratch.
- Components can be modified freely — no upstream dependency to wait on.
- Tailwind's `cn()` utility and `class-variance-authority` enable variant-based component APIs.
- Server Components work with Tailwind without any special configuration.

**Harder / requires attention**:

- Copied shadcn/ui components diverge from upstream over time. Security fixes or improvements in upstream components must be manually reviewed and applied.
- Tailwind class lists in JSX can become verbose for complex components. Consistent use of `cn()` and component encapsulation mitigates this.
- The shadcn CLI must be used (not manual copying) to ensure components are added with correct dependencies and configuration.
- Design consistency depends on Tailwind's config (`tailwind.config.ts`). The design token configuration must be established early and treated as a stable foundation.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 6: Technology Stack (Tailwind CSS, shadcn/ui sections)
- [ADR 0004](0004-nextjs-app-router.md) — Next.js App Router
