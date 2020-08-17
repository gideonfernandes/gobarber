const express = require('express');
const path = require('path');
const Youch = require('youch');
const Sentry = require('@sentry/node');
require('express-async-errors');
const routes = require('./routes');
const sentryConfig = require('./config/sentry');
require('./database');

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      const errors = await new Youch(err, request).toJSON();

      return response.status(500).json(errors);
    });
  }
}

module.exports = new App().server;
