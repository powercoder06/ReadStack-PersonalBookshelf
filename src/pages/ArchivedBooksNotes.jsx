import { useEffect } from "react";
import "../styles/archivedBooksNotesStyles/archivedBooksNotes.css";
import allNotesIcon from "../assets/all-notes-icon.svg";
import allNotesIconDarkMode from "../assets/all-notes-icon-darkmode.svg";
import { Link } from "react-router-dom";

function ArchivedBooksNotes({ darkMode, archivedBookNotes }) {
  useEffect(() => {
    if (archivedBookNotes) {
      localStorage.setItem("archivedBookNotes", JSON.stringify(archivedBookNotes));
    }
  }, [archivedBookNotes]);
  return (
    <main
      className={
        darkMode ? "archived-books-notes-container dark-mode" : "archived-books-notes-container"
      }
    >
      <h3 className="all-archived-notes-title">Archived Notes</h3>
      <section className="all-my-archived-notes">
        {archivedBookNotes?.length ? (
          archivedBookNotes.map(note => {
            return (
              <div className="book-archived-note" key={note.id}>
                <div className="image-infos-archived-book-note">
                  <div className="image-archived-book-note">
                    <img
                      src={note.currentBook?.volumeInfo?.imageLinks?.thumbnail}
                      alt={note.currentBook?.volumeInfo?.title || "Book cover"}
                    />
                  </div>
                  <div className="infos-archived-book-note">
                    <p className="note-archived-date">{note.date}</p>
                    <p className="note-archived-time">{note.time}</p>
                    <p className="note-archived-page-number">
                      Page <span>{note.page}</span>
                    </p>
                  </div>
                </div>
                <p className="note-text-saved">{note.text}</p>
                <div className="show-all">
                  <Link
                    to={`/mynotes/archivedbooksnotes/${note.bookId}`}
                    state={{ bookId: note.bookId, currentBook: note.currentBook }}
                  >
                    <img
                      id={note.bookId}
                      src={darkMode ? allNotesIconDarkMode : allNotesIcon}
                      alt="show all book's note icon"
                    />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-archived-note-found">
            No note found.
            <br />
            <br />
            Go to the Reading now books category and archive a book to see its notes.
          </p>
        )}
      </section>
    </main>
  );
}

export default ArchivedBooksNotes;
