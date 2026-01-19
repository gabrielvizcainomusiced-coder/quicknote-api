const noteController = require('../../src/controllers/noteController');
const Note = require('../../src/models/Note');

// Mock the Note model
jest.mock('../../src/models/Note');

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

    it('should return empty array if no notes exist', async () => {
      // Arrange
      Note.findAll.mockResolvedValue([]);

      // Act
      await noteController.getAllNotes(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
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
  });
});