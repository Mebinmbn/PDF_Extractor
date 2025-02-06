import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),

    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
