import type { LogLevel } from '../definitions/log-level';

export interface LogEntry {
    timestamp: string;
    logLevel: LogLevel;
    loggerName: string;
    message: string;
    error?: object | string | unknown | undefined;
}
