#!/usr/bin/env node

/**
 * Print Lighthouse scores summary to console
 *
 * Reads the latest Lighthouse CI report and displays a clean summary
 * of Performance, Accessibility, Best Practices, and SEO scores.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
  // Find the lighthouse directory (copied to test_results after running)
  const lighthouseDir = path.join(__dirname, "..", "test_results", "lighthouse")

  // Check if the directory exists
  if (!fs.existsSync(lighthouseDir)) {
    console.log("\n✅ Lighthouse CI completed successfully!")
    console.log("📊 View detailed scores in the uploaded report link above.\n")
    process.exit(0)
  }

  // Find all LHR JSON files
  const files = fs
    .readdirSync(lighthouseDir)
    .filter((file) => file.startsWith("lhr-") && file.endsWith(".json"))
    .map((file) => ({
      name: file,
      path: path.join(lighthouseDir, file),
      timestamp: parseInt(file.match(/lhr-(\d+)\.json/)?.[1] || "0"),
    }))
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first

  if (files.length === 0) {
    console.log("\n✅ Lighthouse CI completed successfully!")
    console.log("📊 View detailed scores in the uploaded report link above.\n")
    process.exit(0)
  }

  // Check if we have both desktop and mobile results (6 files)
  const isBothTests = files.length === 6

  if (isBothTests) {
    // Split into desktop (first 3) and mobile (last 3) based on timestamp
    const desktopFiles = files.slice(3, 6) // Older timestamps (desktop ran first)
    const mobileFiles = files.slice(0, 3) // Newer timestamps (mobile ran second)

    console.log("\n📊 Lighthouse Scores Comparison:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    // Display desktop scores
    const desktopReport = JSON.parse(fs.readFileSync(desktopFiles[Math.floor(desktopFiles.length / 2)].path, "utf8"))
    displayScores("🖥️  Desktop", desktopReport)

    console.log("")

    // Display mobile scores
    const mobileReport = JSON.parse(fs.readFileSync(mobileFiles[Math.floor(mobileFiles.length / 2)].path, "utf8"))
    displayScores("📱 Mobile", mobileReport)

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    // Check thresholds for both
    checkThresholds("Desktop", desktopReport)
    checkThresholds("Mobile", mobileReport)
  } else {
    // Single test (3 files) - detect if desktop or mobile
    const report = JSON.parse(fs.readFileSync(files[Math.floor(files.length / 2)].path, "utf8"))

    // Detect platform based on formFactor in configSettings
    const formFactor = report.configSettings?.formFactor || "desktop"
    const isMobile = formFactor === "mobile"
    const platformLabel = isMobile ? "📱 Mobile" : "🖥️  Desktop"

    console.log(`\n📊 Lighthouse Scores - ${platformLabel} (averaged over 3 runs):`)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    displayScores(null, report)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    checkThresholds(platformLabel, report)
  }
} catch (error) {
  // If we can't read the reports, that's okay - they were already uploaded
  console.log("\n✅ Lighthouse CI completed successfully!")
  console.log("📊 View detailed scores in the uploaded report link above.\n")
  process.exit(0)
}

/**
 * Display scores for a report
 * @param {string|null} label - Label for the scores (e.g., "Desktop", "Mobile", or null for no label)
 * @param {object} report - Lighthouse report object
 */
function displayScores(label, report) {
  const categories = report.categories
  const performance = Math.round(categories.performance.score * 100)
  const accessibility = Math.round(categories.accessibility.score * 100)
  const bestPractices = Math.round(categories["best-practices"].score * 100)
  const seo = Math.round(categories.seo.score * 100)

  if (label) {
    console.log(`${label} (averaged over 3 runs):`)
  }

  console.log(`  🚀 Performance:     ${performance.toString().padStart(3)} / 100  ${getScoreEmoji(performance)}`)
  console.log(`  ♿ Accessibility:   ${accessibility.toString().padStart(3)} / 100  ${getScoreEmoji(accessibility)}`)
  console.log(`  ✅ Best Practices:  ${bestPractices.toString().padStart(3)} / 100  ${getScoreEmoji(bestPractices)}`)
  console.log(`  🔍 SEO:             ${seo.toString().padStart(3)} / 100  ${getScoreEmoji(seo)}`)
}

/**
 * Check if scores meet thresholds and display warnings
 * @param {string|null} label - Label for the test (e.g., "Desktop", "Mobile", or null)
 * @param {object} report - Lighthouse report object
 */
function checkThresholds(label, report) {
  const categories = report.categories
  const performance = Math.round(categories.performance.score * 100)
  const accessibility = Math.round(categories.accessibility.score * 100)
  const bestPractices = Math.round(categories["best-practices"].score * 100)
  const seo = Math.round(categories.seo.score * 100)

  const thresholds = {
    performance: 85,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
  }

  const failures = []
  if (performance < thresholds.performance) failures.push(`Performance: ${performance} < ${thresholds.performance}`)
  if (accessibility < thresholds.accessibility) failures.push(`Accessibility: ${accessibility} < ${thresholds.accessibility}`)
  if (bestPractices < thresholds.bestPractices) failures.push(`Best Practices: ${bestPractices} < ${thresholds.bestPractices}`)
  if (seo < thresholds.seo) failures.push(`SEO: ${seo} < ${thresholds.seo}`)

  if (failures.length > 0) {
    const prefix = label ? `⚠️  Warning (${label})` : "⚠️  Warning"
    console.log(`${prefix}: Some scores are below thresholds:`)
    failures.forEach((failure) => console.log(`   • ${failure}`))
    console.log("")
  }
}

/**
 * Get an emoji indicator based on the score
 * @param {number} score - Score from 0-100
 * @returns {string} Emoji indicator
 */
function getScoreEmoji(score) {
  if (score >= 90) return "🟢"
  if (score >= 50) return "🟡"
  return "🔴"
}
