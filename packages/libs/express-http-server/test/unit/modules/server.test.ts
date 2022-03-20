import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import type { Application, RequestHandler } from 'express';
import type { OpenApiValidatorOpts } from 'express-openapi-validator/dist/openapi.validator';
import type { Server } from 'http';

import { createApp } from '../../../src/services/app';

import { createServer } from 'http';
import { json } from 'express';
import { middleware as openApiValidatorMiddleware } from 'express-openapi-validator';

import cors from 'cors';
import helmet from 'helmet';

import { createHttpServer } from '../../../src/modules/server';

jest.mock('../../../src/services/app');
jest.mock('express', () => mock());
jest.mock('express-openapi-validator');
jest.mock('http');
jest.mock('cors');
jest.mock('helmet');

describe('createHttpServer', () => {
    let testOpenApiValidatorOptions: OpenApiValidatorOpts;
    let testMiddlewares: RequestHandler[];

    let mockCors: jest.Mock;
    let mockHelmet: jest.Mock;
    let mockJson: jest.Mock;
    let mockOpenApiValidatorMiddlewares: RequestHandler[];
    let mockApplicationInstance: Application;
    let mockServerInstance: Server;

    beforeEach(() => {
        mockCors = jest.fn();
        when(cors).calledWith({ origin: '*' }).mockReturnValueOnce(mockCors);

        mockHelmet = jest.fn();
        when(helmet).calledWith().mockReturnValueOnce(mockHelmet);

        mockJson = jest.fn();
        when(json).calledWith().mockReturnValueOnce(mockJson);

        testOpenApiValidatorOptions = { apiSpec: './open-api-spec', validateRequests: true, validateResponses: true };
        testMiddlewares = [ mock<RequestHandler>() ];

        mockOpenApiValidatorMiddlewares = [];
        when(openApiValidatorMiddleware).calledWith(testOpenApiValidatorOptions).mockReturnValueOnce(mockOpenApiValidatorMiddlewares);

        mockApplicationInstance = mock<Application>();

        mockServerInstance = mock<Server>();
        // @ts-expect-error
        when(createServer).calledWith(mockApplicationInstance).mockReturnValueOnce(mockServerInstance);
    });

    test('should create http server based on express application when middewares are not defined', () => {
        // Given
        when(createApp).calledWith([ mockCors, mockHelmet, mockJson, ...mockOpenApiValidatorMiddlewares ])
            .mockReturnValueOnce(mockApplicationInstance);

        // When
        const server: Server = createHttpServer(testOpenApiValidatorOptions);

        // Then
        expect(server).toBe(mockServerInstance);
    });

    test('should create http server based on express application when middewares are defined', () => {
        // Given
        testMiddlewares = [ mock<RequestHandler>() ];
        when(createApp).calledWith([ mockCors, mockHelmet, mockJson, ...mockOpenApiValidatorMiddlewares, ...testMiddlewares ])
            .mockReturnValueOnce(mockApplicationInstance);

        // When
        const server: Server = createHttpServer(testOpenApiValidatorOptions, testMiddlewares);

        // Then
        expect(server).toBe(mockServerInstance);
    });
});
