require('dotenv').config();
const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');
const Note = require('./models/Note');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuickNote API is running' });
});

// API Routes
app.use('/api', noteRoutes);

// Error handling
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await Note.createTable();
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;