export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection and try again.",
  BOOK_SEARCH_FAILED: "We couldn't find any books. Please try a different search term.",
  STORAGE_ERROR: "Unable to save your changes. Please try again.",
  BOOK_LOAD_ERROR: "We're having trouble loading your books. Please refresh the page.",
  NOTE_SAVE_ERROR: "Your note couldn't be saved. Please try again.",
  GENERIC_ERROR: "Something went wrong. Please try again or refresh the page.",
};

export const getErrorMessage = (errorType, fallback = ERROR_MESSAGES.GENERIC_ERROR) => {
  return ERROR_MESSAGES[errorType] || fallback;
};
