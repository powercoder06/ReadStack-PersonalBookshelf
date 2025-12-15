import { useEffect } from "react";
import "../styles/currentReadingBooksNotesStyles/currentReadingBooksNotes.css";
import allNotesIcon from "../assets/all-notes-icon.svg";
import allNotesIconDarkMode from "../assets/all-notes-icon-darkmode.svg";
import deleteIcon from "../assets/delete-icon.svg";
import deleteIconDarkMode from "../assets/delete-icon-darkmode.svg";
import deleteAllIcon from "../assets/delete-all-icon.svg";
import deleteAllIconDarkMode from "../assets/delete-all-icon-darkmode.svg";
import { Link } from "react-router-dom";
import {
  deleteOneItemAlert,
  deleteOneItemConfirmed,
  deleteAllItemsAlert,
  deleteAllItemsConfirm,
} from "../components/ConfirmAlert";

function CurrentReadingBooksNotes({
  currentReadingBookNotes,
  setCurrentReadingBookNotes,
  darkMode,
}) {
  const deleteCurrentReadingBookNote = e => {
    deleteOneItemAlert(darkMode, "note").then(result => {
      if (result.isConfirmed) {
        const nonDeletedNotes = currentReadingBookNotes.filter(note => note.id !== e.target.id);
        setCurrentReadingBookNotes(nonDeletedNotes);
        deleteOneItemConfirmed(darkMode, "note");
      }
    });
  };

  const deleteAllCurrentReadingBookNotes = () => {
    deleteAllItemsAlert(darkMode, "notes").then(result => {
      if (result.isConfirmed) {
        setCurrentReadingBookNotes([]);
        deleteAllItemsConfirm(darkMode, "notes");
      }
    });
  };

  useEffect(() => {
    if (currentReadingBookNotes) {
      localStorage.setItem("currentReadingBookNotes", JSON.stringify(currentReadingBookNotes));
    }
  }, [currentReadingBookNotes]);
  return (
    <main
      className={
        darkMode
          ? "current-reading-books-notes-container dark-mode"
          : "current-reading-books-notes-container"
      }
    >
      <h3 className="all-current-reading-notes-title">
        Current reading Notes
        <img
          src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
          alt="delete all icon"
          onClick={deleteAllCurrentReadingBookNotes}
        />
      </h3>
      <section className="all-my-current-reading-notes">
        {currentReadingBookNotes?.length ? (
          currentReadingBookNotes.map(note => {
            return (
              <div className="book-current-reading-note" key={note.id}>
                <div className="image-infos-current-reading-book-note">
                  <div className="image-current-reading-book-note">
                    <img
                      src={note.currentBook?.volumeInfo?.imageLinks?.thumbnail}
                      alt={note.currentBook?.volumeInfo?.title || "Book cover"}
                    />
                  </div>
                  <div className="infos-current-reading-book-note">
                    <p className="note-current-reading-date">{`${note.date}`}</p>
                    <p className="note-current-reading-time">{`${note.time}`}</p>
                    <p className="note-current-reading-page-number">
                      Page <span>{note.page}</span>
                    </p>
                  </div>
                </div>
                <p className="note-text-saved">{note.text}</p>
                <div className="show-all-and-delete">
                  <Link
                    to={`/mynotes/currentreadingbooksnotes/${note.bookId}`}
                    state={{ bookId: note.bookId, currentBook: note.currentBook }}
                  >
                    <img
                      id={note.bookId}
                      src={darkMode ? allNotesIconDarkMode : allNotesIcon}
                      alt="show all book's note icon"
                    />
                  </Link>
                  <img
                    id={note.id}
                    src={darkMode ? deleteIconDarkMode : deleteIcon}
                    alt="delete icon"
                    onClick={deleteCurrentReadingBookNote}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-current-reading-note-found">
            No note found.
            <br />
            <br />
            Go to the Current reading books category and write a note.
          </p>
        )}
      </section>
    </main>
  );
}

export default CurrentReadingBooksNotes;
