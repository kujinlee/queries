# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an e-commerce data utilities project that provides query functions for a SQLite database. The project uses TypeScript with the `sqlite` async wrapper over `sqlite3`.

`src/main.ts` runs as a daily cron job: it opens `ecommerce.db`, initializes the schema, queries for overdue pending orders (>3 days), and sends Slack alerts to `#order-alerts`.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Reference it any time you need to understand the structure of data stored in the database.

## Development Commands

```bash
# Install dependencies and initialize Claude config
npm run setup

# Run the main entry point
npx tsx src/main.ts

# Type-check without emitting
npx tsc --noEmit
```

## Working with Queries

All query modules use the `sqlite` package (async/await), not the raw `sqlite3` callback API. The `Database` type is imported from `"sqlite"`.

- Single record queries use `await db.get()`
- Multiple record queries use `await db.all()`
- Always use parameterized queries (`?` placeholders)

```typescript
import { Database } from "sqlite";

export async function getCustomerByEmail(
  db: Database,
  email: string,
): Promise<any> {
  return db.get(`SELECT * FROM customers WHERE email = ?`, [email]);
}
```

## Slack Integration

`src/slack.ts` exports `sendSlackMessage(channel, text)`. It requires `SLACK_WEBHOOK_URL` to be set as an environment variable.

## Hooks

After any Write/Edit, hooks automatically:

1. Format the file with Prettier
2. Run TypeScript type checking via `hooks/tsc.js` (exits with code 2 on errors)

## Critical Guidance

- Critical: All database queries must be written in the `./src/queries` dir
