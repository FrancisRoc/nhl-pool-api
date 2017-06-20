//==========================================
// Logger factory.
//
// Currently based on Bunyan.
//==========================================
import { LogLevel } from "./logLevel";
import { constants } from "../../config/constants";
import { configs } from "../../config/configs";
import * as bunyan from "bunyan";
let RotatingFileStream = require("bunyan-rotating-file-stream");
import * as fs from "fs";
import * as path from "path";

//==========================================
// The streams to log to.
//==========================================
let streams: any = [];

//==========================================
// In the console
//==========================================

// Using human readable format?
if (configs.logging.humanReadableInConsole) {
    let PrettyStream = require("bunyan-prettystream");
    const prettyStdOut = new PrettyStream();
    prettyStdOut.pipe(process.stdout);
    streams.push(
        {
            type: "raw",
            stream: prettyStdOut
        }
    );
} else {
    streams.push(
        {
            stream: process.stdout
        }
    );
}

//==========================================
// In a file, using Json
//==========================================
let logDir: string = configs.logging.dir;
if (logDir) {

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    if (path.resolve(logDir) !== path.normalize(logDir)) {
        logDir = path.join(process.cwd(), logDir);
    }
    let logPath = logDir + "/application.log";

    streams.push({
        type: "raw",
        stream: new RotatingFileStream({
            path: logPath,
            period: "1d",
            totalFiles: configs.logging.logRotateFilesNbr,
            rotateExisting: true,
            threshold: configs.logging.logRotateThresholdMB + "m",
            totalSize: configs.logging.logRotateMaxTotalSizeMB + "m",
            gzip: false
        })
    });
}

//==========================================
// If we log the file and line number where the
// log occures, "source-map-support" will allow
// us to get the "TypeScript" informations instead
// of the ones from the transpiled Javascript file.
//==========================================
if (configs.logging.logSource) {
    require("source-map-support").install({
        environment: "node"
    });
}

/**
 * Logger class
 */
class Logger {

    private bunyan: bunyan.Logger;

    /**
     * Converts LogLevel to the Buynan string representation.
     */
    private logLevelToBunyanString = (logLevel: LogLevel): string => {

        let buynanLevelStr = "error";
        if (logLevel !== undefined) {
            if (logLevel as LogLevel === LogLevel.DEBUG) {
                buynanLevelStr = "debug";
            } else if (logLevel === LogLevel.INFO) {
                buynanLevelStr = "info";
            } else if (logLevel === LogLevel.WARNING) {
                buynanLevelStr = "warn";
            } else if (logLevel === LogLevel.ERROR) {
                buynanLevelStr = "error";
            }
        }
        return buynanLevelStr;
    }

    constructor(name: string) {

        this.bunyan = bunyan.createLogger({

            //==========================================
            // Logger name
            //==========================================
            name: name || "default",

            //==========================================
            // Should the file and line number where the
            // log occures be logged?
            //
            // This is costy and is generally disabled in production,
            // where we instead use a meaningful *name*
            // to be able to locate the log source.
            //==========================================
            src: configs.logging.logSource,

            //==========================================
            // The logging level to use
            //==========================================
            level: this.logLevelToBunyanString(configs.logging.level),

            //==========================================
            // The streams to log to.
            //==========================================
            streams: streams
        });
    }

    /**
     * Adds the file and line number where the log occures.
     * This particular code is required since our custom Logger
     * is a layer over Bunyan and therefore adds an extra level
     * to the error stack. Without this code, the file and line number
     * are not the right ones.
     *
     * Based by http://stackoverflow.com/a/38197778/843699.
     */
    private enhanceLog() {

        if (configs.logging.logSource) {

            let stackLine;
            let stackLines = (new Error()).stack.split("\n");
            stackLines.shift();
            for (let stackLineTry of stackLines) {
                if (stackLineTry.indexOf("at " + Logger.name + ".") <= 0) {
                    stackLine = stackLineTry;
                    break;
                }
            }
            if (!stackLine) {
                return null;
            }

            let callerLine = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
            if (callerLine.length === 0) {
                callerLine = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
            }

            let firstCommaPos = callerLine.lastIndexOf(":", callerLine.lastIndexOf(":") - 1);
            let filename = callerLine.slice(1, firstCommaPos);
            let lineNo = callerLine.slice(firstCommaPos + 1, callerLine.indexOf(":", firstCommaPos + 1));

            return {
                "src": {
                    "file": filename,
                    "line": lineNo
                }
            };
        }
        return null;
    }

    /**
     * Logs a DEBUG level message.
     */
    debug(message: any) {
        this.log(LogLevel.DEBUG, message);
    }

    /**
     * Logs an INFO level message.
     */
    info(message: any) {
        this.log(LogLevel.INFO, message);
    }

    /**
     * Logs a WARNING level message.
     */
    warning(message: any) {
        this.log(LogLevel.WARNING, message);
    }

    /**
     * Logs an ERROR level message.
     */
    error(message: any) {
        this.log(LogLevel.ERROR, message);
    }

    /**
     * Logs an level specific message.
     */
    log(level: LogLevel, message: any) {

        if (level === LogLevel.DEBUG) {
            this.bunyan.debug(this.enhanceLog(), message);
        } else if (level === LogLevel.INFO) {
            this.bunyan.info(this.enhanceLog(), message);
        } else if (level === LogLevel.WARNING) {
            this.bunyan.warn(this.enhanceLog(), message);
        } else if (level === LogLevel.ERROR) {
            this.bunyan.error(this.enhanceLog(), message);
        } else {
            message = `UNMANAGED LEVEL "${level}" - ${message}`;
            this.bunyan.error(this.enhanceLog(), message);
        }
    }
}

/**
 * Creates a logger.
 *
 * @param the logger name. This name should be related
 * to the file the logger is created in. On a production
 * environment, it's possible that only this name will
 * be available to locate the source of the log.
 */
export function createLogger(name: string): Logger {
    return new Logger(name);
}
