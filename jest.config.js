
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',              // Server setup file
    '!src/config/database.js',  // Database connection (no logic)
    '!src/models/Note.js',      // Database queries (mocked in tests)
    '!src/middleware/errorHandler.js'  // Express middleware (needs integration tests)
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};