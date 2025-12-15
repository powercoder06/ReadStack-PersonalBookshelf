import { useRef, useEffect, useState } from "react";
import "../styles/writeNoteStyles/writeNote.css";
import Back from "./Back";
import DisplayNote from "./DispalyNote";
import Toast, { notifySuccessfullySaved } from "./Toast";
import { useLocation } from "react-router-dom";

function WriteNote({ darkMode, currentReadingBookNotes, setCurrentReadingBookNotes }) {
  const [notePage, setNotePage] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(350);

  const textAreaRef = useRef();
  const location = useLocation();

  const [currentBook, setCurrentBook] = useState();
  const [bookId, setBookId] = useState("");

  const handleNotePage = e => {
    setNotePage(e.target.value);
  };

  const handleNoteText = e => {
    setNoteText(e.target.value);
    setCharactersLeft(350 - e.target.value.length);
  };

  const handleSavedNote = e => {
    e.preventDefault();
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const theDay = [day, month, year].join("/");

    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const theTime = [hour, minute].join(":");

    const second = date.getSeconds();
    const millSecond = date.getMilliseconds();
    const id = `${year}${month}${day}${hour}${minute}${second}${millSecond}`;

    const note = {
      id: id,
      bookId: bookId,
      page: notePage,
      text: noteText,
      date: theDay,
      time: theTime,
      currentBook: currentBook,
      editing: false,
    };
    setCurrentReadingBookNotes([note, ...currentReadingBookNotes]);
    notifySuccessfullySaved();
  };

  useEffect(() => {
    if (location.state?.currentBook) {
      setNotePage(0);
      setNoteText("");
      if (textAreaRef.current) {
        textAreaRef.current.value = "";
      }
    }
    setBookId(location.state?.bookId || "");
    setCurrentBook(location.state?.currentBook);
  }, [location.state?.currentBook]);

  return (
    <article className={darkMode ? "write-note-container dark-mode" : "write-note-container"}>
      <Back darkMode={darkMode} />
      {location.state.currentBook ? (
        <section className="current-book">
          <div className="current-book-image">
            <img
              src={location.state.currentBook.volumeInfo.imageLinks?.thumbnail}
              alt={location.state.currentBook.volumeInfo.title}
            />
          </div>
          <div className="current-book-text">
            <div className="current-book-title-and-authors">
              <h3 className="current-book-title">{location.state.currentBook.volumeInfo.title}</h3>
              <p className="current-book-authors">
                {location.state.currentBook.volumeInfo.authors?.map(author => `${author} `)}
              </p>
            </div>
            <form>
              <div className="input-range">
                <input
                  onChange={handleNotePage}
                  type="range"
                  min="0"
                  max={location.state.currentBook.volumeInfo.pageCount}
                />
                <p className="page-number">{`${notePage} page`}</p>
              </div>
              <textarea
                ref={textAreaRef}
                className="textarea-note"
                onChange={handleNoteText}
                maxLength="350"
              />
              <div className="characters-and-button-save">
                <p className="characters">
                  Characters left <span>{charactersLeft}</span>
                </p>
                <button type="submit" onClick={handleSavedNote}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}
      <DisplayNote
        darkMode={darkMode}
        bookId={bookId}
        currentBook={currentBook}
        currentReadingBookNotes={currentReadingBookNotes}
      />
      <Toast darkMode={darkMode} />
    </article>
  );
}

export default WriteNote;
