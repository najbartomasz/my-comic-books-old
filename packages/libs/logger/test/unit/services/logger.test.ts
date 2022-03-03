import { mock } from 'jest-mock-extended';

import type { LogAppender } from '../../../src/types/log-appender';
import type { LogEntry } from '../../../src/types/log-entry';

import { LogLevel } from '../../../src/definitions/log-level';

import { Logger } from '../../../src/services/logger';

describe('LogAppenderAggregator', () => {
    const testTimestamp: string = '1987-08-20T03:20:15.127Z';
    const testName: string = 'TestLogger';
    const testMessage: string = 'Test message';

    let expectedLogEntry: LogEntry;

    let mockLogAppenderInstance1: LogAppender;
    let mockLogAppenderInstance2: LogAppender;

    let logger: Logger;

    beforeEach(() => {
        const testDate: Date = new Date(testTimestamp);
        // @ts-expect-error: Argument of type 'Date' is not assignable to parameter of type 'string'
        jest.spyOn(global, 'Date').mockReturnValueOnce(testDate);

        mockLogAppenderInstance1 = mock<LogAppender>();
        mockLogAppenderInstance2 = mock<LogAppender>();

        expectedLogEntry = {
            timestamp: testTimestamp,
            loggerName: testName,
            message: testMessage
        } as unknown as LogEntry;

        logger = new Logger(testName, [ mockLogAppenderInstance1, mockLogAppenderInstance2 ]);
    });

    test('should append info log to all appenders', () => {
        // Given
        expectedLogEntry.logLevel = LogLevel.Info;

        // When
        logger.info(testMessage);

        // Then
        expect(mockLogAppenderInstance1.info).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance1.info).toHaveBeenCalledWith(expectedLogEntry);
        expect(mockLogAppenderInstance2.info).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance2.info).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('should append warn log to all appenders', () => {
        // Given
        expectedLogEntry.logLevel = LogLevel.Warn;

        // When
        logger.warn(testMessage);

        // Then
        expect(mockLogAppenderInstance1.warn).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance1.warn).toHaveBeenCalledWith(expectedLogEntry);
        expect(mockLogAppenderInstance2.warn).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance2.warn).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('should append error log with object error to all appenders', () => {
        // Given
        const testError: Error = new Error();
        expectedLogEntry.logLevel = LogLevel.Error;
        expectedLogEntry.error = testError;

        // When
        logger.error(testMessage, testError);

        // Then
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledWith(expectedLogEntry);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('should append error log with string error to all appenders', () => {
        // Given
        const testError: string = 'Test error.';
        expectedLogEntry.logLevel = LogLevel.Error;
        expectedLogEntry.error = testError;

        // When
        logger.error(testMessage, testError);

        // Then
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledWith(expectedLogEntry);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('should append error log with undefined error to all appenders', () => {
        // Given
        expectedLogEntry.logLevel = LogLevel.Error;

        // When
        logger.error(testMessage);

        // Then
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance1.error).toHaveBeenCalledWith(expectedLogEntry);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledTimes(1);
        expect(mockLogAppenderInstance2.error).toHaveBeenCalledWith(expectedLogEntry);
    });
});
