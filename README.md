# Nexo

Nexo is an AI-native, multilingual personal finance SaaS platform.

For full product and architecture documentation, start with:

- docs/product/vision.md
- docs/product/principles.md
- docs/product/scope.md
- docs/product/modules.md
- docs/product/roadmap.md
- docs/product/domain-model.md
- docs/product/architecture.md

## Node.js Version Policy

This project requires Node.js 24.

- Required runtime: Node.js `24.x` (enforced in `package.json` engines)
- Local default version files: `.nvmrc` and `.node-version`
- Install enforcement: `.npmrc` sets `engine-strict=true`
- CI runtime: `.github/workflows/ci.yml` uses Node.js 24

## Local Setup

1. Switch to Node.js 24:

```bash
nvm use
```

2. Verify active version:

```bash
node -v
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the app:

```bash
pnpm dev
```

## Contributing

See CONTRIBUTING.md and docs/branching-and-committing.md for branch and commit conventions.
