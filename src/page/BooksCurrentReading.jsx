import { useContext, useEffect, useRef } from "react";
import "../styles/booksCurrentReadingStyles/booksCurrentReading.css";
import Back from "../components/Back";
import { currentReadingContext } from "../App";
import deleteIcon from "../assets/delete-icon.svg";
import deleteIconDarkMode from "../assets/delete-icon-darkmode.svg";
import deleteAllIcon from "../assets/delete-all-icon.svg";
import deleteAllIconDarkMode from "../assets/delete-all-icon-darkmode.svg";
import BookArchivedIcon from "../assets/book-archived-icon.svg";
import BookArchivedIconDarkMode from "../assets/book-archive-icon-darkmode.svg";
import noteWriteIcon from "../assets/note-write-icon.svg";
import noteWriteIconDarkMode from "../assets/note-write-icon-darkmode.svg";
import { motion } from "framer-motion";
import Toast, { notifyDeniedArchiving, notifyEmptyList } from "../components/Toast";
import {
  archiveBookAlert,
  archiveBookConfirm,
  deleteOneItemAlert,
  deleteOneItemConfirmed,
  deleteAllItemsAlert,
  deleteAllItemsConfirm,
  deleteOneBookWithNoteAlert,
  deleteAllBooksWithNoteAlert,
} from "../components/ConfirmAlert";
import { Link } from "react-router-dom";

function BooksCurrentReading({
  darkMode,
  currentReadingBookNotes,
  setCurrentReadingBookNotes,
  archivedBooks,
  setArchivedBooks,
  archivedBookNotes,
  setArchivedBookNotes,
}) {
  const { currentReadingBooks, setCurrentReadingBooks } = useContext(currentReadingContext);

  const booksRef = useRef();

  const handleClickBook = e => {
    if (e.target.nextElementSibling.style.bottom === "-1.8rem") {
      e.target.nextElementSibling.style.bottom = "1.8rem";
    } else {
      for (const child of booksRef.current.childNodes) {
        child.firstElementChild.nextElementSibling.style.bottom = "1.8rem";
      }
      e.target.nextElementSibling.style.bottom = "-1.8rem";
    }
  };

  const moveToArchivedBooks = e => {
    const foundNote = currentReadingBookNotes.filter(note => note.bookId === e.target.id);
    if (foundNote.length) {
      archiveBookAlert(darkMode).then(result => {
        if (result.isConfirmed) {
          const MovedBook = currentReadingBooks.filter(bookNotes => {
            return bookNotes.id === e.target.id;
          });
          setArchivedBooks([...MovedBook, ...archivedBooks]);

          const movedNotes = currentReadingBookNotes.filter(bookNotes => {
            return bookNotes.bookId === e.target.id;
          });
          setArchivedBookNotes([...movedNotes, ...archivedBookNotes]);

          const nonMovedNotes = currentReadingBookNotes.filter(bookNotes => {
            return bookNotes.bookId !== e.target.id;
          });
          setCurrentReadingBookNotes(nonMovedNotes);

          const nonMovedCurrentReadingBooks = currentReadingBooks.filter(bookNotes => {
            return bookNotes.id !== e.target.id;
          });
          setCurrentReadingBooks(nonMovedCurrentReadingBooks);
          archiveBookConfirm(darkMode);
        }
      });
    } else {
      notifyDeniedArchiving();
    }
  };

  const deleteCurrentReadingBooks = e => {
    const bookId = e.target.id;
    const foundNote = currentReadingBookNotes.filter(note => note.bookId === bookId);
    const alertPromise = foundNote.length
      ? deleteOneBookWithNoteAlert(darkMode)
      : deleteOneItemAlert(darkMode, "book");

    alertPromise.then(result => {
      if (result.isConfirmed) {
        const nonDeletedBooks = currentReadingBooks.filter(book => book.id !== bookId);
        const nonDeletedNotes = currentReadingBookNotes.filter(note => note.bookId !== bookId);
        setCurrentReadingBooks(nonDeletedBooks);
        setCurrentReadingBookNotes(nonDeletedNotes);
        deleteOneItemConfirmed(darkMode, "book");
      }
    });
  };

  const deleteAllCurrentReadingBooks = () => {
    if (currentReadingBooks.length) {
      if (currentReadingBookNotes.length) {
        deleteAllBooksWithNoteAlert(darkMode).then(result => {
          if (result.isConfirmed) {
            setCurrentReadingBooks([]);
            setCurrentReadingBookNotes([]);
            deleteAllItemsConfirm(darkMode, "books");
          }
        });
      } else {
        deleteAllItemsAlert(darkMode, "books").then(result => {
          if (result.isConfirmed) {
            setCurrentReadingBooks([]);
            setCurrentReadingBookNotes([]);
            deleteAllItemsConfirm(darkMode, "books");
          }
        });
      }
    } else {
      notifyEmptyList(' "current reading books" ');
    }
  };

  useEffect(() => {
    if (currentReadingBooks) {
      localStorage.setItem("current reading books", JSON.stringify(currentReadingBooks));
    }
  }, [currentReadingBooks]);

  useEffect(() => {
    if (currentReadingBookNotes) {
      localStorage.setItem("current reading book notes", JSON.stringify(currentReadingBookNotes));
    }
  }, [currentReadingBookNotes]);

  useEffect(() => {
    if (archivedBooks) {
      localStorage.setItem("archived books", JSON.stringify(archivedBooks));
    }
  }, [archivedBooks]);

  useEffect(() => {
    if (archivedBookNotes) {
      localStorage.setItem("archived book notes", JSON.stringify(archivedBookNotes));
    }
  }, [archivedBookNotes]);

  return (
    <motion.main
      className={
        darkMode ? "books-current-reading-container dark-mode" : "books-current-reading-container"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <Back darkMode={darkMode} />
      <h3 className="category-book">
        Current Reading books
        <img
          src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
          alt="delete all icon"
          onClick={deleteAllCurrentReadingBooks}
        />
      </h3>
      <section className="display-current-reading-books" ref={booksRef}>
        {currentReadingBooks
          ? currentReadingBooks.map(book => {
              return (
                <div key={book.id} className="books-displayed">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    onClick={handleClickBook}
                  />
                  <div className="see-and-delete-icons">
                    <Link to={`${book.id}`} state={{ bookId: book.id, currentBook: book }}>
                      <img
                        src={darkMode ? noteWriteIconDarkMode : noteWriteIcon}
                        alt="note write icon"
                      />
                    </Link>
                    <img
                      src={darkMode ? BookArchivedIconDarkMode : BookArchivedIcon}
                      alt="see book icon"
                      id={book.id}
                      onClick={moveToArchivedBooks}
                    />
                    <img
                      src={darkMode ? deleteIconDarkMode : deleteIcon}
                      alt="delete icon"
                      id={book.id}
                      onClick={deleteCurrentReadingBooks}
                    />
                  </div>
                </div>
              );
            })
          : null}
      </section>
      <Toast darkMode={darkMode} />
    </motion.main>
  );
}

export default BooksCurrentReading;
