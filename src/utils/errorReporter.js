class ErrorReporter {
  constructor() {
    this.endpoint = import.meta.env.VITE_ERROR_ENDPOINT || null;
    this.enabled = import.meta.env.PROD && this.endpoint;
  }

  async report(error, context = {}) {
    if (!this.enabled) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      });
    } catch (reportError) {
      // eslint-disable-next-line no-console
      console.error("Failed to report error:", reportError);
    }
  }

  reportUnhandledError(error, context) {
    this.report(error, { type: "unhandled", ...context });
  }

  reportReactError(error, errorInfo) {
    this.report(error, { type: "react", componentStack: errorInfo.componentStack });
  }
}

export default new ErrorReporter();
