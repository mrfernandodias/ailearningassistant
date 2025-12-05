import { handleApiError } from '../utils/apiHelpers';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';

const generateFlashcards = async (documentId, options) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARD, {
      documentId,
      ...options,
    });

    return response.data;
  } catch (error) {
    handleApiError(error, 'generateFlashcards');
  }
};

const generateQuiz = async (documentId, options) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'generateQuiz');
  }
};

const generateSummary = async (documentId) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'generateSummary');
  }
};

const chat = async (documentId, message) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
      documentId,
      question: message,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'chat');
  }
};

const explainConcept = async (documentId, concept) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
      documentId,
      concept,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'explainConcept');
  }
};

const getChatHistory = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.AI.GET_CHAT_HISTORY(documentId),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'getChatHistory');
  }
};

const aiService = {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

export default aiService;
