---
title: Product Scope
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

related: []

supersedes: null

superseded_by: null

tags:
  - product
  - scope
  - mvp
---

# Product Scope

> Scope defines what Nexo is, what it will become, and what it will never try to be.

---

# 1. Purpose

Nexo is a SaaS platform for personal financial management.

Its purpose is to help individuals and families understand, manage, and improve their financial health through accurate financial records, meaningful reports, and AI-powered insights.

Nexo is not accounting software.

Nexo is not ERP software.

Nexo is not banking software.

---

# 2. Target Market

## Primary Users

- Individuals
- Families
- Professionals
- Freelancers
- Homeowners
- Users managing multiple financial accounts
- Users with loans and mortgages

## Future Users

- Couples sharing finances
- Financial advisors
- Family offices

---

# 3. MVP Scope

The first production release should allow users to manage their complete personal financial life without relying on bank integrations.

## Authentication

- Sign up
- Sign in
- Passwordless authentication (Clerk)
- Profile management

---

## Accounts

Supported account types:

- Cash
- Checking
- Savings
- Debit Card
- Credit Card

Each account includes:

- Currency
- Institution
- Current balance
- Status
- Owner

---

## Transactions

Supported transaction types:

- Income
- Expense
- Transfer
- Adjustment

Each transaction supports:

- Category
- Tags
- Merchant
- Notes
- Date
- Currency

---

## Categories

Support both:

- System Categories
- User Categories

Categories are hierarchical.

Example:

Food

- Restaurants
- Groceries

---

## Tags

Users may organize transactions using custom tags.

Tags are independent from categories.

---

## Credit Cards

Support:

- Credit limit
- Statement closing date
- Payment due date
- Payments
- Available credit

---

## Loans

Supported loan types:

- Mortgage
- Auto Loan
- Personal Loan
- Other

Track:

- Original amount
- Outstanding balance
- Interest rate
- Payment schedule
- Remaining payments

---

## Assets

Supported asset types:

- Real Estate
- Land
- Vehicles
- Machinery
- Electronics
- Jewelry
- Other

Each asset includes:

- Purchase price
- Estimated value
- Acquisition date
- Notes

---

## Liabilities

Support liabilities independent of loans.

Examples:

- Personal debts
- Family loans
- Other obligations

---

## Budgets

Budget periods:

- Weekly
- Monthly
- Quarterly
- Yearly

Budgets can be assigned to:

- Categories
- Category groups
- Overall spending

---

## Financial Goals

Examples:

- Emergency Fund
- Vacation
- Home Purchase
- Debt Payoff
- Retirement

Each goal tracks:

- Target amount
- Current progress
- Target date

---

## Dashboard

The dashboard should immediately answer:

- What is my current net worth?
- How much cash do I have?
- How much debt do I owe?
- Am I following my budget?
- What payments are coming soon?
- How did this month compare to last month?

---

## Reports

Initial reports:

- Cash Flow
- Income vs Expenses
- Spending by Category
- Net Worth
- Assets vs Liabilities
- Debt Evolution
- Budget Performance
- Monthly Summary
- Annual Summary

---

## Settings

Support:

- Language
- Currency
- Theme
- Time Zone
- Notification Preferences

---

# 4. AI Scope

AI-assisted capabilities are part of the product scope.

Examples:

- Suggested categories
- Merchant recognition
- Spending summaries
- Budget recommendations
- Natural language financial search
- Financial insights

AI suggestions always require explicit user confirmation.

---

# 5. Future Scope

The following capabilities are intentionally postponed.

## OCR

- Receipt scanning
- Invoice recognition
- Statement scanning

---

## Attachments

Support attaching files to financial records.

Examples:

- Receipts
- Invoices
- Contracts
- Warranty documents

---

## PDF Import

Support importing:

- Credit card statements
- Bank statements

---

## SAT Integration

Support importing:

- CFDI XML
- SAT financial documents

---

## Investments

Support:

- Stocks
- ETFs
- Mutual Funds
- Bonds
- Retirement Accounts
- Cryptocurrency
- Precious Metals

---

## Advanced AI

- Cash flow forecasting
- Financial simulations
- Goal optimization
- Personalized recommendations
- Predictive budgeting

---

## Global Search

Search across:

- Transactions
- Accounts
- Assets
- Loans
- Goals
- Categories

---

## Shared Workspaces

Support:

- Family finances
- Shared budgets
- Shared assets
- User roles and permissions

---

## Mobile Applications

Native:

- iOS
- Android

---

## Desktop Applications

- Windows
- macOS
- Linux

---

## Public API

Provide:

- REST API
- Webhooks
- Developer SDK

---

# 6. Explicitly Out of Scope

Nexo will not include:

- Business accounting
- ERP functionality
- Inventory management
- Payroll
- CRM
- Point of Sale
- Banking platform
- Loan origination
- Trading platform
- Tax filing
- Agricultural management
- Medical records
- Project management

Nexo remains focused exclusively on personal finance.

---

# 7. Scope Expansion Policy

A feature enters the roadmap only if it:

- Aligns with the product vision.
- Improves financial decision-making.
- Fits the domain model.
- Does not introduce unnecessary complexity.
- Can be maintained long-term.

Otherwise, it remains in the backlog.

---

# 8. MVP Success Criteria

The MVP is successful when a user can:

- Create an account.
- Register every financial movement.
- Manage accounts.
- Manage credit cards.
- Manage loans.
- Manage assets and liabilities.
- Build budgets.
- Track financial goals.
- Understand their net worth.
- Generate meaningful reports.
- Receive AI-powered financial insights.

Without connecting to any financial institution.

---

# 9. Product Boundary

Every feature in Nexo should help answer at least one meaningful financial question.

If a feature does not improve financial visibility or decision-making, it does not belong in the product.

---

# Closing Statement

Nexo deliberately chooses focus over feature count.

The objective is not to build the largest finance application.

The objective is to build the most trusted Financial Operating System for individuals and families.

---

# Document Status

**Status**

Approved

**Version**

1.0.0

**Next Document**

`modules.md`

**Notes**

This document defines the functional boundaries of Nexo.

Changes to this document may impact the roadmap, architecture, and domain model and should be reviewed before implementation.
