import { useState, useEffect } from "react";
import logger from "../utils/logger";
import { getErrorMessage } from "../utils/errorMessages";

export const useLocalStorage = (key, initialValue = []) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error("Failed to parse localStorage item", {
        item: key,
        error: error.message,
        userMessage: getErrorMessage("STORAGE_ERROR"),
      });
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error("Failed to save to localStorage", {
        item: key,
        error: error.message,
      });
    }
  }, [key, value]);

  return [value, setValue];
};
