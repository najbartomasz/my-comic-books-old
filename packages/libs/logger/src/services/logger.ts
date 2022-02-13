import type { LogAppender } from '../types/log-appender';
import type { LogEntry } from '../types/log-entry';

import { LogLevel } from '../definitions/log-level';

export class Logger {
    public constructor(private readonly name: string, private readonly logAppenders: LogAppender[]) {}

    public info(message: string): void {
        const logEntry: LogEntry = this.createLogEntry(LogLevel.Info, message);
        this.logAppenders.forEach((logAppender: LogAppender): void => {
            logAppender.info(logEntry);
        });
    }

    public warn(message: string): void {
        const logEntry: LogEntry = this.createLogEntry(LogLevel.Warn, message);
        this.logAppenders.forEach((logAppender: LogAppender): void => {
            logAppender.warn(logEntry);
        });
    }

    public error(message: string, error?: object | string | undefined): void {
        const logEntry: LogEntry = this.createLogEntry(LogLevel.Error, message, error);
        this.logAppenders.forEach((logAppender: LogAppender): void => {
            logAppender.error(logEntry);
        });
    }

    private createLogEntry(logLevel: LogLevel, message: string, error?: object | string | undefined): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            logLevel,
            loggerName: this.name,
            message,
            error
        };
    }
}
