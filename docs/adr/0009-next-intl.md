# 0009 — next-intl for Internationalization

**Date**: 2026-07-11
**Status**: Accepted
**Deciders**: Carlos Ruiz

---

## Context

Nexo targets users in Mexico, the United States, and Canada. The platform must present its UI in both English and Spanish. Financial values, dates, and number formats vary by locale (e.g., decimal separators, currency symbols, date ordering).

A core architectural constraint is that localization must be **strictly a presentation-layer concern**. The domain and application layers must have no knowledge of locale, language, or translation. A `Budget` aggregate does not know what language the user speaks. A query handler does not format currency amounts for display — it returns a `Money` value object and the presentation layer handles formatting.

The i18n library must therefore:

- Integrate natively with Next.js App Router and React Server Components.
- Support locale-aware routing (e.g., `/en/dashboard`, `/es/dashboard` or via `Accept-Language` header).
- Handle translation key lookups, number formatting, date formatting, and currency formatting.
- Keep translation files in a predictable, maintainable format.
- Never require imports from domain or application layer code.

---

## Decision

Nexo uses **next-intl** for internationalization.

Translation files live in `messages/{locale}.json`:

- `messages/en.json` — English
- `messages/es.json` — Spanish

Supported locales at launch: `en` (English), `es` (Spanish).

Locale detection and routing are configured in Next.js middleware using next-intl's `createMiddleware`. The locale prefix strategy is determined by the routing configuration.

Localization is **only ever used** in:

- `src/app/` — React Server Components and Client Components in the presentation layer
- `src/components/` — Shared UI components

Localization must **never** appear in:

- `src/modules/{module}/domain/`
- `src/modules/{module}/application/`
- `src/shared-kernel/`

---

## Rationale

next-intl is designed specifically for Next.js App Router. Unlike next-i18next (which was built for Pages Router) or generic i18n libraries, next-intl provides:

- Server Component support — translations are loaded server-side, reducing client-side JavaScript.
- Type-safe message keys — when configured with TypeScript, referencing a non-existent translation key produces a compile error.
- App Router-native locale routing — middleware-based locale detection and URL prefix handling.
- Number, date, and relative time formatting — through the built-in `useFormatter` hook and server-side equivalents.

For a financial application, locale-aware number and currency formatting is important. next-intl's formatting capabilities are built on the Intl API and support the display conventions required for MXN, USD, and CAD.

---

## Alternatives Considered

| Alternative     | Why rejected                                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| next-i18next    | Built primarily for Pages Router. Lacks first-class App Router support. Requires complex configuration for Server Components.                                            |
| react-i18next   | Popular library but not designed for Next.js App Router. Requires client-side hydration for translations, which defeats the server-rendering benefits of the App Router. |
| LinguiJS        | Strong library with message extraction tooling. More complex setup for Next.js App Router compared to next-intl. Smaller ecosystem in the Next.js community.             |
| Custom solution | Building locale routing, translation key lookup, and number/date formatting from scratch. Not justified when a purpose-built solution exists.                            |

---

## Consequences

**Easier**:

- Server-side translation rendering reduces client JavaScript for UI-heavy pages.
- Type-safe message keys catch missing translations at compile time.
- Number, date, and currency formatting is handled by next-intl's formatter — no manual `Intl.NumberFormat` wiring.
- Adding a third locale (e.g., `fr`) requires only a new `messages/fr.json` and a routing configuration change.

**Harder / requires attention**:

- Developers must maintain translation files in sync. Adding a UI string without adding the translation key to both `en.json` and `es.json` produces a visible gap.
- Translation keys must be organized thoughtfully (e.g., by module or feature) to avoid a single monolithic translation file that is difficult to maintain.
- The rule that localization must never appear in domain or application code must be actively enforced. A domain event message, an email subject, or a notification body must be localized at the presentation boundary — never at the source.
- Missing translation keys at runtime fall back to the key string itself. A QA pass against both locales is required before each release.

---

## Related Documents

- [Architecture](../product/architecture.md) — Section 6: Technology Stack (next-intl section)
- [ADR 0004](0004-nextjs-app-router.md) — Next.js App Router
- [Vision](../product/vision.md) — Multilingual platform requirement
