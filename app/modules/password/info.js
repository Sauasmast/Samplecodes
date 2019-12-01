const axios = require('axios');
const moment = require('moment');

const mysql = require(__base + '/app/modules/common/mysql.js');
const db = 'provisioning';
const config = require(__base + '/app/config/config');
const uuid = require('uuid/v4');


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.signup_token !== 'undefined') {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(data.signup_token == null && data.signup_token.length < 36) {
      reject({ code: 103.2, message: 'Invalid signup token.' });
    } else {
      resolve();
    }
  });
};



module.exports.getUserInfo = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE signup_token = ? AND status = ?';

      let results = await mysql.query(request_id, db, queryString, [payload.signup_token, 'pending']);
      if(results.length >= 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.1, custom_message: 'Invalid sign up token provided.' });
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

