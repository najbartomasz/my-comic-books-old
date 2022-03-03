import { when } from 'jest-when';

import type { LogAppender } from '../../../../src/types/log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';
import type { LogLevel } from '../../../../src/definitions/log-level';
import type { LogMessage } from '../../../../src/types/log-message';

import { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';

describe('ConsoleLogAppender', () => {
    const expectedMessage: LogMessage = 'Expected message.';
    const testLogEntry: Readonly<LogEntry> = {
        timestamp: 'Today', logLevel: 'SomeLevel' as LogLevel, loggerName: 'TestLogger', message: 'Test message.'
    };

    let mockFormatLogEntry: jest.Mock;

    let consoleLogger: LogAppender;

    beforeEach(() => {
        mockFormatLogEntry = jest.fn();
        when(mockFormatLogEntry).calledWith(testLogEntry).mockReturnValueOnce(expectedMessage);

        consoleLogger = new ConsoleLogAppender(mockFormatLogEntry);
    });

    test('should print info message to debug console', () => {
        // Given
        const spyConsoleInfo: jest.SpyInstance = jest.spyOn(console, 'info').mockImplementation();

        // When
        consoleLogger.info(testLogEntry);

        // Then
        expect(spyConsoleInfo).toHaveBeenCalledTimes(1);
        expect(spyConsoleInfo).toHaveBeenCalledWith(expectedMessage);
    });

    test('should print warn message to debug console', () => {
        // Given
        const spyConsoleWarn: jest.SpyInstance = jest.spyOn(console, 'warn').mockImplementation();

        // When
        consoleLogger.warn(testLogEntry);

        // Then
        expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
        expect(spyConsoleWarn).toHaveBeenCalledWith(expectedMessage);
    });

    test('should print error message to debug console', () => {
        // Given
        const spyConsoleError: jest.SpyInstance = jest.spyOn(console, 'error').mockImplementation();

        // When
        consoleLogger.error(testLogEntry);

        // Then
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(expectedMessage);
    });
});
