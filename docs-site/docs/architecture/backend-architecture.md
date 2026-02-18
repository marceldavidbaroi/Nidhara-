

# Backend Architecture (NestJS + Prisma)

This document defines the structural architecture of the backend, its layering model, security model, cross-cutting concerns, and domain boundaries.

It serves as the canonical reference for how new modules must be implemented.

---

# 0) Tech Stack & Runtime

## Runtime

* **Node.js:** 24
* **Framework:** NestJS v11
* **Package manager:** pnpm
* **Database:** PostgreSQL
* **ORM:** Prisma (`@prisma/client` + `@prisma/adapter-pg`)

## Core Libraries

* **Configuration:** `@nestjs/config`
* **Logging:** `nestjs-pino`
* **Authentication:** `@nestjs/jwt`, `passport`, `passport-jwt`
* **Password hashing:** `argon2`
* **Validation:** `class-validator`, `class-transformer`
* **Swagger:** `@nestjs/swagger`
* **Cookies:** `cookie-parser`

---

# 1) High-Level Structure

```
src/
├── main.ts
├── app.module.ts
├── database/
├── common/
└── modules/
```

### Responsibilities

| Folder          | Responsibility          |
| --------------- | ----------------------- |
| `main.ts`       | Application bootstrap   |
| `app.module.ts` | Root module wiring      |
| `database/`     | Prisma integration      |
| `common/`       | Cross-cutting utilities |
| `modules/`      | Domain-driven modules   |

---

# 2) Bootstrapping (main.ts)

`main.ts` defines global behavior.

## Bootstrap Order

1. Create Nest application
2. Attach logger
3. Register global interceptors
4. Enable cookie parsing
5. Enable CORS (for cookie auth)
6. Setup Swagger
7. Start server

## CORS Configuration (Required for Refresh Cookies)

Because refresh token is stored in an **httpOnly cookie**, CORS must allow credentials.

```ts
app.enableCors({
  origin: ['http://localhost:3000'], // whitelist only
  credentials: true,
});
```

### Rules

* Never use `origin: '*'`
* Frontend must send `credentials: 'include'`

---

# 3) Configuration & Environment

## Global Config

```ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env'],
});
```

## Required Environment Variables

### Database

```
DATABASE_URL=postgresql://postgres:pass@localhost:5432/nidhara_db
```

### Authentication

```
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_DAYS=30
NODE_ENV=development
PORT=3000
```

---

# 4) Logging Architecture (nestjs-pino)

Logging is global via:

```ts
LoggerModule.forRoot({
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: { singleLine: true },
    },
  },
});
```

### Guarantees

* Every HTTP request is logged
* Logs are structured JSON internally
* Pretty output in development

Services should log:

* Security events
* State transitions
* Critical business events

---

# 5) Database Architecture (Prisma)

## 5.1 Global Prisma

`PrismaModule` is marked `@Global()`.

PrismaService is available everywhere via DI.

## 5.2 Connection Model

Prisma uses `pg.Pool` with `PrismaPg` adapter.

Lifecycle:

* `onModuleInit()` → `$connect()`
* `onModuleDestroy()` → `$disconnect()`

## 5.3 Persistence Rules

* Controllers never access Prisma directly.
* Repositories encapsulate DB queries.
* Services encapsulate business rules.
* API responses must not expose Prisma models directly.

---

# 6) Global API Response Format

All responses pass through `ResponseInterceptor`.

## Standard Response Shape

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

## Behavior

If controller returns:

```ts
return user;
```

Output becomes:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

If controller returns:

```ts
return { data, meta, message };
```

Output preserves meta + custom message.

---

# 7) Swagger Architecture

Swagger is centrally configured.

## Features

* Bearer authentication scheme
* `persistAuthorization: true`
* Modular swagger decorators

Bearer scheme:

```ts
.addBearerAuth(
  { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  'access-token',
)
```

---

# 8) Authentication Architecture

The system uses a **hybrid model**:

| Token         | Type          | Storage              | Purpose         |
| ------------- | ------------- | -------------------- | --------------- |
| Access Token  | JWT           | Authorization header | API access      |
| Refresh Token | JWT           | httpOnly cookie      | Token rotation  |
| CSRF Token    | Random string | JSON response        | CSRF protection |

---

# 9) Auth Flow (Full Lifecycle)

## Signup / Signin

Server returns:

* JSON:

  * `accessToken`
  * `csrfToken`
  * `expiresIn`
* Cookie:

  * `refresh_token` (httpOnly)

Cookie config:

```ts
{
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/auth'
}
```

---

## Accessing Protected Routes

Client sends:

```
Authorization: Bearer <accessToken>
```

Protected routes use:

```ts
@UseGuards(JwtAuthGuard)
```

---

## Refresh Flow

Client sends:

```js
fetch('/auth/refresh', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ csrfToken }),
});
```

Server verifies:

1. Refresh JWT signature
2. Session exists in DB
3. Session not expired
4. Session not revoked
5. CSRF token matches
6. Refresh token matches stored hash

If valid:

* New access token issued
* New refresh token issued
* Refresh token rotated in DB
* Cookie updated

---

## Logout

* Session revoked
* Cookie cleared

---

# 10) JWT Guard & Strategy

## JwtStrategy

* Extracts bearer token
* Verifies signature
* Returns `{ userId, sessionId }`
* Attaches payload to `req.user`

## JwtAuthGuard

Wraps `AuthGuard('jwt')`.

Used on protected routes.

---

# 11) CurrentUser Pattern

Recommended decorator:

```ts
export const CurrentUser = createParamDecorator(
  (data, ctx) => ctx.switchToHttp().getRequest().user,
);
```

Usage:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
me(@CurrentUser() user) {
  return user;
}
```

---

# 12) Session Model (DB-Backed)

`AuthSession` stores:

* refreshTokenHash (argon2)
* csrfToken
* device metadata
* expiresAt
* revokedAt

Refresh token is never stored raw.

Session is source of truth.

---

# 13) Domain Architecture Pattern

Each module follows:

```
modules/<domain>/
├── controller/
├── dto/
├── services/
├── repository/
├── transformers/
└── validators/
```

---

# 14) Cross-Domain Policy

## Allowed

* Service-to-service calls

## Not Allowed

* Repository-to-repository imports

Repositories are private to their domain.

---

# 15) Adding a New Module Checklist

1. Create module folder
2. Add controller, service, repository
3. Define DTOs
4. Add swagger decorators
5. Register in AppModule
6. Follow response contract

---

# 16) Security Guarantees

* Passwords hashed with argon2
* Refresh tokens hashed in DB
* Token rotation enforced
* CSRF required for refresh
* Sessions revocable
* Access tokens short-lived

---

# 17) Current Architecture Status

✅ JWT Guard + Strategy implemented
✅ Cookie-based refresh flow
✅ CSRF enforced for refresh
✅ Global response interceptor
✅ Prisma global module
⏳ Frontend CSRF storage decision pending
⏳ Production CORS origin tightening

---

# 18) Architectural Rules (Must Not Be Broken)

* Controllers never call Prisma directly.
* Repositories are private to domain.
* Refresh token never returned in JSON.
* All endpoints return interceptor-wrapped responses.
* CORS must allow credentials if cookies are used.
* Access token only via Authorization header.

---

