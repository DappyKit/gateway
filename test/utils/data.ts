/**
 * Convert a string to base64
 * @param data Data to convert
 */
export function stringToBase64(data: string): string {
  const encoded = Buffer.from(data).toString('base64')

  // remove = or == from the end
  return encoded.replace(/[=]*$/, '')
}
