# Article Comments App

A full-stack CRUD application for articles and nested comments, including comment analytics grouped by article for a selected date range.

## Stack

- Backend: Node.js, Express 5, Sequelize 6, PostgreSQL
- Frontend: Vue 3, Vue Router, Vuex 4, Axios, Vuetify 3, Vite
- Tooling: Sequelize CLI, Node test runner, Supertest, ESLint, Docker Compose, GitHub Actions

## Quick start with Docker

Requirements: Docker with the Compose plugin.

```bash
docker compose up --build -d
docker compose exec backend npm run db:seed
```

Open <http://localhost:5173>. The API is proxied through the same address under `/api`; PostgreSQL is exposed on port `5432` for local inspection.

To stop the application:

```bash
docker compose down
```

Add `-v` only when you intentionally want to remove the PostgreSQL volume as well.

## Local development

Requirements: Node.js 20+ (Node.js 24 is used in CI), npm, Docker, and Docker Compose.

1. Install all workspace dependencies:

   ```bash
   npm install
   ```

2. Start PostgreSQL:

   ```bash
   docker compose up -d db
   ```

3. Create the backend environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

   On PowerShell use `Copy-Item backend/.env.example backend/.env`.

4. Prepare the database:

   ```bash
   npm run db:migrate --workspace backend
   npm run db:seed --workspace backend
   ```

5. Start backend and frontend together:

   ```bash
   npm run dev
   ```

The frontend runs at <http://localhost:5173> and proxies API requests to the backend at <http://localhost:3000>.

## API

JSON request bodies must use `Content-Type: application/json`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/article/` | Create an article |
| `GET` | `/article/:id/` | Get one article |
| `GET` | `/articles/` | List articles |
| `PATCH` | `/article/:id/` | Update an article |
| `DELETE` | `/article/:id/` | Delete an article and its comments |
| `POST` | `/article/:id/comment/` | Add a comment |
| `GET` | `/article/:id/comment/:commentId/` | Get one comment scoped to its article |
| `GET` | `/article/:id/comments/` | List an article's comments |
| `PATCH` | `/article/:id/comment/:commentId/` | Update a comment |
| `DELETE` | `/article/:id/comment/:commentId/` | Delete a comment |
| `GET` | `/analytic/comments/?dateFrom=...&dateTo=...` | Group comments created in a period by article |
| `GET` | `/health` | Service health check |

Article payload:

```json
{
  "title": "An article title",
  "text": "The article body"
}
```

Comment payload:

```json
{
  "text": "A comment"
}
```

Analytics accepts ISO-8601 dates, Unix timestamps in seconds, or Unix timestamps in milliseconds. Both range boundaries are inclusive. Example response:

```json
{
  "dateFrom": "2026-07-01T00:00:00.000Z",
  "dateTo": "2026-08-01T00:00:00.000Z",
  "articles": [
    {
      "article": { "id": 1, "title": "Getting started" },
      "comments": [
        {
          "id": 2,
          "text": "A newer comment.",
          "articleId": 1,
          "createdAt": "2026-07-31T12:00:00.000Z",
          "updatedAt": "2026-07-31T12:00:00.000Z"
        }
      ]
    }
  ]
}
```

## Database lifecycle

```bash
npm run db:migrate --workspace backend
npm run db:migrate:undo --workspace backend
npm run db:seed --workspace backend
npm run db:reset --workspace backend
```

The schema uses `ON DELETE CASCADE` for article comments and indexes comment `article_id` and `created_at` for nested reads and period analytics.

## Verification

```bash
npm run lint
npm test
npm run build
```

Backend tests stub the Sequelize persistence methods, so they validate the HTTP contract without requiring a running PostgreSQL instance. Migrations and seeders remain the source of truth for the actual database schema.

## Project layout

```text
backend/
  src/controllers/   HTTP handlers
  src/migrations/    PostgreSQL schema history
  src/models/        Sequelize models and associations
  src/routes/        Express routes
  src/seeders/       Demo data
  test/              API tests
frontend/
  src/components/    Reusable article and comment forms/lists
  src/store/         Vuex modules and API actions
  src/views/         Routed application screens
```
