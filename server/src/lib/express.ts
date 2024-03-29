import express, { Request, Response, NextFunction } from 'express';
import routes from '../api';
import config from '../config';
import log from './logger';

import { ErrorService, NotFoundError } from '../services/ErrorService';

export default () => {
  /**
   *  Initialize Express Server
   */
  const app = express();

  /**
   * Set headers
   */
  app.use((_req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", config.DOMAIN);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-type,Content-parts,Content-filesize',
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  /**
   * App-specific configuration
   */

  app.use(express.raw({ limit: config.MAX_FILE_SIZE }));
  app.use(express.json());
  // app.use(express.static(config.PUBLIC_DIR));

  /**
   * Register api routes
   */

  app.use('/file', routes.fileRouter);

  /**
   * 404 not found
   */

  app.use((_req, _res, next) => {
    next(new NotFoundError('Resource Not Found'));
  });

  /**
   * Error handling
   */

  /* eslint-disable-next-line */
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    log.error(err.message);

    if (err instanceof ErrorService) {
      return res.status(err.status).json(err.message);
    }

    res.status(500).json('Internal Server Error');
  });

  return app;
};
