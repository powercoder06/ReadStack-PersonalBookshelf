import { createContext, useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import AnimatedRoutes from "./animatedRoutes/AnimatedRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import logger from "./utils/logger";
import { getErrorMessage } from "./utils/errorMessages";
import errorReporter from "./utils/errorReporter";

import { BrowserRouter as Router } from "react-router-dom";

export const currentReadingContext = createContext();
export const favoriteBooksContext = createContext();
export const toReadBooksContext = createContext();
export const haveReadBooksContext = createContext();

export const getLocalStorage = name => {
  try {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    logger.error("Failed to parse localStorage item", {
      item: name,
      error: error.message,
      userMessage: getErrorMessage("STORAGE_ERROR"),
    });
    return [];
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleUnhandledError = event => {
      errorReporter.reportUnhandledError(event.error, { source: "window.onerror" });
    };

    const handleUnhandledRejection = event => {
      errorReporter.reportUnhandledError(new Error(event.reason), { source: "unhandledrejection" });
    };

    window.addEventListener("error", handleUnhandledError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleUnhandledError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const [currentReadingBooks, setCurrentReadingBooks] = useState(() =>
    getLocalStorage("current reading books")
  );
  const [favoriteBooks, setFavoriteBooks] = useState(() => getLocalStorage("favorite books"));
  const [toReadBooks, setToReadBooks] = useState(() => getLocalStorage("to read books"));
  const [haveReadBooks, setHaveReadBooks] = useState(() => getLocalStorage("have read books"));

  const providers = [
    [currentReadingContext, { currentReadingBooks, setCurrentReadingBooks }],
    [favoriteBooksContext, { favoriteBooks, setFavoriteBooks }],
    [toReadBooksContext, { toReadBooks, setToReadBooks }],
    [haveReadBooksContext, { haveReadBooks, setHaveReadBooks }],
  ];

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          {providers.reduceRight(
            (children, [Context, value]) => (
              <Context.Provider value={value}>{children}</Context.Provider>
            ),
            <>
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <AnimatedRoutes darkMode={darkMode} />
            </>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
