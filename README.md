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

## Google Maps API key

The `MapGoogle`, `GooglePlacesAutocomplete` and `PlaceList` stories call the
Google Maps JavaScript and Places APIs. The key is **never committed**:

- `config/MapGoogle.config.ts` reads `STORYBOOK_GOOGLE_MAPS_API_KEY` from
  `import.meta.env`. Storybook's Vite builder exposes `STORYBOOK_*` vars to
  stories, so this works in `yarn start:storybook`, `yarn build:storybook` and
  the Vitest story project.
- The library build (`yarn build`) exposes only `VITE_*` vars, so the published
  package always exports `MapGoogleConfig.apiKey === ''`. Consumers pass their
  own key through the components' `config` prop.
- Without the var the stories still render; Google requests just fail.

| Where | How to set it |
| ----- | ------------- |
| Local dev | `cp .env.example .env` and fill in `STORYBOOK_GOOGLE_MAPS_API_KEY` (`.env` is git-ignored and docker-ignored). |
| Storybook image (`Dockerfile`) | `docker build --secret id=google_maps_api_key,src=<file> …`. Optional. |
| CI image build (`.github/workflows/image.yml`) | Repo secret `GOOGLE_MAPS_API_KEY`. The shared `image-build.yml` takes one BuildKit secret today (`npm_token`), so wiring a second one is a follow-up. Until then the deployed Storybook has no Maps key. |

A browser key always ends up in the built JS of the static Storybook site, so
its protection is the **restriction**, not secrecy: limit it to the Maps
JavaScript API and Places API, and to HTTP referrers `http://localhost:4503/*`
plus the deployed Storybook origin.

### Rotation checklist

Two keys were committed earlier and **stay readable in git history and in
published npm versions** (`dist/` bundles from 2023–2024 and every version
that exported `MapGoogleConfig`). History is not rewritten, so **rotating is
the real fix**:

| Fingerprint | Where it leaked |
| ----------- | --------------- |
| `AIzaSyAc…3K3o` | Story files, `src/features/MapGoogle/config`, committed `dist/` bundles (2022-11 → 2024-01: `d49591d`, `7606c08`, `66555b0`, `c55c896`) |
| `AIzaSyBT…MFU4` | `config/MapGoogle.config.ts` (`c55c896`, 2024-01 → removed in deployment-e2e-cloud-1 3.8) |

1. Google Cloud console → **APIs & Services → Credentials**, in the project
   that owns the keys (search for the fingerprints above). Note each key's
   name and current restrictions.
2. **Create a new key** (or use *Regenerate key* on the current one), restrict
   it to *Maps JavaScript API* + *Places API* and to the HTTP referrers above.
3. Put the new value where it is read: your local `.env`, the
   `GOOGLE_MAPS_API_KEY` repo secret (for the image build once wired), and the
   `docker build --secret` file for manual image builds. Never paste it into a
   tracked file.
4. **Delete** both old keys (or, if something still needs them for a short
   overlap, restrict them to no APIs first, then delete). Check the API
   dashboard shows no traffic on the old keys afterwards.
5. Run `yarn start:storybook` and open *MapGoogle* and *GooglePlacesAutocomplete*
   to confirm the new key works.

The gitleaks job in CI (`.github/workflows/ci.yml`) fails a PR that adds a key.

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

# 5. Start Storybook on http://localhost:4503
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
| `yarn start:storybook`| `storybook dev -p 4503` — dev server on port 4503.            |
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
# node-service-gateway

## Deployment manifest

[`deploy.yaml`](./deploy.yaml) declares what this app is and needs to run: its
name, kind, port, public routes, probes, resources, scaling, secret names (never
values) and dependencies. Where it runs is the environment's business
(`deploy/environments/<env>.yaml` in agrippa-stack); the registry and charts are
generated from the two. Validate it with the rest of the workspace from the
workspace root:

```bash
node deploy/registry/bin/agrippa-registry.js manifests services apps --unique-ports
```

The image's `serve` stage follows the agrippa-web image contract (agrippa-stack
`deploy/charts/agrippa-web`): unprivileged nginx (UID 101) on `$PORT`, a
read-only root filesystem (nginx writes only to `/tmp`, see `nginx/`) and
`GET /healthz` for the probes.

Its port, **4503**, is both the container port and the default local port. It is
unique across the workspace and sits in the range for its kind of service (the
port table under "Port Assignments" in agrippa-stack `CLAUDE.md`); `--unique-ports`
fails if another manifest claims it.

