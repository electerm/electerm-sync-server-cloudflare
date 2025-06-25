/**
 * Authentication middleware for Electerm Sync Server
 */
import { ExtendedRequest, Env } from './types'
import { base64UrlDecode, parseJwtPayload } from './jwt'

/**
 * Verifies a JWT token from the request headers
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns A Response if authentication fails, otherwise null
 */
export const verifyJWT = async (request: ExtendedRequest, env: Env): Promise<Response | null> => {
  const authHeader = request.headers.get('authorization')
  if (authHeader === null || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized - Missing or invalid authorization header', { status: 401 })
  }

  const token = authHeader.substring(7)
  try {
    // Use Workers' built-in crypto to verify JWT
    const encoder = new TextEncoder()
    const data = encoder.encode(token.split('.').slice(0, 2).join('.'))
    const signature = token.split('.')[2]

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.JWT_SECRET ?? 'default-secret-for-dev'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlDecode(signature),
      data
    )

    if (!verified) {
      return new Response('Unauthorized - Invalid token', { status: 401 })
    }

    // Parse the payload
    const payload = parseJwtPayload(token)

    // Check user
    const users = (env.JWT_USERS ?? 'test-user,testuser2').split(',')
    if (!users.includes(payload.id)) {
      return new Response('Unauthorized - Invalid user', { status: 401 })
    }

    // Add user ID to request for later use
    request.userId = payload.id
    return null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(`Unauthorized - Token verification failed: ${errorMessage}`, { status: 401 })
  }
}

/**
 * Authentication middleware wrapper
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns A Response if authentication fails, otherwise null
 */
export async function authenticate (request: ExtendedRequest, env: Env): Promise<Response | null> {
  return await verifyJWT(request, env)
}
