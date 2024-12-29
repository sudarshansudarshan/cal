/**
 * @fileoverview Entry point for the Activity Engine backend service.
 * This file sets up the Express application, integrates API documentation,
 * and starts the server.
 */

import express from 'express';
import routes from './api/v1/routes';
import { apiReference } from '@scalar/express-api-reference';
import { errorHandler } from './api/v1/middlewares/errorHandler';
import path from 'path';

const app = express();

app.use('/v1', routes);

// Middlewares

// JSON Parser
app.use(express.json());

// Error Handler
app.use(errorHandler);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
let startServer = undefined;

if (!IS_PRODUCTION) {
  // API Reference
  app.use('/openapi.json', express.static(path.join(__dirname, '../openapi.json')));
  app.use(
    '/reference',
    apiReference({
      spec: {
        url: '/openapi.json',
      },
    })
  );

  startServer = () => {
    console.log(`Activity service running on port ${PORT}. Access the API documentation at http://localhost:${PORT}/reference`);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, startServer);