import { useState } from "react";
import Home from "../page/Home";
import MyBooks from "../page/MyBooks";
import Searched from "../components/Searched";
import BooksCurrentReading from "../page/BooksCurrentReading";
import BooksFavorite from "../page/BooksFavorite";
import BooksToRead from "../page/BooksToRead";
import BooksHaveRead from "../page/BooksHaveRead";
import BooksArchived from "../page/BooksArchived";
import MyNotes from "../page/MyNotes";
import AllCurrentReadingBooksNotes from "../page/AllCurrentReadingBooksNotes";
import CurrentReadingBooksNotes from "../page/CurrentReadingBooksNotes";
import ArchivedBooksNotes from "../page/ArchivedBooksNotes";
import AllArchivedBooksNotes from "../page/AllArchivedBooksNotes";
import { Routes, Route, useLocation } from "react-router-dom";
import { getLocalStorage } from "../App";
import { AnimatePresence } from "framer-motion";
import WriteNote from "../components/WriteNote";

function AnimatedRoutes({ darkMode }) {
   const [archivedBooks, setArchivedBooks] = useState(() => getLocalStorage("archived books"));
   const [currentReadingBookNotes, setCurrentReadingBookNotes] = useState(() =>
      getLocalStorage("current reading book notes")
   );
   const [archivedBookNotes, setArchivedBookNotes] = useState(() =>
      getLocalStorage("archived book notes")
   );
   const [data, setData] = useState();
   const location = useLocation();

   const commonProps = {
      darkMode,
      archivedBooks,
      setArchivedBooks,
      currentReadingBookNotes,
      setCurrentReadingBookNotes,
      archivedBookNotes,
      setArchivedBookNotes
   };

   return (
      <main style={darkMode ? { backgroundColor: "#1f1f1f" } : { backgroundColor: "#ffffff" }}>
         <AnimatePresence>
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<Home darkMode={darkMode} data={data} setData={setData} />} />
               <Route path="mybooks">
                  <Route index element={<MyBooks darkMode={darkMode} />} />
                  <Route path="bookscurrentreading">
                     <Route index element={<BooksCurrentReading {...commonProps} />} />
                     <Route path=":id" element={<WriteNote darkMode={darkMode} currentReadingBookNotes={currentReadingBookNotes} setCurrentReadingBookNotes={setCurrentReadingBookNotes} />} />
                  </Route>
                  <Route path="favoritebooks" element={<BooksFavorite darkMode={darkMode} />} />
                  <Route path="bookstoread" element={<BooksToRead darkMode={darkMode} />} />
                  <Route path="bookshaveread" element={<BooksHaveRead darkMode={darkMode} />} />
                  <Route path="booksarchived" element={<BooksArchived {...commonProps} />} />
               </Route>
               <Route path="mynotes" element={<MyNotes darkMode={darkMode} />}>
                  <Route path="currentreadingbooksnotes">
                     <Route index element={<CurrentReadingBooksNotes darkMode={darkMode} currentReadingBookNotes={currentReadingBookNotes} setCurrentReadingBookNotes={setCurrentReadingBookNotes} />} />
                     <Route path=":id" element={<AllCurrentReadingBooksNotes darkMode={darkMode} currentReadingBookNotes={currentReadingBookNotes} setCurrentReadingBookNotes={setCurrentReadingBookNotes} />} />
                  </Route>
                  <Route path="archivedbooksnotes">
                     <Route index element={<ArchivedBooksNotes archivedBookNotes={archivedBookNotes} darkMode={darkMode} />} />
                     <Route path=":id" element={<AllArchivedBooksNotes darkMode={darkMode} archivedBookNotes={archivedBookNotes} setArchivedBookNotes={setArchivedBookNotes} />} />
                  </Route>
               </Route>
               <Route path="searchedbook/:booktitle" element={<Searched darkMode={darkMode} archivedBooks={archivedBooks} />} />
            </Routes>
         </AnimatePresence>
      </main>
   );
}

export default AnimatedRoutes;
