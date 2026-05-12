# @agrippa-io/react-components

A React component library that extends Material UI, developed and previewed
through Storybook, and published as a private package to npm under the
`@agrippa-io` scope.

> **Releases & CI/CD:** see [RELEASE.md](./RELEASE.md) for the branch model
> (gitflow), GitHub Actions workflows, npm dist-tag strategy, dev tooling
> stack, and the operator runbook for cutting a release.

## Technology stack

| Layer        | Tools                                                                |
| ------------ | -------------------------------------------------------------------- |
| Runtime      | React 18, Material UI 5, React Hook Form                             |
| State        | Redux Toolkit, react-redux                                           |
| Tests        | Vitest 3 (unit + story smoke tests via `@storybook/addon-vitest` running in real Chromium via Playwright) + React Testing Library |
| Library build| Vite (`vite build` produces `dist/index.es.js` + `dist/index.cjs.js` + types) |
| Dev surface  | Storybook 9 with the **Vite builder** (`@storybook/react-vite` + `vite-plugin-svgr`) |
| Lint/format  | ESLint (flat-extending config) + Prettier (`yarn lint`, `yarn format`)|
| Hooks        | Husky pre-commit (lint-staged) + pre-push (format + lint)            |
| Node         | Pinned to `24.x` via `.nvmrc` (use `nvm use` before installing)      |

For why the Vite builder, the `vite-plugin-svgr` config, and the autodocs
opt-in/out pattern are there, see the "Dev tooling stack" section in
[RELEASE.md](./RELEASE.md).

## Releases

Commits MUST be signed. Configure SSH commit signing once per machine:

```bash
git config --global gpg.format ssh
git config --global user.signingkey /PATH/TO/.SSH/KEY.PUB
git config --global commit.gpgsign true
```

The release pipeline (canary on PR, dev on `develop`, staging RC on
`release/*`, latest on `main`) is documented in [RELEASE.md](./RELEASE.md).

## Project architecture

All implementation lives under `src/`:

- `index.ts` — package entry point (the `main` export).
- `assets/` — JavaScript-importable assets (`.svg`, `.json`).
- `components/` — React components, organized by Atomic Design.
- `services/` — non-component logic (form helpers, Google Maps service, etc.).
- `features/` — feature-scoped composition.

### Atomic Design

Components are organized by [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/):

- `atoms` — lowest-level UI elements (`Link`, `Button`, `Typography`).
- `molecules` — composed of 2+ atoms (`FieldText`, `FieldCreditCardNumber`).
- `organisms` — composed of atoms/molecules (`UserProfilePanel`,
  `PaymentCreditCardForm`, `NavigationSidebar`).
- `templates` — full-page or top-level compositions (`UserProfilePage`,
  `CheckoutPaymentPage`, email templates like `EmailSignupWelcome`).

### Material UI

