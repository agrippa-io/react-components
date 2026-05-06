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
5. Opens a **draft** PR `release/<version>` → `main` with title
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

The `publish-prod` job parses the **squash-merge commit message** to choose the
semver bump (see [`release.yml` — push-to-branch publish](#releaseyml--push-to-branch-publish)).
A `chore:` prefix maps to a **patch** bump, which is the safest default — it
will never accidentally promote a release as a `minor` or `major` change.

If the release should ship as a `minor` or `major`, the operator edits the
squash-merge commit title in the GitHub merge dialog **before clicking merge**:

| Desired bump | Squash-merge title prefix                                |
| ------------ | -------------------------------------------------------- |
| patch        | `chore(release): 0.1.0` (default — no edit required)     |
| minor        | `feat: 0.1.0` or `feat(scope): 0.1.0`                    |
| major        | `feat!: 0.1.0` or include `BREAKING CHANGE` in the body  |

Forcing operators to opt-in to non-patch bumps avoids the failure mode where
a release branch with a single trivial commit silently promotes to a major
version because someone authored a `feat!:` commit weeks ago on `develop`.

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

## Required configuration

One-time setup for the workflows to run end-to-end:

1. **Repo (or org-level) secrets**
   - `NPM_TOKEN` — npm automation token with publish access on the
     `@agrippa-io` scope. Recommended: store this as an **organization
     secret** scoped to selected repos so a single token rotation propagates to
     every consumer. Granular tokens are preferred over classic tokens.
   - `RELEASE_TOKEN` — GitHub PAT with `Contents: Read and write`. Used by:
     - `publish-prod` (in `release.yml`) to push the version commit and tag
       back through branch protection.
     - `cut-release-branch` (in `release-stage.yml`) to push `release/*`
       branches in a way that triggers `publish-staging` (pushes from
       `GITHUB_TOKEN` do not trigger downstream workflows).

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

| Job                                       | Permissions                                | Used by                                                           |
| ----------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `ci.yml` → `publish-canary`               | `contents: read`, `pull-requests: write`   | `issues.createComment` to post the canary install snippet         |
| `release.yml` → `publish-dev`             | `contents: read`, `pull-requests: read`    | `repos.listPullRequestsAssociatedWithCommit` for PR lookup        |
| `release.yml` → `publish-prod`            | `contents: write`, `id-token: write`       | `repos.createRelease`; `id-token` reserved for npm OIDC           |
| `release-stage.yml` → `cut-release-branch`| `contents: read`, `pull-requests: write`   | `gh pr create` opens the draft promotion PR (push uses RELEASE_TOKEN) |

Two jobs intentionally use the default `GITHUB_TOKEN` for some operations and
`RELEASE_TOKEN` for others:

- `publish-prod`: `git push` uses `RELEASE_TOKEN` (configured via
  `actions/checkout`), so the elevated `contents: write` is only consumed by
  `repos.createRelease`.
- `cut-release-branch`: the branch push uses `RELEASE_TOKEN` (so the push
  triggers `publish-staging` downstream); `gh pr create` uses the default
  `GITHUB_TOKEN`, which is why the job declares `pull-requests: write` rather
  than relying on the PAT.

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
   - creates and pushes `release/0.1.0` from `develop`'s tip (triggers
     `publish-staging` → publishes `0.1.0-rc.<run_number>` under dist-tag
     `staging`); and
   - opens a **draft** PR `release/0.1.0 → main` titled
     `chore(release): 0.1.0` with a pre-merge checklist body.

   Subsequent commits to `release/0.1.0` (stabilization fixes from your local
   machine) each republish a new RC under the same `staging` tag.
4. After staging soak, mark the draft PR as ready, then merge it. Merging
   triggers `publish-prod`, which bumps the version, tags, and publishes
   `latest`. To control the bump (minor / major), edit the squash-merge commit
   title before clicking merge — see the conventional-commit prefixes in the PR
   body or in [Forcing a specific bump](#forcing-a-specific-bump) below.
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
