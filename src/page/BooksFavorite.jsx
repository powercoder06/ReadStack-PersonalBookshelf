import { useContext, useEffect, useRef } from "react";
import "../styles/booksFavoriteStyles/bookFavorite.css";
import Back from "../components/Back";
import { favoriteBooksContext } from "../App";
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

function BooksFavorite({ darkMode }) {
  const { favoriteBooks, setFavoriteBooks } = useContext(favoriteBooksContext);

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

  const deleteFavoriteBooks = e => {
    deleteOneItemAlert(darkMode, "book").then(result => {
      if (result.isConfirmed) {
        const nonDeletedBooks = favoriteBooks.filter(book => book.id !== e.target.id);
        setFavoriteBooks(nonDeletedBooks);
        deleteOneItemConfirmed(darkMode, "book");
      }
    });
  };

  const deleteAllFavoriteBooks = () => {
    if (favoriteBooks.length) {
      deleteAllItemsAlert(darkMode, "books").then(result => {
        if (result.isConfirmed) {
          setFavoriteBooks([]);
          deleteAllItemsConfirm(darkMode, "books");
        }
      });
    } else {
      notifyEmptyList(' "favorite books" ');
    }
  };

  useEffect(() => {
    if (favoriteBooks) {
      localStorage.setItem("favorite books", JSON.stringify(favoriteBooks));
    }
  }, [favoriteBooks]);

  return (
    <motion.main
      className={darkMode ? "books-favorite-container dark-mode" : "books-favorite-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <Back darkMode={darkMode} />
      <h3 className="category-book">
        Favorite books
        <img
          src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
          alt="delete all icon"
          onClick={deleteAllFavoriteBooks}
        />
      </h3>
      <section className="display-favorite-books" ref={booksRef}>
        {favoriteBooks
          ? favoriteBooks.map(book => {
              return (
                <div key={book.id} className="books-displayed">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
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
                      onClick={deleteFavoriteBooks}
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

export default BooksFavorite;
