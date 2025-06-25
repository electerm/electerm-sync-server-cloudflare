/**
 * Electerm Sync Server - Cloudflare Workers Version
 * Entry point file
 */
import { ExecutionContext } from '@cloudflare/workers-types'
import router from './routes'
import { Env } from './types'

// Main event handler
export default {
  async fetch (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return await router.fetch(request, env, ctx)
  }
}
