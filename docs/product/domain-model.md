---
title: Domain Model
status: Approved
version: 1.0.0

owner: Carlos Ruiz

authors:
  - Carlos Ruiz
  - ChatGPT (Principal Software Architect)

last_updated: 2026-07-11

depends_on:
  - vision.md
  - principles.md
  - scope.md
  - modules.md

related:
  - architecture.md

supersedes: null

superseded_by: null

tags:
  - domain
  - ddd
---

# Domain Model

> This document defines Nexo's business domain using Domain-Driven Design (DDD) principles.

---

# 1. Purpose

The Domain Model defines the core business concepts of Nexo and the relationships between them.

Its purpose is to establish a shared understanding of the financial domain that guides product design, software architecture, and implementation.

The model focuses exclusively on business concepts and behaviors. It intentionally avoids implementation details such as databases, APIs, frameworks, or user interface considerations.

This document serves as the single source of truth for the business domain and provides a common language for product managers, designers, and developers.

---

# 2. Modeling Principles

The domain model follows the principles of Domain-Driven Design (DDD).

Its primary objective is to represent the financial domain as accurately as possible while remaining independent from technical implementation.

## Business First

The domain is modeled around business concepts rather than software components.

Every element of the model must represent a meaningful financial concept.

---

## Technology Agnostic

The domain model does not depend on programming languages, frameworks, databases, or infrastructure.

It should remain valid even if the underlying technology stack changes.

---

## Explicit Boundaries

Business capabilities are organized into well-defined Bounded Contexts.

Each context owns its own language, rules, and responsibilities.

---

## High Cohesion

Related business concepts should remain together within the same context.

Each context should have a clear and focused purpose.

---

## Low Coupling

Contexts should communicate through well-defined contracts while minimizing dependencies.

Business rules should remain isolated whenever possible.

---

## Rich Domain

Business behavior belongs inside the domain.

The model should describe not only data, but also business rules and domain concepts.

---

## Ubiquitous Language

The same terminology should be used consistently by developers, product owners, designers, and business stakeholders.

Every important financial concept must have one clear meaning.

---

# 3. Ubiquitous Language

The following principles define the common language used throughout Nexo.

Business terminology must remain consistent across documentation, source code, APIs, and user interfaces.

Examples include:

- Account
- Transaction
- Category
- Budget
- Goal
- Credit Card
- Loan
- Asset
- Liability
- Cash Flow
- Net Worth
- Statement
- Financial Health

A complete glossary is maintained separately to avoid duplication.

---

# 4. Bounded Contexts

Nexo is organized into seven Bounded Contexts.

Each context represents a distinct area of the business domain with its own language, rules, and responsibilities. Contexts are designed to be highly cohesive, loosely coupled, and independently evolvable.

Contexts communicate through public contracts only. No context may access another context's internal model directly.

---

## 4.1 Identity

### Purpose

Manage user identity, authentication, authorization, and personal preferences.

Authentication is delegated to Clerk. The context defines an anti-corruption layer to keep the domain provider-agnostic.

### Sub-domains

- Identity
- Authorization
- Preferences
- Localization

### Aggregates

#### User _(Aggregate Root)_

Represents an authenticated individual using the platform.

**Entities**

| Entity | Role                                                   |
| ------ | ------------------------------------------------------ |
| User   | Aggregate root. Represents a registered platform user. |

**Value Objects**

| Value Object    | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| UserId          | Stable unique identifier. Referenced by all other contexts.      |
| Email           | The user's email address.                                        |
| UserProfile     | Display name, avatar, and time zone.                             |
| UserPreferences | Language, default currency, theme, and notification preferences. |
| UserStatus      | Enumeration: Active, Deactivated.                                |

**Invariants**

- Every User has a UserId that never changes.
- Authentication is handled exclusively by the external identity provider.
- Authorization rules belong to this context, not to individual business contexts.

### Domain Events

| Event                  | Trigger                            |
| ---------------------- | ---------------------------------- |
| UserRegistered         | A new user completed registration. |
| UserProfileUpdated     | Profile information was modified.  |
| UserPreferencesUpdated | User preferences were changed.     |
| UserDeactivated        | A user account was deactivated.    |

### Context Relationships

