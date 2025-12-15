import { useEffect, useMemo } from "react";
import "../styles/displayNoteStyles/displayNote.css";
import { Link } from "react-router-dom";
function DisplayNote({ currentBook, currentReadingBookNotes, bookId, darkMode }) {
  const displayNote = useMemo(() => {
    return currentReadingBookNotes?.filter(note => note.bookId === bookId) || [];
  }, [currentReadingBookNotes, bookId]);

  useEffect(() => {
    if (currentBook) {
      try {
        localStorage.setItem(`current reading book notes`, JSON.stringify(currentReadingBookNotes));
      } catch (error) {
        console.error("[DisplayNote] Failed to save notes to localStorage:", error);
      }
    }
  }, [currentBook, currentReadingBookNotes]);
  return (
    <main className={darkMode ? "display-note-container dark-mode" : "display-note-container"}>
      {currentBook?.id ? (
        <div className="selected-book-note">
          // amazonq-ignore-next-line
          <p className="number-of-notes">{`Notes (${displayNote.length})`}</p>
          {displayNote.length ? (
            <div className="last-note">
              <div className="last-note-date-page">
                Last note
                <p>{displayNote[0]?.date}</p>
                <p>{displayNote[0]?.time}</p>
                <p>Page {displayNote[0]?.page}</p>
              </div>
              <p className="last-note-text">{displayNote[0]?.text}</p>
              <Link
                state={{ bookId: bookId, currentBook: currentBook }}
                style={
                  darkMode
                    ? { color: "#c20aff", textDecoration: "none", cursor: "auto" }
                    : { color: "#5d0085", textDecoration: "none", cursor: "auto" }
                }
                to={bookId ? `/mynotes/currentreadingbooksnotes/${bookId}` : "#"}
              >
                <p className="see-all-notes">See all notes</p>
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}

export default DisplayNote;
