# Electerm Sync Server - Cloudflare Workers + D1

[English](./README.md) | [中文](./README_CN.md)

A Cloudflare Workers implementation of the electerm sync server using D1 as the database backend. This provides a lightweight, scalable, and serverless alternative to the Node.js implementation.

## Features

- **Serverless Architecture**: Runs on Cloudflare's global edge network
- **D1 Database**: SQLite-compatible database that's distributed across Cloudflare's network
- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **Simple API**: Compatible with electerm's sync protocol

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- A Cloudflare account with Workers and D1 enabled

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/electerm-sync-cloudflare.git
cd electerm-sync-cloudflare
npm install
npm i -g wrangler
```

### 2. Create a D1 Database

```bash
wrangler d1 create electerm_sync_db
```

Take note of the database ID that appears in the output. You'll need to update this in your `wrangler.toml` file.

### 3. Apply the Database Schema

```bash
wrangler d1 execute electerm_sync_db --file=./bin/schema.sql
wrangler d1 execute electerm_sync_db --file=./bin/schema.sql --remote
```

### 4. Configure Environment Variables

Edit the `wrangler.toml` file and update the following:

- `YOUR_D1_DATABASE_ID`: Replace with the database ID you received when creating the D1 database

### 5. Deploy the Worker

```bash
npm run deploy
```

**Then need in cloudflare worker setting to set JWT_SECRET and JWT_USERS (user1,user2...)**

## API Endpoints

The server provides the following API endpoints:

- `GET /test`: Basic health check endpoint
- `GET /api/sync`: Retrieve user data (requires JWT authentication)
- `PUT /api/sync`: Update user data (requires JWT authentication)
- `POST /api/sync`: Test authentication (requires JWT authentication)

## Authentication

This service uses JWT (JSON Web Tokens) for authentication. All `/api/sync` endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The JWT token should contain an `id` claim that matches one of the allowed user IDs specified in the `JWT_USERS` environment variable.

## Local Development

To run the server locally for development:

```bash
npm run dev
```

# Local test

```bash
npm run test
```

## Usage with Electerm

In Electerm, configure the sync feature to use your deployed Cloudflare worker URL:

1. Go to Settings > Sync -> Custom
2. Enter the following settings:
   - Sync server: Your Cloudflare worker URL (e.g., `https://your-subdomain.workers.dev/api/async`)
   - JWT secret: the JWT_SECRET secret for authentication which configured in cloudflare worker setting
   - User ID: one of the JWT_USERS secret which configured in cloudflare worker setting

## Sync server in other languages

[https://github.com/electerm/electerm/wiki/Custom-sync-server](https://github.com/electerm/electerm/wiki/Custom-sync-server)

## License

MIT