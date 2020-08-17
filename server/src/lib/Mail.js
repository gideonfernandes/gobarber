const { resolve } = require('path');
const Nodemailer = require('nodemailer');
const expressHbs = require('express-handlebars');
const nodemailerHbs = require('nodemailer-express-handlebars');
const mailConfig = require('../config/mail');

class Mail {
  constructor() {
    const {
      host, port, secure, auth,
    } = mailConfig;

    this.transporter = Nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use('compile', nodemailerHbs({
      viewEngine: expressHbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

module.exports = new Mail();
