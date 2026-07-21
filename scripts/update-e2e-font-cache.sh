#!/usr/bin/env bash
# Refresh the cached Nunito font files that Playwright serves instead of the live
# fonts.googleapis.com/fonts.gstatic.com network. Run this after changing the Nunito
# <link> in index.html (new weights/styles) so the cache stays in sync.
#
# Steps:
#   1. Fetch the Google Fonts CSS with a desktop Chrome UA (matches what Playwright's
#      Chromium projects request, so we cache the same font format Google serves them).
#   2. Extract every fonts.gstatic.com URL referenced by that CSS.
#   3. Download each referenced font file into the cache directory.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="${ROOT}/tests/e2e/fixtures/font-cache"
CHROME_UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

log_step() { echo "[*] $*" >&2; }

get_css_url() {
  grep -o 'https://fonts\.googleapis\.com/css2[^"'"'"')]*' "${ROOT}/index.html" | head -1
}

fetch_css() {
  local css_url="$1"
  log_step "Fetching Nunito CSS from ${css_url}"
  curl -sf "${css_url}" -H "User-Agent: ${CHROME_UA}" -o "${CACHE_DIR}/nunito.css"
}

fetch_font_files() {
  log_step "Downloading referenced font files"
  local url
  grep -o 'https://fonts\.gstatic\.com/[^)]*' "${CACHE_DIR}/nunito.css" | sort -u | while read -r url; do
    local file_name
    file_name="$(basename "${url}")"
    log_step "  ${file_name}"
    curl -sf "${url}" -o "${CACHE_DIR}/${file_name}"
  done
}

main() {
  mkdir -p "${CACHE_DIR}"

  local css_url
  css_url="$(get_css_url)"
  if [ -z "${css_url}" ]; then
    echo "[!] Could not find a fonts.googleapis.com/css2 URL in index.html" >&2
    exit 1
  fi

  # Step 1: CSS (declares which font files exist and their formats)
  fetch_css "${css_url}"

  # Step 2/3: extract + download the font binaries the CSS references
  fetch_font_files

  log_step "Done. Cached files:"
  ls -la "${CACHE_DIR}"
}

main "$@"
