# Claude.md - QuickNote API

**Last Updated:** February 2026
**Project:** QuickNote API (Backend)
**Developer:** Gabriel Vizcaino
**Repository:** https://github.com/gabrielvizcainomusiced-coder/quicknote-api

---

## Project Overview

QuickNote API is a RESTful backend for the QuickNote Desktop application. It is built with Node.js, Express, and PostgreSQL, containerized with Docker, and designed to demonstrate production-ready full-stack development practices for a portfolio project.

The frontend (QuickNote Desktop) can run in two modes — localStorage (demo) or connected to this API. See the frontend Claude.md for that architecture.

---

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express** — Web framework
- **PostgreSQL** — Relational database
- **Docker & Docker Compose** — Containerization
- **Jest & Supertest** — Testing framework

---

## Project Structure

```
quicknote-api/
├── src/
│   ├── config/
│   │   └── database.js         # PostgreSQL connection pool
│   ├── controllers/
│   │   └── noteController.js   # Business logic, validation, sanitization
│   ├── models/
│   │   └── Note.js             # Database queries (parameterized)
│   ├── routes/
│   │   └── noteRoutes.js       # API endpoint definitions
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling
│   └── app.js                  # Express server setup
├── tests/
│   ├── unit/
│   │   └── noteController.test.js    # 29 unit tests
│   └── integration/
│       └── noteRoutes.test.js        # 8 integration tests
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
└── package.json
```

---

## API Contract

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/notes` | Create a note |
| `GET` | `/notes` | Get all notes |
| `GET` | `/notes/:id` | Get single note |
| `PUT` | `/notes/:id` | Update a note |
| `DELETE` | `/notes/:id` | Delete a note |

### Request Body (create/update)
```json
{ "title": "string", "content": "string" }
```

### Success Response
```json
{
  "id": 1,
  "title": "My Note",
  "content": "Note content",
  "created_at": "2026-01-19T04:47:19.038Z",
  "updated_at": "2026-01-19T04:47:19.038Z"
}
```

### Error Response
```json
{ "error": "Error message here" }
```

### HTTP Status Codes
- `200` — Success
- `201` — Created
- `400` — Validation error
- `404` — Not found
- `500` — Server error

---

## Validation Rules

**For both `createNote` and `updateNote`:**

1. Title and content must be present
2. Title must be non-empty after trimming whitespace
3. Content must be non-empty after trimming whitespace
4. Title max length: **255 characters** (matches database `VARCHAR(255)`)
5. Content max length: **500 characters** (enforces sticky note / quick note intent)
6. Both inputs are sanitized (HTML tags stripped) before saving

**Constants in `noteController.js`:**
```javascript
const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 500;
```

---

## Security

**XSS Prevention:**
- `sanitize()` function strips all HTML tags using `/<[^>]*>/g`
- Applied to both title and content before any database write
- Preserves text content, removes markup

**SQL Injection Prevention:**
- All queries use parameterized placeholders (`$1`, `$2`)
- Never use string concatenation in queries

---

## Testing Strategy

### Coverage
- **37 tests total**, 100% coverage on controllers and routes
- `src/models/Note.js` intentionally excluded — contains raw DB queries, tested via integration tests with a live DB

### Test Files
- `tests/unit/noteController.test.js` — 29 unit tests (mocks Note model)
- `tests/integration/noteRoutes.test.js` — 8 integration tests

### What's Tested
- All CRUD happy paths
- Missing fields validation
- Empty/whitespace-only fields
- Length limit enforcement (255 title, 500 content)
- XSS sanitization
- 404 for missing notes
- 500 for database errors

### Running Tests
```bash
npm test                  # All tests with coverage
npm run test:watch        # Watch mode
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
```

### Configuration (`jest.config.js`)
```javascript
collectCoverageFrom: [
  'src/**/*.js',
  '!src/app.js',
  '!src/config/database.js',
  '!src/models/Note.js',
  '!src/middleware/errorHandler.js'
]
```

`--forceExit` is set in `package.json` to ensure clean exit despite open Express/DB connections.

---

## Development Workflow

```bash
# Start with Docker
docker-compose up

# Run tests
npm test

# TDD workflow
# 1. Write failing test
# 2. Run test (confirm it fails)
# 3. Write code to pass
# 4. Run test (confirm it passes)
# 5. Check coverage
# 6. Commit
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` / `production` | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/quicknote` |

---

## Common Issues & Solutions

**Port 3001 already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**Docker not starting:**
```bash
docker ps              # verify Docker is running
docker-compose up      # retry
```

**Database connection failed:**
```bash
docker-compose ps      # check both containers are up
docker-compose logs db # view database logs
```

**Tests hanging after completion:**
- `--forceExit` is already set in the test script — this is expected behavior

---

## Version History

- **v1.1** (Jan 2026) — Code review pass
  - Security: Input sanitization (XSS prevention)
  - Bug fix: Content empty-string validation (was missing)
  - Validation: Length limits (255 title, 500 content)
  - Testing: 100% coverage, 37 tests (up from 85%, 16 tests)
  - Cleanup: Removed change-log comments from source files

- **v1.0** (Jan 2026) — Initial release
  - RESTful API with Express
  - PostgreSQL + Docker
  - Basic CRUD
  - 85% test coverage

---

## Known Limitations (Intentional for Portfolio Scope)

- No authentication/authorization
- No rate limiting
- No HTTPS enforcement
- No request size limits beyond field validation
- Basic HTML sanitization only (no advanced filtering)

These are enterprise concerns that would add complexity without demonstrating the core skills this project targets.

---

## Interview Talking Points

**Security:**
> "After code review I identified missing input sanitization. I added HTML tag stripping before any database write to prevent stored XSS. It's covered by a dedicated test."

**Bug Fix:**
> "Content validation was missing — users could save whitespace-only notes. I added symmetric validation (same rules for title and content) and wrote regression tests."

**Production Thinking:**
> "Length limits match the app's intent — 255 for title matches VARCHAR(255) in the schema, and 500 for content enforces the sticky note / quick note design philosophy."

**Test Quality:**
> "I went from 85% to 100% coverage by adding 21 tests targeting validation, security, and edge cases. I also removed low-value tests that were just checking obvious behavior."

---

## Notes for AI Assistants

When working on this project:
1. **Never bypass the validation flow** in `noteController.js` — order matters
2. **Always sanitize before saving** — `sanitize()` must run after trimming, before `Note.create/update`
3. **Update tests first** when changing validation rules (TDD)
4. **Keep `Note.js` excluded from coverage** — it's intentional, not an oversight
5. **Update this file** when making architectural or validation changes
6. **Reference frontend Claude.md** for the full-stack integration picture

**Last Review Date:** February 2026
**Status:** Production-ready, Interview-ready
**Next Review:** After Movie Explorer completion or before deployment