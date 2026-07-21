#!/usr/bin/env bash
# Update Linux Playwright visual baselines (what CI compares against).
# Darwin snapshot updates from local Mac runs will NOT fix CI failures.
#
# On a machine behind a corporate TLS-intercepting proxy (e.g. Intuit's), the container
# has no route to the proxy's root CA, so yarn/npm HTTPS calls fail with
# "unable to get local issuer certificate". Set CORP_CA_BUNDLE to a PEM file containing
# that root CA (export it with, e.g., `security find-certificate -a -p
# /Library/Keychains/System.keychain > ~/all-certs.pem`) and this script will install it
# into the container's trust store before running yarn.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PLAYWRIGHT_VERSION="$(node -e "console.log(require('./node_modules/@playwright/test/package.json').version)")"
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy"

echo "Updating Linux e2e snapshots with ${IMAGE}"

CA_MOUNT_ARGS=()
CA_INSTALL_CMD=""
CA_ENV_ARGS=()
if [ -n "${CORP_CA_BUNDLE:-}" ]; then
  if [ ! -f "${CORP_CA_BUNDLE}" ]; then
    echo "CORP_CA_BUNDLE is set but not a file: ${CORP_CA_BUNDLE}" >&2
    exit 1
  fi
  echo "Installing corporate CA bundle from ${CORP_CA_BUNDLE} into the container"
  CA_MOUNT_ARGS=(-v "${CORP_CA_BUNDLE}:/usr/local/share/ca-certificates/corp-ca-bundle.crt:ro")
  CA_INSTALL_CMD="update-ca-certificates"
  # Node ships its own root store and ignores the system one — point it at the same
  # bundle explicitly so corepack/yarn/npm's HTTPS calls trust the corp proxy's CA too.
  CA_ENV_ARGS=(-e "NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/corp-ca-bundle.crt")
fi

docker run --rm \
  -v "${ROOT}:/work" \
  "${CA_MOUNT_ARGS[@]}" \
  "${CA_ENV_ARGS[@]}" \
  -w /work \
  -e CI=1 \
  -e PW_UPDATE_LINUX_SNAPSHOTS=1 \
  "${IMAGE}" \
  /bin/bash -lc "
    ${CA_INSTALL_CMD}
    corepack enable
    yarn install --immutable
    yarn playwright test \
      --update-snapshots \
      --project=chromium \
      --project=\"Mobile Chrome\" \
      -g \"visual regression\"
  "
