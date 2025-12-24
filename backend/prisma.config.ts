import { defineConfig, env } from '@prisma/config';
import 'dotenv/config'; // 👈 THIS IS THE FIX

export default defineConfig({
  // Point to where your schema is
  schema: 'prisma/schema.prisma',

  // Where you want migrations to live
  migrations: {
    path: 'prisma/migrations',
  },

  // Move your DB URL here
  datasource: {
    url: env('DATABASE_URL'),
  },
});
