import { categorizeError } from "./errorMessages";

class ErrorReporter {
  constructor() {
    this.endpoint = import.meta.env.VITE_ERROR_ENDPOINT || null;
    this.enabled = import.meta.env.PROD && this.endpoint;
    this.errorQueue = [];
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async report(error, context = {}) {
    const errorData = this.buildErrorData(error, context);

    if (!this.enabled) {
      this.storeOfflineError(errorData);
      return;
    }

    await this.sendWithRetry(errorData);
  }

  buildErrorData(error, context) {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      name: error.name,
      category: categorizeError(error),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      ...context,
    };
  }

  async sendWithRetry(errorData, attempt = 1) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (reportError) {
      if (attempt < this.retryAttempts) {
        await this.delay(this.retryDelay * attempt);
        return this.sendWithRetry(errorData, attempt + 1);
      }

      this.storeOfflineError(errorData);
      // eslint-disable-next-line no-console
      console.error("Failed to report error after retries:", reportError);
    }
  }

  storeOfflineError(errorData) {
    try {
      const stored = JSON.parse(localStorage.getItem("offline_errors") || "[]");
      stored.push(errorData);
      if (stored.length > 50) stored.shift(); // Keep only last 50 errors
      localStorage.setItem("offline_errors", JSON.stringify(stored));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to store offline error:", e);
    }
  }

  async flushOfflineErrors() {
    if (!this.enabled || !navigator.onLine) return;

    try {
      const stored = JSON.parse(localStorage.getItem("offline_errors") || "[]");
      if (stored.length === 0) return;

      for (const errorData of stored) {
        await this.sendWithRetry(errorData);
      }

      localStorage.removeItem("offline_errors");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to flush offline errors:", e);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reportUnhandledError(error, context) {
    this.report(error, { type: "unhandled", ...context });
  }

  reportReactError(error, errorInfo) {
    this.report(error, {
      type: "react",
      componentStack: errorInfo.componentStack,
      severity: "high",
    });
  }

  reportApiError(error, request, context) {
    this.report(error, {
      type: "api",
      request: {
        url: request.url,
        method: request.method,
        headers: request.headers,
      },
      ...context,
    });
  }

  reportPerformanceIssue(metric, context) {
    this.report(new Error(`Performance issue: ${metric.name}`), {
      type: "performance",
      metric,
      severity: "medium",
      ...context,
    });
  }
}

export default new ErrorReporter();
