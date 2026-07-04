---
title: Product Modules
status: Approved
version: 2.0.0

owner: Carlos Ruiz

authors:
  - Carlos Ruiz
  - ChatGPT (Principal Software Architect)

last_updated: 2026-07-02

depends_on:
  - vision.md
  - principles.md
  - scope.md

related: []

supersedes: null

superseded_by: null

tags:
  - product
  - modules
  - architecture
---

# Product Modules

> Nexo is organized around business capabilities. Every module represents a bounded context with a clear responsibility and explicit ownership. Modules communicate through well-defined public contracts and domain events.

---

# 1. Purpose

The purpose of this document is to define the official module boundaries of Nexo.

A module is **not** a folder.

A module is **not** a UI section.

A module is **not** a database schema.

A module is a business capability with clear ownership over its rules, data, and behavior.

Every business capability belongs to exactly one module.

---

# 2. Architectural Principles

All modules must follow these principles.

## Single Responsibility

Each module solves one business problem.

If a module has multiple unrelated responsibilities, it should be split.

---

## High Cohesion

Business rules that change together belong together.

---

## Low Coupling

Modules communicate only through public interfaces.

Direct access to another module's internals is forbidden.

---

## Explicit Ownership

Every entity, aggregate, repository and business rule has exactly one owner.

Ownership is never shared.

---

## Independent Evolution

Modules should evolve independently whenever possible.

---

## Domain First

Business concepts define module boundaries.

Technology never defines module boundaries.

---

## Public Contracts Only

A module exposes behavior.

It never exposes implementation details.

---

## Replaceable Implementation

The internal implementation of a module may change without affecting other modules.

---

# 3. System Layers

Nexo is divided into three logical layers.

```
Business Capabilities
        ▲
        │
Core Financial Domain
        ▲
        │
Platform Services
```

Dependencies always point downward.

Core Financial Domain never depends on Business Capabilities.

Platform Services never contain business rules.

---

# 4. Layer Overview

## Core Financial Domain

The Core Financial Domain contains the business model of Nexo.

Everything that directly represents a user's financial life belongs here.

Modules:

- Accounts
- Financial Events
- Categories
- Credit Cards
- Loans
- Assets
- Budgets
- Goals

These modules own the financial state of the system.

---

## Business Capabilities

Business Capabilities consume the Core Financial Domain to provide additional value.

They do not own financial data.

Modules:

- Reports
- AI

These modules generate projections, insights and recommendations.

---

## Platform Services

Platform Services provide technical capabilities shared across the application.

They are not business modules.

Services:

- Identity
- Authorization
- Localization
- Notifications
- Audit
- Configuration
- Feature Flags
- Logging
- Observability

Platform Services never own financial business rules.

---

# 5. Core Financial Domain

The following modules define the financial domain of Nexo.

Each module owns:

- Its domain model
- Business rules
- Aggregates
- Repositories
- Domain events
- Application services

No other module may modify another module's business state directly.

The following sections define each Core Financial Module.

# 6. Core Financial Modules

The Core Financial Domain represents the financial reality of a user.

Every financial record belongs to exactly one Core Financial Module.

These modules own the business rules, aggregates, invariants and domain events that define the financial state of the system.

---

# 6.1 Accounts

## Purpose

Manage every financial account owned by a user.

Accounts represent where money is stored or managed. They are the foundation of the financial domain because every Financial Event ultimately impacts one or more accounts.

## Responsibilities

- Create and manage accounts
- Maintain account balances
- Support multiple currencies
- Archive accounts
- Validate account operations

## Owned Concepts

- Account
- Account Balance
- Account Status
- Account Currency

## Public Capabilities

- Create Account
- Update Account
- Archive Account
- Reopen Account
- Adjust Balance
- Retrieve Current Balance

## Published Events

- AccountCreated
- AccountUpdated
- AccountArchived
- AccountReopened
- AccountBalanceAdjusted

## Consumed Events

- IncomeRegistered
- ExpenseRegistered
- TransferCompleted
- LoanPaymentApplied
- CreditCardPaymentApplied
- BalanceAdjustmentRecorded

## Key Invariants

- Every account belongs to exactly one user.
- Archived accounts cannot receive new financial events.
- Account balances are derived from Financial Events.
- Every account has exactly one base currency.

## Future Evolution

- Shared accounts
- Hidden accounts
- External account synchronization

---

# 6.2 Financial Events

## Purpose

Manage the lifecycle of Financial Events.

This module represents the financial history of a user. Every change affecting a user's financial position is recorded as a Financial Event.

## Responsibilities

- Register income
- Register expenses
- Register transfers
- Register balance adjustments
- Validate financial events
- Preserve financial history

## Owned Concepts

- Financial Event
- Financial Movement
- Event Metadata

## Public Capabilities

