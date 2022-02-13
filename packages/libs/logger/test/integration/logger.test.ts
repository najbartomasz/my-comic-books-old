import { when } from 'jest-when';

import { writeFile } from 'fs/promises';

import type { Logger, LoggerConsoleOptions, LoggerFileOptions, LoggerHttpOptions, LoggerOptions } from '../../src';

import { LogEntryFormat, LoggerFactory } from '../../src';

jest.mock('fs/promises');

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

    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

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
    });

    test('should print json pretty to debug console, write stringified json to file send it over http', () => {
        // Given
        const console: LoggerConsoleOptions = {
            outputFormat: LogEntryFormat.Pretty
        };
        const testFilePath: string = '/test/file/path';
        const file: LoggerFileOptions = {
            filePath: testFilePath,
            logEntryFormat: LogEntryFormat.Json
        };
        const testUrl: string = 'http://my-logging-service.com';
        const mockPostFunction: jest.Mock = jest.fn();
        when(mockPostFunction).calledWith(testUrl, expect.anything()).mockResolvedValue(undefined);
        when(writeFile).calledWith(testFilePath, expect.any(String) as string).mockResolvedValue(undefined);
        const http: LoggerHttpOptions = {
            url: testUrl,
            postFunction: mockPostFunction
        };
        const options: LoggerOptions = {
            console,
            file,
            http
        };
        const loggerFactory: LoggerFactory = new LoggerFactory(options);
        const logger1Name: string = 'TestLogger1';
        const logger1: Logger = loggerFactory.createLogger(logger1Name);
        const logger2Name: string = 'TestLogger2';
        const logger2: Logger = loggerFactory.createLogger(logger2Name);
        const logger3Name: string = 'TestLogger3';
        const logger3: Logger = loggerFactory.createLogger(logger3Name);
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

        // When
        logger1.info(infoMessage1);
        logger2.warn(warnMessage1);
        logger3.error(errorMessage1);
        logger2.info(infoMessage2);
        logger3.info(infoMessage3);
        logger1.error(errorMessage2, error2);
        logger3.error(errorMessage3, error3);

        // Then
        expect(consoleInfoSpy).toHaveBeenCalledTimes(3);
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
        expect(writeFile).toHaveBeenCalledTimes(7);
        expect(mockPostFunction).toHaveBeenCalledTimes(7);

        expect(consoleInfoSpy).toHaveBeenNthCalledWith(1, `${testTimestamp1} ${logLevelInfo} ${logger1Name}: ${infoMessage1}`);
        expect(writeFile).toHaveBeenNthCalledWith(1,
            testFilePath,
            JSON.stringify({ timestamp: testTimestamp1, logLevel: logLevelInfo, loggerName: logger1Name, message: infoMessage1 }));
        expect(mockPostFunction).toHaveBeenNthCalledWith(1,
            testUrl, { timestamp: testTimestamp1, logLevel: logLevelInfo, loggerName: logger1Name, message: infoMessage1 });

        expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, `${testTimestamp2} ${logLevelWarn} ${logger2Name}: ${warnMessage1}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(2,
            testUrl, { timestamp: testTimestamp2, logLevel: logLevelWarn, loggerName: logger2Name, message: warnMessage1 });
        expect(writeFile).toHaveBeenNthCalledWith(2,
            testFilePath,
            JSON.stringify({ timestamp: testTimestamp2, logLevel: logLevelWarn, loggerName: logger2Name, message: warnMessage1 }));

        expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, `${testTimestamp3} ${logLevelError} ${logger3Name}: ${errorMessage1}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(3,
            testUrl, { timestamp: testTimestamp3, logLevel: logLevelError, loggerName: logger3Name, message: errorMessage1 });
        expect(writeFile).toHaveBeenNthCalledWith(3,
            testFilePath,
            JSON.stringify({ timestamp: testTimestamp3, logLevel: logLevelError, loggerName: logger3Name, message: errorMessage1 }));

        expect(consoleInfoSpy).toHaveBeenNthCalledWith(2, `${testTimestamp4} ${logLevelInfo} ${logger2Name}: ${infoMessage2}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(4,
            testUrl, { timestamp: testTimestamp4, logLevel: logLevelInfo, loggerName: logger2Name, message: infoMessage2 });
        expect(writeFile).toHaveBeenNthCalledWith(4,
            testFilePath,
            JSON.stringify({ timestamp: testTimestamp4, logLevel: logLevelInfo, loggerName: logger2Name, message: infoMessage2 }));

        expect(consoleInfoSpy).toHaveBeenNthCalledWith(3, `${testTimestamp5} ${logLevelInfo} ${logger3Name}: ${infoMessage3}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(5,
            testUrl, { timestamp: testTimestamp5, logLevel: logLevelInfo, loggerName: logger3Name, message: infoMessage3 });
        expect(writeFile).toHaveBeenNthCalledWith(5,
            testFilePath,
            JSON.stringify({ timestamp: testTimestamp5, logLevel: logLevelInfo, loggerName: logger3Name, message: infoMessage3 }));

        expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, `${testTimestamp6} ${logLevelError} ${logger1Name}: ${errorMessage2} ${stack2}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(6,
            testUrl,
            { timestamp: testTimestamp6, logLevel: logLevelError, loggerName: logger1Name, message: errorMessage2, error: error2 });
        expect(writeFile).toHaveBeenNthCalledWith(6,
            testFilePath,
            JSON.stringify(
                { timestamp: testTimestamp6, logLevel: logLevelError, loggerName: logger1Name, message: errorMessage2, error: error2 }
            ));

        expect(consoleErrorSpy).toHaveBeenNthCalledWith(3, `${testTimestamp7} ${logLevelError} ${logger3Name}: ${errorMessage3} ${error3}`);
        expect(mockPostFunction).toHaveBeenNthCalledWith(7,
            testUrl,
            { timestamp: testTimestamp7, logLevel: logLevelError, loggerName: logger3Name, message: errorMessage3, error: error3 });
        expect(writeFile).toHaveBeenNthCalledWith(7,
            testFilePath,
            JSON.stringify(
                { timestamp: testTimestamp7, logLevel: logLevelError, loggerName: logger3Name, message: errorMessage3, error: error3 }
            ));
    });
});
