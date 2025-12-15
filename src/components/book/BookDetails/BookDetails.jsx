import { useLocation } from "react-router-dom";
import { usePerformanceMonitor } from "../../../hooks/usePerformanceMonitor";
import { useBookRating } from "../../../hooks/business/useBookRating";
import { Rating } from "../../common/Rating/Rating";
import { Button } from "../../common/Button/Button";
import logger from "../../../utils/logger";
import "./BookDetails.scss";

export const BookDetails = ({ darkMode }) => {
  const location = useLocation();
  const book = location.state?.bookDetails;
  const { measureOperation } = usePerformanceMonitor("BookDetails");
  const { rating, updateRating } = useBookRating(book?.id);

  if (!book) return null;

  const handleBuyNow = measureOperation("buyNow", () => {
    const googleBooksLink = book.volumeInfo?.infoLink;
    if (googleBooksLink && googleBooksLink.startsWith("https://books.google.")) {
      window.open(googleBooksLink, "_blank");
      logger.userAction("Buy now clicked", { bookId: book.id, link: googleBooksLink });
    } else {
      logger.warn("Buy now clicked but no valid link found", { bookId: book.id });
    }
  });

  return (
    <article className={`book-details ${darkMode ? "dark-mode" : ""}`}>
      <section className="book-details__image">
        <img
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt="Book cover"
          className="book-details__cover"
        />
      </section>

      <section className="book-details__content">
        <h2 className="book-details__title">
          <span>Title: </span>
          {book.volumeInfo.title}
        </h2>

        <p className="book-details__authors">
          <span>Authors: </span>
          {book.volumeInfo.authors?.join(", ")}
        </p>

        <p className="book-details__publisher">
          <span>Publisher: </span>
          {book.volumeInfo.publisher}
        </p>

        <p className="book-details__published-date">
          <span>Published date: </span>
          {book.volumeInfo.publishedDate}
        </p>

        <p className="book-details__pages">
          <span>Pages: </span>
          {book.volumeInfo.pageCount}
        </p>

        <p className="book-details__description">
          <span>Description: </span>
          {book.volumeInfo.description}
        </p>

        <div className="book-details__actions">
          <Button variant="primary" darkMode={darkMode} onClick={handleBuyNow}>
            Buy Now
          </Button>

          <Rating initialRating={rating} darkMode={darkMode} onRatingChange={updateRating} />
        </div>
      </section>
    </article>
  );
};
