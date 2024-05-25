import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

import serverConfig from "../constants/serverConfig";

const { colorize, combine, printf, splat, timestamp } = winston.format;

const myFormat = printf(({ timestamp, level, message, meta, stack }) => {
    return `\nLEVEL: ${level}\t| TIMESTAMP: ${timestamp}\t| MESSAGE: ${message} ${
        meta ? `\t| META: ${JSON.stringify(meta)}` : ""
    } ${stack ? `\t| STACK: ${stack}` : ""} \n`;
});

const customFormatter = combine(colorize(), timestamp(), splat(), myFormat);
const winstonDailyRotateFileTransportError = new winstonDailyRotateFile({
    filename: "./logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "info",
});
const winstonConsoleTransport = new winston.transports.Console({ level: "info" });
const transports: (winstonDailyRotateFile | winston.transports.ConsoleTransportInstance)[] = [winstonConsoleTransport];

if (serverConfig.NODE_ENV === "development") {
    transports.push(winstonDailyRotateFileTransportError);
}
const options = { level: "debug", transports, format: customFormatter };

export default winston.createLogger(options);
