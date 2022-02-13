import { mock } from 'jest-mock-extended';

import type { LogEntry } from '../../../src/types/log-entry';
import type { LogLevel } from '../../../src/definitions/log-level';

import { toJsonLogMessage, toPrettyLogMessage } from '../../../src/services/log-entry-formatter';

describe('toJsonLogMessage', () => {
    let mockLogEntryInstance: LogEntry;
    let expectedLogMessage: object;

    test('should return expected json log message', () => {
        // Given
        mockLogEntryInstance = mock<LogEntry>();
        expectedLogMessage = mockLogEntryInstance;

        // When
        const logMessage: object = toJsonLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });
});

describe('toPrettyLogMessage', () => {
    let mockLogEntryInstance: LogEntry;
    let expectedLogMessage: string;

    beforeEach(() => {
        mockLogEntryInstance = mock<LogEntry>({
            timestamp: 'Today',
            logLevel: 'SomeLevel' as LogLevel,
            loggerName: 'TestLogger',
            message: 'Test message.'
        });

        expectedLogMessage = `${mockLogEntryInstance.timestamp} ${mockLogEntryInstance.logLevel} `
            + `${mockLogEntryInstance.loggerName}: ${mockLogEntryInstance.message}`;
    });

    test('should return expected pretty log message when error is instance of Error with undefined stack', () => {
        // Given
        const testErrorMessage: string = 'Test error message.';
        const testError: Error = new Error(testErrorMessage);
        delete testError.stack;
        mockLogEntryInstance.error = testError;
        expectedLogMessage += ` ${testErrorMessage}`;

        // When
        const logMessage: string = toPrettyLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is instance of Error with defined stack', () => {
        // Given
        const testError: Error = new Error('Test error message.');
        mockLogEntryInstance.error = testError;
        expectedLogMessage += ` ${testError.stack as unknown as string}`;

        // When
        const logMessage: string = toPrettyLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is type of object', () => {
        // Given
        const testError: object = { error: 'Test error.' };
        mockLogEntryInstance.error = testError;
        expectedLogMessage += ` ${JSON.stringify(testError)}`;

        // When
        const logMessage: string = toPrettyLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is type of string', () => {
        // Given
        const testError: string = 'Test error.';
        mockLogEntryInstance.error = testError;
        expectedLogMessage += ` ${testError}`;

        // When
        const logMessage: string = toPrettyLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is undefined', () => {
        // Given, When
        const logMessage: string = toPrettyLogMessage(mockLogEntryInstance);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });
});
