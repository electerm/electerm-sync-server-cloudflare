/**
 * JWT utility functions for authentication
 */
import { JWTPayload } from './types'
import * as jose from 'jose'

/**
 * Decodes a base64url encoded string to a Uint8Array
 * @param str - The base64url encoded string
 * @returns Decoded Uint8Array
 */
export function base64UrlDecode (str: string): Uint8Array {
  return jose.base64url.decode(str)
}

/**
 * Decodes a base64url encoded string to text
 * @param str - The base64url encoded string
 * @returns Decoded string
 */
export function base64UrlDecodeToString (str: string): string {
  return new TextDecoder().decode(base64UrlDecode(str))
}

/**
 * Parse JWT payload without verification
 * @param token - The JWT token
 * @returns The parsed JWT payload
 */
export function parseJwtPayload (token: string): JWTPayload {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  return jose.decodeJwt(token) as JWTPayload
}
