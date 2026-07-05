---
title: Product Roadmap
status: Approved
version: 1.0.0

owner: Carlos Ruiz

authors:
  - Carlos Ruiz
  - ChatGPT (Principal Software Architect)

last_updated: 2026-07-02

depends_on:
  - vision.md
  - principles.md
  - scope.md
  - modules.md

related: []

supersedes: null

superseded_by: null

tags:
  - product
  - roadmap
---

# Product Roadmap

> This document defines the strategic evolution of Nexo from an MVP into a mature SaaS platform.

---

# 1. Purpose

The roadmap describes **what will be built, in which order, and why**.

It aligns product evolution with business priorities while keeping the architecture sustainable.

The roadmap intentionally avoids implementation details.

Technical decisions belong to the Architecture documentation.

---

# 2. Roadmap Philosophy

The roadmap follows these principles.

## Deliver Value Early

Every phase should provide immediate value to users.

---

## Build Incrementally

Each phase builds upon the previous one without requiring large rewrites.

---

## Prioritize Business Value

Features are prioritized by user impact rather than technical complexity.

---

## Maintain Architectural Integrity

New features must integrate into the existing domain model.

Architectural shortcuts that create long-term technical debt should be avoided.

---

## AI is an Enhancement

Artificial Intelligence complements the product.

Core financial workflows must never depend on AI availability.

---

## Stability Before Expansion

A stable product is more valuable than a large feature set.

Every phase should end with a production-ready release.

---

# 3. Success Criteria

The roadmap is considered successful if it achieves the following objectives.

## Product

- Users can manage their complete personal finances.
- Users understand where their money goes.
- Users receive actionable financial insights.
- Users trust the application with their financial information.

---

## Technical

- Modular Monolith architecture remains maintainable.
- Clear module boundaries are preserved.
- High automated test coverage.
- Excellent performance.
- Strong security practices.

---

## Business

- Multi-tenant SaaS architecture.
- English and Spanish support.
- Multi-currency support (MXN, USD, CAD).
- Progressive feature evolution.
- Sustainable operational costs.

---

# 4. Phase 0 — Foundation

## Objective

Build a solid technical and architectural foundation that enables rapid feature development without compromising quality.

This phase has no user-facing features.

Its purpose is to establish the project's standards, tooling, and infrastructure.

---

## Deliverables

### Product Documentation

- Product Vision
- Product Principles
- Product Scope
- Product Modules
- Product Roadmap
- Domain Model
- Architecture
- ADR process

---

### Development Environment

- Next.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Clerk Authentication
- Tailwind CSS
- shadcn/ui
- next-intl
- PWA support

---

### Project Structure

- Modular Monolith
- Hexagonal Architecture
- Domain-Driven Design
- Shared Kernel
- Feature organization
- Testing strategy

---

### Engineering Standards

- ESLint
- Prettier
- Husky
- Commit conventions
- CI pipeline
- Branch strategy
- Code review guidelines

---

### Quality

- Unit testing framework
- Integration testing framework
- End-to-end testing framework
- Code coverage reporting

---

### Infrastructure

- Development environment
- Staging environment
- Production environment
- Deployment pipeline
- Secrets management
- Monitoring

---

## Exit Criteria

Phase 0 is complete when:

- Documentation is approved.
- The repository structure is finalized.
- The project builds successfully.
- Continuous Integration is operational.
- Authentication is functional.
- The application can be deployed to production.
- Every developer can clone and run the project with minimal setup.

---

## Out of Scope

No financial functionality is implemented during this phase.

No business logic is developed.

No user workflows are available.

The only objective is to establish a production-quality foundation.

---

## Success Metrics

- New developers can set up the project in less than 30 minutes.
- CI passes on every commit.
- Documentation accurately reflects the architecture.
- Development standards are consistently enforced.

# 5. Phase 1 — MVP

## Objective

Deliver the first production-ready version of Nexo.

At the end of this phase, users should be able to manage their entire personal financial life using the application.

The MVP focuses on solving the core problem:

> Help users understand where their money comes from, where it goes, and how their financial position evolves over time.

---

## Goals

- Deliver a complete personal finance management experience.
- Build a reliable financial domain.
- Establish trust through simplicity, performance and data integrity.
- Provide immediate value without requiring AI or external integrations.

---

## Deliverables

### Identity

- User registration
- Authentication with Clerk
- User profile
- User preferences

---

### Accounts

- Cash accounts
- Bank accounts
- Savings accounts
- Custom accounts
- Multiple currencies

---

### Financial Events

- Income
- Expenses
- Transfers
- Balance adjustments

---

### Categories

- System categories
- Custom categories
- Subcategories

