import { Component } from "react";
import { ERROR_MESSAGES } from "../utils/errorMessages";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Promise.all([import("../utils/logger"), import("../utils/errorReporter")]).then(
      ([{ default: logger }, { default: errorReporter }]) => {
        logger.error("React error boundary caught error", {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
        errorReporter.reportReactError(error, errorInfo);
      }
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2>Oops! Something went wrong</h2>
          <p>{ERROR_MESSAGES.GENERIC_ERROR}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
