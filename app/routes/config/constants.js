'use strict';

const routes = {
  referral: '/api/referral',
  refer: '/api/refer',
  validate: '/api/validate',
  resend: '/api/resendrefer',
  delete: '/api/deleterefer',

  web_login: '/api/web/login',
  web_registration: '/api/web/registration',
  web_refer: '/api/web/refer',
  refer_registration: '/api/web/referral',
  password: '/api/web/password',
  passwordCode: '/api/web/password/code',
  dashboard: '/api/web/dashboard',
  changePassword: '/api/web/changePassword',

  //demo endpoints
  ocrDemo: '/api/web/ocr/demo',

  uploadImage: '/api/web/ocr/upload'
};

module.exports = routes;
