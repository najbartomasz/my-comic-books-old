import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { Application, RequestHandler } from 'express';

import express from 'express';

import { createApp } from '../../../src/services/app';

jest.mock('express', () => mock());

describe('createApp', () => {
    let testMiddlewares: RequestHandler[];

    let mockMiddleware1: RequestHandler;
    let mockMiddleware2: RequestHandler;
    let mockMiddleware3: RequestHandler;
    let mockExpress: jest.Mock;
    let mockApplicationInstance: Application;

    let app: Application;

    beforeEach(() => {
        mockMiddleware1 = mock<RequestHandler>();
        mockMiddleware2 = mock<RequestHandler>();
        mockMiddleware3 = mock<RequestHandler>();

        testMiddlewares = [ mockMiddleware1, mockMiddleware2, mockMiddleware3 ];

        mockExpress = jest.mocked(express);
        mockApplicationInstance = mock<Application>();
        when(mockExpress).calledWith().mockReturnValueOnce(mockApplicationInstance);

        app = createApp(testMiddlewares);
    });

    test('should return express application', () => {
        // Given, When, Then
        expect(app).toBe(mockApplicationInstance);
    });

    test('should use all provided middlewares', () => {
        // Given, When, Then
        expect(mockApplicationInstance.use).toHaveBeenCalledTimes(3);
        expect(mockApplicationInstance.use).toHaveBeenCalledWith(mockMiddleware1);
        expect(mockApplicationInstance.use).toHaveBeenCalledWith(mockMiddleware2);
        expect(mockApplicationInstance.use).toHaveBeenCalledWith(mockMiddleware3);
    });
});
