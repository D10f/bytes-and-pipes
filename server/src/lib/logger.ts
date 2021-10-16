import bunyan from 'bunyan';
import config from '../config';

const log = bunyan.createLogger({ name: config.LOG_NAME, level: config.LOG_LEVEL as bunyan.LogLevelString });

export default log;