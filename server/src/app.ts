import { Express } from "express";
import bunyan from 'bunyan';
import init from "./lib";
import config from "./config";

const startServer = async () => {
  /**
   * Initializes services and libraries
   */
  const { log, app } : { log: bunyan, app: Express } = await init();

  /**
   *  Register healthcheck routes
   */
  app.get("/alive", (req, res) => {
    res.status(200).end();
  });

  app.get("/health", (req, res) => {
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
    server.close((err) => {
      if (err) {
        log.error(err);
        process.exitCode = 1;
      }
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
