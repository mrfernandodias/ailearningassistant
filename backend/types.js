/**
 * ============================================================================
 * GLOBAL TYPE DEFINITIONS
 * ============================================================================
 *
 * Centralized JSDoc type definitions for the entire backend.
 * Import this file once to get autocomplete in all controllers.
 *
 * This is a workaround for JavaScript projects that don't use TypeScript.
 * For better type safety, consider migrating to TypeScript.
 * ============================================================================
 */

/**
 * Express Request, Response, NextFunction types
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * User Document from MongoDB with Mongoose methods
 * @typedef {Object} UserDocument
 * @property {string} _id - User ID
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {string} password - Hashed password
 * @property {string|null} profileImage - Profile image URL
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 * @property {function(string): Promise<boolean>} matchPassword - Compare password with hash
 * @property {function(): Promise<UserDocument>} save - Save document to database
 */

/**
 * Document (PDF) from MongoDB
 * @typedef {Object} DocumentDocument
 * @property {string} _id - Document ID
 * @property {string} userId - Owner user ID
 * @property {string} title - Document title
 * @property {string} fileName - Original file name
 * @property {string} filePath - File path on server
 * @property {number} fileSize - File size in bytes
 * @property {string} extractedText - Full extracted text from PDF
 * @property {Array<Object>} chunks - Text chunks for AI processing
 * @property {Date} uploadDate - Upload timestamp
 * @property {Date} lastAccessed - Last access timestamp
 * @property {'processing'|'ready'|'failed'} status - Processing status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * Quiz Document from MongoDB
 * @typedef {Object} QuizDocument
 * @property {string} _id - Quiz ID
 * @property {string} userId - User ID
 * @property {string} documentId - Related document ID
 * @property {Array<Object>} questions - Quiz questions array
 * @property {Array<Object>} userAnswers - User's submitted answers
 * @property {number} score - Final score
 * @property {number} totalQuestions - Total number of questions
 * @property {Date|null} completedAt - Completion timestamp
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * Flashcard Document from MongoDB
 * @typedef {Object} FlashcardDocument
 * @property {string} _id - Flashcard set ID
 * @property {string} userId - User ID
 * @property {string} documentId - Related document ID
 * @property {Array<Object>} cards - Flashcards array
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * ChatHistory Document from MongoDB
 * @typedef {Object} ChatHistoryDocument
 * @property {string} _id - Chat history ID
 * @property {string} userId - User ID
 * @property {string} documentId - Related document ID
 * @property {Array<Object>} messages - Chat messages array
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

// Export empty object to make this a module
export {};
