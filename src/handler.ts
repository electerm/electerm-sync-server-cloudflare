/**
 * Handlers for the sync API endpoints
 */
import { ExtendedRequest, Env } from './types'
import { authenticate } from './auth'
import { D1PreparedStatement } from '@cloudflare/workers-types'

/**
 * Handles GET requests to retrieve user data
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns A Response with the user data or an error
 */
export async function handleGetSync (request: ExtendedRequest, env: Env): Promise<Response> {
  const authResult = await authenticate(request, env)
  if (authResult != null) return authResult

  try {
    const userId = request.userId as string
    const stmt: D1PreparedStatement = env.DB.prepare(
      'SELECT data FROM sync_data WHERE id = ?'
    ).bind(userId)
    const result = await stmt.first<{ data: string }>()

    if (result == null) {
      // Return empty JSON if no data exists
      return new Response(JSON.stringify({}), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(result.data, {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(`Error reading data: ${errorMessage}`, { status: 500 })
  }
}

/**
 * Handles PUT requests to update user data
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns A Response indicating success or failure
 */
export async function handlePutSync (request: ExtendedRequest, env: Env): Promise<Response> {
  const authResult = await authenticate(request, env)
  if (authResult != null) return authResult

  try {
    const userId = request.userId as string
    const data = await request.json()
    const jsonData = JSON.stringify(data)

    // Check if user exists first
    const existingUser = await env.DB.prepare(
      'SELECT 1 FROM sync_data WHERE id = ?'
    ).bind(userId).first<{ '1': number }>()

    if (existingUser != null) {
      // Update existing user data
      await env.DB.prepare(
        'UPDATE sync_data SET data = ?, updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(jsonData, userId).run()
    } else {
      // Insert new user data
      await env.DB.prepare(
        `INSERT INTO sync_data (id, data, created_at, updated_at) 
         VALUES (?, ?, datetime('now'), datetime('now'))`
      ).bind(userId, jsonData).run()
    }

    return new Response('ok')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(`Error writing data: ${errorMessage}`, { status: 500 })
  }
}

/**
 * Handles POST requests for testing
 * @param request - The incoming request
 * @param env - Environment variables
 * @returns A Response for the test endpoint
 */
export async function handlePostSync (request: ExtendedRequest, env: Env): Promise<Response> {
  const authResult = await authenticate(request, env)
  if (authResult != null) return authResult

  return new Response('test ok')
}