| Related Context | Direction         | Mechanism                                                                                                  |
| --------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| All contexts    | Upstream provider | Every context references UserId to scope its data to a specific user. No other context owns user identity. |

---

## 4.2 Finance

### Purpose

Record, manage, and classify all financial movements of a user.

Finance is the core domain of Nexo. It owns the authoritative and immutable history of everything that has happened financially. All other business contexts derive their state from events published here.

### Sub-domains

- Accounts
- Transactions
- Categories
- Tags
- Merchants

### Aggregates

#### Account _(Aggregate Root)_

Represents a financial account owned by the user.

The balance of an Account is derived from Transactions — it is never stored independently.

**Entities**

| Entity  | Role                                            |
| ------- | ----------------------------------------------- |
| Account | Aggregate root. Represents a financial account. |

**Value Objects**

| Value Object  | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| AccountId     | Unique identity of the account.                                                 |
| AccountName   | Human-readable label given by the user.                                         |
| AccountType   | Enumeration: Cash, Checking, Savings, Debit Card.                               |
| AccountStatus | Enumeration: Active, Archived.                                                  |
| Currency      | The base currency of the account. References `Currency` from the Shared Kernel. |

**Invariants**

- Every account belongs to exactly one user.
- Every account has exactly one base currency.
- Archived accounts cannot receive new Transactions.
- Account balances are derived from Transactions and never stored independently.

---

#### Transaction _(Aggregate Root)_

Represents a single financial occurrence that affects the user's financial position. Transactions are immutable once recorded.

**Entities**

| Entity              | Role                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Transaction         | Aggregate root. Represents one financial occurrence in the user's history.                                                           |
| TransactionMovement | One side of a financial movement within a transaction. A Transfer produces exactly two balanced movements: one debit and one credit. |

**Value Objects**

| Value Object        | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| TransactionId       | Unique identity of the transaction.                        |
| TransactionType     | Enumeration: Income, Expense, Transfer, Adjustment.        |
| TransactionDate     | The business date on which the transaction occurred.       |
| Money               | Amount and currency. Defined in the Shared Kernel.         |
| TransactionMetadata | Contextual information: notes, reference number. Optional. |

**Invariants**

- Transactions are immutable once recorded. They are never modified.
- Corrections are recorded as new Transactions, never as updates to existing ones.
- Transactions are never physically deleted.
- Every Transaction affects at least one account.
- A Transfer must produce exactly two balanced movements of equal absolute value.
- Every Transaction is auditable.

---

#### Category _(Aggregate Root)_

Represents a classification node in the category hierarchy. Categories organize Transactions for reporting and analysis — they never affect financial calculations.

**Entities**

| Entity   | Role                                                                 |
| -------- | -------------------------------------------------------------------- |
| Category | Aggregate root. Represents one node in the classification hierarchy. |

**Value Objects**

| Value Object     | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| CategoryId       | Unique identity of the category.                                   |
| CategoryName     | Human-readable label.                                              |
| CategoryType     | Enumeration: System, User-Defined.                                 |
| CategoryStatus   | Enumeration: Active, Archived.                                     |
| ParentCategoryId | Reference to the parent category. Absent on root-level categories. |

**Invariants**

- Category hierarchy cannot contain cycles.
- System categories cannot be deleted.
- Archived categories remain available for historical records.
- Categories never affect financial calculations.

---

#### Tag _(Aggregate Root)_

Represents a user-defined label used to organize and filter Transactions. Tags are independent from the category hierarchy.

**Entities**

| Entity | Role                                             |
| ------ | ------------------------------------------------ |
| Tag    | Aggregate root. Represents a user-defined label. |

**Value Objects**

| Value Object | Description                              |
| ------------ | ---------------------------------------- |
| TagId        | Unique identity of the tag.              |
| TagName      | The label text. Must be unique per user. |
| TagStatus    | Enumeration: Active, Archived.           |

**Invariants**

- Tag names must be unique per user.
- Tags are independent from categories.
- Archived tags remain available for historical records.
- Tags never affect financial calculations.

---

#### Merchant _(Aggregate Root)_

Represents a business or entity that receives payments from the user. A Merchant answers "who was paid", independently from how the payment was classified (Category) or labeled (Tag).

**Entities**

