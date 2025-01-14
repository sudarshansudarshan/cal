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
import cors from 'cors'


const app = express();

app.use(cors());

app.use('/openapi.json', express.static(path.join(__dirname, '../openapi.json')));

app.use(
  '/api/v1/docs',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
  })
);

app.use(express.json());

app.use('/v1', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Activity service runn ing on port ${PORT}. Access the API documentation at http://localhost:${PORT}/api/v1/docs`);
});