---

### Tags

- Custom tags
- Multi-tag assignment on transactions

---

### Merchants

- Merchant registry
- Merchant assignment on transactions
- Normalized merchant names

---

### Credit Cards

- Credit card management
- Billing cycles
- Statements
- Due dates
- Payments
- Available credit

---

### Loans

- Mortgage loans
- Auto loans
- Personal loans
- Payment schedules
- Outstanding balance

---

### Assets

- Real estate
- Vehicles
- Land
- Custom assets
- Manual valuations

---

### Budgets

- Monthly budgets
- Budget monitoring
- Spending alerts

---

### Goals

- Savings goals
- Debt payoff goals
- Custom financial goals
- Progress tracking

---

### Reports

- Dashboard
- Cash Flow
- Net Worth
- Income vs Expenses
- Spending by Category
- Budget Performance
- Debt Summary
- Goal Progress

---

### Platform

- English
- Spanish
- MXN
- USD
- CAD
- Responsive UI
- Progressive Web App (PWA)
- Dark Mode
- Light Mode

---

## Out of Scope

The following features are intentionally excluded from the MVP.

- Investments
- Bank integrations
- OCR
- Receipt scanning
- Mobile applications
- Desktop applications
- Public API
- Third-party integrations
- Marketplace
- AI-powered automation
- Predictive analytics

---

## Exit Criteria

Phase 1 is complete when:

- Users can manage all daily personal finances.
- Users can calculate their Net Worth.
- Users can track Cash Flow.
- Users can manage debts and assets.
- Users can monitor budgets.
- Users can define financial goals.
- Reports accurately reflect financial data.
- The application is production-ready.

---

## Complexity

Very High

---

## Priority

Critical

---

## Success Metrics

- A new user can complete onboarding in less than 5 minutes.
- Recording an expense takes less than 15 seconds.
- Dashboard loads in under 2 seconds.
- Users can manage an entire month of finances without external tools.
- Financial calculations remain accurate and auditable.

# 6. Phase 2 — Financial Management

## Objective

Transform the MVP into a complete financial management platform by introducing advanced planning, automation, and financial analysis features.

The goal of this phase is not to add more data, but to help users better understand, organize, and optimize their financial life.

---

## Goals

- Enable proactive financial planning.
- Reduce repetitive manual financial tasks.
- Improve financial visibility through advanced reporting.
- Help users make better financial decisions.
- Increase long-term engagement with financial planning tools.

---

## Deliverables

### Advanced Budgeting

Budgets become significantly more powerful by supporting:

- Monthly budgets
- Weekly budgets
- Custom budget periods
- Category limits
- Account-specific budgets
- Budget rollover
- Budget alerts
- Budget planning

---

### Cash Flow Planning

Introduce financial planning tools including:

- Future income projections
- Planned expenses
- Expected balances
- Cash flow calendar
- Financial timeline

Users should be able to understand their future financial position before it happens.

---

### Recurring Transactions

Support automatic management of recurring financial events.

Examples include:

- Salary
- Rent
- Mortgage
- Utilities
- Insurance
- Subscriptions
- Loan payments

Recurring transactions should support:

- Flexible frequencies
- Start/end dates
- Pause and resume
- Automatic generation
- Missed occurrence detection

---

### Financial Calendar

Provide a calendar view that centralizes:

- Upcoming bills
- Scheduled payments
- Income dates
- Credit card due dates
- Loan payments
- Budget periods

---

### Debt Management

Expand loan management with:

- Amortization schedules
- Remaining balance
- Interest tracking
- Early payment simulation
- Multiple payment strategies

---

### Savings Management

Savings goals become more sophisticated by supporting:

- Multiple goals
- Automatic progress calculation
- Scheduled contributions
- Priority levels
- Completion estimate

---

### Financial Reports

Introduce richer reporting capabilities.

Examples include:

- Income vs Expenses
- Category spending
- Cash flow
- Net worth evolution
- Budget performance
- Monthly summaries
- Yearly summaries

Reports should support multiple visualization types and filtering options.

---

### Data Organization

Improve financial organization with:

- Advanced search
- Global filtering
- Tags
- Notes
- Attachments
- Favorite views
- Saved filters

---

### Platform Improvements

Improve the overall application experience through:

- Better navigation
- Faster loading
- Improved accessibility
- Better mobile experience
- Enhanced responsiveness
- Improved performance

---

## Out of Scope

The following features remain outside this phase:

- Investment portfolio management
- Bank synchronization
- OCR document scanning
- AI financial assistant
- Predictive analytics
- Shared family workspaces

These capabilities are introduced in later phases.

---

## Exit Criteria

