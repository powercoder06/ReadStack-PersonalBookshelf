import { useEffect, useState, useMemo } from "react";
import "../styles/allArchivedBooksNotesStyles/allArchivedBooksNotes.css";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function AllArchivedBooksNotes({ darkMode, archivedBookNotes }) {
  const [singleArchivedBookNotes, setSingleArchivedBookNotes] = useState();
  const location = useLocation();
  const filteredNotes = useMemo(() => {
    if (!archivedBookNotes || !location.state?.bookId) return null;
    const filtered = archivedBookNotes.filter(note => note.bookId === location.state.bookId);
    return filtered.length ? filtered : null;
  }, [archivedBookNotes, location.state?.bookId]);

  useEffect(() => {
    setSingleArchivedBookNotes(filteredNotes);
  }, [filteredNotes]);

  useEffect(() => {
    if (archivedBookNotes) {
      localStorage.setItem("archived book notes", JSON.stringify(archivedBookNotes));
    }
  }, [archivedBookNotes]);

  return (
    <motion.main
      className={
        darkMode
          ? "all-archived-notes-book-container dark-mode"
          : "all-archived-notes-book-container"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <article>
        {location.state?.currentBook?.volumeInfo ? (
          <section className="filtered-archived-book-info">
            <div className="filtered-archived-book-image">
              <img
                src={location.state.currentBook.volumeInfo.imageLinks?.thumbnail}
                alt={`${location.state.currentBook.volumeInfo.title || "Book"} cover`}
              />
            </div>
            <div className="filtered-archived-book-text">
              <p className="filtered-archived-book-title">
                <span>Title: </span>
                {location.state.currentBook.volumeInfo.title || "N/A"}
              </p>
              <p className="filtered-archived-book-authors">
                <span>Authors: </span>
                {location.state.currentBook.volumeInfo.authors?.map(author => (
                  <span key={author}>{author} </span>
                )) || "N/A"}
              </p>
              <p className="filtered-archived-book-plublisher">
                <span>Publisher: </span>
                {location.state.currentBook.volumeInfo.publisher || "N/A"}
              </p>
              <p className="filtered-archived-book-plublished-date">
                <span>Published date: </span>
                {location.state.currentBook.volumeInfo.publishedDate || "N/A"}
              </p>
              <p className="filtered-archived-book-plublished-page">
                <span>Pages: </span>
                {location.state.currentBook.volumeInfo.pageCount || "N/A"}
              </p>
            </div>
          </section>
        ) : null}
        <h3 className="all-archived-book-notes">All book&apos;s notes</h3>
        <section className="filtered-archived-book-notes">
          {singleArchivedBookNotes ? (
            singleArchivedBookNotes.map(note => {
              return (
                <div key={note.id} className="filtered-archived-note">
                  <div className="filtered-archived-note-date-and-page">
                    <p className="filtered-archived-note-date">{note.date}</p>
                    <p className="filtered-archived-note-time">{note.time}</p>
                    <p className="filtered-archived-note-page">page {note.page}</p>
                  </div>
                  <div className="filtered-archived-note-text">{note.text}</div>
                </div>
              );
            })
          ) : (
            <p className="no-note-found-book">
              No note found for this book.
              <br />
              <br />
              Go to the Reading now books category and archive a book to see its notes.
            </p>
          )}
        </section>
      </article>
    </motion.main>
  );
}

export default AllArchivedBooksNotes;
