'use strict';
const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

const mysql = require(__base + '/app/modules/common/mysql');

const db = 'provisioning';


module.exports.updateFacebookEmailList = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(payload);
      const queryString = 'UPDATE marketing SET is_facebook_email_sent = ? WHERE email = ?';
      const { email } = payload;

      let results = await mysql.query(request_id, db, queryString, [1, email]);
      if(results.length >= 1) {
        resolve();
      } else {
        resolve();
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })

}