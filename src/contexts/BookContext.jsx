import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within BookProvider");
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [currentReadingBooks, setCurrentReadingBooks] = useLocalStorage("current reading books");
  const [favoriteBooks, setFavoriteBooks] = useLocalStorage("favorite books");
  const [toReadBooks, setToReadBooks] = useLocalStorage("to read books");
  const [haveReadBooks, setHaveReadBooks] = useLocalStorage("have read books");

  const value = {
    currentReadingBooks,
    setCurrentReadingBooks,
    favoriteBooks,
    setFavoriteBooks,
    toReadBooks,
    setToReadBooks,
    haveReadBooks,
    setHaveReadBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
