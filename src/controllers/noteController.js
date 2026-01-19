const Note = require('../models/Note');

const noteController = {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          error: 'Title and content are required'
        });
      }

      if (title.trim().length === 0) {
        return res.status(400).json({
          error: 'Title cannot be empty'
        });
      }

      const note = await Note.create(title.trim(), content.trim());
      
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

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          error: 'Title and content are required'
        });
      }

      if (title.trim().length === 0) {
        return res.status(400).json({
          error: 'Title cannot be empty'
        });
      }

      const note = await Note.update(id, title.trim(), content.trim());

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