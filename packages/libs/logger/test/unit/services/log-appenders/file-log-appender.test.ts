import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';
import type { LogLevel } from '../../../../src/definitions/log-level';

import { FileLogAppender } from '../../../../src/services/log-appenders/file-log-appender';

describe('FileLogAppender', () => {
    const testFilePath: string = '/test/file/path';
    const testLogEntry: Readonly<LogEntry> = {
        timestamp: 'Today', logLevel: 'SomeLevel' as LogLevel, loggerName: 'TestLogger', message: 'Test message.'
    };

    let mockFormatLogEntry: jest.Mock;
    let mockWriteFile: jest.Mock;

    let fileLogAppender: FileLogAppender;

    beforeEach(() => {
        mockWriteFile = jest.fn();
    });

    describe('when formatted log entry is string', () => {
        const expectedMessage: string = 'Expected message.';

        beforeEach(() => {
            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(testLogEntry).mockReturnValueOnce(expectedMessage);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockResolvedValueOnce(undefined);

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile);
        });

        test('should write info message to file', () => {
            // Given, When
            fileLogAppender.info(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write warn message to file', () => {
            // Given, When
            fileLogAppender.warn(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write error message to file', () => {
            // Given, When
            fileLogAppender.error(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });
    });

    describe('when formatted log entry is object', () => {
        const expectedMessage: string = JSON.stringify(testLogEntry);

        beforeEach(() => {
            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(testLogEntry).mockReturnValueOnce(testLogEntry);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockResolvedValueOnce(undefined);

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile);
        });

        test('should write info message to file', () => {
            // Given, When
            fileLogAppender.info(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write warn message to file', () => {
            // Given, When
            fileLogAppender.warn(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write error message to file', () => {
            // Given, When
            fileLogAppender.error(testLogEntry);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });
    });

    describe('when writing file fails and console log appender is defined', () => {
        const flushPromise = async (): Promise<void> => Promise.resolve();

        const testError: Error = new Error('Test error');
        const expectedMessage: string = 'Expected message.';
        const expectedLogEntry: Readonly<LogEntry> = {
            timestamp: testLogEntry.timestamp,
            logLevel: testLogEntry.logLevel,
            loggerName: testLogEntry.loggerName,
            message: `Failed to send the following message: ${testLogEntry.message}`,
            error: testError
        };

        let mockConsoleLogAppenderInstance: ConsoleLogAppender;

        beforeEach(() => {
            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(testLogEntry).mockReturnValueOnce(expectedMessage);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockRejectedValueOnce(testError);
            mockConsoleLogAppenderInstance = mock<ConsoleLogAppender>();

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile, mockConsoleLogAppenderInstance);
        });

        test('should write error message to debug console when writing info message to file failed', async () => {
            // Given, When
            fileLogAppender.info(testLogEntry);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should write error message to debug console when writing warn message to file failed', async () => {
            // Given, When
            fileLogAppender.warn(testLogEntry);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should write error message to debug console when writing error message to file failed', async () => {
            // Given, When
            fileLogAppender.error(testLogEntry);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });
    });
});
