#!/usr/bin/env node
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { readFile } from 'fs/promises'
import path from 'path'

// Load config from wrangler.jsonc
const configPath = path.join(process.cwd(), 'wrangler.jsonc')
const configContent = await readFile(configPath, 'utf-8')
const config = JSON.parse(
  configContent
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
)

const JWT_SECRET = config.vars?.JWT_SECRET || 'default-secret'
const JWT_USERS = config.vars?.JWT_USERS || 'test-user'
const SERVER_URL = 'http://localhost:8787'

const userId = JWT_USERS.split(',')[0]
const token = jwt.sign({ id: userId }, JWT_SECRET, {
  algorithm: 'HS256',
  expiresIn: '1h'
})

async function getData () {
  try {
    const response = await fetch(`${SERVER_URL}/api/sync`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Successfully retrieved sync data:')
      console.log(JSON.stringify(data, null, 2))
    } else {
      console.error('❌ Failed to get data:', response.status, response.statusText)
      console.error(await response.text())
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

getData()
