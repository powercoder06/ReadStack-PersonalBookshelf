export const ERROR_TYPES = {
  NETWORK: "NETWORK",
  API: "API",
  STORAGE: "STORAGE",
  VALIDATION: "VALIDATION",
  PERMISSION: "PERMISSION",
  TIMEOUT: "TIMEOUT",
  GENERIC: "GENERIC",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection and try again.",
  BOOK_SEARCH_FAILED: "We couldn't find any books. Please try a different search term.",
  STORAGE_ERROR: "Unable to save your changes. Please try again.",
  BOOK_LOAD_ERROR: "We're having trouble loading your books. Please refresh the page.",
  NOTE_SAVE_ERROR: "Your note couldn't be saved. Please try again.",
  GENERIC_ERROR: "Something went wrong. Please try again or refresh the page.",
  API_TIMEOUT: "Request timed out. Please try again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  VALIDATION_ERROR: "Please check your input and try again.",
  OFFLINE_ERROR: "You're currently offline. Changes will be saved when connection is restored.",
};

export const getErrorMessage = (errorType, fallback = ERROR_MESSAGES.GENERIC_ERROR) => {
  return ERROR_MESSAGES[errorType] || fallback;
};

export const categorizeError = error => {
  if (!navigator.onLine) return ERROR_TYPES.NETWORK;
  if (error.name === "TypeError" && error.message.includes("fetch")) return ERROR_TYPES.NETWORK;
  if (error.message.includes("timeout")) return ERROR_TYPES.TIMEOUT;
  if (error.message.includes("permission")) return ERROR_TYPES.PERMISSION;
  if (error.message.includes("validation")) return ERROR_TYPES.VALIDATION;
  if (error.status >= 400 && error.status < 500) return ERROR_TYPES.API;
  if (error.status >= 500) return ERROR_TYPES.API;
  return ERROR_TYPES.GENERIC;
};
