import { Express } from 'express';
import bunyan from 'bunyan';
import log from './logger';
import initMongoose from './mongoose';
import initExpress from './express';

/**
 * Initializes all services and libraries
 */

export default async (): Promise<{ log: bunyan, app: Express }> => {

  log.info('Bunyan logger ready');

  await initMongoose();

  const app = initExpress();
  log.info('Express server ready');

  return { log, app };
};