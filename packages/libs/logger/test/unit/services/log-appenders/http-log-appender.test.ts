import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';


import { HttpLogAppender } from '../../../../src/services/log-appenders/http-log-appender';

jest.mock('../../../../src/services/log-appenders/console-log-appender');

describe('HttpLogAppender', () => {
    const flushPromise = async (): Promise<void> => Promise.resolve();

    const testUri: string = 'http://my-logging-service.com/';

    let mockLogEntryInstance: LogEntry;
    let mockPost: jest.Mock;

    let httpLogAppender: HttpLogAppender;

    beforeEach(() => {
        mockLogEntryInstance = mock<LogEntry>();
        mockPost = jest.fn();
    });

    describe('when console log appender is not defined', () => {
        beforeEach(() => {
            when(mockPost).calledWith(testUri, mockLogEntryInstance).mockResolvedValueOnce(undefined);

            httpLogAppender = new HttpLogAppender(testUri, mockPost);
        });

        test('should send info log', () => {
            // Given, When
            httpLogAppender.info(mockLogEntryInstance);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, mockLogEntryInstance);
        });

        test('should send warn log', () => {
            // Given, When
            httpLogAppender.warn(mockLogEntryInstance);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, mockLogEntryInstance);
        });

        test('should send error log', () => {
            // Given, When
            httpLogAppender.error(mockLogEntryInstance);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, mockLogEntryInstance);
        });
    });

    describe('when console log appender is defined', () => {
        const testError: string = 'Test error.';
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
            mockConsoleLogAppenderInstance = mock<ConsoleLogAppender>();

            httpLogAppender = new HttpLogAppender(testUri, mockPost, mockConsoleLogAppenderInstance);
        });

        test('should print error message to debug console when sending info log failed', async () => {
            // Given
            when(mockPost).calledWith(testUri, mockLogEntryInstance).mockRejectedValueOnce(testError);

            // When
            httpLogAppender.info(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should print error message to debug console when sending warn log failed', async () => {
            // Given
            when(mockPost).calledWith(testUri, mockLogEntryInstance).mockRejectedValueOnce(testError);

            // When
            httpLogAppender.warn(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should print error message to debug console when sending error log failed', async () => {
            // Given
            when(mockPost).calledWith(testUri, mockLogEntryInstance).mockRejectedValueOnce(testError);

            // When
            httpLogAppender.error(mockLogEntryInstance);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });
    });
});
