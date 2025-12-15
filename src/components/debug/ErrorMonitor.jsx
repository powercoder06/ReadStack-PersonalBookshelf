import { useState, useEffect } from "react";
import logger from "../../utils/logger";

const ErrorMonitor = ({ isVisible, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [offlineErrors, setOfflineErrors] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Get recent logs
      const recentLogs = logger.getRecentLogs(50);
      setLogs(recentLogs);

      // Get offline errors
      try {
        const stored = JSON.parse(localStorage.getItem("offline_errors") || "[]");
        setOfflineErrors(stored);
      } catch (e) {
        console.error("Failed to load offline errors:", e);
      }
    }
  }, [isVisible]);

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    return log.level.toLowerCase() === filter;
  });

  const clearOfflineErrors = () => {
    localStorage.removeItem("offline_errors");
    setOfflineErrors([]);
  };

  const exportLogs = () => {
    const data = {
      logs: filteredLogs,
      offlineErrors,
      timestamp: new Date().toISOString(),
      sessionId: logger.sessionId,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `error-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          height: "80%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>Error Monitor</h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ padding: "0.25rem" }}
            >
              <option value="all">All Logs</option>
              <option value="error">Errors</option>
              <option value="warn">Warnings</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <button onClick={exportLogs} style={{ padding: "0.25rem 0.5rem" }}>
              Export
            </button>
            <button onClick={onClose} style={{ padding: "0.25rem 0.5rem" }}>
              Close
            </button>
          </div>
        </div>

        <div style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>
              <strong>Session ID:</strong> {logger.sessionId}
            </span>
            <span>
              <strong>Offline Errors:</strong> {offlineErrors.length}
            </span>
          </div>
          {offlineErrors.length > 0 && (
            <button
              onClick={clearOfflineErrors}
              style={{
                padding: "0.25rem 0.5rem",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Clear Offline Errors
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
          {filteredLogs.length === 0 ? (
            <p>No logs found</p>
          ) : (
            <div style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: getLogColor(log.level),
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    [{log.timestamp}] {log.level}: {log.message}
                  </div>
                  {Object.keys(log)
                    .filter(key => !["timestamp", "level", "message"].includes(key))
                    .map(key => (
                      <div key={key} style={{ marginLeft: "1rem", fontSize: "0.7rem" }}>
                        <strong>{key}:</strong> {JSON.stringify(log[key], null, 2)}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getLogColor = level => {
  switch (level.toLowerCase()) {
    case "error":
      return "#ffebee";
    case "warn":
      return "#fff3e0";
    case "info":
      return "#e3f2fd";
    case "debug":
      return "#f3e5f5";
    default:
      return "#f5f5f5";
  }
};

export default ErrorMonitor;
