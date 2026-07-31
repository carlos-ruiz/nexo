# Branching and Committing Rules

This document defines how to create branches and write commits in Nexo.

## Branching Rules

Nexo uses **GitHub Flow**.

### Main branch

- `main` must always be deployable.
- Never commit directly to `main`.
- All changes reach `main` through Pull Requests.

### Branch lifecycle

1. Sync your local `main` with remote.
2. Create a short-lived branch from `main`.
3. Implement one focused change.
4. Open a Pull Request.
5. Merge only after review and passing CI.
6. Delete the branch after merge.

### Branch naming

Use this format:

`<kind>/<short-description>`

Allowed branch kinds:

- `feat/` for new features
- `fix/` for bug fixes
- `docs/` for documentation changes
- `chore/` for maintenance and tooling
- `refactor/` for internal code restructuring
- `test/` for testing improvements
- `perf/` for performance work

Examples:

- `feat/add-transaction-reversal-command`
- `fix/loan-payment-rounding-bug`
- `docs/branching-and-committing-rules`
- `chore/update-eslint-config`

### Branch scope and size

- One branch should target one business outcome.
- Keep branches small enough to review quickly.
- Avoid mixing unrelated concerns in one branch.

## Commit Message Rules

Nexo uses **Conventional Commits** and enforces them with commitlint.

### Required format

`<type>(<scope>): <description>`

Example:

`feat(finance): add transaction reversal command`

### Allowed types

- `feat` for a new feature
- `fix` for a bug fix
- `docs` for documentation only changes
- `test` for tests added or changed
- `refactor` for code changes that do not fix bugs or add features
- `chore` for maintenance, tooling, and housekeeping
- `perf` for performance improvements

### Allowed scopes

- `finance`
- `planning`
- `portfolio`
- `insights`
- `identity`
- `administration`
- `shared-kernel`
- `app`
- `infra`
- `docs`

### Description guidelines

- Use imperative mood: "add", "fix", "remove", "update".
- Keep it concise and specific.
- Use lowercase unless a proper noun is required.
- Focus on what changed, not why.

Good:

- `fix(portfolio): prevent negative loan outstanding balance`
- `docs(docs): document category hierarchy constraints`

Avoid:

- `fixed stuff`
- `update`
- `changes`

### Commit hygiene

- Prefer small, logical commits.
- Each commit should keep the project buildable.
- Do not bundle unrelated edits together.
- Ensure tests pass before pushing.

## Jira Ticket Integration

Using Jira ticket IDs does not break Conventional Commits if the commit structure stays valid.

### Branch names with Jira IDs

Branch names may include a Jira key for traceability.

Recommended format:

`<kind>/<jira-key>-<short-description>`

Examples:

- `feat/NEX-123-add-budget-rollover`
- `fix/NEX-245-correct-loan-balance-rounding`

### Commit messages with Jira IDs

Keep the required Conventional Commits structure:

`<type>(<scope>): <description>`

Then include the Jira key in one of these places:

- In the commit footer/body (recommended for this repository):
  - `Refs: NEXO-123`
  - `Closes: NEXO-123`

Important for Jira linking:

- Keep `type` and `scope` lowercase to satisfy Conventional Commits.
- Keep the subject/description lowercase to satisfy commitlint `subject-case`.
- Use Jira keys in uppercase (for example `NEXO-4`) in the commit footer/body.
- Avoid lowercase Jira keys such as `nexo-4`, because some Jira integrations do not index them reliably.

Recommended commit pattern in this repository:

`docs(docs): update jira key formatting guidelines for conventional commits`

`Refs: NEXO-4`

### What to avoid

Do not replace type or scope with a Jira key, because commitlint enforces allowed values.

Invalid examples:

- `feat(NEX-123): add monthly rollover rule`
- `NEX-123(planning): add monthly rollover rule`

## Pull Request Template

Use the default GitHub PR template in [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).

When opening a PR:

- Copy the template sections.
- Fill every applicable section.
- Merge only when checks are green and reviews are complete.

## Quick Command Workflow

```bash
git checkout main
git pull origin main
git checkout -b feat/add-goal-rollover-rule
# make changes
git add .
git commit -m "feat(planning): add monthly goal rollover rule"
git push -u origin feat/add-goal-rollover-rule
```

## Relation to Existing Standards

These rules align with the project standards defined in:

- `CLAUDE.md`
- `docs/product/architecture.md`
