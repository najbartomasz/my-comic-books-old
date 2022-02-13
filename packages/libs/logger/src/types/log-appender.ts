import type { LogEntry } from './log-entry';

export interface LogAppender {
    info: (logEntry: LogEntry) => void;
    warn: (logEntry: LogEntry) => void;
    error: (logEntry: LogEntry) => void;
}
