import bunyan from 'bunyan';
import config from '../config';

const log = bunyan.createLogger({ name: config.LOG_NAME, level: config.LOG_LEVEL });

export default log;