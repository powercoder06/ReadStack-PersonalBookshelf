import { useEffect } from "react";
import { useBooks } from "../../contexts/BookContext";

export const useBookActions = () => {
  const { currentReadingBooks, favoriteBooks, toReadBooks, haveReadBooks } = useBooks();

  // Persist book collections to localStorage
  useEffect(() => {
    if (currentReadingBooks) {
      localStorage.setItem("current reading books", JSON.stringify(currentReadingBooks));
    }
  }, [currentReadingBooks]);

  useEffect(() => {
    if (favoriteBooks) {
      localStorage.setItem("favorite books", JSON.stringify(favoriteBooks));
    }
  }, [favoriteBooks]);

  useEffect(() => {
    if (toReadBooks) {
      localStorage.setItem("to read books", JSON.stringify(toReadBooks));
    }
  }, [toReadBooks]);

  useEffect(() => {
    if (haveReadBooks) {
      localStorage.setItem("have read books", JSON.stringify(haveReadBooks));
    }
  }, [haveReadBooks]);

  return {
    currentReadingBooks,
    favoriteBooks,
    toReadBooks,
    haveReadBooks,
  };
};
