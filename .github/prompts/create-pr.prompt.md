---
description: "Create a branch, commit staged changes, and open a PR for this Nexo repo following conventional commits and the PR template. Use when: submitting work for review, opening a PR, creating a pull request."
argument-hint: "Describe what you're shipping (optional — will be inferred from diff if omitted)"
agent: agent
---

You are helping ship a change in the **Nexo** codebase. Follow these steps exactly.

## 0. Jira ticket

Ask the user: **"Is there a Jira ticket for this change? (e.g. NEXO-123 — press Enter to skip)"**

Store the answer as `$JIRA_TICKET`. If skipped, treat it as empty for all subsequent steps.

## 1. Inspect the working tree

Run `git status` and `git diff HEAD` to understand what changed.

**Guard**: If the working tree is completely clean (nothing staged, nothing modified, no untracked files relevant to the change) → stop and tell the user there is nothing to ship.

Identify the type, scope, and description by reading [branching-and-committing.md](./../../docs/branching-and-committing.md) for the full list of allowed types, scopes, and description guidelines.

If there are **no staged files** (`git diff --cached` is empty), stage everything with `git add -A` before continuing. Inform the user what was staged.

## 2. Create the branch (conditional)

Check the current branch name:

- If it starts with any allowed branch kind defined in [branching-and-committing.md](./../../docs/branching-and-committing.md) → **skip this step, stay on the current branch**
- Otherwise:
  1. Stash any staged/unstaged changes: `git stash --include-untracked`
  2. Pull and checkout main: `git checkout main && git pull origin main`
  3. Create and switch to the new branch: `git checkout -b <type>/<short-slug>` (include `$JIRA_TICKET` in the slug if provided, e.g. `feat/NEX-123-add-budget-rollover`)
  4. Restore the stash: `git stash pop`

## 3. Commit

Commit message format: `<type>(<scope>): <description>`

If `$JIRA_TICKET` is set, append it as a footer on a separate line:

```
feat(planning): add monthly goal rollover rule

Refs: NEXO-123
```

All commits are auto-signed (no `-S` needed). Run the commit.

## 4. Push

Push the branch to `origin` and set upstream if not already set.

## 5. Create the PR

Read [PULL_REQUEST_TEMPLATE.md](./../PULL_REQUEST_TEMPLATE.md) and use it as the PR body structure. Fill in every section based on the actual diff:

- Check the correct **Type** and **Affected Module(s)** checkboxes (use `[x]`)
- Write **What** and **Why** from the diff — be specific, not generic
- Fill **Testing** with what actually applies; remove inapplicable sub-items
- In the **Jira Ticket** field: insert the full URL `https://cruiz.atlassian.net/browse/$JIRA_TICKET` if set, otherwise leave the placeholder comment
- Check off every **Checklist** item satisfied by this change; leave human-judgement items unchecked
- Delete **Screenshots** if no UI changed

Use the `github-pull-request_create_pull_request` tool with:

- **title**: same text as the commit message (`<type>(<scope>): <description>`)
- **base**: `main`
- **body**: the filled template