- Register Income
- Register Expense
- Register Transfer
- Register Balance Adjustment
- Reverse Financial Event
- Retrieve Financial History

## Published Events

- IncomeRegistered
- ExpenseRegistered
- TransferCompleted
- BalanceAdjustmentRecorded
- FinancialEventReversed

## Consumed Events

None

This module is the primary producer of financial events.

## Key Invariants

- Financial history is immutable.
- Every Financial Event is auditable.
- Every Financial Event affects at least one account.
- Corrections create new Financial Events.
- Financial Events are never physically deleted.

## Future Evolution

- Recurring financial events
- Scheduled financial events
- Import pipelines
- Event templates

---

# 6.3 Categories

## Purpose

Organize financial events into meaningful classifications.

Categories improve reporting and financial analysis without affecting financial calculations.

## Responsibilities

- Manage categories
- Manage subcategories
- Manage tags
- Maintain category hierarchy

## Owned Concepts

- Category
- Category Tree
- Tag

## Public Capabilities

- Create Category
- Update Category
- Archive Category
- Manage Tags

## Published Events

- CategoryCreated
- CategoryUpdated
- CategoryArchived

## Consumed Events

None

## Key Invariants

- Category hierarchy cannot contain cycles.
- System categories cannot be deleted.
- Archived categories remain available for historical records.

## Future Evolution

- AI-generated categories
- Category templates
- Smart categorization

---

# 6.4 Credit Cards

## Purpose

Manage revolving credit independently from bank accounts.

Credit Cards model billing cycles, statements and available credit.

## Responsibilities

- Manage credit cards
- Manage billing cycles
- Generate statements
- Track available credit
- Register payments

## Owned Concepts

- Credit Card
- Statement
- Billing Cycle
- Available Credit

## Public Capabilities

- Create Credit Card
- Close Statement
- Register Purchase
- Register Payment
- Calculate Available Credit

## Published Events

- CreditCardCreated
- StatementClosed
- CreditCardPurchaseRegistered
- CreditCardPaymentApplied

## Consumed Events

- ExpenseRegistered
- TransferCompleted

## Key Invariants

- Available credit cannot exceed the credit limit.
- Closed statements are immutable.
- Payments reduce outstanding balance.
- Purchases belong to exactly one statement.

## Future Evolution

- Installment purchases
- Multiple cardholders
- Rewards programs

---

# 6.5 Loans

## Purpose

Manage installment-based debt.

Loans represent long-term financial obligations.

## Responsibilities

- Register loans
- Maintain amortization schedules
- Track outstanding balances
- Register payments

## Owned Concepts

- Loan
- Payment Schedule
- Outstanding Balance

## Public Capabilities

- Create Loan
- Register Payment
- Calculate Outstanding Balance
- Close Loan

## Published Events

- LoanCreated
- LoanPaymentApplied
- LoanClosed

## Consumed Events

- ExpenseRegistered
- TransferCompleted

## Key Invariants

- Outstanding balance cannot become negative.
- Closed loans cannot receive payments.
- Payment schedules cannot overlap.

## Future Evolution

- Variable interest rates
- Early payoff simulation
- Refinancing

---

# 6.6 Assets

## Purpose

Manage everything owned by the user that contributes to net worth.

## Responsibilities

- Register assets
- Maintain valuations
- Track ownership
- Record acquisition information

## Owned Concepts

- Asset
- Asset Valuation
- Asset Type

## Public Capabilities

- Register Asset
- Update Valuation
- Archive Asset
- Calculate Asset Value

## Published Events

- AssetCreated
- AssetUpdated
- AssetValuationUpdated

## Consumed Events

None

## Key Invariants

- Every asset belongs to one owner.
- Historical valuations are preserved.
- Archived assets remain available for reporting.

## Future Evolution

- Depreciation
- Appreciation history
- Insurance information

---

# 6.7 Budgets

## Purpose

Help users plan and monitor spending.

## Responsibilities

- Create budgets
- Track spending
- Monitor progress
- Notify threshold violations

## Owned Concepts

- Budget
- Budget Period
- Budget Target

## Public Capabilities

- Create Budget
- Update Budget
- Close Budget
- Calculate Budget Progress

## Published Events

- BudgetCreated
- BudgetExceeded
- BudgetCompleted

## Consumed Events

- ExpenseRegistered

## Key Invariants

- Budget periods cannot overlap for the same scope.
- Budgets never modify financial records.
- Progress is calculated from Financial Events.

## Future Evolution

- Rollover budgets
- Zero-based budgeting
- Envelope budgeting

---

# 6.8 Goals

## Purpose

Track long-term financial objectives.

Goals measure progress without modifying financial data.

## Responsibilities

- Define goals
- Track progress
- Calculate completion
- Notify milestones

## Owned Concepts

