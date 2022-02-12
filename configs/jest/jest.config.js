'use strict';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coverageDirectory: 'coverage/',
    coverageReporters: [
        'lcov',
        'text'
    ],
    errorOnDeprecated: true,
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    moduleDirectories: [
        'node_modules', 'src'
    ],
    resetMocks: true,
    resetModules: true,
    restoreMocks: true,
    roots: [
        'test'
    ],
    testMatch: [
        '**/*.test.ts'
    ],
    transform: {
        '^.+\\.(ts)$': 'ts-jest'
    },
    timers: 'fake',
    verbose: true
};