| Entity   | Role                                                 |
| -------- | ---------------------------------------------------- |
| Merchant | Aggregate root. Represents a payee in a transaction. |

**Value Objects**

| Value Object           | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| MerchantId             | Unique identity of the merchant.                                                            |
| MerchantName           | The name as provided by the user.                                                           |
| NormalizedMerchantName | Canonical version of the name used to prevent duplicates within a user's merchant registry. |

**Invariants**

- A merchant's normalized name must be unique per user.
- Merchants are shared across transactions and never duplicated per transaction.
- Merchant data never affects financial calculations.

---

### Domain Services

| Service                  | Responsibility                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| AccountBalanceService    | Projects Transactions to derive the current balance of an Account. Balance is never persisted independently.                    |
| TransactionFactory       | Constructs valid Transactions and their movements based on transaction type. Ensures structural correctness before persistence. |
| TransactionReversal      | Creates a compensating Transaction to reverse a previously recorded one. Preserves the immutability of the original.            |
| CategoryHierarchyService | Validates that category relationships do not introduce cycles. Provides tree traversal and ancestry resolution.                 |

---

### Domain Events

| Event               | Trigger                                                                        |
| ------------------- | ------------------------------------------------------------------------------ |
| AccountCreated      | A new account was registered.                                                  |
| AccountArchived     | An account was archived.                                                       |
| AccountReopened     | An archived account was reactivated.                                           |
| IncomeRegistered    | An income transaction was recorded.                                            |
| ExpenseRegistered   | An expense transaction was recorded.                                           |
| TransferCompleted   | A transfer between accounts was completed.                                     |
| AdjustmentRecorded  | A balance adjustment was recorded.                                             |
| TransactionReversed | A previously recorded transaction was reversed via a compensating transaction. |
| CategoryCreated     | A new category was created.                                                    |
| CategoryArchived    | A category was archived.                                                       |
| TagCreated          | A new tag was created.                                                         |
| TagArchived         | A tag was archived.                                                            |
| MerchantRegistered  | A new merchant was added to the registry.                                      |

---

### Context Relationships

| Related Context | Direction          | Mechanism                                                                                                            |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Portfolio       | Upstream publisher | Portfolio subscribes to ExpenseRegistered and TransferCompleted to update credit card, loan, and liability balances. |
| Planning        | Upstream publisher | Planning subscribes to IncomeRegistered and ExpenseRegistered to track budget and goal progress.                     |
| Insights        | Upstream publisher | Insights consumes Finance data through Read Models. It never accesses transactional aggregates directly.             |

---

## 4.3 Planning

### Purpose

Help users plan and monitor their financial objectives and expected cash flows.

Planning observes the financial domain to measure progress. It never modifies financial records.

### Sub-domains

- Budgets
- Goals
- Cash Flow Planning

### Aggregates

#### Budget _(Aggregate Root)_

Represents a spending limit for a defined period and scope. Progress is derived from Finance and never stored independently.

**Entities**

| Entity       | Role                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Budget       | Aggregate root. Defines a spending plan for a period.                         |
| BudgetTarget | A spending limit scoped to a category, a category group, or overall spending. |

**Value Objects**

| Value Object     | Description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| BudgetId         | Unique identity of the budget.                                                     |
| BudgetPeriod     | Time range: start date, end date, and recurrence type.                             |
| BudgetPeriodType | Enumeration: Weekly, Monthly, Quarterly, Yearly.                                   |
| BudgetAmount     | Maximum spending allowed within the scope.                                         |
| BudgetScope      | What the target applies to: a category, a category group, or overall spending.     |
| BudgetStatus     | Enumeration: Active, Closed.                                                       |
| BudgetProgress   | Derived: spending expressed as a percentage of the budget amount. Never persisted. |

**Invariants**

- Budget periods cannot overlap for the same scope and user.
- Budgets never modify financial records.
- Progress is calculated from Transactions and never stored independently.

---

#### Goal _(Aggregate Root)_

Represents a long-term financial objective with a target amount and an optional deadline. Progress is derived from financial data and never stored independently.

**Entities**

| Entity        | Role                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| Goal          | Aggregate root. Represents a long-term financial objective.                                   |
| GoalMilestone | An intermediate checkpoint. Reached automatically when progress crosses the milestone amount. |

