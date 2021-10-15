import express from "express";
import routes from "../api";

export default (app, config) => {
  /**
   * Set headers
   */

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", config.DOMAIN);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-type,Content-parts,Content-filesize"
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });

  /**
   * App-specific configuration
   */

  app.use(express.raw({ limit: config.MAX_FILE_SIZE }));
  app.use(express.json());
  app.use(express.static(config.PUBLIC_DIR));

  /**
   * Register api routes
   */

  app.use("/user", routes.userRouter);
  app.use("/file", routes.fileRouter);

  /**
   * 404 not found
   */

  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });

  /**
   * Error handling
   */

  app.use((err, req, res, next) => {
    res.status(err.status) || 500;
    res.json({ message: err.message });
  });
};
