#!/usr/bin/env node
/**
 * Pre-commit wrapper for lint-staged.
 *
 * 1. Verify Node version
 * 2. Run lint-staged with TTY-attached output (colors + progress)
 * 3. On empty-commit prevention, drop orphaned backup stash lint-staged leaves behind
 */
import { execSync, spawnSync } from 'node:child_process';
import lintStaged from 'lint-staged';

const LINT_STAGED_STASH = 'lint-staged automatic backup';
const EMPTY_COMMIT_MESSAGE = 'prevented an empty git commit';

let preventedEmptyCommit = false;

/** @type {import('lint-staged').Logger} */
const logger = {
  log(message, ...args) {
    console.log(message, ...args);
  },
  warn(message, ...args) {
    const text = String(message).replace(/\u001B\[[0-9;]*m/g, '');
    if (text.toLowerCase().includes(EMPTY_COMMIT_MESSAGE)) {
      preventedEmptyCommit = true;
    }
    console.warn(message, ...args);
  },
  error(message, ...args) {
    console.error(message, ...args);
  },
  debug(message, ...args) {
    console.debug(message, ...args);
  },
};

function getLintStagedBackupStash() {
  const stashList = execSync('git stash list', { encoding: 'utf8' });
  const line = stashList
    .split('\n')
    .find((entry) => entry.includes(LINT_STAGED_STASH));

  if (!line) {
    return null;
  }

  return line.slice(0, line.indexOf(':'));
}

function dropOrphanedBackupStash() {
  const stashRef = getLintStagedBackupStash();

  if (!stashRef) {
    return;
  }

  try {
    execSync(`git stash drop ${stashRef}`, { stdio: 'ignore' });
    console.log('');
    console.log(
      'pre-commit: Staged changes were already formatted correctly — nothing to commit.',
    );
    console.log('pre-commit: Removed orphaned lint-staged backup stash.');
  } catch {
    // Leave stash in place if cleanup fails.
  }
}

const nodeCheck = spawnSync('node', ['scripts/check-node-version.mjs'], {
  stdio: 'inherit',
});

if (nodeCheck.status !== 0) {
  process.exit(nodeCheck.status ?? 1);
}

const success = await lintStaged({}, logger);

if (!success) {
  if (preventedEmptyCommit) {
    dropOrphanedBackupStash();
  }
  process.exit(1);
}
