import mongooseConnect from './mongoose';
import sendgridConnect from './sendgrid';
import expressApp from './express';

/**
 * Initializes all services and libraries
 */

export default async (app, config) => {

  await mongooseConnect(config);
  console.log('MongoDB connection ready');

  sendgridConnect(config);
  console.log('Sendgrid API setup ready');

  expressApp(app, config);
  console.log('Express server ready');
};