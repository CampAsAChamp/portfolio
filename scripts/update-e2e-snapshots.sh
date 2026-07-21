#!/usr/bin/env bash
# Update Linux Playwright visual baselines (what CI compares against).
# Darwin snapshot updates from local Mac runs will NOT fix CI failures.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PLAYWRIGHT_VERSION="$(node -e "console.log(require('./node_modules/@playwright/test/package.json').version)")"
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy"

echo "Updating Linux e2e snapshots with ${IMAGE}"

docker run --rm \
  -v "${ROOT}:/work" \
  -w /work \
  -e CI=1 \
  -e PW_UPDATE_LINUX_SNAPSHOTS=1 \
  "${IMAGE}" \
  /bin/bash -lc '
    corepack enable
    yarn install --immutable
    yarn playwright test \
      --update-snapshots \
      --project=chromium \
      --project="Mobile Chrome" \
      -g "visual regression"
  '
