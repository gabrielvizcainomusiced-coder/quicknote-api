# QuickNote API

A RESTful API backend for the QuickNote application, built with Node.js, Express, and PostgreSQL. Designed as a portfolio project demonstrating full-stack development, security-aware design, and production-ready practices.

## 🚀 Features

- **CRUD Operations** — Create, Read, Update, and Delete notes
- **PostgreSQL Database** — Secure and scalable data storage
- **Docker Support** — Easy local development setup with Docker Compose
- **Input Validation** — Multi-layer server-side validation (presence, type, empty, length)
- **XSS Protection** — HTML tag sanitization prevents stored cross-site scripting attacks
- **SQL Injection Prevention** — Parameterized queries throughout
- **Comprehensive Testing** — 41 tests, 100% coverage on controllers and routes
- **Error Handling** — Proper HTTP status codes and user-friendly error messages

## 🛠️ Tech Stack

- **Node.js** — JavaScript runtime
- **Express** — Web framework
- **PostgreSQL** — Relational database
- **Docker & Docker Compose** — Containerization
- **Jest & Supertest** — Testing framework

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gabrielvizcainomusiced-coder/quicknote-api.git
cd quicknote-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .envexample .env
```

The default `.env` settings work out of the box with Docker. No changes needed for local development.

### 4. Start with Docker

```bash
# Start API and PostgreSQL database
docker-compose up

# Or run in the background
docker-compose up -d
```

The API will be available at `http://localhost:3001`

### 5. Verify It's Running

```bash
curl http://localhost:3001/health
```

Expected response: `{"status":"ok","message":"QuickNote API is running"}`

## 📚 API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/notes` | Create a new note | `{ "title": "string", "content": "string" }` |
| `GET` | `/notes` | Get all notes | — |
| `GET` | `/notes/:id` | Get a single note | — |
| `PUT` | `/notes/:id` | Update a note | `{ "title": "string", "content": "string" }` |
| `DELETE` | `/notes/:id` | Delete a note | — |

### Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Required, non-empty (after trimming whitespace), max 255 characters |
| `content` | Required, non-empty (after trimming whitespace), max 500 characters |

Both fields are sanitized to strip HTML tags before saving.

### Example Requests

**Create a Note:**

```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

**Get All Notes:**

```bash
curl http://localhost:3001/api/notes
```

**Get Single Note:**

```bash
curl http://localhost:3001/api/notes/1
```

**Update Note:**

```bash
curl -X PUT http://localhost:3001/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content"}'
```

**Delete Note:**

```bash
curl -X DELETE http://localhost:3001/api/notes/1
```

### Response Formats

**Success:**

```json
{
  "id": 1,
  "title": "My Note",
  "content": "Note content",
  "created_at": "2026-01-19T04:47:19.038Z",
  "updated_at": "2026-01-19T04:47:19.038Z"
}
```

**Error (400 Validation):**

```json
{
  "error": "Title cannot be empty"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `404` | Not Found |
| `500` | Server Error |

## 🧪 Testing

```bash
# Run all tests with coverage report
npm test

# Watch mode (reruns on file changes)
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

### Test Coverage

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
controllers/        |  100%   |  100%    |  100%   |  100%   |
routes/             |  100%   |  100%    |  100%   |  100%   |
--------------------|---------|----------|---------|---------|
```

**41 tests** covering:
- All CRUD happy paths
- Content and title validation (empty, whitespace-only, missing)
- Length limit enforcement (255 char title, 500 char content)
- XSS sanitization (HTML tag stripping)
- Error handling and edge cases

> `src/models/Note.js` is intentionally excluded — it contains raw database queries best covered by integration tests with a live database rather than unit tests.

## 📁 Project Structure

```
quicknote-api/
├── src/
│   ├── config/
│   │   └── database.js         # PostgreSQL connection pool
│   ├── controllers/
│   │   └── noteController.js   # Business logic, validation, sanitization
│   ├── models/
│   │   └── Note.js             # Database queries
│   ├── routes/
│   │   └── noteRoutes.js       # API endpoint definitions
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling
│   └── app.js                  # Express server setup
├── tests/
│   ├── unit/
│   │   └── noteController.test.js    # 29 unit tests
│   └── integration/
│       └── noteRoutes.test.js        # 12 integration tests
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Container image
├── jest.config.js              # Test configuration
├── package.json                # Dependencies and scripts
└── README.md
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove all data (wipes database)
docker-compose down -v

# View logs
docker-compose logs -f

# Rebuild containers after code changes
docker-compose up --build
```

## 🔧 Development Without Docker

If you have PostgreSQL installed locally:

```bash
# 1. Create the database
createdb quicknote

# 2. Update .env
DATABASE_URL=postgresql://localhost:5432/quicknote

# 3. Start the dev server
npm run dev
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/quicknote` |

## 🔒 Security

**XSS Prevention** — All user input is sanitized before saving. HTML tags are stripped using regex (`/<[^>]*>/g`), preventing stored cross-site scripting attacks.

**SQL Injection Prevention** — All database queries use parameterized placeholders (`$1`, `$2`) instead of string concatenation.

**Input Length Limits** — Title capped at 255 characters (matching the database `VARCHAR(255)` column), content capped at 500 characters to keep notes concise and prevent abuse.

**Known Limitations (intentional for portfolio scope):** Rate limiting, authentication/authorization, HTTPS enforcement, and advanced content filtering are not implemented. These would add complexity without demonstrating the core full-stack skills this project targets.

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**Docker not starting:**
```bash
docker ps          # verify Docker is running
docker-compose up  # retry
```

**Database connection failed:**
```bash
docker-compose ps       # check both containers are up
docker-compose logs db  # view database-specific logs
```

## 📝 Version History

- **v1.1** (Jan 2026) — Code review pass: input sanitization (XSS), content validation bug fix, length limits, 100% test coverage (up from 85%, 16 → 41 tests)
- **v1.0** (Jan 2026) — Initial full-stack implementation with PostgreSQL, Docker, and basic CRUD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Gabriel Vizcaino**

- GitHub: [@gabrielvizcainomusiced-coder](https://github.com/gabrielvizcainomusiced-coder)

---

## Related Projects

- [QuickNote Desktop](https://github.com/gabrielvizcainomusiced-coder/quicknote-desktop) — React frontend for this API