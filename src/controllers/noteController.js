const Note = require('../models/Note');

const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 500;

/**
 * Strips HTML tags from user input to prevent stored XSS attacks.
 */
const sanitize = (str) => str.replace(/<[^>]*>/g, '');

const noteController = {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      if (title.trim().length === 0) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }

      if (content.trim().length === 0) {
        return res.status(400).json({ error: 'Content cannot be empty' });
      }

      if (title.trim().length > MAX_TITLE_LENGTH) {
        return res.status(400).json({ error: `Title must be ${MAX_TITLE_LENGTH} characters or less` });
      }

      if (content.trim().length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({ error: `Content must be ${MAX_CONTENT_LENGTH} characters or less` });
      }

      const sanitizedTitle = sanitize(title.trim());
      const sanitizedContent = sanitize(content.trim());

      const note = await Note.create(sanitizedTitle, sanitizedContent);
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  },

  async getAllNotes(req, res) {
    try {
      const notes = await Note.findAll();
      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  },

  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const note = await Note.findById(id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  },

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      if (title.trim().length === 0) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }

      if (content.trim().length === 0) {
        return res.status(400).json({ error: 'Content cannot be empty' });
      }

      if (title.trim().length > MAX_TITLE_LENGTH) {
        return res.status(400).json({ error: `Title must be ${MAX_TITLE_LENGTH} characters or less` });
      }

      if (content.trim().length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({ error: `Content must be ${MAX_CONTENT_LENGTH} characters or less` });
      }

      const sanitizedTitle = sanitize(title.trim());
      const sanitizedContent = sanitize(content.trim());

      const note = await Note.update(id, sanitizedTitle, sanitizedContent);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  },

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const note = await Note.delete(id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json({ message: 'Note deleted successfully', note });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  }
};

module.exports = noteController;