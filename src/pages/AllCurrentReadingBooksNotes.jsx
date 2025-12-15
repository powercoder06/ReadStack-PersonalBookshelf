import { useEffect, useState } from "react";
import "../styles/allCurrentReadingBooksNotesStyles/allCurrentReadingBooksNotesStyles.css";
import deleteIcon from "../assets/delete-icon.svg";
import deleteIconDarkMode from "../assets/delete-icon-darkmode.svg";
import deleteAllIcon from "../assets/delete-all-icon.svg";
import deleteAllIconDarkMode from "../assets/delete-all-icon-darkmode.svg";
import noteEditIcon from "../assets/note-edit-icon.svg";
import noteEditIconDarkMode from "../assets/note-edit-icon-darkmode.svg";
import { useLocation } from "react-router-dom";
import {
  deleteOneItemAlert,
  deleteOneItemConfirmed,
  deleteAllItemsAlert,
  deleteAllItemsConfirm,
} from "../components/ConfirmAlert";
import { motion } from "framer-motion";
import Toast, { notifySuccessfullyEdited } from "../components/Toast";

function AllCurrentReadingBooksNotes({
  darkMode,
  currentReadingBookNotes,
  setCurrentReadingBookNotes,
}) {
  const [edited, setEdited] = useState();
  const [editedText, setEditedText] = useState("");
  const [singleBookNotes, setSingleBookNotes] = useState();
  const [charactersLeft, setCharactersLeft] = useState(350);
  const location = useLocation();

  const deleteNotefromSingleBookNotes = e => {
    deleteOneItemAlert(darkMode, "note").then(result => {
      if (result.isConfirmed) {
        let nonDeletedNotes;
        if (singleBookNotes.length > 1) {
          nonDeletedNotes = currentReadingBookNotes.filter(note => note.id !== e.target.id);
          setCurrentReadingBookNotes(nonDeletedNotes);
        } else {
          nonDeletedNotes = currentReadingBookNotes.filter(
            note => note.bookId !== location.state.bookId
          );
          setCurrentReadingBookNotes(nonDeletedNotes);
          setSingleBookNotes(null);
        }
        deleteOneItemConfirmed(darkMode, "note");
      }
    });
  };

  const deleteAllNotesfromSingleBookNotes = e => {
    deleteAllItemsAlert(darkMode, "notes").then(result => {
      if (result.isConfirmed) {
        const nonDeletedNotes = currentReadingBookNotes.filter(note => note.bookId !== e.target.id);
        setCurrentReadingBookNotes(nonDeletedNotes);
        deleteAllItemsConfirm(darkMode, "notes");
      }
    });
  };

  const handleEditClick = e => {
    const targetId = e.target.id;
    const updatedNotes = currentReadingBookNotes.map(note => ({
      ...note,
      editing: note.id === targetId,
    }));
    const editedNote = updatedNotes.find(note => note.id === targetId);
    setEdited(editedNote);
    setCurrentReadingBookNotes(updatedNotes);
  };

  const handleEditedTextAndCharactersCount = e => {
    setEditedText(e.target.value);
    if (e.target.value.length - editedText.length === 1) {
      setCharactersLeft(charactersLeft => charactersLeft - 1);
    } else if (e.target.value.length - editedText.length === -1) {
      setCharactersLeft(charactersLeft => charactersLeft + 1);
    } else {
      setCharactersLeft(350 - e.target.value.length);
    }
  };

  const handleSaveEdited = e => {
    e.preventDefault();
    edited.text = editedText;
    currentReadingBookNotes.map(note => (note.editing ? (note.editing = false) : note.editing));
    setEdited(null);
    notifySuccessfullyEdited();
  };

  const handleCancelEdited = e => {
    e.preventDefault();
    currentReadingBookNotes.map(note => (note.editing ? (note.editing = false) : note.editing));
    setEdited(null);
  };

  useEffect(() => {
    if (currentReadingBookNotes) {
      const filteredNotes = currentReadingBookNotes.filter(note => {
        return note.bookId === location.state.bookId;
      });
      if (filteredNotes.length) {
        setSingleBookNotes(filteredNotes);
      } else {
        setSingleBookNotes(null);
      }
      localStorage.setItem("current reading book notes", JSON.stringify(currentReadingBookNotes));
    }
  }, [currentReadingBookNotes, edited, location.state.bookId]);

  useEffect(() => {
    currentReadingBookNotes.map(note => (note.editing ? (note.editing = false) : note.editing));
    setEdited(null);
  }, [currentReadingBookNotes]);

  return (
    <motion.main
      className={
        darkMode
          ? "all-current-reading-notes-book-container dark-mode"
          : "all-current-reading-notes-book-container"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    >
      <article>
        {location.state.currentBook ? (
          <section className="filtered-current-reading-book-info">
            <div className="filtered-current-reading-book-image">
              <img
                src={location.state.currentBook.volumeInfo.imageLinks.thumbnail}
                alt={`${location.state.currentBook.volumeInfo.title} cover`}
              />
            </div>
            <div className="filtered-current-reading-book-text">
              <p className="filtered-current-reading-book-title">
                <span>Title: </span>
                {location.state.currentBook.volumeInfo.title}
              </p>
              <p className="filtered-current-reading-book-authors">
                <span>Authors: </span>
                {location.state.currentBook.volumeInfo.authors.map(author => `${author} `)}
              </p>
              <p className="filtered-current-reading-book-plublisher">
                <span>Publisher: </span>
                {location.state.currentBook.volumeInfo.publisher}
              </p>
              <p className="filtered-current-reading-book-plublished-date">
                <span>Published date: </span>
                {location.state.currentBook.volumeInfo.publishedDate}
              </p>
              <p className="filtered-current-reading-book-plublished-page">
                <span>Pages: </span>
                {location.state.currentBook.volumeInfo.pageCount}
              </p>
            </div>
          </section>
        ) : null}
        {singleBookNotes ? (
          <h3 className="Delete-all-current-reading-book-notes">
            All book&apos;s notes
            <img
              id={singleBookNotes[0].bookId}
              src={darkMode ? deleteAllIconDarkMode : deleteAllIcon}
              alt="delete all icon"
              onClick={deleteAllNotesfromSingleBookNotes}
            />
          </h3>
        ) : null}
        <section className="filtered-current-reading-book-notes">
          {singleBookNotes ? (
            singleBookNotes.map(note => {
              return (
                <div key={note.id} className="filtered-current-reading-note">
                  <div className="filtered-current-reading-note-date-and-page">
                    <p className="filtered-current-reading-note-date">{note.date}</p>
                    <p className="filtered-current-reading-note-time">{note.time}</p>
                    <p className="filtered-current-reading-note-page">page {note.page}</p>
                  </div>
                  <div className="edit-and-delete">
                    <img
                      id={note.id}
                      src={darkMode ? noteEditIconDarkMode : noteEditIcon}
                      alt="note edit icon"
                      onClick={handleEditClick}
                    />
                    <img
                      id={note.id}
                      src={darkMode ? deleteIconDarkMode : deleteIcon}
                      alt="delete icon"
                      onClick={deleteNotefromSingleBookNotes}
                    />
                  </div>
                  {note.editing ? (
                    <form>
                      <textarea
                        className="textarea-edited-note"
                        maxLength="350"
                        onChange={handleEditedTextAndCharactersCount}
                      />
                      <div className="characters-and-buttons">
                        <p className="characters">
                          Characters left <span>{charactersLeft}</span>
                        </p>
                        <div className="save-and-cancel">
                          <button onClick={handleSaveEdited}>Save</button>
                          <button onClick={handleCancelEdited}>Cancel</button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="filtered-current-reading-note-text">{note.text}</div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="no-note-found-book">
              No note found for this book.
              <br />
              <br />
              Go to the Reading now books category and write a note.
            </p>
          )}
        </section>
      </article>
      <Toast darkMode={darkMode} />
    </motion.main>
  );
}

export default AllCurrentReadingBooksNotes;
