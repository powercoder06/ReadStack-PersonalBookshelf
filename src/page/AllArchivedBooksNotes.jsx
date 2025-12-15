import { useEffect, useState } from "react";
import "../styles/allArchivedBooksNotesStyles/allArchivedBooksNotes.css";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function AllArchivedBooksNotes({ darkMode, archivedBookNotes }) {
  const [singleArchivedBookNotes, setArchivedSingleBookNotes] = useState();
  const location = useLocation();
  useEffect(() => {
    if (archivedBookNotes && location.state?.bookId) {
      const filteredNotes = archivedBookNotes.filter(
        note => note.bookId === location.state?.bookId
      );
      if (filteredNotes.length) {
        setArchivedSingleBookNotes(filteredNotes);
      } else {
        setArchivedSingleBookNotes(null);
      }
      try {
        localStorage.setItem("archived book notes", JSON.stringify(archivedBookNotes));
      } catch (error) {
        console.error("[AllArchivedBooksNotes] Failed to save notes to localStorage:", error);
      }
    }
  }, [archivedBookNotes, location.state?.bookId]);

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
        {location.state?.currentBook ? (
          <section className="filtered-archived-book-info">
            <div className="filtered-archived-book-image">
              <img
                src={location.state.currentBook.volumeInfo.imageLinks?.thumbnail}
                alt={`${location.state.currentBook.volumeInfo.title} cover`}
              />
            </div>
            <div className="filtered-archived-book-text">
              <p className="filtered-archived-book-title">
                <span>Title: </span>
                {location.state.currentBook.volumeInfo.title}
              </p>
              <p className="filtered-archived-book-authors">
                <span>Authors: </span>
                {location.state.currentBook.volumeInfo.authors?.map((author, index) => (
                  <span key={index}>{author} </span>
                ))}
              </p>
              <p className="filtered-archived-book-plublisher">
                <span>Publisher: </span>
                {location.state.currentBook.volumeInfo.publisher}
              </p>
              <p className="filtered-archived-book-plublished-date">
                <span>Published date: </span>
                {location.state.currentBook.volumeInfo.publishedDate}
              </p>
              <p className="filtered-archived-book-plublished-page">
                <span>Pages: </span>
                {location.state.currentBook.volumeInfo.pageCount}
              </p>
            </div>
          </section>
        ) : null}
        <h3 className="all-archived-book-notes">All book's notes</h3>
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
