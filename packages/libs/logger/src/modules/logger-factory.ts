import type { LogAppender } from '../types/log-appender';
import type { LogEntry } from '../types/log-entry';
import type { LogMessage } from '../types/log-message';
import type { LoggerOptions } from '../types/logger-options';

import { toJsonLogMessage, toPrettyLogMessage } from '../services/log-entry-formatter';
import { ConsoleLogAppender } from '../services/log-appenders/console-log-appender';
import { EmptyOptionsError } from '../definitions/empty-options-error';
import { FileLogAppender } from '../services/log-appenders/file-log-appender';
import { HttpLogAppender } from '../services/log-appenders/http-log-appender';
import { LogEntryFormat } from '../types/logger-options';
import { Logger } from '../services/logger';

import { writeFile } from 'fs/promises';

export class LoggerFactory {
    public constructor(private readonly options?: LoggerOptions) {}

    public createLogger(name: string): Logger {
        if (this.options === undefined) {
            throw new EmptyOptionsError('No options were provided!');
        }

        const consoleLogAppender: ConsoleLogAppender | undefined = this.createConsoleLogAppenderIfRequested();
        const fileLogAppender: FileLogAppender | undefined = this.createFileLogAppenderIfRequested(consoleLogAppender);
        const httpLogAppender: HttpLogAppender | undefined = this.createHttpLogAppenderIfRequested(consoleLogAppender);

        type LogAppenderChild = ConsoleLogAppender | FileLogAppender | HttpLogAppender;
        const logAppenders: LogAppender[] = [ consoleLogAppender, fileLogAppender, httpLogAppender ]
            .filter((element: LogAppender | undefined): element is LogAppenderChild => element !== undefined);

        return new Logger(name, logAppenders);
    }

    private createConsoleLogAppenderIfRequested(): ConsoleLogAppender | undefined {
        let consoleLogAppender!: ConsoleLogAppender;
        if (this.options?.console) {
            const formatLogEntry: (logEntry: LogEntry) => LogMessage = (this.options.console.outputFormat === LogEntryFormat.Pretty)
                ? toPrettyLogMessage
                : toJsonLogMessage;
            consoleLogAppender = new ConsoleLogAppender(formatLogEntry);
        }

        return consoleLogAppender;
    }

    private createFileLogAppenderIfRequested(consoleLogAppender?: ConsoleLogAppender): FileLogAppender | undefined {
        let fileLogAppender!: FileLogAppender;
        if (this.options?.file !== undefined) {
            const formatLogEntry: (logEntry: LogEntry) => LogMessage = (this.options.file.logEntryFormat === LogEntryFormat.Pretty)
                ? toPrettyLogMessage
                : toJsonLogMessage;
            fileLogAppender = new FileLogAppender(this.options.file.filePath, formatLogEntry, writeFile, consoleLogAppender);
        }

        return fileLogAppender;
    }

    private createHttpLogAppenderIfRequested(consoleLogAppender?: ConsoleLogAppender): HttpLogAppender | undefined {
        let httpLogAppender!: HttpLogAppender;
        if (this.options?.http !== undefined) {
            httpLogAppender = new HttpLogAppender(this.options.http.url, this.options.http.postFunction, consoleLogAppender);
        }

        return httpLogAppender;
    }
}
