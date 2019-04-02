'use strict';

const health = require(__base + '/app/handlers/health')
const route = require(__base + '/app/routes/config/constants');
const logger = require(__base + '/app/modules/common/logger');

exports = module.exports = (app) => {

  // health checks
  app.get('/', health.check);
  app.get('/health', health.check);

  logger.info(`Routes initialized.`)
};
