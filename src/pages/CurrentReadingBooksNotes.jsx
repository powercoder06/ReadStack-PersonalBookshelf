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
        if (currentReadingBookNotes.length > 1) {
          const nonDeletedNotes = currentReadingBookNotes.filter(note => note.id !== e.target.id);
          setCurrentReadingBookNotes(nonDeletedNotes);
        } else {
          setCurrentReadingBookNotes([]);
        }
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
      localStorage.setItem("current reading book notes", JSON.stringify(currentReadingBookNotes));
    }
  }, [currentReadingBookNotes]);
  return (
    <main
      className={
        darkMode
          ? "current-Reading-books-notes-container dark-mode"
          : "current-Reading-books-notes-container"
      }
    >
      <h3 className="all-current-Reading-notes-title">
        Current reading Notes
        <img
          src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
          alt="delete all icon"
          onClick={deleteAllCurrentReadingBookNotes}
        />
      </h3>
      <section className="all-my-current-Reading-notes">
        {currentReadingBookNotes?.length ? (
          currentReadingBookNotes.map(note => {
            return (
              <div className="book-current-Reading-note" key={note.id}>
                <div className="image-infos-current-Reading-book-note">
                  <div className="image-current-Reading-book-note">
                    <img
                      src={note.currentBook.volumeInfo.imageLinks?.thumbnail}
                      alt={note.currentBook.volumeInfo.title}
                    />
                  </div>
                  <div className="infos-current-Reading-book-note">
                    <p className="note-current-Reading-date">{`${note.date}`}</p>
                    <p className="note-current-Reading-time">{`${note.time}`}</p>
                    <p className="note-current-Reading-page-number">
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
          <p className="no-current-Reading-note-found">
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
