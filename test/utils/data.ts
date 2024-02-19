/**
 * Convert a string to base64
 * @param data Data to convert
 */
export function stringToBase64(data: string): string {
  const encoded = Buffer.from(data).toString('base64')

  // remove = or == from the end
  return encoded.replace(/[=]*$/, '')
}

/**
 * Generates a random string of a specified length.
 * @param length - The length of the random string (default is 10).
 * @returns A random string.
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}
