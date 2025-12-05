/**
 * Centralized API error handler
 * Logs errors consistently and throws standardized error objects
 *
 * @param {Error} error - The error object from axios
 * @param {string} context - The function/context where the error occurred
 * @throws {Object} Standardized error object with message
 */
export const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error.message);
  throw error.response?.data || { message: 'An unknown error occurred' };
};
