//==========================================
// The enum for log levels
//==========================================

/**
 * Log levels enum
 */
export enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR
}

/**
 * Log levels enum methods
 */
export namespace LogLevel {

    /**
     * Conversts log level string representation to its associated
     * LogLevel enum value.
     */
    export function fromString(levelStr: string): LogLevel {

        if (levelStr) {
            levelStr = levelStr.toUpperCase();
            return LogLevel[levelStr];
        }
        return undefined;
    }

    /**
     * Converts a LogLevel to its string representation.
     */
    export function toString(logLevel: LogLevel): string {

        if (isNaN(logLevel)) {
            return undefined;
        }
        return LogLevel[logLevel];
    }
}