- Users can create advanced budgets for different financial scenarios.
- Recurring transactions are generated automatically.
- Users can plan future income and expenses.
- The financial calendar provides a complete overview of upcoming financial events.
- Debt repayment progress can be tracked and simulated.
- Savings goals support scheduled contributions and completion estimates.
- Reports provide meaningful insights across multiple time periods.
- Users can efficiently organize and search their financial information.

---

## Complexity

Very High

---

## Priority

Critical

---

## Success Metrics

- Users actively maintain budgets over multiple months.
- Most recurring financial events no longer require manual entry.
- Financial reports are generated in under 2 seconds.
- Users can locate any transaction using search and filters within seconds.
- Users consistently use planning features to manage upcoming financial obligations.

---

# 7. Phase 3 — Financial Intelligence

## Objective

Transform financial data into actionable insights that help users better understand their financial behavior.

This phase introduces advanced analytics, trend analysis, financial health indicators, and intelligent recommendations built on the data collected during previous phases.

The objective is to move beyond financial management and provide meaningful guidance that supports better financial decisions.

---

## Goals

- Help users identify financial trends and spending patterns.
- Deliver meaningful insights from historical financial data.
- Improve financial awareness through advanced analytics.
- Detect unusual financial activity.
- Enable data-driven financial decision making.

---

## Deliverables

### Financial Insights

- Spending trends
- Income trends
- Savings trends
- Debt evolution
- Net Worth evolution
- Cash Flow trends
- Financial summaries

---

### Financial Health

- Financial health score
- Savings rate
- Debt-to-income ratio
- Emergency fund indicator
- Budget adherence
- Financial stability indicators

---

### Smart Analytics

- Spending anomalies
- Category comparisons
- Month-over-month analysis
- Year-over-year analysis
- Seasonal spending analysis
- Trend detection

---

### Forecasting

- Cash flow projections
- Budget projections
- Goal completion forecasting
- Debt payoff forecasting
- Savings growth projections

---

### Recommendations

- Budget improvement suggestions
- Spending optimization opportunities
- Savings recommendations
- Debt reduction opportunities
- Financial habit recommendations

---

### Advanced Reporting

- Custom reports
- Report filters
- Report comparisons
- Historical reports
- Exportable reports
- Report snapshots

---

### Notifications

- Financial insights
- Budget warnings
- Unusual spending alerts
- Goal progress notifications
- Financial milestone notifications

---

### Platform Improvements

- Improved dashboard
- Faster analytics
- Enhanced visualizations
- Better filtering
- Performance optimizations

---

## Out of Scope

The following features are intentionally excluded from this phase.

- AI-powered financial assistant
- Conversational financial analysis
- Bank synchronization
- Automated investment management
- Tax planning
- Family collaboration
- Marketplace integrations
- Third-party financial advisors

---

## Exit Criteria

Phase 3 is complete when:

- Users can visualize long-term financial trends.
- Financial health indicators are calculated automatically.
- Spending anomalies are detected and highlighted.
- Forecasts provide meaningful financial projections.
- Personalized recommendations help users improve their financial habits.
- Advanced reports support historical comparisons and custom filtering.
- Notifications proactively inform users about important financial events and insights.

---

## Complexity

Very High

---

## Priority

High

---

## Success Metrics

- Users regularly consult financial insights and trend analysis.
- Financial health indicators are updated automatically after relevant financial events.
- Forecasts accurately reflect historical financial behavior.
- Users can identify spending patterns without manual analysis.
- Reports and dashboards load in under 2 seconds.
- Users receive timely notifications that support better financial decision making.

---

# 8. Phase 4 — Connected Finance

## Objective

Expand Nexo beyond manual financial management by connecting it with external financial services and platforms.

This phase reduces manual work through synchronization, integrations, and automation while maintaining user control over financial data.

The objective is to create a connected financial ecosystem that keeps information accurate, up to date, and centralized.

---

## Goals

- Reduce manual financial data entry.
- Synchronize financial information across multiple providers.
- Automate repetitive financial workflows.
- Improve data accuracy through direct integrations.
- Create a unified financial ecosystem.

---

## Deliverables

### Financial Integrations

#### Bank Integrations

- Bank account synchronization
- Transaction synchronization
- Balance synchronization
- Automatic transaction imports
- Synchronization history

#### Credit Card Integrations

- Automatic statement imports
- Payment synchronization
- Credit limit updates
- Due date synchronization

#### Investment Integrations

- Investment accounts
- Portfolio synchronization
- Asset valuation updates
- Investment performance tracking

---

### Receipt Management

- Receipt scanning
- OCR processing
- Automatic transaction matching
- Receipt storage
- Receipt search