**Value Objects**

| Value Object    | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| GoalId          | Unique identity of the goal.                                                |
| GoalType        | Examples: Emergency Fund, Vacation, Home Purchase, Debt Payoff, Retirement. |
| GoalAmount      | Target monetary value.                                                      |
| GoalProgress    | Derived: current amount relative to the target. Never persisted.            |
| GoalDeadline    | Optional target date.                                                       |
| GoalStatus      | Enumeration: Active, Completed, Abandoned.                                  |
| MilestoneAmount | Threshold at which a GoalMilestone is considered reached.                   |

**Invariants**

- Goals never modify financial records.
- Progress is derived from existing financial data.
- Completed goals become read-only.

---

#### CashFlowPlan _(Aggregate Root)_

Represents a forward-looking projection of expected income and expenses for a defined future period. Used for planning — not for recording historical facts.

**Entities**

| Entity       | Role                                                               |
| ------------ | ------------------------------------------------------------------ |
| CashFlowPlan | Aggregate root. Defines a projected cash flow for a future period. |
| PlannedEntry | A single expected income or expense item within the plan.          |

**Value Objects**

| Value Object     | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| CashFlowPlanId   | Unique identity of the plan.                                              |
| PlanPeriod       | The future time range covered by the plan.                                |
| PlannedAmount    | The expected monetary amount for a planned entry.                         |
| PlannedEntryType | Enumeration: PlannedIncome, PlannedExpense.                               |
| ProjectedBalance | Derived: expected net position at the end of the period. Never persisted. |

**Invariants**

- Cash Flow Plans are forward-looking only. They never record historical facts.
- Projected balance is derived and never persisted.
- Cash Flow Plans never modify financial records.

---

### Domain Services

| Service                  | Responsibility                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| BudgetProgressCalculator | Projects Transactions against BudgetTargets to derive spending progress for the current period.                  |
| GoalProgressCalculator   | Derives goal progress by projecting relevant Transactions, Portfolio balances, and account data.                 |
| CashFlowProjector        | Combines planned entries with current account balances to project the expected end-of-period financial position. |

---

### Domain Events

| Event                | Trigger                                 |
| -------------------- | --------------------------------------- |
| BudgetCreated        | A new budget was defined.               |
| BudgetExceeded       | Spending crossed the budget limit.      |
| BudgetCompleted      | A budget period ended.                  |
| GoalCreated          | A new goal was defined.                 |
| GoalMilestoneReached | Progress crossed a milestone amount.    |
| GoalCompleted        | The goal's target amount was reached.   |
| GoalAbandoned        | The user explicitly abandoned the goal. |
| CashFlowPlanCreated  | A new cash flow plan was defined.       |

---

### Context Relationships

| Related Context | Direction           | Mechanism                                                                                                      |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| Finance         | Downstream consumer | Subscribes to IncomeRegistered and ExpenseRegistered to recalculate budget and goal progress.                  |
| Portfolio       | Downstream consumer | Subscribes to LoanPaymentApplied, LiabilitySettled, and AssetValuationUpdated to recalculate goal progress.    |
| Administration  | Upstream provider   | Administration subscribes to BudgetExceeded, GoalMilestoneReached, and GoalCompleted to deliver notifications. |
| Insights        | Upstream provider   | Insights reads Planning data through public query services.                                                    |

---

## 4.4 Portfolio

### Purpose

Represent the user's complete financial position — everything they own and everything they owe.

Portfolio is the authoritative source for net worth. It manages the instruments that define the user's financial patrimony: assets, liabilities, credit cards, and loans.

### Sub-domains

- Assets
- Liabilities
- Credit Cards
- Loans
- Investments _(future)_

### Key Boundary Note

The CreditCard instrument lives in Portfolio. The Transaction generated by a credit card purchase lives in Finance. Finance publishes ExpenseRegistered; Portfolio subscribes to update the Statement balance.

### Aggregates

#### Asset _(Aggregate Root)_

Represents a physical or financial item of value owned by the user. Valuation history is preserved.

**Entities**

| Entity         | Role                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| Asset          | Aggregate root. Represents an item of value owned by the user.              |
| AssetValuation | A recorded valuation at a specific point in time. History is never deleted. |

