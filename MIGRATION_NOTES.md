# Migration Notes

## Why this rebuild

The old project is a browser-only exam app. That means:

- answers live in frontend JavaScript
- grading happens on the client
- local storage controls retakes and result history
- admins do not have a reliable source of truth

The new direction is `Next.js + TypeScript + Tailwind + PostgreSQL`.

## Recommended build order

1. Add authentication for admins.
2. Connect Prisma to a Postgres database.
3. Build candidate registration API.
4. Build exam session API.
5. Build answer submission and server-side grading API.
6. Replace sample data in `src/lib/sample-data.ts` with database queries.
7. Add admin exam management, exports, and audit logs.

## Suggested route map

- `/` student landing page
- `/exam` student registration and exam experience
- `/admin` protected dashboard
- `/api/dashboard` starter API route

## Legacy files

The old HTML, CSS, and JS files are still in the repo as migration references:

- `index.html`
- `exam.html`
- `result.html`
- `script.js`
- `exam.js`
- `result.js`

They should not remain the production implementation once the database-backed flow is complete.
