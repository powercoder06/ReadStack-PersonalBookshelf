import { useBooks } from "../../../contexts/BookContext";
import { usePerformanceMonitor } from "../../../hooks/usePerformanceMonitor";
import {
  notifyAlreadyAdded,
  notifySuccessfullyAdded,
  notifyAlreadyArchivedBook,
} from "../../Toast";
import logger from "../../../utils/logger";

// Icons
import BookCurrentReadingIcon from "../../../assets/book-current-reading-icon.svg";
import BookCurrentReadingIconDarkMode from "../../../assets/book-current-reading-icon-darkmode.svg";
import FavoriteBookIcon from "../../../assets/favorite-book-icon.svg";
import FavoriteBookIconDarkMode from "../../../assets/favorite-book-icon-darkmode.svg";
import BookToReadIcon from "../../../assets/book-to-read-icon.svg";
import BookToReadIconDarkMode from "../../../assets/book-to-read-icon-darkmode.svg";
import BookHaveReadIcon from "../../../assets/book-have-read-icon.svg";
import BookHaveReadIconDarkMode from "../../../assets/book-have-read-icon-darkmode.svg";

import "./BookActions.scss";

export const BookActions = ({ book, darkMode, archivedBooks }) => {
  const {
    currentReadingBooks,
    setCurrentReadingBooks,
    favoriteBooks,
    setFavoriteBooks,
    toReadBooks,
    setToReadBooks,
    haveReadBooks,
    setHaveReadBooks,
  } = useBooks();

  const { measureOperation } = usePerformanceMonitor("BookActions");

  const handleAddingBooks = measureOperation("addBook", (booksCategory, setBooksCategory, name) => {
    try {
      const foundBook = booksCategory?.find(existingBook => existingBook.id === book.id);
      if (foundBook) {
        notifyAlreadyAdded(name);
        logger.userAction("Book already in category", { category: name, bookId: book.id });
      } else {
        setBooksCategory([...booksCategory, book]);
        notifySuccessfullyAdded(name);
        logger.userAction("Book added to category", { category: name, bookId: book.id });
      }
    } catch (error) {
      logger.error("Failed to add book to category", {
        category: name,
        bookId: book.id,
        error: error.message,
      });
    }
  });

  const handleCurrentReadingBooks = () => {
    if (archivedBooks) {
      const foundArchivedBooks = archivedBooks.find(archivedBook => archivedBook.id === book.id);
      if (foundArchivedBooks) {
        notifyAlreadyArchivedBook();
        return;
      }
    }
    handleAddingBooks(currentReadingBooks, setCurrentReadingBooks, "Current reading");
  };

  const actions = [
    {
      id: "current-reading",
      icon: darkMode ? BookCurrentReadingIconDarkMode : BookCurrentReadingIcon,
      label: "add to 'current reading'",
      onClick: handleCurrentReadingBooks,
    },
    {
      id: "favorite",
      icon: darkMode ? FavoriteBookIconDarkMode : FavoriteBookIcon,
      label: "add to 'favorite'",
      onClick: () => handleAddingBooks(favoriteBooks, setFavoriteBooks, "Favorite"),
    },
    {
      id: "to-read",
      icon: darkMode ? BookToReadIconDarkMode : BookToReadIcon,
      label: "add to 'to read'",
      onClick: () => handleAddingBooks(toReadBooks, setToReadBooks, "To read"),
    },
    {
      id: "have-read",
      icon: darkMode ? BookHaveReadIconDarkMode : BookHaveReadIcon,
      label: "add to 'have read'",
      onClick: () => handleAddingBooks(haveReadBooks, setHaveReadBooks, "Have read"),
    },
  ];

  return (
    <div className={`book-actions ${darkMode ? "dark-mode" : ""}`}>
      {actions.map(action => (
        <div key={action.id} className="book-action">
          <img
            src={action.icon}
            alt={`${action.id} icon`}
            onClick={action.onClick}
            className="book-action__icon"
          />
          <p className="book-action__label">{action.label}</p>
        </div>
      ))}
    </div>
  );
};
