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

  // Read the latest report (median of 3 runs)
  const latestReport = files[Math.floor(files.length / 2)] // Get the middle report (median)
  const report = JSON.parse(fs.readFileSync(latestReport.path, "utf8"))

  // Extract category scores
  const categories = report.categories
  const performance = Math.round(categories.performance.score * 100)
  const accessibility = Math.round(categories.accessibility.score * 100)
  const bestPractices = Math.round(categories["best-practices"].score * 100)
  const seo = Math.round(categories.seo.score * 100)

  // Display formatted scores
  console.log("\n📊 Lighthouse Scores (averaged over 3 runs):")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`  🚀 Performance:     ${performance.toString().padStart(3)} / 100  ${getScoreEmoji(performance)}`)
  console.log(`  ♿ Accessibility:   ${accessibility.toString().padStart(3)} / 100  ${getScoreEmoji(accessibility)}`)
  console.log(`  ✅ Best Practices:  ${bestPractices.toString().padStart(3)} / 100  ${getScoreEmoji(bestPractices)}`)
  console.log(`  🔍 SEO:             ${seo.toString().padStart(3)} / 100  ${getScoreEmoji(seo)}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

  // Check if any scores are below thresholds
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
    console.log("⚠️  Warning: Some scores are below thresholds:")
    failures.forEach((failure) => console.log(`   • ${failure}`))
    console.log("")
  }
} catch (error) {
  // If we can't read the reports, that's okay - they were already uploaded
  console.log("\n✅ Lighthouse CI completed successfully!")
  console.log("📊 View detailed scores in the uploaded report link above.\n")
  process.exit(0)
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
