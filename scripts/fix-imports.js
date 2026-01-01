#!/usr/bin/env node

/**
 * Script to convert relative imports to absolute imports
 * Run with: node scripts/fix-imports.js
 */
/* eslint-disable no-console -- console output is intentional in this utility script */
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

async function main() {
  // Find all JS/JSX files in src
  const files = await glob('**/*.{js,jsx}', {
    cwd: srcDir,
    absolute: true,
    ignore: ['**/node_modules/**'],
  })

  console.log(`Found ${files.length} files to process...\\n`)

  let totalChanges = 0

  files.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8')
    const originalContent = content
    const fileDir = path.dirname(filePath)

    // Replace relative imports with absolute imports
    const importRegex = /from\s+['"](\.\.[/\\].*?)['"]/g

    content = content.replace(importRegex, (match, importPath) => {
      // Remove quotes and clean the path
      const cleanPath = importPath.replace(/['"]/g, '')

      // Resolve the absolute path
      const absolutePath = path.join(fileDir, cleanPath)
      const relativeToSrc = path.relative(srcDir, absolutePath)

      // Convert to forward slashes and remove file extension
      let finalPath = relativeToSrc.split(path.sep).join('/')

      // Remove .jsx or .js extension if present, but keep .css
      finalPath = finalPath.replace(/\\.jsx?$/, '')

      return `from '${finalPath}'`
    })

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      const relPath = path.relative(process.cwd(), filePath)
      console.log(`✓ Updated: ${relPath}`)
      totalChanges++
    }
  })

  console.log(`\\n✨ Done! Updated ${totalChanges} files.`)
  console.log('\\nNow run: yarn lint:fix')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
/* eslint-enable no-console */
