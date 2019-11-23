'use strict';

const health = require(__base + '/app/handlers/health');
const route = require(__base + '/app/routes/config/constants');
const logger = require(__base + '/app/modules/common/logger');
const referral = require(__base + '/app/handlers/referral');
const authorization = require(__base + '/app/routes/config/authorization');

const refer = require(__base + '/app/handlers/refer');
const registration = require(__base + '/app/handlers/registration');
const login = require(__base + '/app/handlers/login');

const validate = require(__base + '/app/handlers/validate');
const resend = require(__base + '/app/handlers/sendrefer/resendrefer');
const del = require(__base + '/app/handlers/sendrefer/deleterefer');

exports = module.exports = app => {

  logger.info(`Routes initialized.`)

  // health checks
  app.get('/', health.check);
  app.get('/health', health.check);


  // app.get('/', (req, res) => res.send('this is working.......'));

  app.route(route.referral).get(authorization.authCheck, referral.getdata);
  app.route(route.refer).post(authorization.authCheck, refer.referpeople);
  app.route(route.validate).post(validate.checkReferralCode);

  // This is responsible for resending the referral or deleting the referral system.
  app.route(route.resend).get(authorization.authCheck, resend.sendagain);
  app.route(route.delete).post(authorization.authCheck, del.deleterefer);


  //Web Referral Routes--->

  app.route(route.web_registration)
    .post(registration.register)
    .put(registration.finalizeRegistration)

  app.route(route.web_refer)
    .post(refer.sendWebReferral);

  app.route(route.web_login)
    .post(login.handleLogin)

  app.route(route.refer_registration)
    .post(referral.registerWithReferral)

  
};
