import type { LogEntry } from '../../../src/types/log-entry';
import type { LogLevel } from '../../../src/definitions/log-level';

import { toJsonLogMessage, toPrettyLogMessage } from '../../../src/services/log-entry-formatter';

describe('toJsonLogMessage', () => {
    test('should return expected json log message', () => {
        // Given
        const testLogEntry: LogEntry = {
            timestamp: 'Today', logLevel: 'SomeLevel' as LogLevel, loggerName: 'TestLogger', message: 'Test message.'
        };
        const expectedLogMessage: object = { ...testLogEntry };

        // When
        const logMessage: object = toJsonLogMessage(testLogEntry);

        // Then
        expect(logMessage).toStrictEqual(expectedLogMessage);
    });
});

describe('toPrettyLogMessage', () => {
    let testLogEntry: LogEntry;
    let expectedLogMessage: string;

    beforeEach(() => {
        testLogEntry = { timestamp: 'Today', logLevel: 'SomeLevel' as LogLevel, loggerName: 'TestLogger', message: 'Test message.' };

        expectedLogMessage = `${testLogEntry.timestamp} ${testLogEntry.logLevel} `
            + `${testLogEntry.loggerName}: ${testLogEntry.message}`;
    });

    test('should return expected pretty log message when error is instance of Error with undefined stack', () => {
        // Given
        const testErrorMessage: string = 'Test error message.';
        const testError: Error = new Error(testErrorMessage);
        delete testError.stack;
        testLogEntry.error = testError;
        expectedLogMessage += ` ${testErrorMessage}`;

        // When
        const logMessage: string = toPrettyLogMessage(testLogEntry);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is instance of Error with defined stack', () => {
        // Given
        const testError: Error = new Error('Test error message.');
        testLogEntry.error = testError;
        expectedLogMessage += ` ${testError.stack as unknown as string}`;

        // When
        const logMessage: string = toPrettyLogMessage(testLogEntry);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is type of object', () => {
        // Given
        const testError: object = { error: 'Test error.' };
        testLogEntry.error = testError;
        expectedLogMessage += ` ${JSON.stringify(testError)}`;

        // When
        const logMessage: string = toPrettyLogMessage(testLogEntry);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is type of string', () => {
        // Given
        const testError: string = 'Test error.';
        testLogEntry.error = testError;
        expectedLogMessage += ` ${testError}`;

        // When
        const logMessage: string = toPrettyLogMessage(testLogEntry);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });

    test('should return expected pretty log message when error is undefined', () => {
        // Given, When
        const logMessage: string = toPrettyLogMessage(testLogEntry);

        // Then
        expect(logMessage).toBe(expectedLogMessage);
    });
});
