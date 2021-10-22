import mongoose from "mongoose";
import config from '../config';
import log from './logger';

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

    return await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

  } catch (error: any) {
    log.error(error.message);
    process.exit(1);
  }
};
