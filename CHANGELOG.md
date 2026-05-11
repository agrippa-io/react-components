# Changelog

All notable changes to `@agrippa-io/react-components` will be documented in
this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/),
and the project adheres to [Semantic Versioning](https://semver.org/).

Released versions are auto-tagged by the `publish-prod` workflow. See
[RELEASE.md](./RELEASE.md) for the full release process. Each tagged version
also has an auto-generated GitHub release with PR-derived notes — use those as
the source of truth for the exact commits in a release. This file is for
notable cross-cutting changes that span multiple PRs / multiple releases and
benefit from a hand-written narrative.

## [Unreleased]

### Tooling

- **Storybook 7.6.6 → 9.1.x**. Migrated through SB 8 as an intermediate stop
  before landing on 9. CSF 3 (`Meta` / `StoryObj`) replaces the deprecated
  CSF 2 (`ComponentMeta` / `ComponentStory`) across all 13 story files. MDX1
  support and `addon-essentials` consolidated into core.
- **Storybook builder: webpack5 → Vite**. Aligns Storybook with the existing
  Vite library build, eliminates the SWC compiler + `@svgr/webpack` toolchain,
  ~3× faster preview cold start.
- **`@storybook/addon-vitest`** added. Every story is now a Vitest smoke test
  running in real Chromium via Playwright; `play()` interactions execute as
  test assertions.
- **Vitest 1.x → 3.x** for compatibility with `@storybook/addon-vitest`.
- **Node 18 → 24** (`.nvmrc` and Dockerfile base image).
- **CRA removal**. `react-scripts`, `@storybook/preset-create-react-app`,
  `babel-plugin-named-exports-order`, and the `*:app` scripts dropped. The
  project never used CRA at runtime — it was vestigial scaffolding.
- **Jest removal**. `jest`, `ts-jest`, `@types/jest`, and the `test:jest`
  script dropped. Tests are Vitest. `setupTests.ts` now uses the
  jest-dom-for-Vitest entry point (`@testing-library/jest-dom/vitest`).
- **Other vestigial deps removed**: `@babel/core`, `webpack`, `prop-types`,
  `web-vitals`.

### Build / bundle

- **Library externalizes consumer-controlled packages** (React, React DOM,
  MUI, Emotion, Redux Toolkit, react-redux, react-hook-form, react-html-email,
  react-input-mask) via `rollupOptions.external`. Bundle size dropped
  significantly and consumers no longer risk "Invalid hook call" /
  multiple React instances. Matching `peerDependencies` declared in
  `package.json`.
- **`tsconfig.prod.json` target ES5 → ES2020**. Eliminates polyfilled emit for
  `async/await`, `Map`, optional chaining, etc. — all consumers have these
  natively.
- **Storybook build chunking**. The `iframe.js` blob is split into
  `vendor-react`, `vendor-mui`, `vendor-emotion`, `vendor-redux`, and
  `vendor-storybook` chunks via `manualChunks` for better caching and
  parallel loading.

### CI / release

- **GitHub Actions workflows added**: `ci.yml` (PR validation + canary
  publish), `release.yml` (push-triggered publish to `dev`/`staging`/`latest`),
  `release-stage.yml` (operator-dispatched release branch cut + draft PR to
  `main`).
- **Docker publish to AWS ECR** added to `publish-prod` via OIDC. Multi-stage
  Dockerfile uses BuildKit secret mount for the npm token (never written to
  an image layer).
- **`yarn build:storybook` runs in the `validate` CI job** to catch broken
  `.storybook/main.js` config before publish.
- **Playwright browsers cached** in CI via `actions/cache@v4` keyed on
  `yarn.lock`. Saves ~25s per run on cache hits.
- **Per-job permissions** declared as least-privilege on every workflow.
  Workflows requiring downstream chains (e.g. `cut-release-branch` →
  `publish-staging`) use a fine-grained PAT (`RELEASE_TOKEN`) since the
  default `GITHUB_TOKEN` does not trigger downstream workflows.

### Conventions

- **Branch model: Gitflow**. `feature/*` → `develop` → `release/*` → `main`,
  with `hotfix/*` from `main`. Each branch maps to an npm dist-tag
  (`canary`/`dev`/`staging`/`latest`). See [RELEASE.md](./RELEASE.md).
- **Story file imports**: from the framework package
  (`@storybook/react-vite`), not the renderer (`@storybook/react`).
  Enforced by `eslint-plugin-storybook@9` `no-renderer-packages` rule.
- **Autodocs**: opted in globally via `tags: ['autodocs']` in
  `.storybook/preview.js`. Stories opt out per-meta with `tags: ['!autodocs']`.

### Known issues / deferred work

- **`react-html-email@3.0.0`** declares peer `react@^16`, project runs on
  React 18. Works in practice but is the most likely React 19 upgrade
  blocker. Used only by `EmailSignupWelcome`. Replacement candidate:
  `@react-email/components`.
- **`@mui/x-data-grid@^5`** is two majors behind current (`^7`). Bump is a
  separate "MUI upgrade" project — the v5 → v7 path includes API changes in
  column definitions, row models, and the slot system.
- **`.storybook/addons/ControlNested/` and `.storybook/decorators/DecorateThemeProvider.tsx`**
  are dead code (never registered) but kept on purpose. `DecorateThemeProvider`
  still imports from `@agrippa-io/storybook-mui-5`, which is why that package
  remains in devDependencies.
- **Yarn `resolutions` pinning `@types/react@18`** is a band-aid for
  transitive `@types/*` packages that depend on `@types/react@19`. Review
  every ~6 months as those packages release fixes.
