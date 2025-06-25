#!/usr/bin/env node
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-for-dev'
const JWT_USERS = process.env.JWT_USERS || 'test-user,testuser2'
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8787'

const userId = JWT_USERS.split(',')[0]
const token = jwt.sign({ id: userId }, JWT_SECRET, {
  algorithm: 'HS256',
  expiresIn: '1h'
})

// Sample terminal data - modify as needed
const terminalData = {
  bookmarks: [
    {
      title: 'My Server',
      host: 'example.com',
      port: 22,
      username: 'root'
    }
  ],
  lastUsed: new Date().toISOString()
}

async function createData () {
  try {
    const response = await fetch(`${SERVER_URL}/api/sync`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(terminalData)
    })

    if (response.ok) {
      console.log('✅ Successfully created/updated sync data')
      console.log('Response:', await response.text())
    } else {
      console.error('❌ Failed to create data:', response.status, response.statusText)
      console.error(await response.text())
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createData()
