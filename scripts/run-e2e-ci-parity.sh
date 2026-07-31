#!/usr/bin/env bash
# Run the full e2e suite locally the same way CI runs it, so failures show up
# before a push instead of after.
#
# CI runs on GitHub's `ubuntu-latest` (Ubuntu 24.04 / noble) with CI=1 (which sets
# playwright.config.ts's workers: 2; retries are 0 in all environments). Running
# `yarn test:e2e` directly on a Mac does NOT reproduce this: different OS, different
# Chromium build (font rendering, codec support), different worker count, and no
# network isolation.
#
# On a machine behind a corporate TLS-intercepting proxy (e.g. Intuit's), the container
# has no route to the proxy's root CA, so yarn/npm HTTPS calls fail with
# "unable to get local issuer certificate". Set CORP_CA_BUNDLE to a PEM file containing
# that root CA (export it with, e.g., `security find-certificate -a -p
# /Library/Keychains/System.keychain > ~/all-certs.pem`) and this script will install it
# into the container's trust store before running yarn.
#
# Apple Silicon: never run the Playwright image under linux/amd64 (QEMU). Emulated Chromium
# SIGBUSes constantly and Docker writes multi-hundred-MB `qemu_chrome-headless-shell*.core`
# files into this repo via the /work bind mount. Use native linux/arm64 and disable cores.
set -euo pipefail

log_step() { echo "[*] $*" >&2; }

PLATFORM_ARGS=()

resolve_paths() {
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  cd "$ROOT"
}

resolve_image() {
  PLAYWRIGHT_VERSION="$(node -e "console.log(require('./node_modules/@playwright/test/package.json').version)")"
  IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
}

resolve_platform() {
  PLATFORM_ARGS=()
  local host_arch="${1:-$(uname -m)}"
  if [ "$host_arch" = "arm64" ]; then
    PLATFORM_ARGS=(--platform linux/arm64)
    log_step "Apple Silicon: forcing linux/arm64 Playwright image (avoids QEMU core dumps)"
  fi
  if [ -n "${DOCKER_DEFAULT_PLATFORM:-}" ] && [ "$host_arch" = "arm64" ] && [ "${DOCKER_DEFAULT_PLATFORM}" = "linux/amd64" ]; then
    echo "Refusing to run: DOCKER_DEFAULT_PLATFORM=linux/amd64 on Apple Silicon emulates Chromium under QEMU and creates huge qemu_chrome-headless-shell*.core files in the repo." >&2
    echo "Unset DOCKER_DEFAULT_PLATFORM or run: CI=1 yarn test:e2e" >&2
    exit 1
  fi
}

cleanup_qemu_core_dumps() {
  local cores=( "$ROOT"/qemu_chrome-headless-shell*.core )
  if [ ! -e "${cores[0]}" ]; then
    return 0
  fi
  log_step "Removing stale QEMU Chromium core dump(s) from repo root"
  rm -f "$ROOT"/qemu_chrome-headless-shell*.core
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
  # -e CI=1 mirrors playwright.config.ts's CI-only worker count, same as GitHub Actions.
  # This repo uses yarn's node-modules linker, so `yarn install` writes real platform
  # binaries (e.g. @rollup/rollup-linux-x64-gnu) straight into node_modules. Without an
  # anonymous volume there, that install clobbers the host's Mac binaries and breaks
  # `yarn test`/`yarn start` on the host until a fresh `yarn install` is run there too.
  #
  # `${arr[@]+"${arr[@]}"}` expands to nothing when empty — plain `"${arr[@]}"` trips
  # `set -u` on macOS's Bash 3.2.
  #
  # Prefer the host's native arch. A global DOCKER_DEFAULT_PLATFORM=linux/amd64 on Apple
  # Silicon forces QEMU and routinely SIGBUS mid-suite (and writes GB of core dumps).
  unset DOCKER_DEFAULT_PLATFORM || true
  docker run --rm \
    ${PLATFORM_ARGS[@]+"${PLATFORM_ARGS[@]}"} \
    -v "${ROOT}:/work" \
    -v /work/node_modules \
    ${CA_MOUNT_ARGS[@]+"${CA_MOUNT_ARGS[@]}"} \
    ${CA_ENV_ARGS[@]+"${CA_ENV_ARGS[@]}"} \
    -w /work \
    -e CI=1 \
    "${IMAGE}" \
    /bin/bash -lc "
      ulimit -c 0
      ${CA_INSTALL_CMD}
      corepack enable
      yarn install --immutable
      yarn playwright test --config config/playwright.config.ts
    "
}

main() {
  log_step "Step 1/4: Resolving paths and Playwright version"
  resolve_paths
  cleanup_qemu_core_dumps
  resolve_image
  resolve_platform
  log_step "Running full e2e suite in ${IMAGE} (CI parity: CI=1, workers=2, retries=0)"

  log_step "Step 2/4: Preparing corporate CA bundle (if CORP_CA_BUNDLE is set)"
  build_corp_ca_args

  log_step "Step 3/4: Running suite"
  run_suite_in_container

  log_step "Step 4/4: Done. This should match the real CI run — if it's green here, it should be green in GitHub Actions."
}

main "$@"