**Value Objects**

| Value Object     | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| AssetId          | Unique identity of the asset.                                                    |
| AssetType        | Enumeration: Real Estate, Land, Vehicle, Machinery, Electronics, Jewelry, Other. |
| AcquisitionPrice | Original purchase price at the time of acquisition.                              |
| AcquisitionDate  | Date the asset was acquired.                                                     |
| AssetStatus      | Enumeration: Active, Archived.                                                   |
| AssetValue       | Monetary value at a specific valuation date.                                     |
| ValuationDate    | Date on which a valuation was recorded.                                          |

**Invariants**

- Every asset belongs to exactly one owner.
- Historical valuations are preserved and never deleted.
- Archived assets remain available for historical reporting.

---

#### Liability _(Aggregate Root)_

Represents an informal financial obligation owed to an individual or non-institutional counterparty. Unlike Loans, Liabilities have no structured repayment schedule.

**Entities**

| Entity    | Role                                                         |
| --------- | ------------------------------------------------------------ |
| Liability | Aggregate root. Represents an informal financial obligation. |

**Value Objects**

| Value Object          | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| LiabilityId           | Unique identity of the liability.                              |
| LiabilityCounterparty | The person or entity to whom the money is owed.                |
| LiabilityAmount       | Original obligation amount.                                    |
| OutstandingBalance    | Derived: remaining amount owed. Never persisted independently. |
| LiabilityStatus       | Enumeration: Active, Settled.                                  |

**Invariants**

- Outstanding balance cannot become negative.
- Settled liabilities cannot receive new payments.
- Liabilities never generate amortization schedules.
- Liabilities are independent from the Loans sub-domain.

---

#### CreditCard _(Aggregate Root)_

Represents a revolving credit instrument. Manages billing cycles, statements, and available credit.

The CreditCard instrument is distinct from a Transaction. When a user makes a credit card purchase, Finance records the Transaction; Portfolio updates the Statement balance.

**Entities**

| Entity     | Role                                                      |
| ---------- | --------------------------------------------------------- |
| CreditCard | Aggregate root. Represents a revolving credit instrument. |
| Statement  | Represents a billing period. Immutable once closed.       |

**Value Objects**

| Value Object    | Description                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| CreditCardId    | Unique identity of the credit card.                                                                       |
| CreditLimit     | Maximum authorized credit.                                                                                |
| AvailableCredit | Derived: Credit Limit minus the outstanding balance on the open Statement. Never persisted independently. |
| BillingCycle    | Day of month when Statements close and when payments are due.                                             |
| StatementId     | Unique identity of a Statement.                                                                           |
| StatementPeriod | Start and end dates of a Statement period.                                                                |
| StatementStatus | Enumeration: Open, Closed.                                                                                |

**Invariants**

- Available credit cannot exceed the credit limit.
- Closed statements are immutable.
- Purchases belong to exactly one Statement.
- Payments reduce the outstanding balance of the open Statement.

---

#### Loan _(Aggregate Root)_

Represents an installment-based debt instrument with a structured repayment schedule. Covers mortgages, auto loans, and personal loans.

**Entities**

| Entity           | Role                                                  |
| ---------------- | ----------------------------------------------------- |
| Loan             | Aggregate root. Represents an installment-based debt. |
| PaymentSchedule  | The structured repayment plan for the loan.           |
| ScheduledPayment | A single expected payment within the schedule.        |

**Value Objects**

| Value Object       | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| LoanId             | Unique identity of the loan.                                 |
| LoanType           | Enumeration: Mortgage, Auto Loan, Personal Loan, Other.      |
| LoanAmount         | Original principal at origination.                           |
| OutstandingBalance | Derived: remaining principal. Never persisted independently. |
| InterestRate       | Annual percentage rate.                                      |
| LoanStatus         | Enumeration: Active, Closed.                                 |

**Invariants**

- Outstanding balance cannot become negative.
- Closed loans cannot receive new payments.
- Payment schedules cannot contain overlapping payment dates.

---

### Domain Services

