'use strict';
const mysql = require(__base + '/app/modules/common/mysql.js');
const db = 'provisioning';

module.exports.checkUserTable = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM users WHERE user_id = ?';
    try {
      let result = mysql.query(request_id, db, querystring, user_id);
      if (result.length) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      console.log(e);
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.createdata = (request_id, user_data) => {
  return new Promise(async (resolve, reject) => {
    // const data =
    // let queryString = 'INSERT INTO users ('user_id', );
    resolve();
  });
};
