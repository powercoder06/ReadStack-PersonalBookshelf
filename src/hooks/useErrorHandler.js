import { useState, useCallback } from "react";
import { categorizeError, getErrorMessage } from "../utils/errorMessages";
import logger from "../utils/logger";
import errorReporter from "../utils/errorReporter";

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error, context = {}) => {
    const errorCategory = categorizeError(error);
    const userMessage = getErrorMessage(error.message, context.fallbackMessage);

    const errorInfo = {
      ...error,
      category: errorCategory,
      userMessage,
      timestamp: new Date().toISOString(),
    };

    setError(errorInfo);

    logger.error("Error handled by useErrorHandler", {
      error: error.message,
      stack: error.stack,
      category: errorCategory,
      ...context,
    });

    errorReporter.report(error, {
      source: "useErrorHandler",
      category: errorCategory,
      ...context,
    });

    return errorInfo;
  }, []);

  const retry = useCallback(
    async (retryFn, maxAttempts = 3) => {
      setIsRetrying(true);
      let lastError;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await retryFn();
          setError(null);
          setIsRetrying(false);
          return result;
        } catch (err) {
          lastError = err;
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      setIsRetrying(false);
      handleError(lastError, { retryAttempts: maxAttempts });
      throw lastError;
    },
    [handleError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isRetrying,
    handleError,
    retry,
    clearError,
  };
};
