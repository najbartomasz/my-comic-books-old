import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';

import { FileLogAppender } from '../../../../src/services/log-appenders/file-log-appender';

describe('FileLogAppender', () => {
    const testFilePath: string = '/test/file/path';

    let mockFormatLogEntry: jest.Mock;
    let mockWriteFile: jest.Mock;
    let mockLogEntryInstance: LogEntry;

    let fileLogAppender: FileLogAppender;

    beforeEach(() => {
        mockWriteFile = jest.fn();
        mockLogEntryInstance = mock<LogEntry>();
    });

    describe('when formatted log entry is string', () => {
        const expectedMessage: string = 'Expected message.';

        beforeEach(() => {
            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(mockLogEntryInstance).mockReturnValueOnce(expectedMessage);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockResolvedValueOnce(undefined);

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile);
        });

        test('should write info message to file', () => {
            // Given, When
            fileLogAppender.info(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write warn message to file', () => {
            // Given, When
            fileLogAppender.warn(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write error message to file', () => {
            // Given, When
            fileLogAppender.error(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });
    });

    describe('when formatted log entry is object', () => {
        let expectedMessage: string;

        beforeEach(() => {
            expectedMessage = JSON.stringify(mockLogEntryInstance);

            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(mockLogEntryInstance).mockReturnValueOnce(mockLogEntryInstance);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockResolvedValueOnce(undefined);

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile);
        });

        test('should write info message to file', () => {
            // Given, When
            fileLogAppender.info(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write warn message to file', () => {
            // Given, When
            fileLogAppender.warn(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });

        test('should write error message to file', () => {
            // Given, When
            fileLogAppender.error(mockLogEntryInstance);

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
        });
    });

    describe('when writing file fails and console log appender is defined', () => {
        const flushPromise = async (): Promise<void> => Promise.resolve();

        const testError: Error = new Error('Test error');
        const expectedMessage: string = 'Expected message.';

        let expectedLogEntry: LogEntry;

        let mockConsoleLogAppenderInstance: ConsoleLogAppender;

        beforeEach(() => {
            expectedLogEntry = {
                timestamp: mockLogEntryInstance.timestamp,
                logLevel: mockLogEntryInstance.logLevel,
                loggerName: mockLogEntryInstance.loggerName,
                message: `Failed to send the following message: ${mockLogEntryInstance.message}`,
                error: testError
            };

            mockFormatLogEntry = jest.fn();
            when(mockFormatLogEntry).calledWith(mockLogEntryInstance).mockReturnValueOnce(expectedMessage);
            when(mockWriteFile).calledWith(testFilePath, expectedMessage).mockRejectedValueOnce(testError);
            mockConsoleLogAppenderInstance = mock<ConsoleLogAppender>();

            fileLogAppender = new FileLogAppender(testFilePath, mockFormatLogEntry, mockWriteFile, mockConsoleLogAppenderInstance);
        });

        test('should write error message to debug console when writing info message to file failed', async () => {
            // Given, When
            fileLogAppender.info(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should write error message to debug console when writing warn message to file failed', async () => {
            // Given, When
            fileLogAppender.warn(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should write error message to debug console when writing error message to file failed', async () => {
            // Given, When
            fileLogAppender.error(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(testFilePath, expectedMessage);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });
    });
});
