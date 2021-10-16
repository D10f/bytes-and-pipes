import { connect } from "mongoose";
import config from '../config';
import log from './logger';

export default async () => {
  try {
    const connection = await connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    
    return connection;
  } catch (error: any) {
    log.error(error.message);
    process.exit(1);
  }
};