| Service                      | Responsibility                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| NetWorthCalculator           | Aggregates asset valuations, liability balances, loan balances, and credit card balances to compute the user's current net worth. |
| AvailableCreditCalculator    | Derives available credit from the credit limit and the open Statement balance.                                                    |
| OutstandingBalanceCalculator | Derives current outstanding balances for Loans and Liabilities from original amounts and all recorded payments.                   |
| AmortizationService          | Generates a payment schedule from loan terms: principal, interest rate, and term length.                                          |
| StatementClosingService      | Closes the current Statement and opens a new one at the end of a billing cycle.                                                   |

---

### Domain Events

| Event                    | Trigger                                             |
| ------------------------ | --------------------------------------------------- |
| AssetCreated             | A new asset was registered.                         |
| AssetValuationUpdated    | A new valuation was recorded for the asset.         |
| AssetArchived            | An asset was archived.                              |
| LiabilityRegistered      | A new liability was created.                        |
| LiabilityPaymentRecorded | A payment was applied to a liability.               |
| LiabilitySettled         | A liability was fully paid and closed.              |
| CreditCardCreated        | A new credit card was registered.                   |
| StatementClosed          | A billing cycle ended and the Statement was closed. |
| CreditCardPaymentApplied | A payment was applied to a credit card.             |
| LoanCreated              | A new loan was registered.                          |
| LoanPaymentApplied       | A payment was applied to a loan.                    |
| LoanClosed               | A loan was fully repaid or explicitly closed.       |

---

### Context Relationships

| Related Context | Direction           | Mechanism                                                                                                        |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Finance         | Downstream consumer | Subscribes to ExpenseRegistered and TransferCompleted to apply payments to credit cards, loans, and liabilities. |
| Planning        | Upstream provider   | Planning subscribes to Portfolio events to recalculate goal progress.                                            |
| Insights        | Upstream provider   | Insights reads Portfolio data through Read Models and public query services.                                     |

---

## 4.5 Insights

### Purpose

Transform financial data into actionable information and intelligent assistance.

Insights has no financial state of its own. It reads from all other business contexts to generate reports, dashboards, and AI-powered analysis. It never modifies data in any other context.

### Sub-domains

- Reports
- AI

### Aggregates

#### Dashboard _(Aggregate Root)_

Represents the user's real-time financial overview, composed of KPIs derived from the domain.

**Entities**

| Entity    | Role                                                                |
| --------- | ------------------------------------------------------------------- |
| Dashboard | Aggregate root. Represents the user's top-level financial overview. |

**Value Objects**

| Value Object | Description                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------- |
| DashboardId  | Unique identity of the dashboard.                                                            |
| KPI          | A calculated financial metric: Net Worth, Monthly Cash Flow, Total Debt, Budget Status, etc. |

---

#### Report _(Aggregate Root)_

Defines a financial report and retains previously generated versions for reproducibility.

**Entities**

| Entity      | Role                                                          |
| ----------- | ------------------------------------------------------------- |
| Report      | Aggregate root. Defines the parameters of a financial report. |
| SavedReport | A previously generated report. Immutable once saved.          |

**Value Objects**

| Value Object | Description                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ReportId     | Unique identity of the report.                                                                                                                    |
| ReportType   | Enumeration: Cash Flow, Income vs Expenses, Spending by Category, Net Worth, Budget Performance, Debt Evolution, Monthly Summary, Annual Summary. |
| DateRange    | Time range covered by the report. Defined in the Shared Kernel.                                                                                   |
| ReadModel    | A pre-built projection of domain data consumed by the report. Immutable once created.                                                             |

**Invariants**

- Reports never modify data in any other context.
- Reports must be reproducible.
- Historical reports remain consistent even after future data changes.
- Reports only consume Read Models, never transactional aggregates directly.

---

#### AIConversation _(Aggregate Root)_

Represents a natural language session between the user and the AI assistant.

**Entities**

| Entity         | Role                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| AIConversation | Aggregate root. Represents a conversational session.                    |
| AIMessage      | A single message within a conversation, from either the user or the AI. |

**Value Objects**

| Value Object   | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| ConversationId | Unique identity of the conversation.                         |
| PromptTemplate | A reusable query structure for specific financial scenarios. |
| AIFeedback     | User-provided feedback on an AI response.                    |

---

#### AIRecommendation _(Aggregate Root)_

