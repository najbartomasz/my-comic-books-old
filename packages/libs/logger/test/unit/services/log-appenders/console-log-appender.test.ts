import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { LogAppender } from '../../../../src/types/log-appender';
import type { LogEntry } from '../../../../src/types/log-entry';
import type { LogMessage } from '../../../../src/types/log-message';

import { ConsoleLogAppender } from '../../../../src/services/log-appenders/console-log-appender';

describe('ConsoleLogAppender', () => {
    const expectedMessage: LogMessage = 'Expected message.';

    let mockFormatLogEntry: jest.Mock;
    let mockLogEntryInstance: LogEntry;

    let consoleLogger: LogAppender;

    beforeEach(() => {
        mockFormatLogEntry = jest.fn();
        mockLogEntryInstance = mock<LogEntry>();
        when(mockFormatLogEntry).calledWith(mockLogEntryInstance).mockReturnValueOnce(expectedMessage);

        consoleLogger = new ConsoleLogAppender(mockFormatLogEntry);
    });

    test('should print info message to debug console', () => {
        // Given
        const spyConsoleInfo: jest.SpyInstance = jest.spyOn(console, 'info').mockImplementation();

        // When
        consoleLogger.info(mockLogEntryInstance);

        // Then
        expect(spyConsoleInfo).toHaveBeenCalledTimes(1);
        expect(spyConsoleInfo).toHaveBeenCalledWith(expectedMessage);
    });

    test('should print warn message to debug console', () => {
        // Given
        const spyConsoleWarn: jest.SpyInstance = jest.spyOn(console, 'warn').mockImplementation();

        // When
        consoleLogger.warn(mockLogEntryInstance);

        // Then
        expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
        expect(spyConsoleWarn).toHaveBeenCalledWith(expectedMessage);
    });

    test('should print error message to debug console', () => {
        // Given
        const spyConsoleError: jest.SpyInstance = jest.spyOn(console, 'error').mockImplementation();

        // When
        consoleLogger.error(mockLogEntryInstance);

        // Then
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(expectedMessage);
    });
});
