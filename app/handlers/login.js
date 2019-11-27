'use strict';

const mysql = require(__base + '/app/modules/common/mysql');
const response = require(__base + '/app/modules/common/response');

const signupModule = require(__base + '/app/modules/registration/signup');
const loginModule = require(__base + '/app/modules/registration/login');

module.exports.handleLogin = async (req, res) => {
  try {
    const body = req.body;
    await loginModule.init(req.request_id, body);
    let user = await loginModule.checkUserExistAndIsActive(req.request_id, body);
    body.userPassword = user.password;
    await loginModule.comparePassword(req.request_id,body);

    let token = await signupModule.generateToken(req.request_id, user);

    response.success(req.request_id, { token: token, user_id: user.user_id }, res);
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