A specific actionable suggestion generated by AI. Requires explicit user approval before being applied to the domain.

**Entities**

| Entity           | Role                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| AIRecommendation | Aggregate root. Represents a pending suggestion awaiting user decision. |

**Value Objects**

| Value Object              | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| RecommendationId          | Unique identity of the recommendation.                                   |
| RecommendationStatus      | Enumeration: Pending, Accepted, Rejected.                                |
| RecommendationExplanation | The reason behind the suggestion. Every recommendation must include one. |

---

#### AIInsight _(Aggregate Root)_

An AI-generated observation about the user's financial patterns or health. Generated proactively or on demand.

**Entities**

| Entity    | Role                                                              |
| --------- | ----------------------------------------------------------------- |
| AIInsight | Aggregate root. Represents an AI-generated financial observation. |

**Value Objects**

| Value Object | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| InsightId    | Unique identity of the insight.                                       |
| InsightType  | Examples: Spending Pattern, Unusual Activity, Budget Risk, Goal Risk. |

**Invariants (across the AI sub-domain)**

- AI never modifies financial records automatically.
- Every recommendation must be explainable.
- User approval is required before any AI suggestion is applied to the domain.
- AI failures must never interrupt core business operations.

---

### Domain Services

| Service                          | Responsibility                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ReadModelProjector               | Builds and refreshes Read Models from domain data. May execute synchronously or asynchronously depending on performance requirements. |
| ReportGenerator                  | Produces a report from a Report definition and the corresponding Read Models.                                                         |
| AIQueryService                   | Reads domain data through Read Models and public query services. Never accesses transactional aggregates directly.                    |
| RecommendationApplicationService | Applies an accepted AIRecommendation to the target context through its public capabilities. Requires prior explicit user approval.    |

---

### Domain Events

| Event                   | Trigger                              |
| ----------------------- | ------------------------------------ |
| ReportGenerated         | A report was successfully generated. |
| DashboardUpdated        | Dashboard data was refreshed.        |
| RecommendationGenerated | A new AI recommendation was created. |
| RecommendationAccepted  | The user accepted a recommendation.  |
| RecommendationRejected  | The user rejected a recommendation.  |
| InsightGenerated        | A new AI insight was generated.      |

---

### Context Relationships

| Related Context | Direction           | Mechanism                                                                                |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| Finance         | Downstream consumer | Reads Finance data through Read Models. Never queries transactional aggregates directly. |
| Portfolio       | Downstream consumer | Reads Portfolio data through Read Models and public query services.                      |
| Planning        | Downstream consumer | Reads Planning data through public query services.                                       |

---

## 4.6 Integrations _(Future)_

### Purpose

Connect Nexo with external financial services, data providers, and third-party systems.

This context establishes the boundary for all external integration capabilities. It is intentionally outside the MVP scope and will be detailed in a future phase.

### Sub-domains

- Bank Synchronization
- Statement Import (PDF, CFDI/SAT)
- OCR
- Data Export

### Preliminary Aggregates

| Aggregate             | Role                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| ConnectedInstitution  | Represents a linked external financial institution.                       |
| ImportJob             | Represents an in-progress or completed data import operation.             |
| ExportJob             | Represents a data export operation.                                       |
| SynchronizationRecord | Captures the result of a synchronization cycle with an external provider. |

### Invariants

- Imported data must pass validation before being promoted to Finance as Transactions.
- Integrations never write directly to Finance aggregates. All data flows through Finance's public capabilities.
- External provider failures must never affect core business operations.

---

## 4.7 Administration

### Purpose

Provide the operational and platform capabilities required for Nexo to function safely and reliably.

Administration is a generic supporting domain. It contains no business rules and does not depend on any business context.

### Sub-domains

- Notifications
- Audit
- Feature Flags
- Configuration
- Observability
- Logging

### Aggregates

#### Notification _(Aggregate Root)_

Represents a message delivered to the user in response to a business event.

**Value Objects**

| Value Object        | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| NotificationId      | Unique identity of the notification.                             |
| NotificationType    | What triggered it: BudgetExceeded, GoalReached, PaymentDue, etc. |
| NotificationChannel | Enumeration: In-App, Email.                                      |
| NotificationStatus  | Enumeration: Pending, Sent, Failed.                              |

