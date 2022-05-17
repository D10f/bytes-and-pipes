import mongoose from 'mongoose';
import config from '../config';
import log from './logger';

const MONGODB_URI = `mongodb://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@mongo:27017/${config.MONGODB_DATABASE}?authSource=admin`;

export default async () => {
  try {
    mongoose.connection.on('connecting', () => {
      log.info('Connecting to MongoDB...');
    });

    mongoose.connection.on('connected', () => {
      log.info('Connection to MongoDB ready');
    });

    mongoose.connection.on('disconnected', () => {
      log.error('Connection to MongoDB lost, attempting to reconnect...');
    });

    mongoose.connection.on('reconnectFailed', () => {
      log.error('Failed to reconnect to MongoDB');
    });

    return await mongoose.connect(MONGODB_URI as string, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (error) {
    log.error((error as Error).message);
    process.exit(1);
  }
};
