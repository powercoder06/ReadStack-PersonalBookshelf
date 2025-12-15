const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor() {
    this.level = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
    this.sessionId = this.generateSessionId();
    this.logBuffer = [];
    this.maxBufferSize = 100;
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getContext() {
    return {
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
    };
  }

  log(level, message, context = {}) {
    if (level > this.level) return;

    const logEntry = {
      level: Object.keys(LOG_LEVELS)[level],
      message,
      ...this.getContext(),
      ...context,
    };

    this.addToBuffer(logEntry);

    const consoleMethod =
      level === LOG_LEVELS.ERROR ? "error" : level === LOG_LEVELS.WARN ? "warn" : "log";
    // eslint-disable-next-line no-console
    // console[consoleMethod](JSON.stringify(logEntry));
  }

  addToBuffer(logEntry) {
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  getRecentLogs(count = 10) {
    return this.logBuffer.slice(-count);
  }

  performance(name, duration, context = {}) {
    this.info(`Performance: ${name}`, { duration, type: "performance", ...context });
  }

  userAction(action, context = {}) {
    this.info(`User Action: ${action}`, { type: "user-action", ...context });
  }

  error(message, context) {
    this.log(LOG_LEVELS.ERROR, message, { type: "error", ...context });
  }

  warn(message, context) {
    this.log(LOG_LEVELS.WARN, message, { type: "warning", ...context });
  }

  info(message, context) {
    this.log(LOG_LEVELS.INFO, message, { type: "info", ...context });
  }

  debug(message, context) {
    this.log(LOG_LEVELS.DEBUG, message, { type: "debug", ...context });
  }
}

export default new Logger();
