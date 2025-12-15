import { useContext, useEffect, useRef } from "react";
import "../styles/booksHaveReadStyles/booksHaveRead.css";
import Back from "../components/Back";
import { haveReadBooksContext } from "../App";
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

function BooksHaveRead({ darkMode }) {
  const { haveReadBooks, setHaveReadBooks } = useContext(haveReadBooksContext);

  const booksRef = useRef();

  const handleClickBook = e => {
    if (!e.target.nextElementSibling || !booksRef.current) return;

    if (e.target.nextElementSibling.style.bottom === "-1.8rem") {
      e.target.nextElementSibling.style.bottom = "1.8rem";
    } else {
      for (const child of booksRef.current.childNodes) {
        child.firstElementChild.nextElementSibling.style.bottom = "1.8rem";
      }
      e.target.nextElementSibling.style.bottom = "-1.8rem";
    }
  };

  const deleteHaveReadBooks = e => {
    deleteOneItemAlert(darkMode, "book").then(result => {
      if (result.isConfirmed) {
        const nonDeletedBooks = haveReadBooks.filter(book => book.id !== e.target.id);
        setHaveReadBooks(nonDeletedBooks);
        deleteOneItemConfirmed(darkMode, "book");
      }
    });
  };

  const deleteAllHaveReadBooks = () => {
    if (haveReadBooks.length) {
      deleteAllItemsAlert(darkMode, "books").then(result => {
        if (result.isConfirmed) {
          setHaveReadBooks([]);
          deleteAllItemsConfirm(darkMode, "books");
        }
      });
    } else {
      notifyEmptyList(' "have read books" ');
    }
  };

  useEffect(() => {
    if (haveReadBooks) {
      localStorage.setItem("have read books", JSON.stringify(haveReadBooks));
    }
  }, [haveReadBooks]);

  return (
    <motion.main
      className={darkMode ? "books-have-read-container dark-mode" : "books-have-read-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <Back darkMode={darkMode} />
      <h3 className="category-book">
        Have read books
        <img
          src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
          alt="delete all icon"
          onClick={deleteAllHaveReadBooks}
        />
      </h3>
      <section className="display-have-read-books" ref={booksRef}>
        {haveReadBooks.map(book => (
          <div key={book.id} className="books-displayed">
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              onClick={handleClickBook}
            />
            <div className="see-and-delete-icons">
              <Link to={`/searchedbook/${book.id}`} state={{ bookDetails: book }}>
                <img src={darkMode ? seeBookIconDarkMode : seeBookIcon} alt="see book icon" />
              </Link>
              <img
                src={darkMode ? deleteIconDarkMode : deleteIcon}
                alt="delete icon"
                id={book.id}
                onClick={deleteHaveReadBooks}
              />
            </div>
          </div>
        ))}
      </section>
      <Toast darkMode={darkMode} />
    </motion.main>
  );
}

export default BooksHaveRead;
