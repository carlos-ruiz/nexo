---
title: Product Principles
status: Approved
version: 1.0.0
owner: Carlos Ruiz
reviewers:
  - ChatGPT (Principal Software Architect)
last_updated: 2026-07-02
related:
  - vision.md
  - scope.md
---

# Product Principles

> Every decision made in Nexo must reinforce the product vision. These principles are the foundation used to evaluate features, architecture, user experience, and engineering decisions.

---

# 1. Decision First

Nexo exists to help users make better financial decisions.

Recording transactions is not the goal.

Recording transactions enables better decisions.

Every feature should ultimately answer one or more financial questions.

Examples:

- Can I afford this purchase?
- Am I improving my financial health?
- Where is my money going?
- What should I do next?

---

# 2. Financial Accuracy Above Convenience

Financial software must prioritize correctness.

The system should never sacrifice data integrity for convenience.

If there is a conflict between speed and accuracy, accuracy wins.

---

# 3. Trust Is the Most Valuable Feature

Users must trust Nexo with their financial information.

Trust is built through:

- Accurate calculations
- Predictable behavior
- Transparent workflows
- Consistent reporting
- Reliable data

Every engineering decision should increase trust.

---

# 4. AI Assists, Humans Decide

Artificial Intelligence assists users.

Artificial Intelligence does not make financial decisions.

AI may:

- Suggest
- Detect
- Recommend
- Predict
- Explain

AI must never:

- Modify financial records automatically
- Delete financial information
- Execute irreversible actions

The user always has final control.

---

# 5. Explainable Intelligence

Every AI recommendation must be explainable.

Users should understand:

- Why the recommendation exists
- Which data was analyzed
- Which assumptions were made

Black-box recommendations are not acceptable.

---

# 6. Single Source of Truth

Every financial fact should exist only once.

Avoid duplicated information.

Reports should derive from financial records rather than storing calculated values whenever possible.

---

# 7. Financial History Is Immutable

Historical financial events represent reality.

Reality cannot be rewritten.

Corrections are represented as new financial events.

The platform should preserve a complete financial timeline.

---

# 8. Event-Oriented Domain

The business domain is modeled around financial events.

Examples include:

- Income Received
- Expense Recorded
- Transfer Completed
- Credit Card Payment Made
- Loan Payment Applied

Events describe what happened.

Reports, dashboards, budgets, and AI derive insights from those events.

---

# 9. Simplicity Before Features

Adding features is easy.

Maintaining them is expensive.

Every new capability increases long-term complexity.

A feature should exist only if it creates meaningful value for most users.

---

# 10. Progressive Complexity

New users should experience a simple product.

Advanced capabilities should become available progressively.

Powerful software should not feel overwhelming.

---

# 11. Manual Entry Is a First-Class Experience

Nexo intentionally supports manual financial management.

The product should never depend on bank integrations.

Users should remain fully capable of managing their finances without connecting financial institutions.

---

# 12. Privacy by Design

User privacy is a core value.

Financial information belongs to the user.

The platform should minimize data collection and always communicate clearly how information is processed.

---

# 13. Localization Without Business Logic

Localization must never affect financial behavior.

Business rules remain language-independent.

Translations belong exclusively to the presentation layer.

---

# 14. Multi-Currency as a Core Capability

Currency support is a domain capability.

Language and currency are independent settings.

The platform should correctly support users managing multiple currencies.

---

# 15. Accessibility Is Not Optional

Nexo should be usable by as many people as possible.

Accessibility must be considered during design, implementation, and testing.

---

# 16. Performance Creates Trust

A financial application should feel responsive.

Users should never question whether an operation succeeded because of slow feedback.

Performance is a product feature.

---

# 17. Transparency Over Automation

Automation should never surprise users.

Every automated action should be:

- Visible
- Understandable
- Reversible whenever possible

---

# 18. Modular Evolution

Every module should evolve independently.

The architecture should support adding new capabilities without rewriting existing ones.

The system should become larger without becoming more complex.

---

# 19. Product Before Technology

Technology choices serve the product.

The product does not exist to showcase technologies.

Architectural decisions should always support business goals.

---

# 20. Long-Term Thinking

Nexo is designed to exist for many years.

Short-term optimizations that increase long-term maintenance costs should be avoided.

When two valid solutions exist, prefer the one that improves maintainability, clarity, and scalability.

---

# Decision Filters

Before implementing any feature, answer the following questions.

## User Value

- Does this help users make better financial decisions?
- Does this solve a real problem?

## Simplicity

- Can this be implemented in a simpler way?
- Does it increase unnecessary complexity?

## Trust

- Does it improve confidence in financial data?
- Can users clearly understand what is happening?

## Product Vision

- Does it align with Nexo's vision?
- Would removing this feature make the product worse?

## AI

- Does AI genuinely improve the experience?
- Is the recommendation explainable?

## Engineering

- Is the solution maintainable?
- Is it testable?
- Is it modular?
- Is it scalable?

If a feature fails multiple filters, it should not be implemented.

---

# Engineering Motto

> Build software that users trust.

---

# Product Motto

> Help people make better financial decisions.

---

# Vision Reminder

Nexo is not an expense tracker.

Nexo is a Financial Operating System.

Every feature should move the platform closer to that vision.
