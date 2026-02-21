const noteController = require('../../src/controllers/noteController');
const Note = require('../../src/models/Note');

// Mock the Note model
jest.mock('../../src/models/Note');

const pool = require('../../src/config/database');
afterAll(async () => {
  await pool.end();
});

describe('Note Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create mock request and response objects
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('createNote', () => {
    it('should create a note with valid title and content', async () => {
      // Arrange
      req.body = {
        title: 'Test Note',
        content: 'Test Content'
      };
      
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      Note.create.mockResolvedValue(mockNote);

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(Note.create).toHaveBeenCalledWith('Test Note', 'Test Content');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNote);
    });

    it('should return 400 if title is missing', async () => {
      // Arrange
      req.body = {
        content: 'Test Content'
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title and content are required'
      });
    });

    it('should return 400 if content is missing', async () => {
      // Arrange
      req.body = {
        title: 'Test Note'
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title and content are required'
      });
    });

    it('should return 400 if title is empty after trimming', async () => {
      // Arrange
      req.body = {
        title: '   ',
        content: 'Test Content'
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title cannot be empty'
      });
    });

    it('should return 400 if content is empty after trimming', async () => {
      // Arrange
      req.body = {
        title: 'Test Note',
        content: '   '
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Content cannot be empty'
      });
    });

    it('should return 400 if both title and content are empty after trimming', async () => {
      // Tests that title validation happens first (order matters)
      // Arrange
      req.body = {
        title: '   ',
        content: '   '
      };

      // Act
      await noteController.createNote(req, res);

      // Assert - Should fail on title first
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title cannot be empty'
      });
    });

    it('should trim whitespace from title and content', async () => {
      // Arrange
      req.body = {
        title: '  Test Note  ',
        content: '  Test Content  '
      };
      
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content'
      };
      
      Note.create.mockResolvedValue(mockNote);

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(Note.create).toHaveBeenCalledWith('Test Note', 'Test Content');
    });

    it('should return 400 if title exceeds maximum length', async () => {
      // Arrange
      const longTitle = 'a'.repeat(256); // 256 characters (max is 255)
      req.body = {
        title: longTitle,
        content: 'Test Content'
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title must be 255 characters or less'
      });
    });

    it('should return 400 if content exceeds maximum length', async () => {
      // Arrange
      const longContent = 'a'.repeat(501); // 501 characters (max is 500)
      req.body = {
        title: 'Test Note',
        content: longContent
      };

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Content must be 500 characters or less'
      });
    });

    it('should sanitize HTML tags from title and content', async () => {
      // Arrange
      req.body = {
        title: 'Test <script>alert("xss")</script> Note',
        content: 'Content with <b>HTML</b> tags'
      };
      
      const mockNote = {
        id: 1,
        title: 'Test alert("xss") Note',
        content: 'Content with HTML tags'
      };
      
      Note.create.mockResolvedValue(mockNote);

      // Act
      await noteController.createNote(req, res);

      // Assert - HTML tags should be stripped, content preserved
      expect(Note.create).toHaveBeenCalledWith(
        'Test alert("xss") Note',
        'Content with HTML tags'
      );
    });

    it('should return 500 if database error occurs', async () => {
      // Arrange
      req.body = {
        title: 'Test Note',
        content: 'Test Content'
      };
      
      Note.create.mockRejectedValue(new Error('Database error'));

      // Act
      await noteController.createNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create note'
      });
    });
  });

  describe('getAllNotes', () => {
    it('should return all notes', async () => {
      // Arrange
      const mockNotes = [
        { id: 1, title: 'Note 1', content: 'Content 1' },
        { id: 2, title: 'Note 2', content: 'Content 2' }
      ];
      
      Note.findAll.mockResolvedValue(mockNotes);

      // Act
      await noteController.getAllNotes(req, res);

      // Assert
      expect(Note.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockNotes);
    });

    it('should return empty array and default 200 status when no notes exist', async () => {
      // Arrange
      Note.findAll.mockResolvedValue([]);

      // Act
      await noteController.getAllNotes(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
      // Proves we don't explicitly set status for 200
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 500 if database error occurs', async () => {
      // Arrange
      Note.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      await noteController.getAllNotes(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch notes'
      });
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      // Arrange
      req.params.id = '1';
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content'
      };
      
      Note.findById.mockResolvedValue(mockNote);

      // Act
      await noteController.getNoteById(req, res);

      // Assert
      expect(Note.findById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockNote);
    });

    it('should return 404 if note not found', async () => {
      // Arrange
      req.params.id = '999';
      Note.findById.mockResolvedValue(null);

      // Act
      await noteController.getNoteById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Note not found'
      });
    });

    it('should return 500 if database error occurs', async () => {
      // Arrange
      req.params.id = '1';
      Note.findById.mockRejectedValue(new Error('Database error'));

      // Act
      await noteController.getNoteById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch note'
      });
    });
  });

  describe('updateNote', () => {
    it('should update a note with valid data', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      const mockNote = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      Note.update.mockResolvedValue(mockNote);

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(Note.update).toHaveBeenCalledWith('1', 'Updated Title', 'Updated Content');
      expect(res.json).toHaveBeenCalledWith(mockNote);
    });

    it('should return 400 if title is missing', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        content: 'Updated Content'
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if content is missing', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: 'Updated Title'
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title and content are required'
      });
    });

    it('should return 400 if title is empty after trimming', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: '   ',
        content: 'Updated Content'
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title cannot be empty'
      });
    });

    it('should return 400 if content is empty after trimming', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: 'Updated Title',
        content: '   '
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Content cannot be empty'
      });
    });

    it('should trim whitespace from updated title and content', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: '  Updated Title  ',
        content: '  Updated Content  '
      };
      
      const mockNote = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      Note.update.mockResolvedValue(mockNote);

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(Note.update).toHaveBeenCalledWith('1', 'Updated Title', 'Updated Content');
    });

    it('should return 400 if updated title exceeds maximum length', async () => {
      // Arrange
      const longTitle = 'a'.repeat(256); // 256 characters (max is 255)
      req.params.id = '1';
      req.body = {
        title: longTitle,
        content: 'Updated Content'
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title must be 255 characters or less'
      });
    });

    it('should return 400 if updated content exceeds maximum length', async () => {
      // Arrange
      const longContent = 'a'.repeat(501); // 501 characters (max is 500)
      req.params.id = '1';
      req.body = {
        title: 'Updated Title',
        content: longContent
      };

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Content must be 500 characters or less'
      });
    });

    it('should return 404 if note not found', async () => {
      // Arrange
      req.params.id = '999';
      req.body = {
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      Note.update.mockResolvedValue(null);

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 if database error occurs', async () => {
      // Arrange
      req.params.id = '1';
      req.body = {
        title: 'Updated Title',
        content: 'Updated Content'
      };
      
      Note.update.mockRejectedValue(new Error('Database error'));

      // Act
      await noteController.updateNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to update note'
      });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      // Arrange
      req.params.id = '1';
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content'
      };
      
      Note.delete.mockResolvedValue(mockNote);

      // Act
      await noteController.deleteNote(req, res);

      // Assert
      expect(Note.delete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note deleted successfully',
        note: mockNote
      });
    });

    it('should return 404 if note not found', async () => {
      // Arrange
      req.params.id = '999';
      Note.delete.mockResolvedValue(null);

      // Act
      await noteController.deleteNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 if database error occurs', async () => {
      // Arrange
      req.params.id = '1';
      Note.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await noteController.deleteNote(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to delete note'
      });
    });
  });
});