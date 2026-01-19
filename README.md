# QuickNote API

A RESTful API backend for the QuickNote application, built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **CRUD Operations** - Create, Read, Update, and Delete notes
- **PostgreSQL Database** - Secure and scalable data storage
- **Docker Support** - Easy local development setup
- **Comprehensive Testing** - 85% controller test coverage with Jest
- **Input Validation** - Server-side validation for data integrity
- **Error Handling** - Proper error responses with appropriate HTTP status codes

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Docker & Docker Compose** - Containerization
- **Jest & Supertest** - Testing framework

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
cp .env.example .env
```

The default `.env` settings work for Docker. No changes needed for local development.

### 4. Start the Application with Docker

```bash
# Start API and PostgreSQL database
docker-compose up

# Or run in background
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
| `GET` | `/notes` | Get all notes | - |
| `GET` | `/notes/:id` | Get a single note | - |
| `PUT` | `/notes/:id` | Update a note | `{ "title": "string", "content": "string" }` |
| `DELETE` | `/notes/:id` | Delete a note | - |

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

## 🧪 Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage

Current coverage: **85% for controllers**

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
controllers/        |   85.1% |   94.4%  |  100%   |  85.1%  |
routes/             |  100%   |  100%    |  100%   |  100%   |
--------------------|---------|----------|---------|---------|
```

## 📁 Project Structure

```
quicknote-api/
├── src/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection
│   ├── controllers/
│   │   └── noteController.js # Business logic
│   ├── models/
│   │   └── Note.js           # Database queries
│   ├── routes/
│   │   └── noteRoutes.js     # API endpoints
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   └── app.js                # Express server setup
├── tests/
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── docker-compose.yml        # Docker configuration
├── Dockerfile                # Container image
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

## 🔧 Development

### Without Docker (Local PostgreSQL)

If you have PostgreSQL installed locally:

1. Create a database:
```bash
createdb quicknote
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://localhost:5432/quicknote
```

3. Run the API:
```bash
npm run dev
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/quicknote` |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Docker Not Starting
```bash
# Check Docker is running
docker ps

# Restart Docker Desktop
# Then try: docker-compose up
```

### Database Connection Failed
```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs db
```

## 📝 Response Formats

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
{
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Gabriel Vizcaino**
- GitHub: [@gabrielvizcainomusiced-coder](https://github.com/gabrielvizcainomusiced-coder)

---

## Related Projects

- [QuickNote Desktop](https://github.com/gabrielvizcainomusiced-coder/quicknote-desktop) - React frontend for this API

---

Built using Node.js and Express