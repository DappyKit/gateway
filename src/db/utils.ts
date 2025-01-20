/**
 * Extracts the networks from a JSON string
 * @param json JSON string
 * @returns Networks array
 */
export function extractJsonNetworks(json: string): string[] {
  try {
    const data = JSON.parse(json)

    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}
