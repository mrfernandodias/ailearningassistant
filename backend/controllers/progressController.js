import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

/**
 * Helper: Get document statistics
 */
const getDocumentStats = async userId => {
  const totalDocuments = await Document.countDocuments({ userId });

  const recentDocuments = await Document.find({ userId })
    .sort({ lastAccessed: -1 })
    .limit(5)
    .select('title fileName lastAccessed status')
    .lean();

  return { totalDocuments, recentDocuments };
};

/**
 * Helper: Get flashcard statistics using aggregation
 */
const getFlashcardStats = async userId => {
  const stats = await Flashcard.aggregate([
    { $match: { userId } },
    { $unwind: '$cards' },
    {
      $group: {
        _id: null,
        totalSets: { $addToSet: '$_id' },
        totalFlashcards: { $sum: 1 },
        reviewedFlashcards: {
          $sum: { $cond: [{ $gt: ['$cards.reviewCount', 0] }, 1, 0] },
        },
        starredFlashcards: {
          $sum: { $cond: ['$cards.isStarred', 1, 0] },
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      totalFlashcardSets: 0,
      totalFlashcards: 0,
      reviewedFlashcards: 0,
      starredFlashcards: 0,
    };
  }

  return {
    totalFlashcardSets: stats[0].totalSets.length,
    totalFlashcards: stats[0].totalFlashcards,
    reviewedFlashcards: stats[0].reviewedFlashcards,
    starredFlashcards: stats[0].starredFlashcards,
  };
};

/**
 * Helper: Get quiz statistics using aggregation
 */
const getQuizStats = async userId => {
  const stats = await Quiz.aggregate([
    { $match: { userId } },
    {
      $facet: {
        overview: [
          {
            $group: {
              _id: null,
              totalQuizzes: { $sum: 1 },
              completedQuizzes: {
                $sum: { $cond: [{ $ne: ['$completedAt', null] }, 1, 0] },
              },
              averageScore: {
                $avg: {
                  $cond: [{ $ne: ['$completedAt', null] }, '$score', null],
                },
              },
            },
          },
        ],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'documents',
              localField: 'documentId',
              foreignField: '_id',
              as: 'documentInfo',
            },
          },
          { $unwind: { path: '$documentInfo', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              title: 1,
              score: 1,
              totalQuestions: 1,
              completedAt: 1,
              documentId: { $ifNull: ['$documentInfo._id', null] },
              documentTitle: { $ifNull: ['$documentInfo.title', 'Unknown'] },
            },
          },
        ],
      },
    },
  ]);

  const overview = stats[0].overview[0] || {
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
  };

  const recentQuizzes = stats[0].recent.map(quiz => ({
    _id: quiz._id,
    title: quiz.title,
    score: quiz.score,
    totalQuestions: quiz.totalQuestions,
    completedAt: quiz.completedAt,
    documentId: quiz.documentId
      ? {
          _id: quiz.documentId,
          title: quiz.documentTitle,
        }
      : null,
  }));

  return {
    totalQuizzes: overview.totalQuizzes,
    completedQuizzes: overview.completedQuizzes,
    averageScore: Math.round(overview.averageScore || 0),
    recentQuizzes,
  };
};

/**
 * Helper: Calculate study streak (placeholder for future implementation)
 */
const getStudyStreak = async userId => {
  // TODO: Implement proper streak tracking with daily activity logs
  // For now, return mock data
  return Math.floor(Math.random() * 7) + 1;
};

/**
 * @desc    Get user learning dashboard with comprehensive statistics
 * @route   GET /api/progress/dashboard
 * @access  Private
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Execute all queries in parallel for maximum performance
    const [documentStats, flashcardStats, quizStats, studyStreak] = await Promise.all([
      getDocumentStats(userId),
      getFlashcardStats(userId),
      getQuizStats(userId),
      getStudyStreak(userId),
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments: documentStats.totalDocuments,
          totalFlashcardSets: flashcardStats.totalFlashcardSets,
          totalFlashcards: flashcardStats.totalFlashcards,
          reviewedFlashcards: flashcardStats.reviewedFlashcards,
          starredFlashcards: flashcardStats.starredFlashcards,
          totalQuizzes: quizStats.totalQuizzes,
          completedQuizzes: quizStats.completedQuizzes,
          averageScore: quizStats.averageScore,
          studyStreak,
        },
        recentActivity: {
          documents: documentStats.recentDocuments,
          quizzes: quizStats.recentQuizzes,
        },
      },
      message: 'Operation successful',
    });
  } catch (error) {
    next(error);
  }
};
