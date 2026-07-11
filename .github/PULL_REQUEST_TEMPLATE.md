## Type

<!-- Check all that apply -->

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — no behavior change
- [ ] `test` — tests only
- [ ] `docs` — documentation only
- [ ] `chore` — tooling, dependencies, configuration
- [ ] `perf` — performance improvement

---

## Affected Module(s)

<!-- Check all modules this PR touches -->

- [ ] `finance`
- [ ] `planning`
- [ ] `portfolio`
- [ ] `insights`
- [ ] `identity`
- [ ] `administration`
- [ ] `shared-kernel`
- [ ] `app` — presentation layer
- [ ] `infra` — configuration or tooling

---

## What

<!-- What does this PR do? One paragraph or a short bullet list is enough. -->

## Why

<!-- Why is this needed? What problem does it solve or what decision does it implement? -->

---

## Testing

<!-- How was this verified? Fill in what applies and delete the rest. -->

- **Unit tests**: <!-- what domain rules or invariants are covered -->
- **Integration tests**: <!-- what flows or commands were tested against a real database -->
- **Manual verification**: <!-- steps to reproduce or verify the change locally -->

---

## Screenshots

<!-- For UI changes, include before/after screenshots. Delete this section if not applicable. -->

---

## Checklist

- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`type(scope): description`)
- [ ] Unit tests cover all new or changed domain invariants
- [ ] Integration tests use a real PostgreSQL database — no mocked repositories
- [ ] No module queries another module's database tables directly
- [ ] Domain invariants from `domain-model.md` are preserved
- [ ] Prisma is not imported in domain or application layer code
- [ ] No localization logic appears in domain or application layer code
- [ ] No `any` types in domain or application layer code
- [ ] An ADR has been written if this change requires one (see `docs/adr/README.md`)

---

## Related

<!-- Link to issues, ADRs, or other PRs. Delete if not applicable. -->