The library extends [Material UI](https://mui.com/) — components are typically
thin wrappers that add app/organization-specific behavior on top of MUI
primitives. Useful references:

- [MUI components](https://mui.com/material-ui/all-components/)
- [MUI theming](https://mui.com/material-ui/customization/theming/)

Storybook serves as both the component playground and the visual diff surface
for theming changes.

### Email templates (MJML)

Email templates under `src/components/templates/email/**` are authored as
React components using [MJML](https://mjml.io/) — a markup language that
compiles to email-safe, responsive HTML and handles the cross-client quirks
(Outlook desktop conditional comments, hybrid responsive layouts, dark-mode
media queries, etc.) that hand-rolled HTML emails get wrong. The library used
is [`@faire/mjml-react`](https://github.com/Faire/mjml-react), which exposes
MJML tags as React components.

Useful references:

- [MJML documentation](https://documentation.mjml.io/) — component reference
  (`mj-section`, `mj-column`, `mj-text`, `mj-button`, …) and attribute list.
- [MJML online editor (`mjml.io/try-it-live`)](https://mjml.io/try-it-live) —
  paste raw MJML and see the compiled HTML, useful for prototyping a layout
  before porting it into JSX.
- [`@faire/mjml-react` README](https://github.com/Faire/mjml-react#readme) —
  the JSX-to-MJML mapping (each `<MjmlSection>` becomes `<mj-section>`, etc.)
  and the `render()` / `renderToMjml()` helpers.

**Rendering paths.** The compile step has two flavors:

| Context              | API                                                       |
| -------------------- | --------------------------------------------------------- |
| Node (sending email) | `@agrippa-io/react-components`'s `renderReactEmail` util → `@faire/mjml-react`'s `render()` (synchronous, uses the Node `mjml` package internally) |
| Browser (Storybook)  | `renderToMjml()` → `mjml-browser` (default export is **async** — `await` the Promise) |

The split exists because `@faire/mjml-react`'s `render` transitively imports
`html-minifier` → `clean-css`, which references Node globals (`process`,
`os.EOL`) and won't run in the browser. Stories sidestep this by composing
`renderToMjml` with `mjml-browser` and rendering the compiled HTML inside an
`<iframe srcDoc={...}>` for a true visual preview. `EmailSignupWelcome.story.tsx`
is the reference implementation; copy its `EmailPreview` shape for new email
stories.

## Getting started

```bash
# 1. Clone
git clone git@github.com:agrippa-io/react-components.git
cd react-components

# 2. Use the project's pinned Node version (24.x)
nvm use            # reads .nvmrc

# 3. Install dependencies (Yarn classic v1)
yarn

# 4. Install Playwright Chromium for story smoke tests (one-time, ~90 MB)
npx playwright install chromium

# 5. Start Storybook on http://localhost:6006
yarn start
```

> The Playwright install in step 4 is only needed if you'll run `yarn test`
> — it powers the story smoke tests added by `@storybook/addon-vitest`.
> Skip it if you only need the Storybook dev server.

## Local hooks

Husky + lint-staged are wired up by `yarn install` (via the `prepare` script).
Configuration lives in `.lintstagedrc`:

```jsonc
{
  "*.{ts,tsx}": [
    "yarn format",                                    // Prettier write
    "yarn lint",                                      // ESLint --fix
    "./node_modules/.bin/vitest related --run --passWithNoTests"  // tests touching staged files
  ]
}
```

`vitest related` only re-runs tests whose dependency graph touches the staged
files, so the pre-commit hook stays fast as the suite grows.

The `pre-push` hook runs `yarn format` + `yarn lint` against the entire repo
and aborts the push if either modified files (so you can stage + commit them
before pushing again). This guarantees the push will pass the CI `format:check`
and `lint` gates.

> ⚠ Use `git commit --no-verify` only on feature/work branches when you have a
> good reason — never on `main` or `develop`. Bypassing the hook risks
> introducing mal-formatted code or failing tests into shared branches.

## Available scripts

### Primary

| Script             | What it does                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `yarn start`       | Alias for `yarn start:storybook`. Default dev surface.           |
| `yarn build`       | `tsc -p tsconfig.prod.json && vite build` — produces `dist/`.    |
| `yarn test`        | `vitest run --coverage` — single-pass test run with coverage.    |
| `yarn test:watch`  | `vitest` in watch mode.                                          |
| `yarn test:ui`     | Vitest's browser UI for inspecting tests interactively.          |
| `yarn lint`        | `eslint . --ext .ts,.tsx --fix` — lint with auto-fix.            |
| `yarn format`      | `prettier --write` against `src/**/*.{ts,tsx}`.                  |
| `yarn format:check`| `prettier --check` (same paths). Used by CI gating.              |

### Storybook

| Script                | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `yarn start:storybook`| `storybook dev -p 6006` — dev server on port 6006.            |
| `yarn build:storybook`| `storybook build` — produces `storybook-static/`.             |

### Release

| Script              | What it does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `yarn release-stage`| Dispatches the `release-stage.yml` workflow to cut a release branch from `develop`. See [RELEASE.md](./RELEASE.md#release-stageyml--operator-triggered-release-branch-cut). |

### Forking this repo

If you fork this project under a different scope:

1. Update the `name` field in `package.json` to your `@<scope>/<name>`.
2. Set `version` to your starting version (`0.0.1` for a fresh start, or
   `1.0.0` if you're cutting a production release).
3. Run `yarn` to refresh `yarn.lock`.
4. Run `yarn build` to verify the build produces a clean `dist/`.
5. Update the GitHub Actions secrets / variables described in
   [RELEASE.md](./RELEASE.md#required-configuration) for your fork's npm
   organization, AWS account, and release token.

`dist/` is `.gitignore`'d — it is built fresh by `prepublishOnly` on every
publish, so you do not need to commit the build output.

## Learn more

- [React](https://react.dev/) — runtime
- [Material UI](https://mui.com/) — design system base
- [React Hook Form](https://react-hook-form.com/) — form library
- [MJML](https://mjml.io/) — email markup framework
  ([docs](https://documentation.mjml.io/),
  [try-it-live](https://mjml.io/try-it-live),
  [`@faire/mjml-react`](https://github.com/Faire/mjml-react))
- [Storybook 9](https://storybook.js.org/docs/get-started) — dev/preview surface
- [Vitest](https://vitest.dev/) — test runner
- [Vite](https://vitejs.dev/) — library build tool
