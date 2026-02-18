Claude.md - QuickNote API Project Memory
Last Updated: January 19, 2026
 Project: QuickNote Full-Stack Application
 Developer: Gabriel Vizcaino

Project Overview
QuickNote is a full-stack note-taking application demonstrating modern web development practices. It consists of two repositories:
Frontend: React + Vite (QuickNote-Desktop)
Backend: Node.js + Express + PostgreSQL (quicknote-api)
Key Architecture Decision
The frontend can operate in two modes via environment variables:
Demo Mode: Uses localStorage (for GitHub Pages deployment)
Full-Stack Mode: Connects to backend API with PostgreSQL
This dual-mode approach allows for both live demos and proper full-stack functionality.

Tech Stack
Backend (quicknote-api)
Runtime: Node.js 18+
Framework: Express.js
Database: PostgreSQL 15
Testing: Jest + Supertest
Containerization: Docker + Docker Compose
Development: Nodemon for hot-reload
Frontend (QuickNote-Desktop)
Library: React 19
Build Tool: Vite
State Management: React Hooks (useState, useEffect)
API Communication: Fetch API
Deployment: GitHub Pages (demo mode)

Project Structure
Backend Structure
quicknote-api/
├── src/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection pool
│   ├── controllers/
│   │   └── noteController.js # Business logic & request handlers
│   ├── models/
│   │   └── Note.js           # Database queries (SQL)
│   ├── routes/
│   │   └── noteRoutes.js     # URL → Controller mapping
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handling
│   └── app.js                # Express server setup
├── tests/
│   ├── unit/
│   │   └── noteController.test.js    # Function-level tests
│   └── integration/
│       └── noteRoutes.test.js        # Full request/response tests
├── docker-compose.yml        # Multi-container setup
├── Dockerfile               # Container image definition
├── .cursorrules            # Cursor AI instructions
└── .env                    # Local configuration (not in git)

Frontend Structure
QuickNote-Desktop/
├── src/
│   ├── components/         # React components
│   ├── config/
│   │   └── api.js         # API configuration
│   ├── services/
│   │   └── noteService.js # Backend communication layer
│   └── main.jsx           # Entry point
├── .env                   # Frontend configuration
└── vite.config.js         # Build configuration


Development Environment
Prerequisites
Node.js 18+
Docker Desktop (for backend database)
macOS 11.7+ / Windows 10+ / Linux
Environment Variables
Backend (.env):
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@db:5432/quicknote

Frontend (.env):
VITE_USE_BACKEND=false           # Toggle localStorage vs API
VITE_API_URL=http://localhost:3001/api

Starting the Application
Backend:
cd quicknote-api
docker-compose up              # Starts API + PostgreSQL

Frontend:
cd QuickNote-Desktop
npm run dev                    # Starts Vite dev server


API Endpoints
All endpoints use /api prefix.
Method
Endpoint
Purpose
Request Body
Response
POST
/notes
Create note
{title, content}
Created note (201)
GET
/notes
Get all notes
-
Array of notes (200)
GET
/notes/:id
Get single note
-
Note object (200) or 404
PUT
/notes/:id
Update note
{title, content}
Updated note (200) or 404
DELETE
/notes/:id
Delete note
-
Success message (200) or 404

Status Codes Used
200: Success
201: Created
400: Bad Request (validation failed)
404: Not Found
500: Server Error

Database Schema
Notes Table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Security Measures
All queries use parameterized statements ($1, $2) to prevent SQL injection
Input validation on title and content (non-empty, trimmed)
Environment variables for sensitive data (never committed)

Testing Strategy
Test Coverage Goals
Overall: >70%
Controllers: >80%
Routes: 100%
Current Coverage
Controllers: 85.1%
Routes: 100%
Status: ✅ Passing all 23 tests
Test Types
Unit Tests (tests/unit/noteController.test.js):
Test individual controller functions in isolation
Mock the database layer
Verify validation logic
Test error handling
Integration Tests (tests/integration/noteRoutes.test.js):
Test complete request/response cycles
Verify HTTP status codes
Test full endpoint behavior
Still mock database for speed
Running Tests
npm test                 # All tests with coverage
npm run test:watch       # Watch mode for development
npm run test:unit        # Only unit tests
npm run test:integration # Only integration tests