- Goal
- Goal Progress
- Goal Milestone

## Public Capabilities

- Create Goal
- Update Goal
- Complete Goal
- Calculate Progress

## Published Events

- GoalCreated
- GoalUpdated
- GoalCompleted

## Consumed Events

- IncomeRegistered
- ExpenseRegistered
- LoanPaymentApplied
- AssetValuationUpdated

## Key Invariants

- Goals never modify financial records.
- Progress is calculated from existing financial information.
- Completed goals become read-only.

## Future Evolution

- Shared goals
- AI recommendations
- Goal simulations

# 7. Business Capabilities

Business Capabilities extend the value of the Core Financial Domain.

Unlike Core Financial Modules, they do not own the user's financial state. Instead, they consume information from the domain to provide insights, intelligence, and decision support.

Business Capabilities must never modify financial records directly.

---

# 7.1 Reports

## Purpose

Provide meaningful financial information through dashboards, analytics and historical reports.

Reports transform financial data into actionable insights without altering the underlying domain.

## Responsibilities

- Financial dashboards
- Income analysis
- Expense analysis
- Cash Flow analysis
- Net Worth tracking
- Budget performance
- Debt analysis
- Goal progress
- Category breakdowns
- Historical comparisons
- Trend analysis

## Owned Concepts

- Dashboard
- Report Definition
- Saved Report
- Read Model
- KPI

## Public Capabilities

- Generate Dashboard
- Generate Financial Report
- Generate Cash Flow Report
- Generate Net Worth Report
- Generate Budget Report
- Export Reports

## Published Events

- ReportGenerated
- DashboardUpdated

## Data Sources

Reports consume Read Models generated from the Core Financial Domain.

Reports never query transactional models directly.

Read Models may be refreshed synchronously or asynchronously depending on performance requirements.

## Consumed Events

Reports do not consume business events directly.

Business events may be used internally to update Read Models, but Reporting operates exclusively against those Read Models.

## Key Invariants

- Reports never modify business data.
- Reports must be reproducible.
- Historical reports should remain consistent even after future data changes.
- Reporting queries must never impact transactional performance.
- Reports must only depend on Read Models, never on transactional aggregates.

## Future Evolution

- Scheduled reports
- PDF exports
- Excel exports
- Custom dashboards
- User-defined KPIs

---

# 7.2 AI

## Purpose

Provide intelligent assistance that helps users understand, organize and improve their finances.

AI assists users by generating recommendations and explanations.

Final decisions always belong to the user.

## Responsibilities

- Expense categorization
- Merchant recognition
- Financial insights
- Spending analysis
- Budget recommendations
- Debt optimization suggestions
- Financial explanations
- Natural language interaction
- Predictive analysis (future)

## Owned Concepts

- AI Conversation
- AI Recommendation
- AI Insight
- Prompt Template
- AI Feedback

## Public Capabilities

- Suggest Category
- Explain Spending
- Analyze Budget
- Generate Financial Insights
- Recommend Debt Strategy
- Answer Financial Questions
- Summarize Financial Activity
- Simulate Financial Scenarios

## Published Events

- RecommendationGenerated
- InsightGenerated

## Data Sources

AI consumes Read Models and public query services exposed by the Core Financial Domain.

Whenever possible, AI should avoid querying transactional models directly.

## Consumed Events

None.

AI is request-driven.

Business modules invoke AI capabilities when intelligent assistance is required.

## Key Invariants

- AI never changes financial records automatically.
- Every recommendation must be explainable.
- User approval is required before applying any AI suggestion.
- AI failures must never interrupt core business operations.
- AI is stateless whenever possible.
- AI should be replaceable without affecting the financial domain.

## Future Evolution

- Financial forecasting
- Goal optimization
- Retirement planning
- Investment assistant
- Voice interaction
- AI financial coach

## Service Model

AI acts as a Business Capability Provider.

It exposes intelligent capabilities that may be invoked by other modules.

AI never owns business workflows.

Business modules remain responsible for every business decision.

---

# 8. Platform Services

Platform Services provide cross-cutting technical capabilities shared across the application.

They are not part of the financial domain.

They should remain independent from business rules whenever possible.

---

# 8.1 Identity

## Purpose

Manage user identity and authentication.

Authentication is delegated to Clerk.

The application should remain provider-agnostic.

## Responsibilities

- Authentication
- Session management
- User profile
- Account recovery

---

# 8.2 Authorization

## Purpose

Control access to application resources.

## Responsibilities

- Roles
- Permissions
- Authorization policies

Authorization must remain independent from authentication.

---

# 8.3 Localization

## Purpose

Provide multilingual and regional support.

## Responsibilities

- Language management
- Currency formatting
- Date formatting
- Time formatting
- Number formatting

Initial languages

- English
- Spanish

Initial currencies

