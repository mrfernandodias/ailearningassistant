import ChatHistory from '../models/ChatHistory.js';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

/**
 * @desc    Generate flashcards from document
 * @route   POST /api/ai/generate-flashcards
 * @access  Private
 */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or not ready',
        statusCode: 404,
      });
    }

    // Generate flashcards using Gemini
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count),
    );

    // Save to database
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate quiz from document
 * @route   POST /api/ai/generate-quiz
 * @access  Private
 */
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        statusCode: 404,
      });
    }

    // Generate quiz using Gemini
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions),
    );

    // Save to database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    res.status(200).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate document summary
 * @route   POST /api/ai/generate-summary
 * @access  Private
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a document id',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        statusCode: 404,
      });
    }

    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary,
      },
      message: 'Summary generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Chat with document
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document id and question',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        statusCode: 404,
      });
    }

    // Query expansion for better retrieval
    const expandedQueries = await geminiService.expandQuery(question);

    // Find relevant chunks using all query variations
    const allChunks = expandedQueries.flatMap((q) =>
      findRelevantChunks(document.chunks, q, 2),
    );

    // Remove duplicates and take top 5
    const uniqueChunks = Array.from(
      new Map(allChunks.map((c) => [c.chunkIndex, c])).values(),
    ).slice(0, 5);

    const chunkIndices = uniqueChunks.map((c) => c.chunkIndex);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: [],
      });
    }

    // Generate response using Gemini with conversation history
    const conversationHistory = chatHistory.messages || [];
    const answer = await geminiService.chatWithContext(
      question,
      uniqueChunks,
      conversationHistory,
    );

    // Save conversation
    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: Date(),
        relevantChunks: [],
      },
      {
        role: 'assistant',
        content: answer,
        timestamps: Date(),
        relevantChunks: chunkIndices,
      },
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
        expandedQueries, // Show what queries were used
      },
      message: 'Response generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Explain concept from document
 * @route   POST /api/ai/explain-concept
 * @access  Private
 */
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        message: 'Please provide document id and concept',
        statusCode: 400,
      });
    }

    const document = Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or not ready',
        statusCode: 404,
      });
    }

    // Find relevant chunks for the concept
    const relevantChunks = findRelevantChunks(
      (await document).chunks,
      concept,
      3,
    );
    const context = relevantChunks.map((c) => c.content).join('\n\n');

    // Generate explanation using Gemini
    const explanation = await geminiService.explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map((c) => c.chunkIndex),
      },
      message: 'Explanation generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history for a document
 * @route   GET /api/ai/chat-hist
 * @access  Private
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId,
    }).select('messages');

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No chat history found for this document',
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.messages || [],
      message: 'Chat history retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
