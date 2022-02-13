import type { ConsoleLogAppender } from './console-log-appender';
import type { LogAppender } from '../../types/log-appender';
import type { LogEntry } from '../../types/log-entry';
import type { LogMessage } from '../../types/log-message';

export class FileLogAppender implements LogAppender {
    public constructor(
        private readonly logFilePath: string,
        private readonly formatLogEntry: (logEntry: LogEntry) => LogMessage,
        private readonly writeFile: (filePath: string, data: string) => Promise<void>,
        private readonly consoleLogAppender?: ConsoleLogAppender
    ) {}

    public info(logEntry: LogEntry): void {
        this.writeLog(logEntry);
    }

    public warn(logEntry: LogEntry): void {
        this.writeLog(logEntry);
    }

    public error(logEntry: LogEntry): void {
        this.writeLog(logEntry);
    }

    private writeLog(logEntry: LogEntry): void {
        const message: LogMessage = this.formatLogEntry(logEntry);
        const writableMessage: string = ('string' === typeof message) ? message : JSON.stringify(message);
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.writeFile(this.logFilePath, writableMessage).catch((error: unknown): void => {
            this.consoleLogAppender?.error({
                timestamp: logEntry.timestamp,
                logLevel: logEntry.logLevel,
                loggerName: logEntry.loggerName,
                message: `Failed to send the following message: ${logEntry.message}`,
                error
            });
        });
    }
}
