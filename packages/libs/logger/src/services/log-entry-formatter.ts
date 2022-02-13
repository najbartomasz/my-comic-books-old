import type { LogEntry } from '../types/log-entry';

export const toJsonLogMessage = (logEntry: LogEntry): object => logEntry;

export const toPrettyLogMessage = (logEntry: LogEntry): string => {
    let errorMessage: string;
    if (logEntry.error instanceof Error) {
        errorMessage = (undefined === logEntry.error.stack) ? logEntry.error.message : logEntry.error.stack;
    } else if ('object' === typeof logEntry.error) {
        errorMessage = JSON.stringify(logEntry.error);
    } else if ('string' === typeof logEntry.error) {
        errorMessage = logEntry.error;
    } else {
        errorMessage = '';
    }

    let prettyMessage: string = `${logEntry.timestamp} ${logEntry.logLevel} ${logEntry.loggerName}: ${logEntry.message}`;
    if (errorMessage) {
        prettyMessage += ` ${errorMessage}`;
    }
    return prettyMessage;
};
