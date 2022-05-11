import { createLogger, transports, format } from "winston";

const { combine, timestamp, prettyPrint, json } = format;

const options = {
    file: {
        level: "info",
        filename: `./logs/app.log`,
        json: true,
        maxsize: 20242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: combine(timestamp(), json()),
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
        format: combine(timestamp(), prettyPrint()),
    },
};

let logger: any;

// Fixes jest detection of open handles during test run
if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
) {
    logger = createLogger({
        transports: [new transports.File(options.file)],
        exceptionHandlers: [
            new transports.File({ filename: "./logs/exceptions.log" }),
        ],
        exitOnError: false, // do not exit on handled exceptions
    });
} else {
    logger = createLogger({
        exitOnError: false,
    });
}
logger.add(new transports.Console(options.console));

// create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
    write(message: any): void {
        // use the 'info' log level so the output will be picked up by both transports (es and console)
        logger.info("SERVER_RESPONSE", { response: JSON.parse(message) });
    },
};

export default logger;