---

### Import & Export

- CSV import
- Excel import
- OFX import
- QFX import
- Data export
- Backup restoration

---

### Productivity Integrations

- Google Drive
- Dropbox
- OneDrive
- Email notifications
- Calendar synchronization

---

### Automation

- Automatic categorization
- Rule-based transaction processing
- Auto-tagging
- Smart transaction matching
- Scheduled imports

---

### Platform Improvements

- Background synchronization
- Sync status monitoring
- Conflict resolution
- Offline improvements
- Performance optimization

---

## Out of Scope

The following features are intentionally excluded from this phase.

- AI-powered financial assistant
- Conversational financial guidance
- Predictive financial planning
- Autonomous financial automation
- Tax filing and tax optimization
- Financial advisor marketplace
- Family financial workspaces
- Open developer API

---

## Exit Criteria

Phase 4 is complete when:

- Users can securely connect supported financial institutions.
- Financial accounts synchronize automatically with minimal manual intervention.
- Transactions can be imported from multiple external sources.
- Investment accounts are synchronized and reflected in the user's financial overview.
- Receipts can be scanned and matched to transactions.
- Rule-based automation correctly categorizes and processes financial events.
- Users can import and export financial data using common industry formats.
- Synchronization processes are reliable, transparent, and recover gracefully from failures.

---

## Complexity

Very High

---

## Priority

High

---

## Success Metrics

- Most financial transactions are imported automatically.
- Synchronization completes successfully for supported providers with high reliability.
- Manual transaction entry is significantly reduced.
- Imported financial data remains accurate and consistent across connected accounts.
- Receipt matching achieves a high success rate.
- Data synchronization completes within an acceptable time after changes are detected.
- Users can restore or migrate their financial data without loss.

---

# 9. Phase 5 — Autonomous Finance

## Objective

Transform Nexo into an intelligent financial platform that proactively assists users in managing, understanding, and improving their financial life.

This phase leverages Artificial Intelligence, predictive analytics, and intelligent automation to provide personalized financial guidance while maintaining transparency, user control, and trust.

The objective is to shift from reactive financial management to proactive financial assistance.

---

## Goals

- Provide personalized financial guidance.
- Automate complex financial tasks.
- Deliver predictive financial insights.
- Help users achieve financial goals faster.
- Create an intelligent financial experience without reducing user control.

---

## Deliverables

### AI Financial Assistant

- Conversational financial assistant
- Natural language financial queries
- Personalized financial guidance
- Financial Q&A
- Context-aware conversations
- Explainable AI responses

---

### Predictive Intelligence

- Income forecasting
- Expense forecasting
- Cash flow forecasting
- Net Worth projections
- Financial risk prediction
- Goal achievement predictions

---

### Intelligent Recommendations

- Personalized budgeting suggestions
- Spending optimization
- Savings opportunities
- Debt reduction strategies
- Investment recommendations
- Financial habit coaching

---

### Intelligent Automation

- AI-powered transaction categorization
- Automatic anomaly detection
- Smart financial summaries
- Intelligent notification prioritization
- Adaptive financial rules
- Workflow automation

---

### Advanced Financial Insights

- Personalized financial reports
- Behavioral analysis
- Financial trend explanations
- Long-term financial projections
- Opportunity detection

---

### Family Intelligence

- Shared financial insights
- Household financial recommendations
- Collaborative planning
- Family financial health

---

### Developer Platform

- Public API
- Webhooks
- Third-party extensions
- Partner ecosystem
- Developer documentation

---

### Platform Improvements

- Continuous AI model improvements
- Faster prediction engine
- Enhanced personalization
- Scalable AI infrastructure
- Enterprise-grade security

---

## Out of Scope

The roadmap concludes with this phase.

Future iterations may introduce additional capabilities based on customer feedback, emerging technologies, and business priorities.

---

## Exit Criteria

Phase 5 is complete when:

- Users can interact naturally with an AI financial assistant.
- Personalized recommendations adapt to each user's financial behavior.
- Predictive models provide reliable financial forecasts.
- Intelligent automation significantly reduces manual financial management.
- AI-generated insights remain transparent and explainable.
- The platform supports external integrations through a secure public API.
- The platform delivers a highly personalized financial management experience.

---

## Complexity

Very High

---

## Priority

Strategic

---

## Success Metrics

- Users regularly interact with the AI financial assistant.
- Personalized recommendations improve user financial outcomes.
- Predictive models maintain high accuracy across supported financial scenarios.
- Intelligent automation reduces repetitive manual tasks.
- AI-generated insights are considered trustworthy and actionable by users.
- The platform scales reliably as AI capabilities continue to evolve.
