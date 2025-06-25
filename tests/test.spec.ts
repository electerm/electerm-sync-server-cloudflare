// tests/e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

// Server management
let wranglerProcess: ReturnType<typeof spawn>
let serverUrl: string

// Test data
let validUserId: string
const invalidUserId = 'invalid-user'
let validToken: string
let invalidToken: string
const testData = { test: 'data' }

beforeAll(async () => {
  const JWT_SECRET = 'default-secret-for-dev'
  const JWT_USERS = 'test-user,testuser2'

  // Setup test data
  validUserId = JWT_USERS.split(',')[0]
  validToken = jwt.sign({ id: validUserId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
  invalidToken = jwt.sign({ id: invalidUserId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })

  // Start Wrangler dev server
  serverUrl = 'http://localhost:8787'
  wranglerProcess = spawn('wrangler', ['dev', '--port', '8787'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      JWT_SECRET,
      JWT_USERS
    }
  })

  // Wait for server to start (simple delay - in real world, poll health endpoint)
  await new Promise(resolve => setTimeout(resolve, 3000))
}, 10000) // Increased timeout for server startup

afterAll(() => {
  if (wranglerProcess !== null) {
    wranglerProcess.kill()
  }
})

describe('API Endpoints', () => {
  describe('GET /test', () => {
    it('should return 200 OK', async () => {
      const response = await fetch(`${serverUrl}/test`)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('ok')
    })
  })

  describe('PUT /api/sync', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'PUT',
        body: JSON.stringify(testData),
        headers: { 'Content-Type': 'application/json' }
      })
      expect(response.status).toBe(401)
    })

    it('should return 401 with invalid token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'PUT',
        body: JSON.stringify(testData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${invalidToken}`
        }
      })
      expect(response.status).toBe(401)
    })

    it('should return 200 with valid token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'PUT',
        body: JSON.stringify(testData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`
        }
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('ok')
    })
  })

  describe('POST /api/sync', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'POST'
      })
      expect(response.status).toBe(401)
    })

    it('should return 401 with invalid token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${invalidToken}`
        }
      })
      expect(response.status).toBe(401)
    })

    it('should return 200 with valid token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validToken}`
        }
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test ok')
    })
  })

  describe('GET /api/sync', () => {
    it('should return 401 without token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`)
      expect(response.status).toBe(401)
    })

    it('should return 401 with invalid token', async () => {
      const response = await fetch(`${serverUrl}/api/sync`, {
        headers: {
          Authorization: `Bearer ${invalidToken}`
        }
      })
      expect(response.status).toBe(401)
    })

    it('should return previously stored data with valid token', async () => {
      // First store some data
      await fetch(`${serverUrl}/api/sync`, {
        method: 'PUT',
        body: JSON.stringify(testData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`
        }
      })

      // Then retrieve it
      const response = await fetch(`${serverUrl}/api/sync`, {
        headers: {
          Authorization: `Bearer ${validToken}`
        }
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual(testData)
    })
  })
})
