import type { LogAppender } from '../../types/log-appender';
import type { LogEntry } from '../../types/log-entry';
import type { LogMessage } from '../../types/log-message';

export class ConsoleLogAppender implements LogAppender {
    public constructor(private readonly formatLogEntry: (logEntry: LogEntry) => LogMessage) {}

    public info(logEntry: LogEntry): void {
        // eslint-disable-next-line no-console
        console.info(this.formatLogEntry(logEntry));
    }

    public warn(logEntry: LogEntry): void {
        // eslint-disable-next-line no-console
        console.warn(this.formatLogEntry(logEntry));
    }

    public error(logEntry: LogEntry): void {
        // eslint-disable-next-line no-console
        console.error(this.formatLogEntry(logEntry));
    }
}
