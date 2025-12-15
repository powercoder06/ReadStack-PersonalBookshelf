import { Link } from "react-router-dom";

export const BookGrid = ({ books, darkMode }) => {
  if (!books || books.length === 0) return null;

  return (
    <article className={darkMode ? "books dark-mode" : "books"}>
      {books.map(book => (
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
      ))}
    </article>
  );
};
