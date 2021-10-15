import { connect } from "mongoose";
import config from '../config';
import log from './logger';

export default async () => {
  const connection = await connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  
  log.info(connection);
  return connection.connection.db;
};
