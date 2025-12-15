import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import AnimatedRoutes from "./animatedRoutes/AnimatedRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";
import DebugPanel from "./components/debug/DebugPanel";
import errorReporter from "./utils/errorReporter";
import logger from "./utils/logger";
import { BookProvider } from "./contexts/BookContext";
import { useTheme } from "./hooks/useTheme";
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const { darkMode, toggleTheme } = useTheme();
  const { measureOperation } = usePerformanceMonitor("App");

  useEffect(() => {
    logger.info("Application started", {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      darkMode,
      online: navigator.onLine,
    });

    const handleUnhandledError = event => {
      logger.error("Unhandled error caught", {
        error: event.error?.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      errorReporter.reportUnhandledError(event.error, {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = event => {
      logger.error("Unhandled promise rejection", {
        reason: event.reason,
        promise: event.promise,
      });
      errorReporter.reportUnhandledError(new Error(event.reason), {
        source: "unhandledrejection",
        reason: event.reason,
      });
    };

    const handleVisibilityChange = () => {
      logger.info("Page visibility changed", {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
    };

    // Performance monitoring
    const handlePerformanceEntry = list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 100) {
          // Log slow operations
          logger.performance(`Slow ${entry.entryType}`, entry.duration, {
            name: entry.name,
            entryType: entry.entryType,
          });
        }
      });
    };

    window.addEventListener("error", handleUnhandledError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up performance observer
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver(handlePerformanceEntry);
        observer.observe({ entryTypes: ["measure", "navigation"] });
      } catch (e) {
        logger.warn("Performance observer not supported", { error: e.message });
      }
    }

    // Flush offline errors on app start
    errorReporter.flushOfflineErrors();

    return () => {
      window.removeEventListener("error", handleUnhandledError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <BookProvider>
        <Router>
          <div className="App">
            <NetworkStatus />
            <Header darkMode={darkMode} setDarkMode={toggleTheme} />
            <AnimatedRoutes darkMode={darkMode} />
            <DebugPanel />
          </div>
        </Router>
      </BookProvider>
    </ErrorBoundary>
  );
}

export default App;
