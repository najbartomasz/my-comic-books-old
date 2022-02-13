import { LogLevel } from '../../../src/definitions/log-level';

describe('LogLevel', () => {
    test('should define INFO level', () => {
        // Given, When, Then
        expect(LogLevel.Info).toBe('INFO');
    });

    test('should define WARN level', () => {
        // Given, When, Then
        expect(LogLevel.Warn).toBe('WARN');
    });

    test('should define ERROR level', () => {
        // Given, When, Then
        expect(LogLevel.Error).toBe('ERROR');
    });
});
