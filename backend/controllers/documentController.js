import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { processPDF } from '../helpers/documentHelpers.js';
import ChatHistory from '../models/ChatHistory.js';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400,
      });
    }

    const { title } = req.body;

    if (!title) {
      // Delete uploaded file if no title provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400,
      });
    }

    // Build public path to be served via Express static
    const publicFilePath = `/uploads/documents/${req.file.filename}`;

    // Create document record (store public-relative path)
    const document = await Document.create({
      userId: req.user.id,
      title,
      fileName: req.file.originalname,
      filePath: publicFilePath, // Public path (served under /uploads)
      fileSize: req.file.size,
      status: 'processing',
    });

    // Process PDF in background (in production, use a queue like Bull)
    // Use physical path for processing
    processPDF(document._id, req.file.path).catch((err) => {
      console.error('PDF processing error: ', err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully. Processing in progress...',
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          // Count flashcard sets associated to the document
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document with chuncks
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404,
      });
    }

    // Get counts: number of flashcard sets and quizzes for this document
    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });
    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    // Update last accessed
    document.lastAccessed = Date.now();
    await document.save();

    // Combine document data with counts
    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
        statusCode: 404,
      });
    }

    // Cascade delete related resources
    try {
      await Promise.all([
        Flashcard.deleteMany({
          documentId: document._id,
          userId: req.user._id,
        }),
        Quiz.deleteMany({ documentId: document._id, userId: req.user._id }),
        ChatHistory.deleteMany({
          documentId: document._id,
          userId: req.user._id,
        }),
      ]);
    } catch (cascadeError) {
      console.warn(
        'Failed to cascade delete related resources:',
        cascadeError.message,
      );
    }

    // Resolve physical filesystem path from stored public path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const publicPath = document.filePath || '';
    const relativePath = publicPath.replace(/^\/+/, ''); // remove leading '/'
    const physicalPath = path.join(__dirname, '..', relativePath);

    // Delete file from filesystem
    try {
      await fs.unlink(physicalPath);
    } catch (unlinkError) {
      // Log error but don't fail the request (file may already be deleted)
      console.warn(
        `Failed to delete file: ${physicalPath}`,
        unlinkError.message,
      );
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
