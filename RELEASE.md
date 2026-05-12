# Release & CI/CD

This document describes how `@agrippa-io/react-components` is built, validated,
and published. All automation is defined under
[`.github/workflows`](./.github/workflows) and the local
[`.husky`](./.husky) hooks.

## Branch model (gitflow)

| Branch         | Purpose                                                         | npm dist-tag | Environment |
| -------------- | --------------------------------------------------------------- | ------------ | ----------- |
| `feature/*`    | Active development; opens PR into `develop`                     | `canary`     | —           |
| `develop`      | Integration branch; auto-publishes prereleases                  | `dev`        | `dev`       |
| `release/*`    | Release stabilization; cut from `develop` for QA / staging soak | `staging`    | `staging`   |
| `main`         | Production line; tagged releases                                | `latest`     | `prod`      |
| `hotfix/*`     | Urgent prod fixes; cut from `main`, merged to `main` + `develop`| `latest`     | `prod`      |

Consumers install per environment:

```bash
yarn add @agrippa-io/react-components            # latest (prod)
yarn add @agrippa-io/react-components@staging    # staging RC
yarn add @agrippa-io/react-components@dev        # dev prerelease
yarn add @agrippa-io/react-components@canary     # PR canary
```

## Workflows

### `ci.yml` — pull request validation + canary publish

Triggered on `pull_request` targeting `develop`, `release/**`, or `main`.

1. **`validate`** job
   - `yarn install --frozen-lockfile`
   - `yarn prettier --check 'src/**/*.{ts,tsx}'` — formatting check
   - `yarn eslint . --ext .ts,.tsx --max-warnings=0` — lint
   - `yarn vitest run --coverage` — unit tests
   - `yarn build` — typecheck + Vite library build
   - Uploads the built `dist/` as a workflow artifact for inspection.
2. **`publish-canary`** job (skipped for draft PRs)
   - Computes version `x.y.z-canary.<short-sha>` via `npm version --no-git-tag-version`.
   - Publishes to npm under dist-tag `canary`.
   - Posts a comment on the PR with the install command for the freshly
     published canary build.

### `release.yml` — push-to-branch publish

Triggered on `push` to `develop`, `release/**`, or `main`. Each push runs the
same `validate` job as CI before any publish job runs.

| Trigger              | Job              | Version                                | dist-tag  | Environment |
| -------------------- | ---------------- | -------------------------------------- | --------- | ----------- |
| push to `develop`    | `publish-dev`    | `x.y.z-dev.<pr-number>.<short-sha>`    | `dev`     | `dev`       |
| push to `release/**` | `publish-staging`| `x.y.z-rc.<run_number>`                | `staging` | `staging`   |
| push to `main`       | `publish-prod`   | `x.y.z` (read from `package.json`)     | `latest`  | `prod`      |

The `publish-dev` job resolves the PR number and merge-commit short SHA from the
GitHub API (`repos.listPullRequestsAssociatedWithCommit`) so each dev prerelease
is traceable back to the PR and exact commit it came from. If a push lands on
`develop` without an associated PR (direct push), the PR number falls back to
`0` and the SHA falls back to `github.sha`.

The `publish-prod` job:

1. **Reads the version directly from `package.json`** — the bump was
   committed to the release branch by `release-stage.yml` (or by the
   operator on a hotfix branch) and arrived on `main` as part of the
   squash-merge. No inference from the merge-commit subject, no
   `npm version`, no parsing the PR title.
