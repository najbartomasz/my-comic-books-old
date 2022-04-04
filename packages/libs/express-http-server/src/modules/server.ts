import type { OpenApiValidatorOpts } from 'express-openapi-validator/dist/openapi.validator';

import type { Application, RequestHandler } from 'express';
import type { Server } from 'http';

import { createApp } from '../services/app';

import { createServer } from 'http';
import { json } from 'express';
import { middleware as openApiValidatorMiddleware } from 'express-openapi-validator';

import cors from 'cors';
import helmet from 'helmet';

export const createHttpServer = (openApiValidatorOptions: OpenApiValidatorOpts, middlewares: RequestHandler[] = []): Server => {
    const app: Application = createApp([
        ...middlewares,
        cors({ origin: '*' }), // NOSONAR
        helmet(),
        json(),
        ...openApiValidatorMiddleware(openApiValidatorOptions)
    ]);
    const server: Server = createServer(app);

    return server;
};
