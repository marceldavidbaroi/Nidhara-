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
┃   ┃   ┗━━ <module-name>/       # e.g., "users"
┃   ┃       ┣━━ controller/      # HTTP Entry (with Swagger decorators)
┃   ┃       ┣━━ services/        # Business Logic
┃   ┃       ┣━━ repository/      # Prisma queries (Isolated from service)
┃   ┃       ┣━━ transformers/    # Prisma Type -> API Response
┃   ┃       ┣━━ validators/      # Complex business validation
┃   ┃       ┣━━ dto/             # Class-validator & Swagger shapes
┃   ┃       ┗━━ <module>.module.ts
┃   ┃
┃   ┣━━ 📜  app.module.ts        # ROOT ORCHESTRATOR
┃   ┗━━ 🏁  main.ts              # BOOTSTRAP, PINO & SWAGGER SETUP
┃
┣━━ 📜  .env                     # DB Credentials & Env Vars
┗━━ ⚙️  nest-cli.json            # Configured with @nestjs/swagger plugin
</pre>
