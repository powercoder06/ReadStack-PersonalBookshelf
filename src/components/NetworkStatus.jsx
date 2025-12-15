import { useState, useEffect } from "react";
import errorReporter from "../utils/errorReporter";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      // Flush offline errors when back online
      errorReporter.flushOfflineErrors();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => setShowOfflineMessage(false), 5000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showOfflineMessage && isOnline) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: isOnline ? "#27ae60" : "#e74c3c",
        color: "white",
        borderRadius: "4px",
        fontSize: "0.9rem",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {isOnline ? (
        <>
          <span style={{ marginRight: "0.5rem" }}>✅</span>
          Back online! Syncing data...
        </>
      ) : (
        <>
          <span style={{ marginRight: "0.5rem" }}>⚠️</span>
          You're offline. Changes will be saved when connection is restored.
        </>
      )}
    </div>
  );
};

export default NetworkStatus;
