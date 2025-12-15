import { useState } from "react";

const ErrorFallback = ({ error, retry, resetError }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      import("../utils/errorReporter").then(({ default: errorReporter }) => {
        errorReporter.report(new Error("User Feedback"), {
          type: "user-feedback",
          feedback: feedback,
          originalError: error?.message,
        });
      });
      setFeedback("");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        border: "1px solid #e74c3c",
        borderRadius: "8px",
        backgroundColor: "#fdf2f2",
        margin: "1rem 0",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
      <h3 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Something went wrong</h3>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        {error?.userMessage || error?.message || "An unexpected error occurred"}
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
        {retry && (
          <button
            onClick={retry}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        )}

        {resetError && (
          <button
            onClick={resetError}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          placeholder="Help us improve by describing what happened..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          style={{
            width: "100%",
            minHeight: "60px",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "0.5rem",
          }}
        />
        <button
          onClick={handleFeedbackSubmit}
          disabled={!feedback.trim()}
          style={{
            padding: "0.25rem 0.75rem",
            backgroundColor: feedback.trim() ? "#27ae60" : "#bdc3c7",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: feedback.trim() ? "pointer" : "not-allowed",
            fontSize: "0.8rem",
          }}
        >
          Send Feedback
        </button>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          background: "none",
          border: "none",
          color: "#3498db",
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: "0.8rem",
        }}
      >
        {showDetails ? "Hide" : "Show"} Details
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
            fontSize: "0.7rem",
            fontFamily: "monospace",
            overflow: "auto",
            maxHeight: "150px",
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
            {error?.stack || error?.message || "No error details available"}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ErrorFallback;
