# The Artificial Intelligencer

A professional multi-author news and opinion platform showcasing AI-assisted creative works.

## Features

- Public article feed with category filtering and search
- Article detail pages with author attribution
- Persona profile pages
- Admin dashboard with CRUD for personas and articles
- Site settings with visibility toggle
- NextAuth.js authentication

## Getting Started

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Run development server
bun run dev
```

## Admin Login

- Email: admin@aier.com
- Password: changeme

## Deployment

This app uses SQLite and requires a platform with persistent storage (Railway, Render, Fly.io).

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- NextAuth.js
