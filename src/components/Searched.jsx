import React, { useState, useContext, useEffect } from "react";
import "../styles/searchedStyles/searchedStyles.css";
import Back from "./Back";
import BookCurrentReadingIcon from "../assets/book-current-reading-icon.svg";
import BookCurrentReadingIconDarkMode from "../assets/book-current-reading-icon-darkmode.svg";
import FavoriteBookIcon from "../assets/favorite-book-icon.svg";
import FavoriteBookIconDarkMode from "../assets/favorite-book-icon-darkmode.svg";
import BookToReadIcon from "../assets/book-to-read-icon.svg";
import BookToReadIconDarkMode from "../assets/book-to-read-icon-darkmode.svg";
import BookHaveReadIcon from "../assets/book-have-read-icon.svg";
import BookHaveReadIconDarkMode from "../assets/book-have-read-icon-darkmode.svg";
import { currentReadingContext, favoriteBooksContext, toReadBooksContext, haveReadBooksContext } from "../App";
import Toast, { notifyAlreadyAdded, notifySuccessfullyAdded, notifyAlreadyArchivedBook } from "./Toast";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function Searched({ darkMode, archivedBooks }) {
   const { currentReadingBooks, setCurrentReadingBooks } = useContext(currentReadingContext);
   const { favoriteBooks, setFavoriteBooks } = useContext(favoriteBooksContext);
   const { toReadBooks, setToReadBooks } = useContext(toReadBooksContext);
   const { haveReadBooks, setHaveReadBooks } = useContext(haveReadBooksContext);

   const location = useLocation();

   const bookKey = location.state?.bookDetails?.id;
   const initialRating = bookKey ? sessionStorage.getItem(bookKey) || 0 : 0;

   try {
      if (!bookKey) {
         console.error("[Searched] Missing book key from location state");
      } else {
         console.info(`[Searched] Loaded book rating - Key: ${bookKey}, Rating: ${initialRating || 'none'}`);
      }
   } catch (error) {
      console.error("[Searched] Error loading book rating:", error);
   }

   const [rating, setRating] = useState(parseInt(initialRating));
   const [hoverRating, setHoverRating] = useState(0);

   const handleAddingBooks = (booksCategory, setBooksCategory, name) => {
      const foundBook = booksCategory?.find((book) => book.id === location.state.bookDetails.id);
      if (foundBook) {
         notifyAlreadyAdded(name);
      } else {
         setBooksCategory([...booksCategory, location.state.bookDetails]);
         notifySuccessfullyAdded(name);
      }
   };

   const handleCurrentReadingBooks = () => {
      if (archivedBooks) {
         const foundArchivedBooks = archivedBooks.find(
            (book) => book.id === location.state.bookDetails.id
         );
         if (foundArchivedBooks) {
            notifyAlreadyArchivedBook();
         } else {
            handleAddingBooks(currentReadingBooks, setCurrentReadingBooks, '" Current reading "');
         }
      } else {
         handleAddingBooks(currentReadingBooks, setCurrentReadingBooks, '" Current reading "');
      }
   };

   useEffect(() => {
      if (currentReadingBooks) {
         localStorage.setItem("current reading books", JSON.stringify(currentReadingBooks));
      }
      if (favoriteBooks) {
         localStorage.setItem("favorite books", JSON.stringify(favoriteBooks));
      }
      if (toReadBooks) {
         localStorage.setItem("to read books", JSON.stringify(toReadBooks));
      }
      if (haveReadBooks) {
         localStorage.setItem("have read books", JSON.stringify(haveReadBooks));
      }
      // Store rating in session storage
      sessionStorage.setItem(bookKey, rating);
   }, [currentReadingBooks, favoriteBooks, toReadBooks, haveReadBooks, rating, bookKey]);

   const handleSetRating = (ratingValue) => {
      setRating(ratingValue);
   };

   const handleSetHoverRating = (ratingValue) => {
      setHoverRating(ratingValue);
   };

   const handleResetHoverRating = () => {
      setHoverRating(0);
   };

   const renderStars = () => {
      const stars = [];
      const maxRating = 5;
      const starColor = darkMode ? '#c20aff' : '#5d0085';
    
      for (let i = 1; i <= maxRating; i++) {
        const isActive = i <= (hoverRating || rating);
        stars.push(
          <span
            key={i}
            className="star"
            onClick={() => handleSetRating(i)}
            onMouseEnter={() => handleSetHoverRating(i)}
            onMouseLeave={handleResetHoverRating}
          >
            <FontAwesomeIcon 
              icon={isActive ? solidStar : regularStar} 
              style={{ color: starColor }} 
            />
          </span>
        );
      }
      return (
        <div className="rating">
          <span className="rating-text">Rate:</span>
          <div className="rating-stars">
            {stars}
          </div>
        </div>
      );
    };

   const handleBuyNow = () => {
      const googleBooksLink = location.state?.bookDetails?.volumeInfo?.infoLink;
      if (googleBooksLink && googleBooksLink.startsWith('https://books.google.')) {
         window.open(googleBooksLink, "_blank");
      } else {
         console.warn('[Searched] Invalid or untrusted URL blocked:', googleBooksLink);
      }
   };

   return (
      <motion.main
         className={darkMode ? "searched-container dark-mode" : "searched-container"}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >
         <section className="back-and-add-to">
            <Back darkMode={darkMode} />
            <div className="add-to">
               <div className="add-to-reading-now">
                  <img
                     src={darkMode ? BookCurrentReadingIconDarkMode : BookCurrentReadingIcon}
                     alt="book current reading icon"
                     onClick={handleCurrentReadingBooks}
                  />
                  <p>add to 'current reading'</p>
               </div>
               <div className="add-to-favorite">
                  <img
                     src={darkMode ? FavoriteBookIconDarkMode : FavoriteBookIcon}
                     alt="favorite book icon"
                     onClick={() => handleAddingBooks(favoriteBooks, setFavoriteBooks, '" Favorite "')}
                  />
                  <p>add to 'favorite'</p>
               </div>
               <div className="add-to-to-read">
                  <img
                     src={darkMode ? BookToReadIconDarkMode : BookToReadIcon}
                     alt="to read book icon"
                     onClick={() => handleAddingBooks(toReadBooks, setToReadBooks, '" To read "')}
                  />
                  <p>add to 'to read'</p>
               </div>
               <div className="add-to-have-read">
                  <img
                     src={darkMode ? BookHaveReadIconDarkMode : BookHaveReadIcon}
                     alt="have read book icon"
                     onClick={() => handleAddingBooks(haveReadBooks, setHaveReadBooks, '" Have read "')}
                  />
                  <p>add to 'have read'</p>
               </div>
            </div>
         </section>
         {location.state.bookDetails ? (
            <article className="searched-book">
               <section className="searched-book-image">
                  <img src={location.state.bookDetails.volumeInfo.imageLinks?.thumbnail} alt="Book cover" />
               </section>
               <section className="searched-book-text">
                  <h2 className="searched-title">
                     <span>Title: </span>
                     {location.state.bookDetails.volumeInfo.title}
                  </h2>
                  <p className="searched-authors">
                     <span>Authors: </span>
                     {location.state.bookDetails.volumeInfo.authors?.map((author) => `${author} `)}
                  </p>
                  <p className="searched-publisher">
                     <span>Publisher: </span>
                     {location.state.bookDetails.volumeInfo.publisher}
                  </p>
                  <p className="searched-published-date">
                     <span>Published date: </span>
                     {location.state.bookDetails.volumeInfo.publishedDate}
                  </p>
                  <p className="searched-published-page">
                     <span>Pages: </span>
                     {location.state.bookDetails.volumeInfo.pageCount}
                  </p>
                  <p className="searched-description">
                     <span>Description: </span>
                     {location.state.bookDetails.volumeInfo.description}
                  </p>
                  <button className="search" onClick={handleBuyNow}>
                     Buy Now
                  </button>
                  {renderStars()}
               </section>
            </article>
         ) : null}
         <Toast darkMode={darkMode} />
      </motion.main>
   );
}

export default Searched;
