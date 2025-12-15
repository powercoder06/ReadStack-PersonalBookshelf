import { useState } from "react";
import Home from "../pages/Home";
import MyBooks from "../pages/MyBooks";
import Searched from "../components/Searched";
import BooksCurrentReading from "../pages/BooksCurrentReading";
import BooksFavorite from "../pages/BooksFavorite";
import BooksToRead from "../pages/BooksToRead";
import BooksHaveRead from "../pages/BooksHaveRead";
import BooksArchived from "../pages/BooksArchived";
import MyNotes from "../pages/MyNotes";
import AllCurrentReadingBooksNotes from "../pages/AllCurrentReadingBooksNotes";
import CurrentReadingBooksNotes from "../pages/CurrentReadingBooksNotes";
import ArchivedBooksNotes from "../pages/ArchivedBooksNotes";
import AllArchivedBooksNotes from "../pages/AllArchivedBooksNotes";
import { Routes, Route, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AnimatePresence } from "framer-motion";
import WriteNote from "../components/WriteNote";

function AnimatedRoutes({ darkMode }) {
  const [archivedBooks, setArchivedBooks] = useLocalStorage("archived books");
  const [currentReadingBookNotes, setCurrentReadingBookNotes] = useLocalStorage(
    "current reading book notes"
  );
  const [archivedBookNotes, setArchivedBookNotes] = useLocalStorage("archived book notes");
  const location = useLocation();

  const commonProps = {
    darkMode,
    archivedBooks,
    setArchivedBooks,
    currentReadingBookNotes,
    setCurrentReadingBookNotes,
    archivedBookNotes,
    setArchivedBookNotes,
  };

  return (
    <main style={darkMode ? { backgroundColor: "#1f1f1f" } : { backgroundColor: "#ffffff" }}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="mybooks">
            <Route index element={<MyBooks darkMode={darkMode} />} />
            <Route path="bookscurrentreading">
              <Route index element={<BooksCurrentReading {...commonProps} />} />
              <Route
                path=":id"
                element={
                  <WriteNote
                    darkMode={darkMode}
                    currentReadingBookNotes={currentReadingBookNotes}
                    setCurrentReadingBookNotes={setCurrentReadingBookNotes}
                  />
                }
              />
            </Route>
            <Route path="favoritebooks" element={<BooksFavorite darkMode={darkMode} />} />
            <Route path="bookstoread" element={<BooksToRead darkMode={darkMode} />} />
            <Route path="bookshaveread" element={<BooksHaveRead darkMode={darkMode} />} />
            <Route path="booksarchived" element={<BooksArchived {...commonProps} />} />
          </Route>
          <Route path="mynotes" element={<MyNotes darkMode={darkMode} />}>
            <Route path="currentreadingbooksnotes">
              <Route
                index
                element={
                  <CurrentReadingBooksNotes
                    darkMode={darkMode}
                    currentReadingBookNotes={currentReadingBookNotes}
                    setCurrentReadingBookNotes={setCurrentReadingBookNotes}
                  />
                }
              />
              <Route
                path=":id"
                element={
                  <AllCurrentReadingBooksNotes
                    darkMode={darkMode}
                    currentReadingBookNotes={currentReadingBookNotes}
                    setCurrentReadingBookNotes={setCurrentReadingBookNotes}
                  />
                }
              />
            </Route>
            <Route path="archivedbooksnotes">
              <Route
                index
                element={
                  <ArchivedBooksNotes archivedBookNotes={archivedBookNotes} darkMode={darkMode} />
                }
              />
              <Route
                path=":id"
                element={
                  <AllArchivedBooksNotes
                    darkMode={darkMode}
                    archivedBookNotes={archivedBookNotes}
                    setArchivedBookNotes={setArchivedBookNotes}
                  />
                }
              />
            </Route>
          </Route>
          <Route
            path="searchedbook/:booktitle"
            element={<Searched darkMode={darkMode} archivedBooks={archivedBooks} />}
          />
        </Routes>
      </AnimatePresence>
    </main>
  );
}

export default AnimatedRoutes;
