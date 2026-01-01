import { technologiesMap } from "data/technologies"
import { Technology } from "types/technology.types"

/**
 * Maps technology names to their full Technology objects from the technologies map.
 * Filters out any names not found in the map.
 *
 * @param technologyNames - Array of technology name strings to look up
 * @returns Array of Technology objects, excluding any undefined entries
 */
export function getTechnologies(technologyNames: string[]): Technology[] {
  return technologyNames.map((name) => technologiesMap.get(name)).filter((tech): tech is Technology => tech !== undefined)
}