2. Runs `yarn build` and publishes to npm with dist-tag `latest`.
3. Builds and pushes a Docker image to AWS ECR (see [Docker image publish](#docker-image-publish-publish-prod)).
4. Creates a GitHub Release with auto-generated notes — `repos.createRelease`
   creates the matching `vX.Y.Z` tag remotely (no `git push --follow-tags`
   to `main`), pinned to the merge commit via `target_commitish: context.sha`.
5. Triggers the [`sync-develop`](#sync-develop) job to back-merge `main` into
   `develop` per Gitflow.

> **Why no post-merge bump?** A previous iteration ran `npm version <bump>` in
> `publish-prod` after the merge and pushed the resulting `chore(release):
> vX.Y.Z [skip ci]` commit and tag back to `main`. Two problems compounded:
> (1) GitHub appends ` (#PR_NUMBER)` to squash-merge subjects, so the
> "preferred path" regex `^chore\(release\): X.Y.Z$` never matched and the
> workflow always fell through to a patch-bump inferred from `package.json`,
> overriding the operator's intent; (2) the `git push --follow-tags origin
> main` failed silently against `main`'s branch protection / signed-commit
> rules, so the bump never landed and the next release tried to publish the
> same version and got rejected by npm with "You cannot publish over the
> previously published versions: X.Y.Z". Moving the bump to the release
> branch (a normal merge, not a bot push to a protected branch) eliminates
> both failure modes.

#### `sync-develop`

After `publish-prod` succeeds, the `sync-develop` job opens a PR to merge
`main` back into `develop`. Per Gitflow, every commit on `main` must flow
back to `develop` so the version bump and any stabilization fixes from the
release branch (and any hotfixes, when applicable) reach the integration
branch.

The job:

1. Counts how many commits `main` is ahead of `develop`. If zero (e.g. a
   manual back-merge already happened), prints a no-op summary and exits.
2. Creates a `sync/main-to-develop-<version>` branch from `main` using
   `RELEASE_TOKEN`. The branch name includes the version so retries don't
   collide and the audit trail shows which release each sync corresponds to.
3. Opens a PR `sync/main-to-develop-<version>` → `develop` with the default
   `GITHUB_TOKEN`. Not a draft — this is meant to merge as soon as the
   operator reviews it.
4. If a sync branch for this version already exists on origin (e.g. an
   earlier run failed mid-flight), the job skips branch creation and PR
   opening, leaving the in-flight sync PR for the operator to resolve.

Merging this PR runs `publish-dev` automatically (since the merge is a push
to `develop`), so a fresh `dev` prerelease that includes the version bump
appears under dist-tag `dev` shortly after.

#### Docker image publish (`publish-prod`)

Following the npm publish, `publish-prod` builds a Docker image from the
project's `Dockerfile` and pushes it to AWS ECR with two tags per release:

| Tag                                                              | Purpose                                          |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| `${URL_DOCKER_REGISTRY}:vX.Y.Z` (read from `package.json`)       | Immutable, traceable to a specific git tag       |
| `${URL_DOCKER_REGISTRY}:latest`                                  | Floating reference to the most recent prod build |

The pipeline uses four cooperating steps after the npm publish:

1. **`aws-actions/configure-aws-credentials@v4`** — assumes `AWS_DEPLOY_ROLE_ARN`
   via GitHub OIDC (no long-lived AWS keys). The job's existing `id-token: write`
   permission, originally added for npm OIDC, is reused — OIDC tokens are
   audience-scoped so AWS and npm can coexist.
2. **`aws-actions/amazon-ecr-login@v2`** — exchanges the AWS credential for a
   docker-login token against the ECR registry.
3. **`docker/setup-buildx-action@v3`** — enables BuildKit features (secret
   mounts, GHA layer cache).
4. **`docker/build-push-action@v5`** — builds and pushes both tags. The npm
   token is passed as a **BuildKit secret** (`secrets: npm_token=...`), not as
   a `build-args:` value, so it is mounted at build time only and never lands
   in any image layer.

The image build uses GitHub Actions cache (`cache-from: type=gha`, `cache-to:
type=gha,mode=max`), so dependency layers are reused across runs and only the
diffed layers are rebuilt.

##### `Dockerfile` — multi-stage build with BuildKit secret mount

The `Dockerfile` is split into two stages so the final image carries the
resolved dependency tree but not the credentials used to fetch it:

- **`deps` stage** — runs `yarn install` with `NPM_TOKEN` mounted via
  `--mount=type=secret,id=npm_token`. The token lives only in tmpfs at
  `/run/secrets/npm_token` for the duration of the `RUN`. The step writes a
  temporary `.npmrc` from it, runs `yarn install --frozen-lockfile`, then
  `rm -f .npmrc` before the layer is committed. The token never appears in
  any layer's filesystem, environment, or history.
- **`build` stage** — copies `node_modules` from `deps` and the project
  source into a clean image. No credential files are present.

This replaces the previous single-stage Dockerfile which used `RUN echo
"...${NPM_TOKEN}" >> .npmrc` — that pattern persists the token in the layer
where the `RUN` executed, so anyone with `docker pull` access could
`docker run` and `cat .npmrc` to recover it. The risk was contained to the
private ECR registry, but the multi-stage refactor closes the leak entirely.

The first line of the `Dockerfile` (`# syntax=docker/dockerfile:1.7`) is
required to enable BuildKit secret mount syntax — do not remove it.

### `release-stage.yml` — operator-triggered release branch cut

Gitflow does not auto-promote `develop` to `main`; cutting a `release/*` branch
from `develop` is a deliberate human action. This workflow automates the branch
cut so operators don't have to `git checkout -b` manually.

Triggered by `workflow_dispatch` with a single input:

| Input     | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `version` | string | yes      | Strict semver, e.g. `0.1.0` (no `v` prefix) |

The single `cut-release-branch` job:

1. Validates `version` matches `^[0-9]+\.[0-9]+\.[0-9]+$`. Pre-release tags
   (`0.1.0-rc.1`) are rejected — those names are reserved for the `staging`
   dist-tag versions that `publish-staging` mints automatically.
2. Checks out `develop` at its current tip using `RELEASE_TOKEN`.
3. Verifies `release/<version>` does not already exist on origin (refuses to
   overwrite).
4. Creates `release/<version>` and pushes it.
5. **Bumps `package.json` on the release branch to `<version>`** via the
   GitHub contents API (`PUT /repos/.../contents/package.json`). API commits
   are verified-signed by `github-actions[bot]`, so this works even if
   `release/*` has "require signed commits" branch protection. This commit
   is what pins the version end-to-end: `publish-staging` reads it to mint
   `X.Y.Z-rc.N` RCs, and after the release PR squash-merges to `main`,
   `publish-prod` reads it directly without parsing the merge subject.
6. Opens a **draft** PR `release/<version>` → `main` with title
   `chore(release): <version>` and a pre-merge checklist body.

#### Why draft?

The PR is opened in **draft** status deliberately:

- It signals to reviewers and automation that staging soak is in progress and
  the PR should not be merged yet. The operator flips it to "Ready for review"
  once the staging RC has been validated.
- It prevents accidental merges by any auto-merge automation that gates on
  `mergeable_state: clean`, since draft PRs are never `clean`.
- It still surfaces in the PR list so QA can find the corresponding promotion
  PR while validating the staging RC.

#### Why `chore(release): <version>` as the default title?

The title is purely cosmetic now — the version is pinned in
`package.json` on the release branch, and `publish-prod` reads it from
there. You can rename the PR freely without affecting which version
publishes. `chore(release): <version>` is kept as the default because it
shows up nicely in the squash-merge commit on `main` and in the
auto-generated GitHub release notes.

To change the version after `release-stage.yml` has run (e.g. you cut
`release/0.1.0` but decide to ship as `0.2.0`), push a follow-up commit to
the release branch that edits `package.json` to the new version. Don't try
to "rename" the release branch — abandon it and dispatch
`release-stage.yml` again with the correct version.

#### Token usage in this workflow

Two different tokens are used by design:

- The **branch push** uses `RELEASE_TOKEN` (a PAT, configured via
  `actions/checkout`). This is required because pushes authenticated with the
  default `GITHUB_TOKEN` do not trigger downstream workflows — and the entire
  point of pushing `release/<version>` is to trigger `publish-staging` in
  `release.yml`.
- The **PR creation** uses the default `GITHUB_TOKEN` (via the job's
  `pull-requests: write` permission). PRs opened by `GITHUB_TOKEN` *do* fire
  the standard `pull_request` events, and using the built-in token here keeps
  the surface area of `RELEASE_TOKEN` minimal.

The companion local script `scripts/release-stage.sh` (exposed as
`yarn release-stage`) validates the version client-side and dispatches the
workflow via the GitHub CLI:

```bash
yarn release-stage 0.1.0
# → validates semver
# → gh workflow run release-stage.yml --ref develop -f version=0.1.0
```

Requires `gh` to be installed and authenticated against the repo. The script
prints a `gh run watch` command so the operator can follow the dispatched run.

## Local hooks (`husky`)

- **`.husky/pre-commit`** — runs `lint-staged` against staged `.ts/.tsx` files
  (`yarn format`, `yarn lint`, `vitest related --run --passWithNoTests`).
  `vitest related` only re-runs tests whose dependency graph touches the staged
  files, so the hook stays fast even as the suite grows.
- **`.husky/pre-push`** — auto-fixes formatting and lint for the whole project
  (`yarn format` + `yarn lint`). If those commands modified any files, the push
  is aborted with a list of changed files so they can be staged and committed
  before pushing again. This guarantees that what gets pushed will pass the
  CI `format:check` and `lint` gates.

## `package.json` conventions

- `"files": ["/dist"]` — only the built artifact is shipped in the npm tarball.
- `"prepublishOnly": "yarn build"` — `npm publish` always rebuilds from source,
  so the published package cannot drift from the committed source.
- `dist/` is `.gitignore`'d — built locally and in CI, never committed.
- Scripts are organized by purpose. The library build is **Vite**
  (`yarn build` → `tsc -p tsconfig.prod.json && vite build`); Storybook is the
  development surface (`yarn start` → `yarn start:storybook`); tests are
  **Vitest** (`yarn test`). Legacy CRA scripts (`*:app`) and `react-scripts`
  itself were removed — the project never used CRA at runtime; those scripts
  were vestigial scaffolding.
- A `resolutions` block pins three transitive type packages:
  - `@types/minimatch: 5.1.2` — overrides the deprecated `@types/minimatch@6`
    stub (no `.d.ts` files, breaks the prod `tsc` compile with TS2688).
  - `@types/react: ^18.3.28` and `@types/react-dom: ^18.3.0` — three
    transitive packages (`@types/google-map-react`, `@types/react-html-email`,
    `@types/react-input-mask`) pull in `@types/react@19`, which conflicts
    with the project's React 18 runtime and surfaces as
    "Type 'bigint' is not assignable to type 'ReactNode'" on every JSX
    component in `EmailSignupWelcome.tsx`. Pinning to 18 keeps types aligned
    with runtime React.

  **Review cadence:** these resolutions are temporary band-aids. Re-evaluate
  every ~6 months — the underlying packages should update to support newer
  type versions over time, at which point the resolutions can be removed.
- A `peerDependencies` block declares consumer-controlled packages
  (React, React DOM, MUI, Emotion, Redux Toolkit, react-redux,
  react-hook-form). The Vite library build externalizes these via
  `rollupOptions.external` in `vite.config.ts`, so the published bundle
  does not embed its own copies. Without this, consumers risk duplicate
  React instances ("Invalid hook call"), duplicate MUI theme contexts,
  and a roughly doubled bundle size.

### Known dependency risks

- **`react-html-email@3.0.0` declares `peerDependencies: react ^16`** but
  this project runs React 18 (and the page above pins types to React 18).
  Yarn surfaces this as a peer dep warning on every install. The package
  is unmaintained — it works in practice because React 18 is
  backwards-compatible enough for its rendering needs, but any React 19
  upgrade should treat this as the most likely failure point. Used only by
  `src/components/templates/email/EmailSignupWelcome/`. Replacement
  candidate: `@react-email/components`.

## Dev tooling stack

The dev surface is independent from the published artifact (which is
Vite-built `dist/` shipped to npm), but matters for CI parity and for anyone
contributing locally:

| Tool      | Version | Purpose                                                |
| --------- | ------- | ------------------------------------------------------ |
| Node      | `24.x` (pinned in `.nvmrc` to `24.0.0`) | Runtime for all yarn scripts and CI jobs |
| TypeScript| `^5.8`  | Source language (compiled by Vite for the library, by SWC for Storybook) |
| Vite      | (peer-managed) | Library build: produces `dist/index.es.js` + types     |
| Vitest    | `^3.x`  | Unit tests + story smoke tests via `@storybook/addon-vitest` (`yarn test` runs both projects) |
| Storybook | `^9.0`  | Component playground (uses the Vite builder via `@storybook/react-vite`) |
| ESLint    | `^8.55` | Lint + format gate (with prettier integration)         |

### Node version

`.nvmrc` is the source of truth (`24.0.0`). All CI jobs use
`actions/setup-node@v4` with `node-version-file: '.nvmrc'`, so a single bump
of `.nvmrc` propagates to every workflow. The `Dockerfile` base image is
pinned to `FROM node:24` (major-only) to track the latest 24.x LTS minor
without a code change.

### Storybook 9

Storybook is a developer-only dependency — it is never bundled into the
published package. The relevant scripts:

```bash
yarn start                # alias for start:storybook
yarn start:storybook      # storybook dev -p 6006
yarn build:storybook      # storybook build (produces storybook-static/)
```

Configuration lives in `.storybook/`:

- `main.js` — framework (`@storybook/react-vite`), addons (`addon-links`),
  TypeScript docgen, static asset directory, and a `viteFinal` hook that
  registers `vite-plugin-svgr` for CRA-compatible `import { ReactComponent }`
  SVG handling and adds the legacy emotion aliases.
- `preview.js` — global font CSS, `controls` matchers for color/date, and a
  global `tags: ['autodocs']` so every story generates docs by default.
- `manager.js` — sets the dark theme via `storybook/manager-api`.

Storybook 9 collapsed most addons into core. The repo previously depended on
`@storybook/addon-essentials`, `@storybook/addon-interactions`,
`@storybook/manager-api`, `@storybook/preview-api`, `@storybook/test`, and
`@storybook/theming` as separate packages — these are gone. Their APIs are
reached via deep imports off the single `storybook` package (e.g.
`storybook/manager-api`, `storybook/test`).

### Why the Vite builder (and not webpack5)?

The repo briefly ran on `@storybook/react-webpack5` as a stepping stone after
the SB 7 → 9 migration. It now uses `@storybook/react-vite` because:

- **Single build tool across the project.** The library build already uses
  Vite (`yarn build` → `vite build`), and `vite-plugin-svgr` is already a
  dependency. Aligning Storybook with the same tool eliminates the
  webpack/Vite duplication.
- **~3× faster cold start.** Storybook preview boots in ~1.3s on Vite vs
  ~4.0s on webpack5 for this codebase.
- **No compiler addon required.** Vite handles `.ts/.tsx`/JSX natively via
  esbuild. The `@storybook/addon-webpack5-compiler-swc` addon (and the
  `@svgr/webpack` loader) that webpack5 needed are gone — fewer moving
  parts, smaller `node_modules`, less surface area to break in future
  Storybook majors.
- **Story files import from the framework package** (`@storybook/react-vite`)
  to keep the `Meta` / `StoryObj` types aligned with the builder. The
  `eslint-plugin-storybook` rule `storybook/no-renderer-packages` enforces
  this.

### Story smoke tests via `@storybook/addon-vitest`

Every story file is automatically a Vitest test. `yarn test` runs two
parallel Vitest projects (configured under `test.projects` in
`vite.config.ts`):

| Project   | Source                  | Runner                                | What it covers                                                    |
| --------- | ----------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `unit`    | `src/**/*.test.{ts,tsx}`| jsdom (`./setupTests.ts`)             | 51 existing unit tests for services / utils                       |
| `storybook` | `src/**/*.story.tsx`  | Real Chromium via Playwright          | 13 smoke tests — one per story; component must mount without throwing. `play()` interactions, when added, are executed and asserted here. |

The storybook project pulls global preview annotations from
`.storybook/preview.js` via `.storybook/vitest.setup.ts`, so each
story-as-test runs with the same decorators, parameters, and global tags
that the Storybook canvas uses. Without that, a story that depends on a
decorator (e.g. a theme provider) would render bare in the test runner.

**Required setup** before the first test run:

```bash
npx playwright install chromium     # ~90 MB download, one-time per machine
```

`yarn test` itself does not auto-install Playwright browsers — CI must run
`npx playwright install chromium --with-deps` in its setup step (the
`--with-deps` flag also pulls the system libraries the headless browser
needs).

**To opt a story out** of the test run (e.g. one that requires an API key
or has flaky external deps), tag its `meta`:

```tsx
const meta: Meta<typeof Component> = {
  title: '...',
  component: Component,
  tags: ['!test'],   // SB 9 tag-negation; complements ['!autodocs']
}
```

### SVG handling via `vite-plugin-svgr`

The source code uses CRA's `import { ReactComponent as Icon } from
'./foo.svg'` pattern (not just URL imports). The Vite builder registers
`vite-plugin-svgr` in `viteFinal` with the same `svgrOptions` as the
library build (`vite.config.ts`), so dev (Storybook) and prod (published
library) transform SVGs identically — no surprises when a story works in
Storybook but the published component doesn't.

### Story file conventions

All 13 story files use **CSF 3** (object-based) — `Meta` and `StoryObj`
imported as types from the **framework** package `@storybook/react-vite`,
not the renderer `@storybook/react`. The `eslint-plugin-storybook@9` rule
`storybook/no-renderer-packages` enforces this — importing from
`@storybook/react` triggers a lint error in pre-commit. The framework import
is also more accurate: it includes any builder-specific extensions to the
`Meta` / `StoryObj` types and tracks the builder you actually run.

CSF 2 (function-based, `ComponentStory<typeof X>`) was removed in
Storybook 9. New stories should follow the CSF 3 pattern:

```tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5'
import { Component } from './Component'

const meta: Meta<typeof Component> = {
  title: 'Components / atoms / Component',
  component: Component,
  argTypes: {
    /* ... */
  },
}
export default meta

export const Default: StoryObj<typeof Component> = {
  args: {
    /* default props */
  },
  // Custom render only when needed (e.g. wrapping in providers):
  // render: (args) => <FormProvider><Component {...args} /></FormProvider>,
}
```

### Autodocs (opt-in by default, opt-out per story)

Autodocs generates a Docs tab for every story that includes the `autodocs`
tag. The original Storybook 7 setup used `docs.autodocs: true` (every story
gets a Docs page); Storybook 9 removed that field, so the equivalent is set
**globally** in `.storybook/preview.js`:

```js
// .storybook/preview.js
const preview = {
  parameters: { /* ... */ },
  tags: ['autodocs'],   // <-- every story opts in by default
}
```

This preserves the original "all stories have docs" behavior with one
change in one file, instead of touching every meta.

**To opt a single story out**, add `tags: ['!autodocs']` on its `meta`:

```tsx
const meta: Meta<typeof Component> = {
  title: '...',
  component: Component,
  tags: ['!autodocs'],   // overrides the global opt-in for this story only
}
```

The leading `!` is Storybook 9's tag-negation syntax — it removes a tag
that would otherwise be inherited from the global `preview.js` tags.

**When to opt out**: the autodocs Docs tab assumes the story's render is a
representative single instance of `meta.component` driven by `args`. Opt
out for stories where that assumption breaks — e.g.

- Showcase grids that render many static instances regardless of `args`
  (the Controls table would only drive a subset of what's on screen).
- Stories that intentionally don't follow the single-component pattern
  (e.g. multi-component layout demos).

Currently only `IconCreditCardLogo.story.tsx` opts out — its render shows
every `iconStyle × company` combination in a static grid, so the Docs page
is misleading. The other 12 story files inherit the global opt-in.

## Required configuration

One-time setup for the workflows to run end-to-end:

1. **Repo (or org-level) secrets**
   - `NPM_TOKEN` — npm automation token with publish access on the
     `@agrippa-io` scope. Recommended: store this as an **organization
     secret** scoped to selected repos so a single token rotation propagates to
     every consumer. Granular tokens are preferred over classic tokens.
   - `RELEASE_TOKEN` — GitHub PAT with `Contents: Read and write`. Used by:
     - `cut-release-branch` (in `release-stage.yml`) to (a) push `release/*`
       branches in a way that triggers `publish-staging` (pushes from
       `GITHUB_TOKEN` do not trigger downstream workflows), and (b) commit
       the `package.json` version bump on the release branch via the
       contents API.
     - The previous use — `publish-prod` pushing the version commit + tag
       back to `main` — is gone. The bump now lives on the release branch
       and arrives on `main` via the squash-merge, and the release tag is
       created remotely via `repos.createRelease`, so `publish-prod` runs
       with only the default `GITHUB_TOKEN`.

     **Important: fine-grained PAT resource owner.** When generating a
     fine-grained PAT, the **Resource owner** must be set to `agrippa-io`
     (the org), not your personal account. A fine-grained PAT issued against
     your personal account has no access to org repos even if you're an org
     admin, and pushes will fail with `Permission to ... denied to <you>` —
     authenticated, but unauthorized for the org's resources. If your org
     requires admin approval for fine-grained tokens, the token must also be
     approved before the secret is usable. Classic PATs work too but require
     SAML SSO authorization on each org if SSO is enabled.

     If `main` is unprotected and you don't need to chain workflows, you can
     replace `RELEASE_TOKEN` with the built-in `secrets.GITHUB_TOKEN`.
2. **GitHub Environments** named `dev`, `staging`, `prod` — used to gate
   publishes (manual approvals, environment-scoped secrets).

3. **AWS / ECR for Docker publish** (used by `publish-prod`):
   - **Repo (or `prod` environment) variable** `URL_DOCKER_REGISTRY` — the
     full ECR repository URL (e.g.
     `739504454286.dkr.ecr.us-west-1.amazonaws.com/agrippa-dev/react-components`).
     Stored as a GitHub Actions **variable** (`vars.`), not a secret —
     registry URLs aren't sensitive and storing them as variables makes them
     visible in the workflow logs and run summary, which is useful for
     auditability.

     ```bash
     gh variable set URL_DOCKER_REGISTRY --env prod \
       --body '739504454286.dkr.ecr.us-west-1.amazonaws.com/agrippa-dev/react-components'
     ```

   - **Repo (or `prod` environment) secret** `AWS_DEPLOY_ROLE_ARN` — IAM role
     ARN that GitHub OIDC assumes during `publish-prod`. The role's trust
     policy must trust GitHub's OIDC provider and restrict to this repo's
     `main` branch:

     ```json
     {
       "Effect": "Allow",
       "Principal": { "Federated": "arn:aws:iam::739504454286:oidc-provider/token.actions.githubusercontent.com" },
       "Action": "sts:AssumeRoleWithWebIdentity",
       "Condition": {
         "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
         "StringLike":   { "token.actions.githubusercontent.com:sub": "repo:agrippa-io/react-components:ref:refs/heads/main" }
       }
     }
     ```

     The role's permission policy needs the standard ECR push set:
     `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`,
     `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`,
     `ecr:CompleteLayerUpload`, `ecr:PutImage` — scoped to the target
     repository ARN.

     If the org's AWS account doesn't yet have a GitHub OIDC identity
     provider, add it once via IAM → Identity providers → Add provider →
     OpenID Connect → URL `https://token.actions.githubusercontent.com`,
     audience `sts.amazonaws.com`.

   - **ECR repository** must exist before the first publish (ECR does not
     auto-create on first push). Tag immutability is recommended:

     ```bash
     aws ecr create-repository \
       --region us-west-1 \
       --repository-name agrippa-dev/react-components \
       --image-tag-mutability IMMUTABLE
     ```

     With immutability on, the versioned tag (`v0.1.0`) cannot be overwritten;
     only the `latest` tag rotates. This matches the npm dist-tag model
     (`vX.Y.Z` immutable, `latest` floating) and prevents accidental tag
     reuse during retries.
4. **Branch protection on `main`** does not need a bypass for any bot — the
   release workflow no longer pushes to `main` directly. The version bump
   arrives via the squash-merge of the release PR, and the `vX.Y.Z` git tag
   is created remotely via `repos.createRelease`. Branch protection can be
   as strict as you like (required reviews, required status checks, signed
   commits, linear history) without conflicting with release automation.
5. **Default branch**: `develop` should be the working branch; `main` is
   release-only.
6. **Bootstrap publish (first-time only)**. npm rejects the first publish of a
   new package if it's a prerelease under a non-`latest` dist-tag. Before CI
   can run, publish the current stable version once from a developer machine:

   ```bash
   yarn install --frozen-lockfile
   yarn build
   npm publish --tag latest --access restricted
   ```

   After this initial publish, all CI prerelease publishes (`canary`, `dev`,
   `staging`) succeed because `latest` is already established.

### Per-job permissions

The workflows declare least-privilege `permissions:` on each job rather than
relying on the repo-wide default. If you fork or duplicate these workflows,
preserve these blocks or you will see `HttpError: Resource not accessible by
integration` at runtime.

| Job                                       | Permissions                                | Used by                                                           |
| ----------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `ci.yml` → `publish-canary`               | `contents: read`, `pull-requests: write`   | `issues.createComment` to post the canary install snippet         |
| `release.yml` → `publish-dev`             | `contents: read`, `pull-requests: read`    | `repos.listPullRequestsAssociatedWithCommit` for PR lookup        |
| `release.yml` → `publish-prod`            | `contents: write`, `id-token: write`       | `repos.createRelease` (which also creates the `vX.Y.Z` tag); `id-token` reserved for npm OIDC |
| `release-stage.yml` → `cut-release-branch`| `contents: read`, `pull-requests: write`   | `gh pr create` opens the draft promotion PR (push + contents API uses RELEASE_TOKEN) |

`cut-release-branch` uses two tokens by design:

- **`RELEASE_TOKEN`** for (a) pushing the `release/*` branch (so the push
  triggers `publish-staging` downstream — `GITHUB_TOKEN` pushes don't fire
  workflows) and (b) the contents-API call that commits the `package.json`
  bump onto the release branch.
- **`GITHUB_TOKEN`** for `gh pr create` (via the job's `pull-requests: write`
  permission), which keeps the surface area of the PAT minimal.

`publish-prod` runs with only the default `GITHUB_TOKEN`. It does not push
to `main` and does not need a PAT.

### Package access

The package is published as **private** (`npm publish --access restricted`).
This requires `@agrippa-io` to be on a paid npm org plan; CI consumers must
authenticate with `NODE_AUTH_TOKEN` set on their `Install` step or a
project-level `.npmrc` referencing `${NODE_AUTH_TOKEN}`.

## Cutting a release (operator runbook)

### Routine release

1. Open PRs against `develop`. Each PR push publishes a canary; QA can install
   `@agrippa-io/react-components@<canary-version>` to validate.
2. Merge to `develop`. The `dev` dist-tag is updated automatically.
3. When ready to stabilize, cut a release branch from `develop`:

   ```bash
   yarn release-stage 0.1.0
   ```

   This dispatches the `release-stage.yml` workflow, which:
   - creates and pushes `release/0.1.0` from `develop`'s tip;
   - commits a `package.json` version bump to `0.1.0` onto the release
     branch via the GitHub contents API (verified-signed by
     `github-actions[bot]`). This push then triggers `publish-staging` →
     publishes `0.1.0-rc.<run_number>` under dist-tag `staging`;
   - opens a **draft** PR `release/0.1.0 → main` titled
     `chore(release): 0.1.0` with a pre-merge checklist body.

   Subsequent commits to `release/0.1.0` (stabilization fixes from your local
   machine) each republish a new RC under the same `staging` tag.
4. After staging soak, mark the draft PR as ready, then merge it. Merging
   triggers `publish-prod`, which reads the version from `package.json` (now
   on `main` via the squash-merge) and publishes it under dist-tag
   `latest`. The PR title is cosmetic — to publish a different version,
   push a follow-up commit to the release branch that edits `package.json`
   before merging.
5. `sync-develop` opens a `sync/main-to-develop-<version>` PR
   automatically. Review and merge it — that's what closes the Gitflow loop
   and gets the version bump onto `develop`. The merge triggers
   `publish-dev`, which republishes a fresh `dev` prerelease at the new
   version.

### Hotfix

1. Branch `hotfix/<issue>` from `main`.
2. **Bump `package.json`** to the hotfix version (e.g. `0.1.1`) as part of
   the hotfix commits. `publish-prod` will publish whatever version
   `package.json` says — if you forget to bump, the publish step fails with
   `npm ERR! 403 You cannot publish over the previously published versions:
   X.Y.Z`, which is the correct guardrail.
3. PR back into `main`. Merge triggers `publish-prod` exactly as above.
4. Merge `main` into `develop` (the `sync-develop` job opens this PR for
   you).

### Choosing the next version

Because `package.json` is the single source of truth, you pick `patch` vs
`minor` vs `major` by typing the version you want into
`yarn release-stage <version>` (or, for hotfixes, by editing `package.json`
in your hotfix branch). There is no longer any auto-inference from
conventional-commit prefixes.
