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

| Trigger              | Job              | Version                       | dist-tag  | Environment |
| -------------------- | ---------------- | ----------------------------- | --------- | ----------- |
| push to `develop`    | `publish-dev`    | `x.y.z-dev.<run_number>`      | `dev`     | `dev`       |
| push to `release/**` | `publish-staging`| `x.y.z-rc.<run_number>`       | `staging` | `staging`   |
| push to `main`       | `publish-prod`   | `x.y.(z+1)` (or minor / major)| `latest`  | `prod`      |

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

## Local hooks (`husky`)

- **`.husky/pre-commit`** — runs `lint-staged` against staged `.ts/.tsx` files
  (`yarn format`, `yarn lint`, `jest --passWithNoTests`).
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

1. **Repo secrets**
   - `NPM_TOKEN` — npm automation token with publish access on the
     `@agrippa-io` scope.
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

## Cutting a release (operator runbook)

### Routine release

1. Open PRs against `develop`. Each PR push publishes a canary; QA can install
   `@agrippa-io/react-components@<canary-version>` to validate.
2. Merge to `develop`. The `dev` dist-tag is updated automatically.
3. When ready to stabilize, branch `release/x.y.0` from `develop`. Each push to
   that branch publishes a staging RC.
4. After staging soak, PR `release/x.y.0` → `main`. Merging triggers
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
