import "../styles/myBooksStyles/myBooks.css";
import Back from "../components/Back";
import { useBooks } from "../contexts/BookContext";
import BookCurrentReadingIcon from "../assets/book-current-reading-icon.svg";
import BookCurrentReadingIconDarkMode from "../assets/book-current-reading-icon-darkmode.svg";
import FavoriteBookIcon from "../assets/favorite-book-icon.svg";
import FavoriteBookIconDarkMode from "../assets/favorite-book-icon-darkmode.svg";
import BookToReadIcon from "../assets/book-to-read-icon.svg";
import BookToReadIconDarkMode from "../assets/book-to-read-icon-darkmode.svg";
import BookHaveReadIcon from "../assets/book-have-read-icon.svg";
import BookHaveReadIconDarkMode from "../assets/book-have-read-icon-darkmode.svg";
import BookArchivedIcon from "../assets/book-archived-icon.svg";
import BookArchivedIconDarkMode from "../assets/book-archive-icon-darkmode.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function MyBooks({ darkMode }) {
  const { currentReadingBooks, favoriteBooks, toReadBooks, haveReadBooks } = useBooks();

  return (
    <motion.main
      className={darkMode ? "mybooks-container darkmode" : "mybooks-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <Back darkMode={darkMode} />
      <article className="books">
        <section className="books-categories">
          <nav className="mybooks-nav">
            <ul>
              <li>
                <Link className="book-category" to="bookscurrentreading">
                  <img
                    src={darkMode ? BookCurrentReadingIconDarkMode : BookCurrentReadingIcon}
                    alt="book current reading icon"
                  />
                  <p>Current reading</p>
                </Link>
              </li>
              <li>
                <Link className="book-category" to="favoritebooks">
                  <img
                    src={darkMode ? FavoriteBookIconDarkMode : FavoriteBookIcon}
                    alt="favorite book icon"
                  />
                  <p>Favorite</p>
                </Link>
              </li>
              <li>
                <Link className="book-category" to="bookstoread">
                  <img
                    src={darkMode ? BookToReadIconDarkMode : BookToReadIcon}
                    alt="to read book icon"
                  />
                  <p>To Read</p>
                </Link>
              </li>
              <li>
                <Link className="book-category" to="bookshaveread">
                  <img
                    src={darkMode ? BookHaveReadIconDarkMode : BookHaveReadIcon}
                    alt="have read book icon"
                  />
                  <p>Have Read</p>
                </Link>
              </li>
              <li>
                <Link className="book-category" to="booksarchived">
                  <img
                    src={darkMode ? BookArchivedIconDarkMode : BookArchivedIcon}
                    alt="archived book icon"
                  />
                  <p>Archived</p>
                </Link>
              </li>
            </ul>
            <p className="number-of-all-books">
              All books
              <span>
                {` (${
                  currentReadingBooks.length +
                  favoriteBooks.length +
                  toReadBooks.length +
                  haveReadBooks.length
                })`}
              </span>
            </p>
          </nav>
        </section>
        <section className="display-books">
          <h3 className="display-books-category">
            Current Reading books<span>{` (${currentReadingBooks.length})`}</span>
          </h3>
          <div className="reading-now-books">
            {currentReadingBooks
              ? currentReadingBooks.map(book => {
                  return (
                    <Link
                      key={book.id}
                      to={`/searchedbook/${book.id}`}
                      state={{ bookDetails: book }}
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt={book.volumeInfo.title}
                        id={book.id}
                      />
                    </Link>
                  );
                })
              : null}
          </div>
          <h3 className="display-books-category">
            Favorite books<span>{` (${favoriteBooks.length})`}</span>
          </h3>
          <div className="favorite-books">
            {favoriteBooks
              ? favoriteBooks.map(book => {
                  return (
                    <Link
                      key={book.id}
                      to={`/searchedbook/${book.id}`}
                      state={{ bookDetails: book }}
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt={book.volumeInfo.title}
                        id={book.id}
                      />
                    </Link>
                  );
                })
              : null}
          </div>
          <h3 className="display-books-category">
            To read books<span>{` (${toReadBooks.length})`}</span>
          </h3>
          <div className="to-read-books">
            {toReadBooks
              ? toReadBooks.map(book => {
                  return (
                    <Link
                      key={book.id}
                      to={`/searchedbook/${book.id}`}
                      state={{ bookDetails: book }}
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt={book.volumeInfo.title}
                        id={book.id}
                      />
                    </Link>
                  );
                })
              : null}
          </div>
          <h3 className="display-books-category">
            Have read books<span>{` (${haveReadBooks.length})`}</span>
          </h3>
          <div className="have-read-books">
            {haveReadBooks
              ? haveReadBooks.map(book => {
                  return (
                    <Link
                      key={book.id}
                      to={`/searchedbook/${book.id}`}
                      state={{ bookDetails: book }}
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt={book.volumeInfo.title}
                        id={book.id}
                      />
                    </Link>
                  );
                })
              : null}
          </div>
        </section>
      </article>
    </motion.main>
  );
}

export default MyBooks;
