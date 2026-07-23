#!/usr/bin/env bash
# Run the full e2e suite locally the same way CI runs it, so failures show up
# before a push instead of after.
#
# CI runs on GitHub's `ubuntu-latest` (Ubuntu 24.04 / noble) with CI=1 (which sets
# playwright.config.ts's retries: 2, workers: 2). Running `yarn test:e2e` directly on a
# Mac does NOT reproduce this: different OS, different Chromium build (font rendering,
# codec support), different retry/worker config, and no network isolation.
#
# On a machine behind a corporate TLS-intercepting proxy (e.g. Intuit's), the container
# has no route to the proxy's root CA, so yarn/npm HTTPS calls fail with
# "unable to get local issuer certificate". Set CORP_CA_BUNDLE to a PEM file containing
# that root CA (export it with, e.g., `security find-certificate -a -p
# /Library/Keychains/System.keychain > ~/all-certs.pem`) and this script will install it
# into the container's trust store before running yarn.
set -euo pipefail

log_step() { echo "[*] $*" >&2; }

resolve_paths() {
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  cd "$ROOT"
}

resolve_image() {
  PLAYWRIGHT_VERSION="$(node -e "console.log(require('./node_modules/@playwright/test/package.json').version)")"
  IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
}

build_corp_ca_args() {
  CA_MOUNT_ARGS=()
  CA_INSTALL_CMD=""
  CA_ENV_ARGS=()
  if [ -n "${CORP_CA_BUNDLE:-}" ]; then
    if [ ! -f "${CORP_CA_BUNDLE}" ]; then
      echo "CORP_CA_BUNDLE is set but not a file: ${CORP_CA_BUNDLE}" >&2
      exit 1
    fi
    log_step "Installing corporate CA bundle from ${CORP_CA_BUNDLE} into the container"
    CA_MOUNT_ARGS=(-v "${CORP_CA_BUNDLE}:/usr/local/share/ca-certificates/corp-ca-bundle.crt:ro")
    CA_INSTALL_CMD="update-ca-certificates"
    # Node ships its own root store and ignores the system one — point it at the same
    # bundle explicitly so corepack/yarn/npm's HTTPS calls trust the corp proxy's CA too.
    CA_ENV_ARGS=(-e "NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/corp-ca-bundle.crt")
  fi
}

run_suite_in_container() {
  # -e CI=1 mirrors playwright.config.ts's CI-only retries/workers, same as GitHub Actions.
  # This repo uses yarn's node-modules linker, so `yarn install` writes real platform
  # binaries (e.g. @rollup/rollup-linux-x64-gnu) straight into node_modules. Without an
  # anonymous volume there, that install clobbers the host's Mac binaries and breaks
  # `yarn test`/`yarn start` on the host until a fresh `yarn install` is run there too.
  #
  # `${arr[@]+"${arr[@]}"}` expands to nothing when empty — plain `"${arr[@]}"` trips
  # `set -u` on macOS's Bash 3.2.
  #
  # Prefer the host's native arch. A global DOCKER_DEFAULT_PLATFORM=linux/amd64 on Apple
  # Silicon forces QEMU and routinely SIGBUS mid-suite.
  unset DOCKER_DEFAULT_PLATFORM || true
  docker run --rm \
    -v "${ROOT}:/work" \
    -v /work/node_modules \
    ${CA_MOUNT_ARGS[@]+"${CA_MOUNT_ARGS[@]}"} \
    ${CA_ENV_ARGS[@]+"${CA_ENV_ARGS[@]}"} \
    -w /work \
    -e CI=1 \
    "${IMAGE}" \
    /bin/bash -lc "
      ${CA_INSTALL_CMD}
      corepack enable
      yarn install --immutable
      yarn playwright test
    "
}

main() {
  log_step "Step 1/3: Resolving paths and Playwright version"
  resolve_paths
  resolve_image
  log_step "Running full e2e suite in ${IMAGE} (CI parity: CI=1, retries=2, workers=2)"

  log_step "Step 2/3: Preparing corporate CA bundle (if CORP_CA_BUNDLE is set)"
  build_corp_ca_args

  log_step "Step 3/3: Running suite"
  run_suite_in_container

  log_step "Done. This should match the real CI run — if it's green here, it should be green in GitHub Actions."
}

main "$@"