- MXN
- USD
- CAD

---

# 8.4 Notifications

## Purpose

Deliver important information to users.

## Responsibilities

- Email notifications
- In-app notifications
- Reminder notifications
- Scheduled notifications

Examples

- Payment reminders
- Budget alerts
- Goal milestones
- Loan due dates

---

# 8.5 Audit

## Purpose

Provide an immutable history of important application events.

## Responsibilities

- Security auditing
- Administrative actions
- Critical business operations
- Compliance support

Audit records are append-only.

---

# 8.6 Configuration

## Purpose

Centralize application configuration.

## Responsibilities

- System configuration
- Feature configuration
- Environment configuration
- User defaults

---

# 8.7 Feature Flags

## Purpose

Safely release new functionality.

## Responsibilities

- Progressive rollout
- Beta features
- Internal testing
- Experiment management

---

# 8.8 Logging

## Purpose

Provide structured application logging.

## Responsibilities

- Diagnostic logging
- Error logging
- Performance logging

Logging should never contain business logic.

---

# 8.9 Observability

## Purpose

Monitor application health.

## Responsibilities

- Metrics
- Distributed tracing
- Health checks
- Performance monitoring
- Error monitoring

---

# 9. Module Communication

Modules communicate through explicit contracts.

Communication should always preserve module independence.

Preferred communication mechanisms are:

1. Public Application Services
2. Domain Events
3. Read Models
4. Query Services

Direct access to another module's persistence layer is strictly forbidden.

---

# 10. Dependency Rules

The following rules are mandatory throughout the project.

## Allowed

- Core Financial Modules may depend on Platform Services.
- Business Capabilities may consume Core Financial Modules.
- Platform Services may be used by any module.

## Forbidden

- Core Financial Modules depending on Business Capabilities.
- Circular dependencies.
- Cross-module database access.
- Shared ownership of business concepts.
- Business logic inside Platform Services.

Violations require an Architecture Decision Record (ADR).

---

# 11. Shared Kernel

A minimal Shared Kernel may exist for concepts used across multiple modules.

The Shared Kernel should contain only:

- Shared interfaces
- Primitive value objects
- Domain-independent utilities
- Common result types
- Error abstractions

The Shared Kernel must never contain business logic.

When in doubt, do not place code in the Shared Kernel.

# 12. Module Evolution Strategy

Nexo is designed as a Modular Monolith.

Module boundaries are intentionally strict to enable long-term maintainability.

The objective is not to build microservices.

The objective is to build a modular system that could evolve into independently deployable services if future business requirements justify it.

Module extraction should be driven by business needs, never by technology trends.

---

# 13. Module Ownership

Every business concept belongs to exactly one module.

Ownership includes:

- Business rules
- Domain model
- Aggregates
- Domain Services
- Repositories
- Domain Events
- Application Services

Other modules may consume a module's public capabilities, but they must never modify another module's internal state.

Shared ownership is forbidden.

---

# 14. Module Lifecycle

Every module evolves independently.

The expected lifecycle is:

1. Define the business capability.
2. Model the domain.
3. Implement the public contract.
4. Expose application services.
5. Publish domain events.
6. Consume the module from other modules through its public interface.

Business rules should remain inside the owning module throughout its lifecycle.

---

# 15. Architectural Governance

Every new module must answer the following questions before implementation.

## Business Responsibility

What business capability does this module own?

## Ownership

Which concepts belong exclusively to this module?

## Public Contract

What capabilities does this module expose?

## Dependencies

Which modules does it depend on?

Why?

## Published Events

Which business events are published?

## Consumed Events

Which events are consumed?

## Invariants

Which business rules must always remain true?

If these questions cannot be answered clearly, the module boundary should be reconsidered.

---

# 16. Design Principles Summary

The following principles apply to every module in Nexo.

- Business first.
- Domain-driven design.
- Modular monolith.
- Hexagonal architecture.
- High cohesion.
- Low coupling.
- Explicit ownership.
- Event-oriented domain model.
- Read models for reporting.
- AI as a business capability.
- Platform services remain infrastructure.
- Shared Kernel must remain minimal.

These principles should guide every architectural decision made throughout the lifetime of the project.

---

# Closing Statement

Nexo is not organized around pages, APIs, folders or database tables.

It is organized around business capabilities.

The structure defined in this document establishes the official business boundaries of the system.

Every future feature should integrate into these boundaries instead of creating new ones unnecessarily.

Long-term maintainability is achieved by protecting module boundaries from the very beginning.

---

# Document Status

**Status**

Approved

**Version**

2.0.0

**Next Document**

`roadmap.md`

**Notes**

This document defines the official modular decomposition of Nexo.

Changes to module boundaries require an Architecture Decision Record (ADR), as they directly impact the domain model, system architecture and long-term maintainability.
