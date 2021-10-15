import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default {
  //MONGODB SETTINGS
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",

  //SENDGRID API
  SG_API_KEY: process.env.SG_API_KEY || "",

  //FILE UPLOAD/DOWNLOAD SETTINGS
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 1024 * 1024 * 1024,
  PUBLIC_DIR: process.env.PUBLIC_DIR || path.resolve(__dirname, "dist"),
  UPLOAD_LOCATION: process.env.UPLOAD_LOCATION || '',

  //NODE.JS PROCESS
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "0.0.0.0",

  //APP SETTINGS
  DOMAIN: process.env.DOMAIN || "localhost",
  JWT_SECRET: process.env.JWT_SECRET || "goodenoughfordevandtestpurposes",
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_NAME: process.env.LOG_NAME || 'Bytes And Pipes [Development]'
};
