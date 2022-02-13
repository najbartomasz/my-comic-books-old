export const enum LogEntryFormat {
    Json,
    Pretty
}

export interface LoggerConsoleOptions {
    outputFormat: LogEntryFormat;
}

export interface LoggerHttpOptions {
    url: string;
    postFunction: (url: string, data: object) => Promise<void>;
}

export interface LoggerFileOptions {
    filePath: string;
    logEntryFormat: LogEntryFormat;
}

export interface LoggerOptions {
    console?: LoggerConsoleOptions;
    file?: LoggerFileOptions;
    http?: LoggerHttpOptions;
}
