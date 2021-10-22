import { Express } from "express";
import mongoose from 'mongoose';
import bunyan from 'bunyan';
import init from "./lib";
import config from "./config";

const startServer = async () => {
  /**
   * Initializes services and libraries
   */
  const { log, app, db } : { log: bunyan, app: Express, db: typeof mongoose } = await init();

  /**
   *  Register healthcheck routes
   */
  app.get("/alive", (_req, res) => {
    res.status(200).end();
  });

  app.get("/health", (_req, res) => {
    // Check connection to db, check for certain files, etc.
    res.status(200).end();
  });

  /**
   * Start listening for connections
   */
   const server = app.listen(+config.PORT, config.HOST, () => {
    log.info(`Listening on port ${config.PORT}`);
  });

  /**
   *  Initialize signal listeners for graceful shutdown
   */
   const shutdown = () => {
     log.info('Shutting down server...');
     server.close(async (err) => {

       if (err) {
         log.error(err);
         process.exitCode = 1;
       }

       log.info('Disconnecting from database...');
       await db.disconnect();

       log.info(`Server shutdown [${process.exitCode}]`)
       process.exit();
     });
  };

  process.on("SIGINT", () => {
    log.warn(
      "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
      new Date().toISOString()
    );
    shutdown();
  });

  process.on("SIGTERM", () => {
    log.warn(
      "Got SIGTERM (docker container stop). Graceful shutdown ",
      new Date().toISOString()
    );
    shutdown();
  });
};

startServer();
