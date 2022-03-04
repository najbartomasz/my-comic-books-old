import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';
import type { LogLevel } from '../../../../src/definitions/log-level';

import { HttpLogAppender } from '../../../../src/services/log-appenders/http-log-appender';

describe('HttpLogAppender', () => {
    const flushPromise = async (): Promise<void> => Promise.resolve();

    const testUri: string = 'http://my-logging-service.com/';
    const testLogEntry: Readonly<LogEntry> = {
        timestamp: 'Today', logLevel: 'SomeLevel' as LogLevel, loggerName: 'TestLogger', message: 'Test message.'
    };

    let mockPost: jest.Mock;

    let httpLogAppender: HttpLogAppender;

    beforeEach(() => {
        mockPost = jest.fn();
    });

    describe('when console log appender is not defined', () => {
        beforeEach(() => {
            when(mockPost).calledWith(testUri, testLogEntry).mockResolvedValueOnce(undefined);

            httpLogAppender = new HttpLogAppender(testUri, mockPost);
        });

        test('should send info log', () => {
            // Given, When
            httpLogAppender.info(testLogEntry);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, testLogEntry);
        });

        test('should send warn log', () => {
            // Given, When
            httpLogAppender.warn(testLogEntry);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, testLogEntry);
        });

        test('should send error log', () => {
            // Given, When
            httpLogAppender.error(testLogEntry);

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith(testUri, testLogEntry);
        });
    });

    describe('when console log appender is defined', () => {
        const testError: string = 'Test error.';
        const expectedLogEntry: Readonly<LogEntry> = {
            timestamp: testLogEntry.timestamp,
            logLevel: testLogEntry.logLevel,
            loggerName: testLogEntry.loggerName,
            message: `Failed to send the following message: ${testLogEntry.message}`,
            error: testError
        };

        let mockConsoleLogAppenderInstance: ConsoleLogAppender;

        beforeEach(() => {
            when(mockPost).calledWith(testUri, testLogEntry).mockRejectedValueOnce(testError);

            mockConsoleLogAppenderInstance = mock<ConsoleLogAppender>();

            httpLogAppender = new HttpLogAppender(testUri, mockPost, mockConsoleLogAppenderInstance);
        });

        test('should print error message to debug console when sending info log failed', async () => {
            // Given, When
            httpLogAppender.info(testLogEntry);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should print error message to debug console when sending warn log failed', async () => {
            // Given, When
            httpLogAppender.warn(testLogEntry);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });

        test('should print error message to debug console when sending error log failed', async () => {
            // Given, When
            httpLogAppender.error(testLogEntry);
            await flushPromise();

            // Then
            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledTimes(1);
            expect(mockConsoleLogAppenderInstance.error).toHaveBeenCalledWith(expectedLogEntry);
        });
    });
});