Schema and rules: agrippa-stack `deploy/registry/src/manifest/README.md`.

## Publishing docs

> **Tutorials** (node-service-docs): [Document an application](https://github.com/agrippa-io/node-service-docs/blob/develop/docs/tutorials/01-document-your-service.md#a-library-or-an-application) · [Using the docs](https://github.com/agrippa-io/node-service-docs/blob/develop/docs/tutorials/05-using-the-docs.md) · [all tutorials](https://github.com/agrippa-io/node-service-docs/blob/develop/docs/tutorials/README.md).

This application's page goes to the docs platform (`node-service-docs`) as the
`application` source `react-components`: [`docs/app-manifest.json`](docs/app-manifest.json) says what
the app is for, the routes it serves, the environment it reads and who owns it (format:
node-service-docs `src/lib/appManifest`). **Update the manifest with the app:** a new route
or env var belongs in it too.

The shared [`publish-docs` workflow](https://github.com/agrippa-io/github-actions/blob/main/docs/README.md#reusable-workflow-publish-docsyml) (github-actions `v1.13.0`) does the publishing:

- **Pull requests:** job `publish-docs` in `.github/workflows/ci.yml`, after `ci-ok`,
  checks the app manifest and dry-runs the publish: the request is validated, nothing is sent.
- **Pushes to `develop`, `release/**` and `main`:** job `publish-docs` in `.github/workflows/release.yml`, after
  its `build` job (lint + test), PUTs the version to `<DOCS_API_URL>/sources/react-components/versions/<version>`, where
  `<version>` is `<version>-dev.<sha>` on `develop`, the `package.json` version on `main` and `release/**`.
- **Until the four settings below exist** it builds, validates and skips the send with a
  notice. Today that is every run: the docs host isn't deployed yet. It comes with the
  cloud launch, docs-platform-0 slice 17.

| Setting | Kind | Value |
|---|---|---|
| `DOCS_API_URL` | variable | the docs API base, e.g. `https://api.<env>.agrippa.io/docs/v1` |
| `DOCS_TOKEN_URL` | variable | the OIDC token endpoint (client credentials) |
| `DOCS_PUBLISH_CLIENT_ID` | variable | the publishing client's id (scope `docs:publish`) |
| `DOCS_PUBLISH_CLIENT_SECRET` | secret | that client's secret |

They are GitHub Actions organization variables and an organization secret. Slice 17 creates
them along with the docs host and its publishing client; there is nothing to set per repo.

### Publish to your local docs stack

A GitHub runner can't reach your `localhost`, so CI never hydrates a local docs stack. Do it
from the workspace root (`repos-agrippa/`, agrippa-stack `develop`).

1. Start the stack: auth on :4200, authz on :4201, docs on :4370 (`… stack.sh down` stops it).

   ```bash
   STACK_AUTH_DIR=$PWD/services/node-auth-service STACK_AUTHZ_DIR=$PWD/services/node-service-authz STACK_DOCS_DIR=$PWD/services/node-service-docs github-actions/docs/actions/sdk-contract-stack/stack.sh up
   ```

2. Publish this repo:

   ```bash
   npm run docs:publish-local -- --repo apps/react-components
   ```

3. Publish every wired repo:

   ```bash
   npm run docs:publish-local
   ```

4. Validate without sending: it checks the request (there is nothing to build here), needs no token and
   sends nothing. Leave out `--repo` to check every repo; add `--no-build` to skip the build when the
   documents are already built (a repo whose document isn't built then fails with `spec not found`).

   ```bash
   npm run docs:publish-local -- --repo apps/react-components --dry-run
   npm run docs:publish-local -- --no-build --dry-run
   ```

5. Look at it. `curl http://localhost:4370/sources/react-components` lists the versions;
   `…/versions/latest` has the ingest status, counts and diagnostics, and
   `…/versions/latest/app` the manifest as ingested.
   (The docs UI can't read this stack directly yet: node-service-docs sends no CORS
   headers, so a browser on :4504 is blocked.)

Local versions are `<version>-dev.<sha>` (plus `.local.<hash>` for uncommitted changes), so
they never collide with CI's. See [`docs-publish-local.mjs`](https://github.com/agrippa-io/agrippa-stack/blob/develop/deploy/scripts/README.md) for the options.
