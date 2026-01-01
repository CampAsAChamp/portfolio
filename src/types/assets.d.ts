/**
 * TypeScript Declaration File for Asset Imports
 *
 * This file provides type definitions for importing non-TypeScript assets in the project.
 * Without these declarations, TypeScript would throw errors when importing images, videos, and CSS files.
 *
 * What it does:
 * - Tells TypeScript that image/video file imports (SVG, PNG, WEBP, MP4, etc.) resolve to strings
 *   (representing the file path/URL that Vite generates during the build process)
 * - Tells TypeScript that CSS imports resolve to objects with string key-value pairs (for CSS modules)
 *
 * This allows us to safely import assets in components like:
 *   import logo from 'assets/S_Logo.svg'
 *   import profilePic from 'assets/Real_Profile_Pic.webp'
 *   import styles from 'styles/Component.css'
 */
declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.png" {
  const content: string
  export default content
}

declare module "*.jpg" {
  const content: string
  export default content
}

declare module "*.jpeg" {
  const content: string
  export default content
}

declare module "*.webp" {
  const content: string
  export default content
}

declare module "*.gif" {
  const content: string
  export default content
}

declare module "*.mp4" {
  const content: string
  export default content
}

declare module "*.webm" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: Record<string, string>
  export default content
}
