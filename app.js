'use strict';

const EasyCaptchaService = require('./lib/index');

module.exports = app => {
  if (app.config.easyCaptcha.app) EasyCaptchaService(app);
};
