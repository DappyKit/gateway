import { OAuth2Client, TokenPayload } from 'google-auth-library'

/**
 * Verify Google token
 * @param clientId Client id
 * @param token Token
 */
export async function verifyGoogleToken(clientId: string, token: string): Promise<TokenPayload> {
  if (!clientId) {
    throw new Error('Client id is empty')
  }

  if (!token) {
    throw new Error('Token is empty')
  }

  const client = new OAuth2Client(clientId)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  })
  const payload = ticket.getPayload()

  if (!payload) {
    throw new Error('Payload is empty')
  }

  if (!(payload.azp === clientId && payload.aud === clientId)) {
    throw new Error('Token is not intended for this client')
  }

  return payload
}
