/**
 * Checks if the given ISO time is within the specified number of minutes.
 * @param isoTime The ISO time to check.
 * @param maxMinutes The maximum number of minutes.
 */
export function isWithinMaxMinutes(isoTime: string, maxMinutes: number): boolean {
  const passedTime = new Date(isoTime).getTime()
  const currentTime = new Date().getTime()
  const maxTimeDifference = maxMinutes * 60 * 1000
  const timeDifference = currentTime - passedTime

  return timeDifference >= 0 && timeDifference <= maxTimeDifference
}
