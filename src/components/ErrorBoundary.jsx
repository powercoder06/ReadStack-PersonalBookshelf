import { Component } from "react";
import { ERROR_MESSAGES, categorizeError } from "../utils/errorMessages";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      showDetails: false,
      userFeedback: "",
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    Promise.all([import("../utils/logger"), import("../utils/errorReporter")]).then(
      ([{ default: logger }, { default: errorReporter }]) => {
        const errorCategory = categorizeError(error);

        logger.error("React error boundary caught error", {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          category: errorCategory,
          retryCount: this.state.retryCount,
        });

        errorReporter.reportReactError(error, {
          ...errorInfo,
          category: errorCategory,
          retryCount: this.state.retryCount,
          fallbackComponent: this.props.fallback || "default",
        });
      }
    );
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      showDetails: false,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  handleFeedbackSubmit = () => {
    if (this.state.userFeedback.trim()) {
      import("../utils/errorReporter").then(({ default: errorReporter }) => {
        errorReporter.report(new Error("User Feedback"), {
          type: "user-feedback",
          feedback: this.state.userFeedback,
          originalError: this.state.error?.message,
          retryCount: this.state.retryCount,
        });
      });
      this.setState({ userFeedback: "" });
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, userFeedback, retryCount } = this.state;
      const { fallback: FallbackComponent } = this.props;

      if (FallbackComponent) {
        return <FallbackComponent error={error} retry={this.handleRetry} />;
      }

      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😵</div>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Oops! Something went wrong</h2>
          <p style={{ marginBottom: "2rem", color: "#666" }}>{ERROR_MESSAGES.GENERIC_ERROR}</p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}
          >
            <button
              onClick={this.handleRetry}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Try Again {retryCount > 0 && `(${retryCount})`}
            </button>

            <button
              onClick={this.handleReload}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Reload Page
            </button>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <textarea
              placeholder="Help us improve by describing what you were doing when this error occurred..."
              value={userFeedback}
              onChange={e => this.setState({ userFeedback: e.target.value })}
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical",
                marginBottom: "0.5rem",
              }}
            />
            <button
              onClick={this.handleFeedbackSubmit}
              disabled={!userFeedback.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: userFeedback.trim() ? "#27ae60" : "#bdc3c7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: userFeedback.trim() ? "pointer" : "not-allowed",
                fontSize: "0.9rem",
              }}
            >
              Send Feedback
            </button>
          </div>

          <button
            onClick={this.toggleDetails}
            style={{
              background: "none",
              border: "none",
              color: "#3498db",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            {showDetails ? "Hide" : "Show"} Technical Details
          </button>

          {showDetails && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "4px",
                textAlign: "left",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              <strong>Error:</strong> {error?.message}
              <br />
              <strong>Stack:</strong>
              <br />
              <pre style={{ whiteSpace: "pre-wrap", margin: "0.5rem 0" }}>{error?.stack}</pre>
              {errorInfo?.componentStack && (
                <>
                  <strong>Component Stack:</strong>
                  <br />
                  <pre style={{ whiteSpace: "pre-wrap", margin: "0.5rem 0" }}>
                    {errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
