const request = require('supertest');
const app = require('../../src/app');
const Note = require('../../src/models/Note');

// Mock the Note model to avoid actual database calls
jest.mock('../../src/models/Note');

const pool = require('../../src/config/database');
afterAll(async () => {
  await pool.end();
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Note Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const mockNote = {
        id: 1,
        title: 'Integration Test',
        content: 'Test Content',
        created_at: new Date(),
        updated_at: new Date()
      };

      Note.create.mockResolvedValue(mockNote);

      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Integration Test',
          content: 'Test Content'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Integration Test');
      expect(response.body.content).toBe('Test Content');
    });

    it('should return 400 for missing content', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test'
          // Missing content
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    // NEW: Whitespace-only content should also be rejected
    it('should return 400 for whitespace-only content', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: '   '
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Content cannot be empty');
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      const mockNotes = [
        { id: 1, title: 'Note 1', content: 'Content 1' },
        { id: 2, title: 'Note 2', content: 'Content 2' }
      ];

      Note.findAll.mockResolvedValue(mockNotes);

      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Note 1');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a single note', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content'
      };

      Note.findById.mockResolvedValue(mockNote);

      const response = await request(app)
        .get('/api/notes/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Test Note');
    });

    it('should return 404 for non-existent note', async () => {
      Note.findById.mockResolvedValue(null);

      await request(app)
        .get('/api/notes/999')
        .expect(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const mockNote = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content'
      };

      Note.update.mockResolvedValue(mockNote);

      const response = await request(app)
        .put('/api/notes/1')
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
    });

    // NEW: Invalid data should be rejected
    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put('/api/notes/1')
        .send({
          title: '   ',
          content: 'Updated Content'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Title cannot be empty');
    });

    // NEW: Updating a note that doesn't exist
    it('should return 404 for non-existent note', async () => {
      Note.update.mockResolvedValue(null);

      await request(app)
        .put('/api/notes/999')
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        })
        .expect(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content'
      };

      Note.delete.mockResolvedValue(mockNote);

      const response = await request(app)
        .delete('/api/notes/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Note deleted successfully');
    });

    // NEW: Deleting a note that doesn't exist
    it('should return 404 for non-existent note', async () => {
      Note.delete.mockResolvedValue(null);

      await request(app)
        .delete('/api/notes/999')
        .expect(404);
    });
  });
});