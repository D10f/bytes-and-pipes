import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'development', level: 'debug' });

export default logger;