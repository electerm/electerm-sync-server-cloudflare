/**
 * Router configuration for Electerm Sync Server
 */
import { AutoRouter } from 'itty-router'
import { handleGetSync, handlePutSync, handlePostSync } from './handler'

// Create a new router
const router = AutoRouter()

router
  .get('/test', (): Response => new Response('ok'))
  .get('/api/sync', handleGetSync)
  .put('/api/sync', handlePutSync)
  .post('/api/sync', handlePostSync)
  .all('*', (): Response => {
    console.log('Not Found333')
    return new Response('Not Found', { status: 404 })
  })

export default router
