import { useState, useEffect } from "react";
import { usePerformanceMonitor } from "../usePerformanceMonitor";
import logger from "../../utils/logger";

export const useBookRating = (bookId, initialRating = 0) => {
  const [rating, setRating] = useState(initialRating);
  const { measureOperation } = usePerformanceMonitor("BookRating");

  // Load rating from session storage on mount
  useEffect(() => {
    if (bookId) {
      const savedRating = sessionStorage.getItem(bookId);
      if (savedRating) {
        setRating(parseInt(savedRating));
      }
    }
  }, [bookId]);

  // Save rating to session storage when it changes
  useEffect(() => {
    if (bookId && rating > 0) {
      sessionStorage.setItem(bookId, rating.toString());
    }
  }, [bookId, rating]);

  const updateRating = measureOperation("setRating", newRating => {
    setRating(newRating);
    logger.userAction("Book rated", { bookId, rating: newRating });
  });

  return {
    rating,
    updateRating,
  };
};
