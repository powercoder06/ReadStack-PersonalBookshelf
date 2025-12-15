import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import AnimatedRoutes from "./animatedRoutes/AnimatedRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import errorReporter from "./utils/errorReporter";
import { BookProvider } from "./contexts/BookContext";
import { useTheme } from "./hooks/useTheme";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const { darkMode, toggleTheme } = useTheme();

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

  return (
    <ErrorBoundary>
      <BookProvider>
        <Router>
          <div className="App">
            <Header darkMode={darkMode} setDarkMode={toggleTheme} />
            <AnimatedRoutes darkMode={darkMode} />
          </div>
        </Router>
      </BookProvider>
    </ErrorBoundary>
  );
}

export default App;
