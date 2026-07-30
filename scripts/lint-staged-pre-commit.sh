#!/usr/bin/env bash
# Wrapper for lint-staged that cleans up orphaned backup stashes when formatters
# normalize away all staged changes. lint-staged prevents empty commits but, due to
# a GitError flag, skips dropping its backup stash in that case.
set -uo pipefail

node scripts/check-node-version.mjs

output=$(yarn lint-staged 2>&1) && exit_code=0 || exit_code=$?
printf '%s\n' "$output"

if [ "$exit_code" -eq 0 ]; then
  exit 0
fi

if printf '%s\n' "$output" | grep -q 'Prevented an empty git commit'; then
  stash_ref=$(git stash list | grep 'lint-staged automatic backup' | head -1 | cut -d: -f1)
  if [ -n "$stash_ref" ]; then
    if git stash drop "$stash_ref" 2>/dev/null; then
      echo ""
      echo "pre-commit: Staged changes were already formatted correctly — nothing to commit."
      echo "pre-commit: Removed orphaned lint-staged backup stash."
    fi
  fi
fi

exit "$exit_code"
