# Neon Setup

This app now expects PostgreSQL through Prisma.

## 1. Create a Neon project

1. Sign in to Neon.
2. Create a new project.
3. Open the project dashboard.
4. Copy:
   - the pooled connection string for `DATABASE_URL`
   - the direct connection string for `DIRECT_URL`

## 2. Update your env file

Use [.env.example](/c:/Users/HP/Documents/final%20mfmcf%20exam/final%20mfmcf%20exam/.env.example) as the template and replace the values in your local `.env`.

Required variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## 3. Push the schema to Neon

```bash
npm run prisma:generate
npm run prisma:push
```

## 4. Start the app

```bash
npm run dev
```

## 5. Admin access

- Admin URL: `http://localhost:3000/admin`
- Login URL: `http://localhost:3000/admin/login`

## Notes

- `DATABASE_URL` should use Neon's pooled connection string.
- `DIRECT_URL` should use Neon's direct connection string.
- The old `data/app-db.json` file is no longer the main source of truth once Neon is connected.
