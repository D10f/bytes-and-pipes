import express from "express";
import init from "./lib";
import config from "./config";

const startServer = async () => {
  /**
   *  Initialize Express Server
   */
  const app = express();

  /**
   * Initializes services and libraries
   */
  await init(app, config);

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
   *  Initialize signal listeners for graceful shutdown
   */
  const shutdown = () => {
    server.close((err) => {
      if (err) {
        console.error(err);
        process.exitCode = 1;
      }
      process.exit();
    });
  };

  process.on("SIGINT", () => {
    console.info(
      "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
      new Date().toISOString()
    );
    shutdown();
  });

  process.on("SIGTERM", () => {
    console.info(
      "Got SIGTERM (docker container stop). Graceful shutdown ",
      new Date().toISOString()
    );
    shutdown();
  });

  /**
   * Start listening for connections
   */
   app.listen(config.PORT, config.HOST, () => {
    console.log(`Listening on port ${config.PORT}`);
  });
};

startServer();
