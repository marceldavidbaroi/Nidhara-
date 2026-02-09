<pre>
root/
┃
┣━━ 📂  prisma/                  # 🟢 PRISMA HOME (Outside src/)
┃   ┣━━ schema.prisma            # Single source of truth for DB
┃   ┣━━ seed.ts                  # Main seed script
┃   ┗━━ 📂 migrations/           # Auto-generated SQL history
┃
┣━━ 📂  src/
┃   ┃
┃   ┣━━ 📂 common/               # SHARED AGNOSTIC LOGIC
┃   ┃   ┣━━ decorators/          # @CurrentUser(), @Public()
┃   ┃   ┣━━ guards/              # AuthGuard, RolesGuard
┃   ┃   ┣━━ interceptors/        # Logging, Transform
┃   ┃   ┣━━ filters/             # Global Error Handler
┃   ┃   ┣━━ pipes/               # GlobalValidation
┃   ┃   ┣━━ constants/           # Global enums
┃   ┃   ┗━━ logger/              # Pino implementation & config
┃   ┃
┃   ┣━━ 📂 database/             # 🗄️ PERSISTENCE ABSTRACTION
┃   ┃   ┣━━ prisma.module.ts     # Exports PrismaService globally
┃   ┃   ┣━━ prisma.service.ts    # Database connection logic
┃   ┃   ┗━━ base.repository.ts   # Optional Abstract for Prisma logic
┃   ┃
┃   ┣━━ 📂 config/               # ENV & PROVIDER CONFIG
┃   ┃
┃   ┣━━ 📂 modules/              # DOMAIN FEATURES
┃   ┃   ┗━━ module-name/       # e.g., "users"
┃   ┃       ┣━━ controller/      # HTTP Entry (with Swagger decorators)
┃   ┃       ┣━━ services/        # Business Logic
┃   ┃       ┣━━ repository/      # Prisma queries (Isolated from service)
┃   ┃       ┣━━ transformers/    # Prisma Type -> API Response
┃   ┃       ┣━━ validators/      # Complex business validation
┃   ┃       ┣━━ dto/             # Class-validator & Swagger shapes
┃   ┃       ┗━━ module.module.ts
┃   ┃
┃   ┣━━ 📜  app.module.ts        # ROOT ORCHESTRATOR
┃   ┗━━ 🏁  main.ts              # BOOTSTRAP, PINO & SWAGGER SETUP
┃
┣━━ 📜  .env                     # DB Credentials & Env Vars
┗━━ ⚙️  nest-cli.json            # Configured with @nestjs/swagger plugin
</pre>

# Project init command

To set up the project structure you provided, you will need to combine the NestJS CLI commands with manual directory creation. Here is the complete sequence of commands in Markdown.

### 1. Initialize Project & Core Dependencies

First, create the base NestJS application and install the necessary libraries for Swagger, Validation, and Logging.

```bash
# 1. Create the project
npx @nestjs/cli new project-name

# 2. Enter the project directory
cd project-name

# 3. Install dependencies for Swagger and Validation
pnpm install @nestjs/swagger swagger-ui-express class-validator class-transformer

# 4. Install Logging and Config dependencies
pnpm install nestjs-pino pino-http pino-pretty
```

---

### 2. Initialize Prisma (Persistence Layer)

This sets up the `prisma/` folder at the root and installs the client.

```bash
# 1. Install Prisma CLI and Client
npm install @prisma/client
npm install -D prisma

# 2. Initialize Prisma (Creates /prisma folder)
npx prisma init

```

---

### 3. Scaffold Custom Directory Structure

Since the NestJS CLI doesn't create folders like `common`, `transformers`, or `repository` by default, use these commands to build the hierarchy.

```bash
# 1. Create Common logic folders
mkdir -p src/common/{decorators,guards,interceptors,filters,pipes,constants,logger}

# 2. Create Database abstraction folders
mkdir -p src/database

# 3. Create a placeholder for the first module
mkdir -p src/modules

```

npm install @prisma/adapter-pg pg
npm install -D @types/pg

npx prisma studio
