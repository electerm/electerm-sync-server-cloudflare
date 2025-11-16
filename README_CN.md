# Electerm 同步服务器 - Cloudflare Workers + D1

[English](./README.md) | [中文](./README_CN.md)

这是一个基于 Cloudflare Workers 的 Electerm 同步服务器实现，使用 D1 作为数据库后端。它为 Node.js 实现提供了一个轻量、可扩展的无服务器替代方案。

## 功能

- **Serverless 架构**：运行在 Cloudflare 的全球边缘网络
- **D1 数据库**：兼容 SQLite 的数据库，分布在 Cloudflare 网络中
- **JWT 身份验证**：使用 JSON Web Tokens 进行安全身份验证
- **简单的 API**：与 electerm 的同步协议兼容

## 先决条件

- [Node.js](https://nodejs.org/)（v20 或更高）
- 拥有启用 Workers 和 D1 的 Cloudflare 账户

## 安装与配置

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/electerm-sync-cloudflare.git
cd electerm-sync-cloudflare
npm install
npm i -g wrangler
```

### 2. 创建 D1 数据库

```bash
wrangler d1 create electerm_sync_db
```

记录输出中的数据库 ID，并在 `wrangler.toml` 中更新该 ID。

### 3. 应用数据库 Schema

```bash
wrangler d1 execute electerm_sync_db --file=./bin/schema.sql
wrangler d1 execute electerm_sync_db --file=./bin/schema.sql --remote
```

### 4. 配置环境变量

编辑 `wrangler.toml` 文件并更新以下项：

- `YOUR_D1_DATABASE_ID`：用创建 D1 时得到的数据库 ID 替换它

另外在 Cloudflare Worker 设置中配置 `JWT_SECRET` 与 `JWT_USERS`。

### 5. 部署 Worker

```bash
npm run deploy
```

> 在 Cloudflare Worker 设置中还需要配置 `JWT_SECRET` 和 `JWT_USERS`（例如：user1,user2...）

## API 端点

该服务提供以下 API：

- `GET /test`: 基本健康检查
- `GET /api/sync`: 获取用户数据（需要 JWT 验证）
- `PUT /api/sync`: 更新用户数据（需要 JWT 验证）
- `POST /api/sync`: 测试鉴权（需要 JWT 验证）

## 身份验证

本服务使用 JWT（JSON Web Tokens）进行鉴权。所有 `/api/sync` 端点都需要在 Authorization 头中带上合法的 JWT：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

JWT Token 应包含一个 `id` 声明，其值应匹配 `JWT_USERS` 环境变量中允许的用户 ID。

## 本地开发

```bash
npm run dev
```

## 本地测试

```bash
npm run test
```

## 与 Electerm 一起使用

在 Electerm 中配置同步功能：

1. 进入 Settings > Sync -> Custom
2. 输入以下设置：
   - Sync server: 你的 Cloudflare Worker URL（例如：`https://your-subdomain.workers.dev/api/async`）
   - JWT secret: 与 Cloudflare Worker 中配置的 `JWT_SECRET` 相同
   - User ID: `JWT_USERS` 中配置的其中一个用户名

## 其他语言的同步服务器实现

[https://github.com/electerm/electerm/wiki/Custom-sync-server](https://github.com/electerm/electerm/wiki/Custom-sync-server)

## 许可证

MIT
