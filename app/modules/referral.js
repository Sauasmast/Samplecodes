'use strict';
const mysql = require(__base + '/app/modules/common/mysql.js');
const db = 'provisioning';
const uuid = require('uuid/v4');

module.exports.checkUserTable = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM users WHERE user_id = ?';
    try {
      let result = await mysql.query(request_id, db, querystring, user_id);
      if (result.length == 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch (e) {
      console.log(e);
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.createdata = (request_id, user_data) => {
  return new Promise(async (resolve, reject) => {
    const data = {
      user_id: user_data.user_id,
      email: user_data.email,
      status: 'active',
      source: 'web'
    };
    let queryString = `INSERT INTO users SET ?`;
    try {
      let result = await mysql.query(request_id, db, queryString, data);
      if (result.affectedRow == 1) {
        resolve();
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};
