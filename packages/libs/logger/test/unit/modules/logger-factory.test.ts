import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { LoggerOptions } from '../../../src/types/logger-options';

import { toJsonLogMessage, toPrettyLogMessage } from '../../../src/services/log-entry-formatter';
import { ConsoleLogAppender } from '../../../src/services/log-appenders/console-log-appender';
import { EmptyOptionsError } from '../../../src/definitions/empty-options-error';
import { FileLogAppender } from '../../../src/services/log-appenders/file-log-appender';
import { HttpLogAppender } from '../../../src/services/log-appenders/http-log-appender';
import { LogEntryFormat } from '../../../src/types/logger-options';
import { Logger } from '../../../src/services/logger';

import { writeFile } from 'fs/promises';

import { LoggerFactory } from '../../../src/modules/logger-factory';

jest.mock('../../../src/services/log-entry-formatter');
jest.mock('../../../src/services/log-appenders/console-log-appender');
jest.mock('../../../src/definitions/empty-options-error');
jest.mock('../../../src/services/log-appenders/file-log-appender');
jest.mock('../../../src/services/log-appenders/http-log-appender');
jest.mock('../../../src/services/logger');
jest.mock('fs/promises');

describe('LoggerFactory', () => {
    const testName: string = 'TestLogger';

    let mockLogger: jest.MockedObject<typeof Logger>;
    let mockLoggerInstance: Logger;
    let mockConsoleLogAppender: jest.MockedObject<typeof ConsoleLogAppender>;
    let mockConsoleLogAppenderInstance: ConsoleLogAppender;

    let loggerFactory: LoggerFactory;

    beforeEach(() => {
        mockConsoleLogAppender = jest.mocked(ConsoleLogAppender);
        mockConsoleLogAppenderInstance = mock<ConsoleLogAppender>();

        mockLogger = jest.mocked(Logger);
        mockLoggerInstance = mock<Logger>();
    });

    describe('when options are not defined', () => {
        test('should throw error', () => {
            // Given
            loggerFactory = new LoggerFactory();

            // When, Then
            expect(() => {
                loggerFactory.createLogger(testName);
            }).toThrow(new EmptyOptionsError());
        });
    });

    describe('when options are defined', () => {
        const testFilePath: string = '/test/file/path';
        const testUrl: string = 'http://my-logging-service.com';

        let mockFileLogAppender: jest.MockedObject<typeof FileLogAppender>;
        let mockFileLogAppenderInstance: FileLogAppender;

        let mockPostFunction: jest.Mock;
        let mockHttpLogAppender: jest.MockedObject<typeof HttpLogAppender>;
        let mockHttpLogAppenderInstance: HttpLogAppender;

        beforeEach(() => {
            mockFileLogAppender = jest.mocked(FileLogAppender);
            mockFileLogAppenderInstance = mock<FileLogAppender>();

            mockPostFunction = jest.fn();
            mockHttpLogAppender = jest.mocked(HttpLogAppender);
            mockHttpLogAppenderInstance = mock<HttpLogAppender>();
        });

        test('should return logger instance with json console log appender', () => {
            // Given
            when(mockConsoleLogAppender).calledWith(toJsonLogMessage).mockReturnValueOnce(mockConsoleLogAppenderInstance);
            when(mockLogger).calledWith(testName, [ mockConsoleLogAppenderInstance ]).mockReturnValueOnce(mockLoggerInstance);
            const testLoggerOptions: LoggerOptions = {
                console: {
                    outputFormat: LogEntryFormat.Json
                }
            };
            loggerFactory = new LoggerFactory(testLoggerOptions);

            // When
            const logger: Logger = loggerFactory.createLogger(testName);

            // Then
            expect(logger).toStrictEqual(mockLoggerInstance);
        });

        test('should return logger instance with pretty console log appender', () => {
            // Given
            when(mockConsoleLogAppender).calledWith(toPrettyLogMessage).mockReturnValueOnce(mockConsoleLogAppenderInstance);
            when(mockLogger).calledWith(testName, [ mockConsoleLogAppenderInstance ]).mockReturnValueOnce(mockLoggerInstance);
            const testLoggerOptions: LoggerOptions = {
                console: {
                    outputFormat: LogEntryFormat.Pretty
                }
            };
            loggerFactory = new LoggerFactory(testLoggerOptions);

            // When
            const logger: Logger = loggerFactory.createLogger(testName);

            // Then
            expect(logger).toStrictEqual(mockLoggerInstance);
        });

        test('should return logger instance with pretty file log appender', () => {
            // Given
            when(mockFileLogAppender).calledWith(testFilePath, toPrettyLogMessage, writeFile, undefined)
                .mockReturnValueOnce(mockFileLogAppenderInstance);
            when(mockLogger).calledWith(testName, [ mockFileLogAppenderInstance ])
                .mockReturnValueOnce(mockLoggerInstance);

            const testLoggerOptions: LoggerOptions = {
                file: {
                    filePath: testFilePath,
                    logEntryFormat: LogEntryFormat.Pretty
                }
            };
            loggerFactory = new LoggerFactory(testLoggerOptions);

            // When
            const logger: Logger = loggerFactory.createLogger(testName);

            // Then
            expect(logger).toStrictEqual(mockLoggerInstance);
        });

        test('should return logger instance with http log appender', () => {
            // Given
            when(mockHttpLogAppender).calledWith(testUrl, mockPostFunction, undefined)
                .mockReturnValueOnce(mockHttpLogAppenderInstance);
            when(mockLogger).calledWith(testName, [ mockHttpLogAppenderInstance ])
                .mockReturnValueOnce(mockLoggerInstance);

            const testLoggerOptions: LoggerOptions = {
                http: {
                    url: testUrl,
                    postFunction: mockPostFunction
                }
            };
            loggerFactory = new LoggerFactory(testLoggerOptions);

            // When
            const logger: Logger = loggerFactory.createLogger(testName);

            // Then
            expect(logger).toStrictEqual(mockLoggerInstance);
        });
    });
});
