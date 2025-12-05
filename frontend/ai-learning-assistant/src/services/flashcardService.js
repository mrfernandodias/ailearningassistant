import { handleApiError } from '../utils/apiHelpers';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';

const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS_SETS,
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'getAllFlashcardSets');
  }
};

const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'getFlashcardsForDocument');
  }
};

const reviewFlashcard = async (cardId, cardIndex) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),
      { cardIndex },
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'reviewFlashcard');
  }
};

const toggleStar = async (cardId) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'toggleStar');
  }
};

const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id),
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'deleteFlashcardSet');
  }
};

const flashcardService = {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStar,
  deleteFlashcardSet,
};

export default flashcardService;
