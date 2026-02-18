const Note = require('../models/Note');

/**
 * UPDATES MADE TO THIS FILE:
 * 
 * 1. Added content validation (empty string check after trimming)
 *    - Previously only validated title, not content
 *    - Now both createNote and updateNote check content isn't just whitespace
 * 
 * 2. Added input sanitization for security
 *    - Strips HTML/script tags to prevent XSS attacks
 *    - Applied to both title and content before saving
 * 
 * 3. Added length validation for production-readiness
 *    - Title max: 255 characters (matches database VARCHAR limit)
 *    - Content max: 10,000 characters (prevents database bloat)
 *    - Returns clear error messages when exceeded
 * 
 * WHY THESE CHANGES:
 * - Content validation: Bug fix - users could create notes with empty content
 * - Sanitization: Security - prevents stored XSS attacks
 * - Length limits: Production-ready - prevents abuse and database issues
 */

// Configuration constants
const MAX_TITLE_LENGTH = 255;
const MAX_CONTENT_LENGTH = 10000;

/**
 * Sanitize user input by removing HTML/script tags
 * Prevents XSS (Cross-Site Scripting) attacks
 * @param {string} str - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitize = (str) => {
  return str.replace(/<[^>]*>/g, '');
};

const noteController = {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;

      // VALIDATION STEP 1: Check fields exist
      if (!title || !content) {
        return res.status(400).json({
          error: 'Title and content are required'
        });
      }

      // VALIDATION STEP 2: Check title isn't empty after trimming
      // (Prevents "   " being accepted as valid)
      if (title.trim().length === 0) {
        return res.status(400).json({
          error: 'Title cannot be empty'
        });
      }

      // NEW: VALIDATION STEP 3: Check content isn't empty after trimming
      // Previously missing - this was a bug!
      if (content.trim().length === 0) {
        return res.status(400).json({
          error: 'Content cannot be empty'
        });
      }

      // NEW: VALIDATION STEP 4: Check title length
      // Prevents database errors and abuse
      if (title.trim().length > MAX_TITLE_LENGTH) {
        return res.status(400).json({
          error: `Title must be ${MAX_TITLE_LENGTH} characters or less`
        });
      }

      // NEW: VALIDATION STEP 5: Check content length
      // Prevents extremely large notes that could cause performance issues
      if (content.trim().length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({
          error: `Content must be ${MAX_CONTENT_LENGTH} characters or less`
        });
      }

      // NEW: Sanitize inputs before saving
      // This removes any HTML tags that could be used for XSS attacks
      const sanitizedTitle = sanitize(title.trim());
      const sanitizedContent = sanitize(content.trim());

      // Create note with sanitized inputs
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

      // VALIDATION STEP 1: Check fields exist
      if (!title || !content) {
        return res.status(400).json({
          error: 'Title and content are required'
        });
      }

      // VALIDATION STEP 2: Check title isn't empty after trimming
      if (title.trim().length === 0) {
        return res.status(400).json({
          error: 'Title cannot be empty'
        });
      }

      // NEW: VALIDATION STEP 3: Check content isn't empty after trimming
      // Previously missing - same bug as createNote
      if (content.trim().length === 0) {
        return res.status(400).json({
          error: 'Content cannot be empty'
        });
      }

      // NEW: VALIDATION STEP 4: Check title length
      if (title.trim().length > MAX_TITLE_LENGTH) {
        return res.status(400).json({
          error: `Title must be ${MAX_TITLE_LENGTH} characters or less`
        });
      }

      // NEW: VALIDATION STEP 5: Check content length
      if (content.trim().length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({
          error: `Content must be ${MAX_CONTENT_LENGTH} characters or less`
        });
      }

      // NEW: Sanitize inputs before updating
      const sanitizedTitle = sanitize(title.trim());
      const sanitizedContent = sanitize(content.trim());

      // Update note with sanitized inputs
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