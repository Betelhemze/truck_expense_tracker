const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} ${level}: ${message} - ${stack}`
        : `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
