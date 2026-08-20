#!/bin/sh
# Publishes every public workspace to npm, then tags and pushes the version
# just published for each one. Run from the repo root.
#
# Yarn 4 does not read ~/.npmrc, so the token is lifted out of it unless the
# environment already carries one (which is how CI supplies it). A 2FA code
# goes in as the first argument, for shells that cannot answer the prompt:
#
#   scripts/release.sh          # interactive terminal: yarn asks for the code
#   scripts/release.sh 123456   # anywhere else
set -e

if [ -z "$YARN_NPM_AUTH_TOKEN" ]; then
  YARN_NPM_AUTH_TOKEN=$(sed -n 's|^//registry.npmjs.org/:_authToken=||p' "$HOME/.npmrc" 2>/dev/null || true)
  export YARN_NPM_AUTH_TOKEN
fi

otp=${1:+--otp=$1}

yarn workspaces foreach -A --topological --no-private npm publish --tolerate-republish $otp

yarn workspaces foreach -A --no-private exec sh -c '
  tag="$npm_package_name@$npm_package_version"
  git tag "$tag" 2>/dev/null || true
  git push origin "$tag"
'
