import log from './logger';
import initMongoose from './mongoose';
import initSendgrid from './sendgrid';
import initExpress from './express';

/**
 * Initializes all services and libraries
 */

export default async (app) => {

  log.info('Bunyan initialized');

  await initMongoose();
  log.info('MongoDB connection ready');

  initSendgrid();
  log.info('Sendgrid API setup ready');

  initExpress(app);
  log.info('Express server ready');
};