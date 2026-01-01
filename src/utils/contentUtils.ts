// Utility functions for creating structured content
import { Link } from "types/content.types"

export function createLink(text: string, href: string, options?: { target?: string; rel?: string }): Link {
  return {
    text,
    href,
    ...options,
  }
}

export function createExternalLink(text: string, href: string): Link {
  return createLink(text, href, { target: "_blank", rel: "noopener noreferrer" })
}
