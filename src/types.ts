/**
 * Type definitions for Electerm Sync Server
 */
import { D1Database } from '@cloudflare/workers-types'

// Extend the Request interface to include userId
export interface ExtendedRequest extends Request {
  userId?: string
}

// Environment variables
export interface Env {
  JWT_SECRET: string | undefined
  JWT_USERS: string | undefined
  DB: D1Database
}

// User data structure
export interface UserData {
  [key: string]: any
}

// JWT Payload interface
export interface JWTPayload {
  id: string
  [key: string]: any
}

// Database query result
export interface DbQueryResult {
  [key: string]: any
}
