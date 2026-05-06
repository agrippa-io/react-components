#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
  echo "Usage: yarn release-stage <version>" >&2
  echo "Example: yarn release-stage 0.1.0" >&2
  exit 1
fi

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be semver x.y.z (got: $VERSION)" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is required. Install: https://cli.github.com" >&2
  exit 1
fi

echo "Triggering release-stage workflow for version $VERSION..."
gh workflow run release-stage.yml --ref develop -f version="$VERSION"

echo
echo "Workflow dispatched. Watch the run with:"
echo "  gh run watch --workflow=release-stage.yml"
