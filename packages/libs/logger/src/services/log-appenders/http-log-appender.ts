import type { ConsoleLogAppender } from './console-log-appender';
import type { LogAppender } from '../../types/log-appender';
import type { LogEntry } from '../../types/log-entry';

export class HttpLogAppender implements LogAppender {
    public constructor(
        private readonly loggingServiceUrl: string,
        private readonly post: (url: string, data: object) => Promise<void>,
        private readonly consoleLogAppender?: ConsoleLogAppender
    ) {}

    public info(logEntry: LogEntry): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendLog(logEntry);
    }

    public warn(logEntry: LogEntry): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendLog(logEntry);
    }

    public error(logEntry: LogEntry): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendLog(logEntry);
    }

    private sendLog(logEntry: LogEntry): void {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.post(this.loggingServiceUrl, logEntry).catch((error: unknown): void => {
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
