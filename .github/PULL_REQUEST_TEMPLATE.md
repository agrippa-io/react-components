## Summary

<!--
What does this PR change and why? Keep it short — the diff shows what,
this section explains why.
-->

## Base branch checklist

Pick the right base for the PR type (see RELEASE.md → Branch model):

- [ ] **Feature work** → base is `develop`
- [ ] **Release stabilization** → base is `release/<version>`
- [ ] **Hotfix** → base is `main` *and* a follow-up PR backports to `develop`
- [ ] **Release promotion** (`release/* → main`) — usually opened automatically
      by `yarn release-stage`

## Pre-merge checks

- [ ] CI passes (format, lint, unit + story tests, library build, storybook build)
- [ ] Story added or updated for any new/changed component (and renders
      cleanly in Storybook canvas)
- [ ] No deprecated `@storybook/react` imports (use `@storybook/react-vite`)
- [ ] Public API change? Bump conventional-commit prefix accordingly:
      `feat:` for minor, `feat!:` / `BREAKING CHANGE` for major

## Test plan

<!--
How did you validate this change? Include manual steps if applicable.
For a release-promotion PR, link the staging RC version that was validated.
-->

- [ ] ...
