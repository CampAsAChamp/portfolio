#!/usr/bin/env node

/**
 * Check Node.js version before running tests
 * This script ensures tests don't hang when run with an incompatible Node version
 */

const nodeVersion = process.versions.node
const majorVersion = parseInt(nodeVersion.split('.')[0], 10)
const REQUIRED_NODE_VERSION = 22

if (majorVersion < REQUIRED_NODE_VERSION) {
  console.error('\n❌ ERROR: Incompatible Node.js version detected\n')
  console.error(`  Current version: v${nodeVersion}`)
  console.error(`  Required version: >=${REQUIRED_NODE_VERSION}.0.0\n`)
  console.error('This project requires Node.js 22 or higher due to:')
  console.error('  - jsdom 27.4.0 (requires Node 22+)')
  console.error('  - Vitest 4.x and other modern dependencies\n')
  console.error('To fix this issue:')
  console.error('  1. Run: nvm use    (uses version from .nvmrc file)')
  console.error('  2. Or: nvm install 22 && nvm use 22\n')
  console.error('⚠️  Note: Running tests with Node 18 causes them to hang indefinitely.\n')
  process.exit(1)
}

// If version check passes, continue silently
