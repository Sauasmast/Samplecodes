'use strict';

const health = require(__base + '/app/handlers/health');
const route = require(__base + '/app/routes/config/constants');
const logger = require(__base + '/app/modules/common/logger');
const referral = require(__base + '/app/handlers/referral');
const authorization = require(__base + '/app/routes/config/authorization');
const refer = require(__base + '/app/handlers/refer');
const validate = require(__base + '/app/handlers/validate');

exports = module.exports = app => {
  // health checks
  // app.get('/', health.check);
  // app.get('/health', health.check);

  // logger.info(`Routes initialized.`);

  app.get('/', (req, res) => res.send('this is working.......'));

  app.route(route.referral).get(authorization.authCheck, referral.getdata);
  app.route(route.refer).post(authorization.authCheck, refer.referpeople);
  app.route(route.validate).post(validate.checkReferralCode);
};
