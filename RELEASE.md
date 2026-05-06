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
| push to `main`       | `publish-prod`   | `x.y.(z+1)` (or minor / major)         | `latest`  | `prod`      |

The `publish-dev` job resolves the PR number and merge-commit short SHA from the
GitHub API (`repos.listPullRequestsAssociatedWithCommit`) so each dev prerelease
is traceable back to the PR and exact commit it came from. If a push lands on
`develop` without an associated PR (direct push), the PR number falls back to
`0` and the SHA falls back to `github.sha`.

The `publish-prod` job:

1. Reads the latest commit message and chooses a semver bump using
   conventional-commit prefixes:
   - `BREAKING CHANGE` or `<type>!:` → **major**
   - `feat:` / `feat(scope):` → **minor**
   - anything else → **patch**
2. Runs `npm version <bump>`, which creates a `chore(release): vX.Y.Z [skip ci]`
   commit and a matching git tag.
3. Runs `yarn build` and publishes to npm with dist-tag `latest`.
4. Pushes the version commit and tag back to `main`.
5. Creates a GitHub Release with auto-generated notes.

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

Because the push is authenticated with `RELEASE_TOKEN` (a PAT) rather than the
default `GITHUB_TOKEN`, it triggers the `publish-staging` job in `release.yml`
automatically — pushes from `GITHUB_TOKEN` cannot trigger downstream workflows.

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

## Required configuration

One-time setup for the workflows to run end-to-end:

1. **Repo (or org-level) secrets**
   - `NPM_TOKEN` — npm automation token with publish access on the
     `@agrippa-io` scope. Recommended: store this as an **organization
     secret** scoped to selected repos so a single token rotation propagates to
     every consumer. Granular tokens are preferred over classic tokens.
   - `RELEASE_TOKEN` — GitHub PAT with `contents: write`, used by `publish-prod`
     to push the version commit and tag back through branch protection. If
     `main` is unprotected you can replace this with the built-in
     `secrets.GITHUB_TOKEN`.
2. **GitHub Environments** named `dev`, `staging`, `prod` — used to gate
   publishes (manual approvals, environment-scoped secrets).
3. **Branch protection on `main`** must allow the release bot's `[skip ci]`
   commit (either via a bypass rule for the `RELEASE_TOKEN` identity, or by
   using a GitHub App token).
4. **Default branch**: `develop` should be the working branch; `main` is
   release-only.
5. **Bootstrap publish (first-time only)**. npm rejects the first publish of a
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

| Job                          | Permissions                                            | Used by                                                     |
| ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `ci.yml` → `publish-canary`  | `contents: read`, `pull-requests: write`               | `issues.createComment` to post the canary install snippet   |
| `release.yml` → `publish-dev`| `contents: read`, `pull-requests: read`                | `repos.listPullRequestsAssociatedWithCommit` for PR lookup  |
| `release.yml` → `publish-prod`| `contents: write`, `id-token: write`                  | `repos.createRelease`; `id-token` reserved for npm OIDC     |

`publish-prod`'s `git push` uses `RELEASE_TOKEN` (configured via
`actions/checkout`), not the default `GITHUB_TOKEN`, so the elevated `contents:
write` is only consumed by `repos.createRelease`.

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

   This dispatches the `release-stage.yml` workflow, which creates and pushes
   `release/0.1.0` from `develop`'s tip. The push triggers `publish-staging`,
   which publishes `0.1.0-rc.<run_number>` under dist-tag `staging`.

   Subsequent commits to `release/0.1.0` (stabilization fixes from your local
   machine) each republish a new RC under the same `staging` tag.
4. After staging soak, PR `release/0.1.0` → `main`. Merging triggers
   `publish-prod`, which bumps the version, tags, and publishes `latest`.
5. Merge `main` back into `develop` so the version bump and any hotfixes flow
   downstream.

### Hotfix

1. Branch `hotfix/<issue>` from `main`.
2. PR back into `main`. Merge triggers `publish-prod` exactly as above.
3. Merge `main` into `develop`.

### Forcing a specific bump

The bump is read from the merge-commit message. To force a `minor` or `major`
on `main`, ensure the squash-merge commit message uses the conventional-commit
prefix (`feat:` for minor, `feat!:` / `BREAKING CHANGE:` for major).
