#!/bin/sh
# Publishes every public workspace to npm, then tags and pushes the version
# just published for each one. Run from the repo root.
set -e

yarn workspaces foreach -A --topological --no-private npm publish --tolerate-republish

yarn workspaces foreach -A --no-private exec sh -c '
  tag="$npm_package_name@$npm_package_version"
  git tag "$tag" 2>/dev/null || true
  git push origin "$tag"
'