---

#### AuditLog _(Aggregate Root)_

Represents an immutable record of a significant platform event. Append-only.

**Value Objects**

| Value Object   | Description                          |
| -------------- | ------------------------------------ |
| AuditLogId     | Unique identity of the audit record. |
| AuditAction    | The operation that occurred.         |
| AuditActor     | The user who performed the action.   |
| AuditTimestamp | When the action occurred.            |

---

#### FeatureFlag _(Aggregate Root)_

Controls the availability of a feature for a specific user or cohort.

**Value Objects**

| Value Object      | Description                                      |
| ----------------- | ------------------------------------------------ |
| FlagKey           | Unique identifier for the flag.                  |
| FlagStatus        | Enumeration: Enabled, Disabled.                  |
| RolloutPercentage | Percentage of users for whom the flag is active. |

---

### Domain Events

| Event              | Trigger                                             |
| ------------------ | --------------------------------------------------- |
| NotificationSent   | A notification was delivered to the user.           |
| AuditEventRecorded | A significant action was recorded in the audit log. |
| FeatureFlagUpdated | A feature flag was changed.                         |

---

### Context Relationships

| Related Context | Direction           | Mechanism                                                                                            |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| Planning        | Downstream consumer | Subscribes to BudgetExceeded, GoalMilestoneReached, and GoalCompleted to trigger user notifications. |
| Portfolio       | Downstream consumer | Subscribes to LoanClosed, LiabilitySettled, and StatementClosed to trigger user notifications.       |
| All contexts    | Downstream consumer | Any context may publish audit-relevant events consumed by the Audit sub-domain.                      |

---

# 5. Shared Kernel

Certain domain concepts are shared across multiple contexts.

These shared concepts form the Shared Kernel and must remain stable to avoid unnecessary coupling between contexts.

The Shared Kernel contains only primitive concepts with no natural single owner:

- **Money** — an amount paired with a Currency. The core financial primitive used by all contexts that deal with monetary values.
- **Currency** — an ISO 4217 currency code and symbol.
- **DateRange** — a start date and end date pair used to define time-bound queries and periods.
- **UserId** — a stable reference to an authenticated user. The User entity itself belongs to Identity. Other contexts reference users only through UserId.

The Shared Kernel must never contain business logic.

When in doubt, do not place a concept here.

---

# 6. Cross-Context Relationships

Although each Bounded Context is autonomous, business workflows often span multiple contexts.

Relationships between contexts should be explicit and carefully managed.

Whenever possible, contexts communicate using domain events rather than direct dependencies.

This approach preserves autonomy while enabling collaboration across the domain.

---

# 7. Domain Events

Domain Events represent important business occurrences that have already happened.

They enable communication between Bounded Contexts without creating tight coupling.

All domain events are defined within their respective Bounded Contexts in Section 4.

The following cross-context flows represent the most critical event integrations in the domain:

- Finance publishes IncomeRegistered, ExpenseRegistered, and TransferCompleted — consumed by Portfolio, Planning, and Insights.
- Portfolio publishes AssetValuationUpdated, LoanPaymentApplied, and LiabilitySettled — consumed by Planning.
- Planning publishes BudgetExceeded, GoalMilestoneReached, and GoalCompleted — consumed by Administration for user notifications.

---

# 8. Domain Constraints

The domain model is governed by business rules that protect the integrity of financial information.

The following constraints apply across the entire domain:

- Financial history is immutable. Transactions are never modified or deleted.
- Corrections are represented as new Transactions, never as rewrites of existing ones.
- Account balances are derived from Transactions and never stored independently.
- AI never modifies financial records automatically.
- Every AI suggestion requires explicit user confirmation before being applied.
- No context may access another context's internal data directly.
- Every business concept belongs to exactly one context.

Additional constraints are documented within their respective Bounded Contexts.

---

# 9. Future Evolution

The Domain Model is expected to evolve as new business capabilities are introduced.

New concepts should be incorporated by extending existing Bounded Contexts whenever appropriate.

Creating new Bounded Contexts should be reserved for capabilities that introduce a distinct business language or significantly different business rules.

The long-term objective is to maintain a clear, scalable, and maintainable domain model that supports the continued evolution of Nexo.
