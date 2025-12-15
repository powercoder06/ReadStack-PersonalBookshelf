const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor() {
    this.level = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
  }

  log(level, message, context = {}) {
    if (level > this.level) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: Object.keys(LOG_LEVELS)[level],
      message,
      ...context,
    };

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(logEntry));
  }

  error(message, context) {
    this.log(LOG_LEVELS.ERROR, message, context);
  }

  warn(message, context) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message, context) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message, context) {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }
}

export default new Logger();
