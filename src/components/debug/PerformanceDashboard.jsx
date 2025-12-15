import { useState, useEffect } from "react";
import logger from "../../utils/logger";

const PerformanceDashboard = ({ isVisible, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (isVisible) {
      const recentLogs = logger.getRecentLogs(100);
      const performanceLogs = recentLogs.filter(log => log.type === "performance");
      setLogs(performanceLogs);

      // Calculate stats
      const componentStats = {};
      const operationStats = {};

      performanceLogs.forEach(log => {
        if (log.component) {
          if (!componentStats[log.component]) {
            componentStats[log.component] = { count: 0, totalTime: 0, avgTime: 0 };
          }
          componentStats[log.component].count++;
          componentStats[log.component].totalTime += log.duration;
          componentStats[log.component].avgTime =
            componentStats[log.component].totalTime / componentStats[log.component].count;
        }

        if (log.operation) {
          const key = `${log.component}.${log.operation}`;
          if (!operationStats[key]) {
            operationStats[key] = { count: 0, totalTime: 0, avgTime: 0, maxTime: 0 };
          }
          operationStats[key].count++;
          operationStats[key].totalTime += log.duration;
          operationStats[key].avgTime = operationStats[key].totalTime / operationStats[key].count;
          operationStats[key].maxTime = Math.max(operationStats[key].maxTime, log.duration);
        }
      });

      setStats({ componentStats, operationStats });
    }
  }, [isVisible]);

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
          maxWidth: "1000px",
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
          <h2 style={{ margin: 0 }}>Performance Dashboard</h2>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Close
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* Component Performance */}
            <div>
              <h3>Component Performance</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>Component</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Count</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Avg Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.componentStats || {}).map(([component, data]) => (
                    <tr key={component}>
                      <td style={{ padding: "0.5rem" }}>{component}</td>
                      <td style={{ padding: "0.5rem", textAlign: "right" }}>{data.count}</td>
                      <td
                        style={{
                          padding: "0.5rem",
                          textAlign: "right",
                          color:
                            data.avgTime > 1000
                              ? "#e74c3c"
                              : data.avgTime > 500
                                ? "#f39c12"
                                : "#27ae60",
                        }}
                      >
                        {Math.round(data.avgTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Operation Performance */}
            <div>
              <h3>Operation Performance</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>Operation</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Count</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Avg (ms)</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Max (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.operationStats || {}).map(([operation, data]) => (
                    <tr key={operation}>
                      <td style={{ padding: "0.5rem" }}>{operation}</td>
                      <td style={{ padding: "0.5rem", textAlign: "right" }}>{data.count}</td>
                      <td
                        style={{
                          padding: "0.5rem",
                          textAlign: "right",
                          color:
                            data.avgTime > 2000
                              ? "#e74c3c"
                              : data.avgTime > 1000
                                ? "#f39c12"
                                : "#27ae60",
                        }}
                      >
                        {Math.round(data.avgTime)}
                      </td>
                      <td
                        style={{
                          padding: "0.5rem",
                          textAlign: "right",
                          color:
                            data.maxTime > 2000
                              ? "#e74c3c"
                              : data.maxTime > 1000
                                ? "#f39c12"
                                : "#27ae60",
                        }}
                      >
                        {Math.round(data.maxTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Performance Logs */}
          <div style={{ marginTop: "2rem" }}>
            <h3>Recent Performance Events</h3>
            <div style={{ maxHeight: "300px", overflow: "auto", fontSize: "0.8rem" }}>
              {logs.slice(-20).map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.5rem",
                    marginBottom: "0.25rem",
                    backgroundColor:
                      log.duration > 2000 ? "#ffebee" : log.duration > 1000 ? "#fff3e0" : "#f5f5f5",
                    borderRadius: "4px",
                  }}
                >
                  <strong>{log.message}</strong> - {log.duration}ms
                  {log.component && <span> | {log.component}</span>}
                  {log.operation && <span> | {log.operation}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
