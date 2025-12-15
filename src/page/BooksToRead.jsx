import { useContext, useEffect, useRef } from "react";
import "../styles/booksToReadStyles/booksToRead.css";
import Back from "../components/Back";
import { toReadBooksContext } from "../App";
import deleteIcon from "../assets/delete-icon.svg";
import deleteIconDarkMode from "../assets/delete-icon-darkmode.svg";
import deleteAllIcon from "../assets/delete-all-icon.svg";
import deleteAllIconDarkMode from "../assets/delete-all-icon-darkmode.svg";
import seeBookIcon from "../assets/see-book-icon.svg";
import seeBookIconDarkMode from "../assets/see-book-icon-darkmode.svg";
import { Link } from "react-router-dom";
import {
   deleteOneItemAlert,
   deleteOneItemConfirmed,
   deleteAllItemsAlert,
   deleteAllItemsConfirm,
} from "../components/ConfirmAlert";
import { motion } from "framer-motion";
import Toast, { notifyEmptyList } from "../components/Toast";

function BooksToRead({ darkMode }) {
   const { toReadBooks, setToReadBooks } = useContext(toReadBooksContext);

   const booksRef = useRef();

   const handleClickBook = (e) => {
      if (e.target.nextElementSibling.style.bottom === "-1.8rem") {
         e.target.nextElementSibling.style.bottom = "1.8rem";
      } else {
         for (const child of booksRef.current.childNodes) {
            child.firstElementChild.nextElementSibling.style.bottom = "1.8rem";
         }
         e.target.nextElementSibling.style.bottom = "-1.8rem";
      }
   };

   const deleteToReadBooks = (e) => {
      deleteOneItemAlert(darkMode, "book").then((result) => {
         if (result.isConfirmed) {
            const nonDeletedBooks = toReadBooks.filter((book) => book.id !== e.target.id);
            setToReadBooks(nonDeletedBooks);
            deleteOneItemConfirmed(darkMode, "book");
         }
      });
   };

   const deleteAllToReadBooks = () => {
      if (toReadBooks.length) {
         deleteAllItemsAlert(darkMode, "books").then((result) => {
            if (result.isConfirmed) {
               setToReadBooks([]);
               deleteAllItemsConfirm(darkMode, "books");
            }
         });
      } else {
         notifyEmptyList(' "to read books" ');
      }
   };

   useEffect(() => {
      if (toReadBooks) {
         localStorage.setItem("to read books", JSON.stringify(toReadBooks));
      }
   }, [toReadBooks]);

   return (
      <motion.main
         className={darkMode ? "books-to-read-container dark-mode" : "books-to-read-container"}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{
            opacity: 0,
         }}
      >
         <Back darkMode={darkMode} />
         <h3 className="category-book">
            To read Books
            <img
               src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
               alt="delete all icon"
               onClick={deleteAllToReadBooks}
            />
         </h3>
         <section className="display-to-read-books" ref={booksRef}>
            {toReadBooks
               ? toReadBooks.map((book) => {
                    return (
                       <div key={book.id} className="books-displayed">
                          <img
                             src={book.volumeInfo.imageLinks?.thumbnail}
                             alt={book.volumeInfo.title}
                             onClick={handleClickBook}
                          />
                          <div className="see-and-delete-icons">
                             <Link to={`/searchedbook/${book.id}`} state={{ bookDetails: book }}>
                                <img
                                   src={darkMode ? seeBookIconDarkMode : seeBookIcon}
                                   alt="see book icon"
                                />
                             </Link>
                             <img
                                src={darkMode ? deleteIconDarkMode : deleteIcon}
                                alt="delete icon"
                                id={book.id}
                                onClick={deleteToReadBooks}
                             />
                          </div>
                       </div>
                    );
                 })
               : null}
         </section>
         <Toast />
      </motion.main>
   );
}

export default BooksToRead;
