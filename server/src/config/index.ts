import { resolve } from 'path';
import dotenv from 'dotenv';
import * as Joi from 'joi';
import { parseStorage, readDockerSecrets } from './utils';

interface TSchema {
  MONGODB_USERNAME: string;
  MONGODB_PASSWORD: string;
  MONGODB_DATABASE: string;
  PUBLIC_DIR: string;
  UPLOAD_LOCATION: string;
  MAX_FILE_SIZE: number;
  PORT: number;
  DOMAIN: string;
  LOG_LEVEL: string;
  LOG_NAME: string;
}

dotenv.config();

const envSchema = Joi.object({
  MONGODB_USERNAME: Joi.string(),
  MONGODB_USERNAME_FILE: Joi.string(),
  MONGODB_PASSWORD: Joi.string(),
  MONGODB_PASSWORD_FILE: Joi.string(),
  MONGODB_DATABASE: Joi.string(),
  MONGODB_DATABASE_FILE: Joi.string(),

  PUBLIC_DIR: Joi.string().default(resolve(__dirname, 'public')),
  UPLOAD_LOCATION: Joi.string().default(resolve(__dirname, 'uploads')),
  UPLOAD_LOCATION_FILE: Joi.string(),

  MAX_FILE_SIZE: Joi.string().custom(parseStorage),

  PORT: Joi.number().default(80),

  DOMAIN: Joi.string().default('localhost'),
  LOG_LEVEL: Joi.string().default('debug'),
  LOG_NAME: Joi.string().default('Bytes And Pipes [Development]'),
})
  .xor('MONGODB_USERNAME_FILE', 'MONGODB_USERNAME')
  .xor('MONGODB_PASSWORD_FILE', 'MONGODB_PASSWORD')
  .xor('MONGODB_DATABASE_FILE', 'MONGODB_DATABASE')
  .oxor('UPLOAD_LOCATION_FILE', 'UPLOAD_LOCATION')
  .rename('MONGODB_USERNAME_FILE', 'MONGODB_USERNAME')
  .rename('MONGODB_PASSWORD_FILE', 'MONGODB_PASSWORD')
  .rename('MONGODB_DATABASE_FILE', 'MONGODB_DATABASE')
  .rename('UPLOAD_LOCATION_FILE', 'UPLOAD_LOCATION');

const config = envSchema.validate(readDockerSecrets(), {
  allowUnknown: true,
  stripUnknown: true,
});

if (config.error) {
  throw new Error(config.error.details[0].message);
}

export default config.value as TSchema;
