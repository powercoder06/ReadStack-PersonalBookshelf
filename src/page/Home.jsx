import { useEffect, useRef, useState } from "react";
import "../styles/homeStyles/home.css";
import Illustration from "../assets/Illustration.svg";
import searchMagnifyingGlassIcon from "../assets/search-magnifying-glass-icon.svg";
import searchMagnifyingGlassIconDarMode from "../assets/search-magnifying-glass-icon-darkmode.svg";
import arrowUpIcon from "../assets/arrow-up-icon.svg";
import arrowUpIconDarkMode from "../assets/arrow-up-icon-darkmode.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home({ darkMode, data, setData }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(false);

  const booksRef = useRef();

  const fetchData = async () => {
    try {
      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=relevance&key=${
          import.meta.env.VITE_APP_API_KEY
        }&langRestrict=en&maxResults=40`
      )
        .then(response => response.json())
        .then(result => {
          setData(result.items);
        });
    } catch (error) {
      console.error(`[Home] Failed to fetch books for query: "${query}"`, {
        error: error.message,
        query,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const scrollToTopBook = () => {
    window.scrollTo({
      top: booksRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showArrowUp = () => {
    if (window.scrollY > lastScrollY) {
      setShow(true);
    } else {
      setShow(false);
    }
    setLastScrollY(window.scrollY);
  };

  const handleInput = e => {
    setQuery(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setResult(false);
    await fetchData();
    setResult(true);
  };

  useEffect(() => {
    if (result) {
      scrollToTopBook();
    }
  }, [result]);

  useEffect(() => {
    window.addEventListener("scroll", showArrowUp);
    return () => {
      window.removeEventListener("scroll", showArrowUp);
    };
  }, [lastScrollY]);

  return (
    <motion.main
      className={darkMode ? "home-container dark-mode " : "home-container"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <article className="hero">
        <section className="hero-text">
          <div className="quote">
            <h1>&quot; The right book can turn a non-reader into a bookworm &quot;</h1>
          </div>
          <div className="get-started">
            <h2>Get ready to transform !</h2>
            <form className="form">
              <div className="search-input">
                <img
                  src={darkMode ? searchMagnifyingGlassIconDarMode : searchMagnifyingGlassIcon}
                  alt="search magnifying glass icon"
                />
                <input type="text" placeholder="Search for a book..." onChange={handleInput} />
              </div>
              <button className="search" type="submit" onClick={handleSubmit}>
                Search
              </button>
            </form>
          </div>
        </section>
        <section className="hero-image">
          <img
            src={Illustration}
            alt="Illustration of three people reading books made by Storyset"
          />
        </section>
      </article>
      <article
        ref={booksRef}
        className={darkMode ? "books dark-mode" : "books"}
        style={data ? { paddingBottom: "1rem" } : null}
      >
        {data
          ? data
              .filter(
                book =>
                  book.volumeInfo.pageCount &&
                  book.volumeInfo.title &&
                  book.volumeInfo.imageLinks?.thumbnail &&
                  book.volumeInfo.authors &&
                  book.volumeInfo.publishedDate &&
                  book.volumeInfo.description &&
                  book.volumeInfo.categories // Add genre filter
              )
              .map(book => {
                return (
                  <Link
                    className="book"
                    style={{ textDecoration: "none" }}
                    to={`searchedbook/${book.id}`}
                    key={book.id}
                    state={{ bookDetails: book }}
                  >
                    <div className="book-image">
                      <img src={book.volumeInfo.imageLinks?.thumbnail} alt="book cover" />
                    </div>
                    <div className="book-text">
                      <h3 className="title">{book.volumeInfo.title}</h3>
                      <p className="authors-and-date">
                        {book.volumeInfo.authors.join(", ")} - {book.volumeInfo.publishedDate}
                      </p>
                      <p className="description">{book.volumeInfo.description}</p>
                      <p className="genre">{book.volumeInfo.categories.join(", ")}</p>
                    </div>
                  </Link>
                );
              })
          : null}
      </article>
      <img
        className={show ? "arrow-up fixed" : "arrow-up"}
        src={darkMode ? arrowUpIconDarkMode : arrowUpIcon}
        alt="arrow up icon"
        onClick={scrollToTop}
      />
    </motion.main>
  );
}

export default Home;
