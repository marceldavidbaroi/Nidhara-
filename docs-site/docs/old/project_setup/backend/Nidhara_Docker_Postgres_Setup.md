# Nidhara Project: Docker PostgreSQL Setup Guide

This document outlines how to set up PostgreSQL using Docker for the **Nidhara** project, with persistent storage, optional database population from an external file, and Prisma integration. It also explains the reasoning behind each configuration choice.

---

## 1. Project Goals

* Run PostgreSQL locally using Docker for Nidhara.
* Keep database data persistent across container restarts.
* Allow optional population of initial data from an external `.sql` or `.backup` file.
* Ensure Prisma can connect seamlessly.
* Enable exporting the database for sharing or backup.

---

## 2. Prerequisites

* **Docker installed** on your Mac.
* **Node.js & npm** installed for Prisma.
* Optional: DBeaver or TablePlus to inspect the database.
* Optional: SQL dump file (`dump.sql` or `dump.backup`) for initial data.

---

## 3. Docker PostgreSQL Setup

### Step 1: Create Docker Volume

Persistent storage ensures database data survives container removal:

```bash
docker volume create nidhara-db-data
```

---

### Step 2: Run PostgreSQL Container (First Time Only)

```bash
docker run --name nidhara-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=nidhara_db \
  -p 5432:5432 \
  -v nidhara-db-data:/var/lib/postgresql/data \
  -d postgres
```

⚠️ **Important:**

* This command should be run **only once**.
* If the container already exists, running this again will result in a **name conflict error**.

**Decision rationale:**

* Docker volumes keep database data persistent.
* Port mapping allows Prisma and GUI tools to connect locally.
* Default credentials simplify Prisma setup.

---

### Step 3: Verify Container

```bash
docker ps
docker logs nidhara-postgres
```

---

## 4. Container Lifecycle Management (Start / Stop)

### Stop the PostgreSQL container

```bash
docker stop nidhara-postgres
```

* Gracefully shuts down PostgreSQL
* Data remains safe in the Docker volume

---

### Start the container again

```bash
docker start nidhara-postgres
```

✅ Use this after:

* Restarting your computer
* Closing and reopening Docker Desktop

---

### Restart the container

```bash
docker restart nidhara-postgres
```

Useful after configuration or environment changes.

---

### Check container status

```bash
docker ps      # running containers
docker ps -a   # all containers (including stopped)
```

---

### Docker Desktop behavior

* Closing Docker Desktop **stops all containers**
* Containers **do not auto-start** when Docker reopens
* You must manually run:

```bash
docker start nidhara-postgres
```

---

### Remove the container (⚠️ destructive)

```bash
docker rm nidhara-postgres
```

* Removes the container only
* Database data remains intact

To remove data as well:

```bash
docker volume rm nidhara-db-data
```

---

## 5. Optional Database Population

If you have an external database file (`dump.sql` or `dump.backup`):

### Copy the file into the container

```bash
docker cp dump.sql nidhara-postgres:/dump.sql
```

### Restore the database

* For `.sql`:

```bash
docker exec -i nidhara-postgres psql -U postgres -d nidhara_db < /dump.sql
```

* For `.backup`:

```bash
docker exec -i nidhara-postgres pg_restore -U postgres -d nidhara_db /dump.backup
```

---

## 6. Prisma Integration

### Step 1: Configure `.env`

```env
DATABASE_URL=postgresql://postgres:pass@localhost:5432/nidhara_db
```

---

### Step 2: Prisma Config (`prisma.config.ts`)

```ts
import { defineConfig, env } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
```

---

### Step 3: Run Migrations

```bash
npx prisma migrate dev
```

* Creates tables if not already present
* Prisma Client is now connected to Docker PostgreSQL

---

## 7. Workflow Summary

1. Create Docker volume (once)
2. Run PostgreSQL container (once)
3. Start/stop container using `docker start` / `docker stop`
4. Optional: import SQL or backup files
5. Prisma connects via `DATABASE_URL`
6. Optional: export database for sharing

**Benefits:**

* Persistent database
* Clear container lifecycle commands
* Easy local development
* Safe team collaboration

---

**End of Nidhara Docker PostgreSQL Setup Guide**
