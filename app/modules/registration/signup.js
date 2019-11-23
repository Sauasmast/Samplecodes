'use strict';

const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require(__base + '/app/modules/common/mysql');
// const logger = require(__base + '/app/modules/common/logger');
const config = require(__base + '/app/config/config');
const axios = require('axios');

// const salt_rounds = 10;
const db = 'provisioning';


//generate jwt token
module.exports.generateToken = async (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {
        user_id: payload.user_id,
        email: payload.email
      };
      let token = await jwt.sign(data, config.jwt.cert);
      resolve(token);
    } catch (e) {
      reject({ code: 102, message: { message: e.message } });
    }
  });
};
