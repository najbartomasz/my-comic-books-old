/* eslint-disable jest/expect-expect */
import { when } from 'jest-when';

import { writeFile } from 'fs/promises';

import type { Logger, LoggerConsoleOptions, LoggerFileOptions, LoggerHttpOptions, LoggerOptions } from '../../src';

import { LogEntryFormat, LoggerFactory } from '../../src';

jest.mock('fs/promises');

// eslint-disable-next-line max-params
const toString = (timestamp: string, logLevel: string, loggerName: string, message: string, error?: string): string => {
    let stringMessage: string = `${timestamp} ${logLevel} ${loggerName}: ${message}`;
    if (error !== undefined) {
        stringMessage += ` ${error}`;
    }

    return stringMessage;
};

// eslint-disable-next-line max-params
const toJsonStringify = (timestamp: string, logLevel: string, loggerName: string, message: string, error?: Error | string): string =>
    JSON.stringify({ timestamp, logLevel, loggerName, message, error });

// eslint-disable-next-line max-params
const toObject = (timestamp: string, logLevel: string, loggerName: string, message: string, error?: Error | string): object =>
    ({ timestamp, logLevel, loggerName, message, error });

describe('Logger', () => {
    const testTimestamp1: string = '1987-08-20T03:20:15.127Z';
    const testTimestamp2: string = '1987-08-20T03:21:16.239Z';
    const testTimestamp3: string = '1987-08-21T06:56:23.002Z';
    const testTimestamp4: string = '1987-08-21T06:56:23.002Z';
    const testTimestamp5: string = '1987-09-11T01:11:03.132Z';
    const testTimestamp6: string = '1987-10-10T05:22:58.345Z';
    const testTimestamp7: string = '1992-03-01T12:21:12.212Z';

    const logLevelInfo: string = 'INFO';
    const logLevelWarn: string = 'WARN';
    const logLevelError: string = 'ERROR';

    const testFilePath: string = '/test/file/path';

    const testUrl: string = 'http://my-logging-service.com';

    const infoMessage1: string = 'Package initializing.';
    const infoMessage2: string = 'Everything went well. Enjoy!';
    const infoMessage3: string = 'Recovered. Up and running.';
    const warnMessage1: string = 'Failed. Making another attempt...';
    const errorMessage1: string = 'Unknown error while reading file.';
    const errorMessage2: string = 'Something bad happened.';
    const error2: Error = new Error('error');
    const stack2: string = 'error stack';
    error2.stack = stack2;
    const errorMessage3: string = 'Complete disaster.';
    const error3: string = 'fatal';

    const logger1Name: string = 'TestLogger1';
    const logger2Name: string = 'TestLogger2';
    const logger3Name: string = 'TestLogger3';

    let testLoggerConsoleOptions: LoggerConsoleOptions;
    let testLoggerFileOptions: LoggerFileOptions;
    let testLoggerHttpOptions: LoggerHttpOptions;
    let testLoggertOtions: LoggerOptions;

    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let mockPostFunction: jest.Mock;

    const verifyConsoleInfoNthCalledWith = (nthCall: number, message: string): void => {
        expect(consoleInfoSpy).toHaveBeenNthCalledWith(nthCall, message);
    };

    const verifyConsoleWarnNthCalledWith = (nthCall: number, message: string): void => {
        expect(consoleWarnSpy).toHaveBeenNthCalledWith(nthCall, message);
    };

    const verifyConsoleErrorNthCalledWith = (nthCall: number, message: string): void => {
        expect(consoleErrorSpy).toHaveBeenNthCalledWith(nthCall, message);
    };

    const verifyWriteFileNthCalledWith = (nthCall: number, filePath: string, message: string): void => {
        expect(writeFile).toHaveBeenNthCalledWith(nthCall, filePath, message);
    };

    const verifyPostNthCalledWith = (nthCall: number, url: string, message: object): void => {
        expect(mockPostFunction).toHaveBeenNthCalledWith(nthCall, url, message);
    };

    beforeEach(() => {
        const OriginalDate: DateConstructor = global.Date;
        jest.spyOn(global, 'Date')
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp1))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp2))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp3))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp4))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp5))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp6))
            // @ts-expect-error
            .mockReturnValueOnce(new OriginalDate(testTimestamp7));

        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        mockPostFunction = jest.fn();
        when(mockPostFunction).calledWith(testUrl, expect.anything()).mockResolvedValue(undefined);

        when(writeFile).calledWith(testFilePath, expect.any(String) as string).mockResolvedValue(undefined);

        testLoggerConsoleOptions = {
            outputFormat: LogEntryFormat.Pretty
        };
        testLoggerFileOptions = {
            filePath: testFilePath,
            logEntryFormat: LogEntryFormat.Json
        };
        testLoggerHttpOptions = {
            url: testUrl,
            postFunction: mockPostFunction
        };
        testLoggertOtions = {
            console: testLoggerConsoleOptions,
            file: testLoggerFileOptions,
            http: testLoggerHttpOptions
        };
    });

    test('should print json pretty to debug console, write stringified json to file send it over http', () => {
        // Given
        const loggerFactory: LoggerFactory = new LoggerFactory(testLoggertOtions);
        const logger1: Logger = loggerFactory.createLogger(logger1Name);
        const logger2: Logger = loggerFactory.createLogger(logger2Name);
        const logger3: Logger = loggerFactory.createLogger(logger3Name);

        // When
        logger1.info(infoMessage1);
        logger2.warn(warnMessage1);
        logger3.error(errorMessage1);
        logger2.info(infoMessage2);
        logger3.info(infoMessage3);
        logger1.error(errorMessage2, error2);
        logger3.error(errorMessage3, error3);

        // Then
        verifyConsoleInfoNthCalledWith(1, toString(testTimestamp1, logLevelInfo, logger1Name, infoMessage1));
        verifyWriteFileNthCalledWith(1, testFilePath, toJsonStringify(testTimestamp1, logLevelInfo, logger1Name, infoMessage1));
        verifyPostNthCalledWith(1, testUrl, toObject(testTimestamp1, logLevelInfo, logger1Name, infoMessage1));

        verifyConsoleWarnNthCalledWith(1, toString(testTimestamp2, logLevelWarn, logger2Name, warnMessage1));
        verifyWriteFileNthCalledWith(2, testFilePath, toJsonStringify(testTimestamp2, logLevelWarn, logger2Name, warnMessage1));
        verifyPostNthCalledWith(2, testUrl, toObject(testTimestamp2, logLevelWarn, logger2Name, warnMessage1));

        verifyConsoleErrorNthCalledWith(1, toString(testTimestamp3, logLevelError, logger3Name, errorMessage1));
        verifyWriteFileNthCalledWith(3, testFilePath, toJsonStringify(testTimestamp3, logLevelError, logger3Name, errorMessage1));
        verifyPostNthCalledWith(3, testUrl, toObject(testTimestamp3, logLevelError, logger3Name, errorMessage1));

        verifyConsoleInfoNthCalledWith(2, toString(testTimestamp4, logLevelInfo, logger2Name, infoMessage2));
        verifyWriteFileNthCalledWith(4, testFilePath, toJsonStringify(testTimestamp4, logLevelInfo, logger2Name, infoMessage2));
        verifyPostNthCalledWith(4, testUrl, toObject(testTimestamp4, logLevelInfo, logger2Name, infoMessage2));

        verifyConsoleInfoNthCalledWith(3, toString(testTimestamp5, logLevelInfo, logger3Name, infoMessage3));
        verifyWriteFileNthCalledWith(5, testFilePath, toJsonStringify(testTimestamp5, logLevelInfo, logger3Name, infoMessage3));
        verifyPostNthCalledWith(5, testUrl, toObject(testTimestamp5, logLevelInfo, logger3Name, infoMessage3));

        verifyConsoleErrorNthCalledWith(2, toString(testTimestamp6, logLevelError, logger1Name, errorMessage2, stack2));
        verifyWriteFileNthCalledWith(6, testFilePath, toJsonStringify(testTimestamp6, logLevelError, logger1Name, errorMessage2, error2));
        verifyPostNthCalledWith(6, testUrl, toObject(testTimestamp6, logLevelError, logger1Name, errorMessage2, error2));

        verifyConsoleErrorNthCalledWith(3, toString(testTimestamp7, logLevelError, logger3Name, errorMessage3, error3));
        verifyWriteFileNthCalledWith(7, testFilePath, toJsonStringify(testTimestamp7, logLevelError, logger3Name, errorMessage3, error3));
        verifyPostNthCalledWith(7, testUrl, toObject(testTimestamp7, logLevelError, logger3Name, errorMessage3, error3));
    });
});