Key Design Patterns
MVC Architecture
Model (Note.js): Database queries and data access
View (React frontend): User interface
Controller (noteController.js): Business logic and request handling
Separation of Concerns
Each layer has a single responsibility:
Routes: Map URLs to controller functions
Controllers: Validate input, orchestrate logic, format responses
Models: Execute database queries
Services (frontend): Abstract API communication
Error Handling Pattern
async function(req, res) {
  try {
    // 1. Validate input
    if (!input) return res.status(400).json({ error: 'message' });
    
    // 2. Process/call model
    const result = await Model.method(input);
    
    // 3. Handle not found
    if (!result) return res.status(404).json({ error: 'Not found' });
    
    // 4. Success response
    res.json(result);
  } catch (error) {
    // 5. Error handling
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
}


Important Decisions & Context
Why Docker?
Developer had macOS 11.7 which made PostgreSQL installation difficult. Docker provides:
Consistent environment across machines
No system-level installation needed
Easy cleanup (delete containers)
Matches production deployment patterns
Why Two Modes (localStorage + API)?
Demo mode allows GitHub Pages deployment without backend
Shows understanding of environment configuration
Demonstrates ability to build with multiple deployment targets
Useful for portfolio demonstrations
Why Separate Repositories?
Independent deployment cycles
Clear separation of concerns
Frontend can be static (CDN/GitHub Pages)
Backend can scale independently
Different teams could work on each
Why Test-Driven Development?
Catches bugs before they reach production
Documents expected behavior
Makes refactoring safer
Required for professional development
Demonstrates code quality awareness

Common Issues & Solutions
"Database connection refused"
Cause: Docker containers not running
 Solution: docker-compose up in quicknote-api directory
"Tests failing after changes"
Cause: Code changed but tests weren't updated
 Solution:
Understand why test is failing
Update test if expectations changed
Fix code if test is correct
Never commit failing tests
"CORS error in browser"
Cause: Frontend and backend on different ports
 Solution: CORS middleware already configured in app.js
"Environment variables not working"
Cause: Need to restart dev server after .env changes
 Solution: Stop and restart npm run dev

Development Workflow
Adding a New Feature (TDD Approach)
Write failing test first

 it('should do the new thing', async () => {
  // Test implementation
});


Run tests - verify it fails

 npm test


Implement feature


Update route
Update controller
Update model if needed
Run tests again - verify it passes


Check coverage - ensure it didn't drop


Commit changes

 git add .
git commit -m "Add feature: description"
git push origin main


Code Review Checklist
✅ All tests passing
✅ Coverage maintained/improved
✅ Input validation added
✅ Error handling included
✅ Environment variables used for config
✅ No secrets in code
✅ Meaningful commit message

Security Best Practices
Implemented
✅ Parameterized SQL queries (prevent injection)
✅ Input validation and sanitization
✅ Environment variables for secrets
✅ CORS configured properly
✅ .env files in .gitignore
Not Yet Implemented (Future)
⏳ Authentication/Authorization
⏳ Rate limiting
⏳ Request size limits
⏳ HTTPS in production
⏳ API key rotation

Deployment Considerations
Frontend (GitHub Pages)
Set VITE_USE_BACKEND=false for demo mode
Build: npm run build
Deploy: GitHub Actions workflow exists
Backend (Future - Render/Railway)
Environment variables set in platform
DATABASE_URL from managed PostgreSQL
Set NODE_ENV=production
CORS configured for production frontend URL

Performance Considerations
Current Optimizations
Database connection pooling (pg)
Lightweight queries (only fetch needed columns)
Index on id column (auto via PRIMARY KEY)
Future Optimizations
Add database indexes on frequently queried columns
Implement caching layer (Redis)
Add pagination for large note lists
Compress responses (gzip)

Learning Resources Used
During development, the developer learned:
RESTful API design patterns
Express.js middleware system
PostgreSQL and SQL fundamentals
Docker containerization basics
Jest testing framework
TDD methodology
Git version control
Environment variable management

Future Enhancements
Short Term
Add note categories/tags
Add search functionality
Add note favoriting
Add last edited timestamp display
Long Term
User authentication
Multi-user support
Note sharing
Rich text editor
File attachments
Mobile app

Interview Talking Points
When discussing this project:
Architecture Decision: Explain the dual-mode approach (localStorage vs API)
Security: Discuss parameterized queries and validation
Testing: Highlight TDD approach and 85% coverage
DevOps: Explain Docker usage and why it was chosen
Best Practices: Separation of concerns, environment variables, error handling
Trade-offs: Why PostgreSQL vs MongoDB, why Docker vs direct installation

Known Limitations
No authentication (single-user app)
No pagination (all notes loaded at once)
No search functionality
No rich text support
No offline support
No real-time collaboration
These are intentional scope decisions for a portfolio project.

Git Workflow
Branch Strategy
main branch for stable code
Feature branches for new work (optional for solo project)
Commit Message Convention
Add feature: description
Fix bug: description
Update: description
Refactor: description
Test: description
Docs: description


Collaboration Notes
For New Developers
Read this file first - it contains all context
Read .cursorrules - it contains coding standards
Run tests - verify everything works: npm test
Check Docker - ensure containers start: docker-compose up
Review tests - they document expected behavior
For AI Assistants (Claude/Cursor)
Reference this file for project context
Follow .cursorrules for coding standards
Write tests first (TDD approach)
Maintain test coverage (>70% overall)
Use established patterns from existing code

Debugging Tips
API Issues
# Check if API is running
curl http://localhost:3001/health

# Test endpoint manually
curl http://localhost:3001/api/notes

# Create note via curl
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content"}'

Database Issues
# Check containers
docker ps

# View database logs
docker-compose logs db

# Connect to database
docker exec -it quicknote-api-db-1 psql -U postgres quicknote

Frontend Issues
# Check console for errors (F12 in browser)
# Verify API URL in .env
# Check network tab for failed requests


Credits & Acknowledgments
Developer: Gabriel Vizcaino
Mentor: [Mentor name] - provided guidance on architecture and testing
AI Assistant: Claude (Anthropic) - code generation and learning support
Stack Overflow: Various solutions referenced during development

Version History
v1.0 (Jan 2026): Initial full-stack implementation
Backend API with PostgreSQL
Frontend with dual-mode support
Docker containerization
Comprehensive test suite
Documentation complete

Contact
GitHub: @gabrielvizcainomusiced-coder
Project Repos:
Frontend: github.com/gabrielvizcainomusiced-coder/QuickNote-Desktop
Backend: github.com/gabrielvizcainomusiced-coder/quicknote-api

Note to Future Developers (Including AI):
This file should be updated after each significant change or learning. It serves as the "memory" of the project and prevents having to re-explain context repeatedly. When you make changes, update relevant sections of this document.
Preventing Ralph Wiggum Loops:
If you're an AI reading this file, you have all the context needed to make intelligent suggestions without "forgetting" project decisions. Always reference this file before making recommendations that might conflict with established patterns or decisions.

