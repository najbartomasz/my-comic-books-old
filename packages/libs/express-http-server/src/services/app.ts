/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/dot-notation */
import type { Application, RequestHandler } from 'express';

import express from 'express';

export const createApp = (middlewares?: RequestHandler[]): Application => {
    const app: Application = express();

    middlewares?.forEach((middleware: RequestHandler): void => {
        app.use(middleware);
    });

    return app;
};
