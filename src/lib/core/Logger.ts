import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
import { config } from "../config";
import jc from "json-cycle";

const { combine, timestamp, prettyPrint, json } = format;
const { url, username, password, label } = config.grafana.loki;

// Create a format to decycle the object
const decycleFormat = format((info, _opts) => jc.decycle(info));
// Combine the decycleFormat with the built-in json format.
const circularJsonFormat = combine(decycleFormat(), json());

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
        colorize: true,
        json: false,
        format: combine(timestamp(), prettyPrint()),
    },
    loki: {
        host: url,
        json: true,
        basicAuth: `${username}:${password}`,
        labels: { job: label },
        format: circularJsonFormat,
    },
};

let logger: any;

// Fixes jest detection of open handles during test run
if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
) {
    logger = createLogger({
        transports: [
            new transports.File(options.file),
            new LokiTransport(options.loki),
        ],
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
