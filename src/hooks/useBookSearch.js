import { useState } from "react";
import { bookService } from "../services/bookService";
import { useErrorHandler } from "./useErrorHandler";
import logger from "../utils/logger";

export const useBookSearch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error, handleError, retry, clearError } = useErrorHandler();

  const searchBooks = async query => {
    if (!query.trim()) {
      logger.warn("Empty search query provided");
      return;
    }

    setLoading(true);
    clearError();

    try {
      logger.userAction("Book search initiated", { query });
      const results = await bookService.searchBooks(query);
      setData(results);

      logger.info("Book search successful", {
        query,
        resultCount: results.length,
      });
    } catch (err) {
      handleError(err, {
        operation: "book-search",
        query,
        fallbackMessage: "Failed to search for books. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const retrySearch = async query => {
    try {
      await retry(() => bookService.searchBooks(query));
      // If retry succeeds, update data
      const results = await bookService.searchBooks(query);
      setData(results);
    } catch (err) {
      // Error is already handled by retry function
    }
  };

  return {
    data,
    loading,
    error,
    searchBooks,
    retrySearch,
    clearError,
  };
};
