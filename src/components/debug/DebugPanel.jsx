import { useState } from "react";
import ErrorMonitor from "./ErrorMonitor";
import PerformanceDashboard from "./PerformanceDashboard";
import logger from "../../utils/logger";

const DebugPanel = () => {
  const [showErrorMonitor, setShowErrorMonitor] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show debug panel if debug mode is enabled
  const debugMode =
    localStorage.getItem("debug") === "true" ||
    new URLSearchParams(window.location.search).get("debug") === "true";

  if (!debugMode && !isVisible) return null;

  return (
    <>
      {/* Debug Toggle Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            padding: "0.5rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          title="Debug Panel"
        >
          🔧
        </button>
      </div>

      {/* Debug Panel */}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9998,
            minWidth: "200px",
          }}
        >
          <h4 style={{ margin: "0 0 1rem 0" }}>Debug Tools</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              onClick={() => setShowPerformance(true)}
              style={{
                padding: "0.5rem",
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              📊 Performance Dashboard
            </button>

            <button
              onClick={() => setShowErrorMonitor(true)}
              style={{
                padding: "0.5rem",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🐛 Error Monitor
            </button>

            <button
              onClick={() => {
                console.log("Recent Logs:", logger.getRecentLogs(20));
                console.log(
                  "Offline Errors:",
                  JSON.parse(localStorage.getItem("offline_errors") || "[]")
                );
              }}
              style={{
                padding: "0.5rem",
                backgroundColor: "#9b59b6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              📝 Console Logs
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: "0.5rem",
                backgroundColor: "#f39c12",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🗑️ Clear & Reload
            </button>
          </div>
        </div>
      )}

      {/* Dashboards */}
      <PerformanceDashboard isVisible={showPerformance} onClose={() => setShowPerformance(false)} />

      <ErrorMonitor isVisible={showErrorMonitor} onClose={() => setShowErrorMonitor(false)} />
    </>
  );
};

export default DebugPanel;
