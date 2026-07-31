# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for Nexo.

An ADR captures a significant architectural decision: what was decided, why, and what consequences follow from it.

ADRs are the primary mechanism for documenting architectural choices that are not obvious from the code or from the product documentation.

---

## When to Write an ADR

An ADR is required whenever a decision:

- Changes the architectural style or system layering defined in `architecture.md`
- Adds, replaces, or removes a technology from the tech stack
- Changes module boundaries or moves a business concept between modules
- Introduces a cross-module communication pattern not covered by `architecture.md`
- Grants an exception to any rule in `architecture.md` or `CLAUDE.md`
- Violates a non-negotiable invariant from `domain-model.md`
- Introduces a new architectural pattern not previously used in the codebase

When in doubt, write the ADR. A short record is better than no record.

---

## File Naming

ADRs are numbered sequentially and stored in this directory.

Format: `NNNN-short-title.md`

Examples:

- `0001-use-nextjs-app-router.md`
- `0002-use-vitest-for-testing.md`
- `0003-move-liabilities-to-portfolio.md`

Numbers are zero-padded to four digits. Numbers are never reused, even if an ADR is deprecated or superseded.

---

## ADR Lifecycle

Each ADR has a status that reflects its current state.

| Status       | Meaning                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `Proposed`   | The decision is under discussion. Not yet adopted.                        |
| `Accepted`   | The decision has been approved and is in effect.                          |
| `Deprecated` | The decision was once accepted but is no longer relevant. Not replaced.   |
| `Superseded` | The decision was replaced by a newer ADR. Link to the superseding record. |

---

## ADR Template

Copy the template below when writing a new ADR.

```markdown
# NNNN — Title

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded by [NNNN](NNNN-title.md)
**Deciders**: Name(s)

---

## Context

Describe the situation that requires a decision.

What problem are we trying to solve?
What constraints or forces are at play?
What makes this decision necessary now?

---

## Decision

State the decision clearly and directly.

What are we doing?

---

## Rationale

Why this option over the alternatives?

What are the key reasons for this choice?

---

## Alternatives Considered

List the options that were evaluated and why they were not chosen.

| Alternative | Why rejected |
| ----------- | ------------ |
| Option A    | Reason       |
| Option B    | Reason       |

---

## Consequences

What becomes easier as a result of this decision?

What becomes harder or requires more attention?

Are there any risks or trade-offs introduced?

---

## Related Documents

- Link to relevant product docs, other ADRs, or external references.
```

---

## Index

| ADR | Title         | Status | Date |
| --- | ------------- | ------ | ---- |
| —   | _No ADRs yet_ | —      | —    |

New ADRs are added to this index when they are created.

---

## Principles for Good ADRs

**Write for a future reader who has no context.** The ADR should be understandable six months from now by someone who was not part of the original discussion.

**Focus on the why, not the what.** The code shows what was built. The ADR explains why this approach was chosen over the alternatives.

**Keep it short.** A good ADR fits on one page. If the context requires more, it may be two decisions disguised as one.

**One decision per ADR.** If two decisions are independent, write two ADRs.

**Accept imperfection.** A short ADR written now is more valuable than a perfect ADR written never.
