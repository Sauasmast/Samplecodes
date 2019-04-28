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
        reject({ code: 105, message: 'User does not exist' });
      } else {
        resolve();
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.userConfigdata = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM users_config WHERE user_id = ?';
    try {
      let result = await mysql.query(request_id, db, querystring, user_id);
      if (result.length == 0 || result.length > 1) {
        reject({ code: 102, custom_message: 'Internal Server Error' });
      } else {
        const { type, max_referral_count, default_count } = result[0];
        resolve({ type, max_referral_count, default_count });
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.userreferreddata = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM users_referred WHERE user_id = ?';
    try {
      let result = await mysql.query(request_id, db, querystring, user_id);
      if (result.length == 0) {
        resolve({ active: 0, users_referred: [] });
      } else {
        let activated_count = 0;
        let users_referred = [];
        result.forEach(data => {
          if (data.status == 'active') {
            activated_count += 1;
          }
          users_referred.push({ email: data.email, status: data.status });
        });
        resolve({ active: activated_count, users_referred });
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};
// This one was for creating the data if the user exist but the user does not exist in referral table
// module.exports.createdata = (request_id, user_data) => {
//   return new Promise(async (resolve, reject) => {
//     const data = {
//       user_id: user_data.user_id,
//       email: user_data.email,
//       status: 'active',
//       source: user_data.referred_by_user_id ? 'referral' : 'web',
//       reference_id: user_data.reference_id,
//       referred_by_user_id: user_data.referred_by_user_id
//     };
//     let queryString = `INSERT INTO users SET ?`;
//     try {
//       let result = await mysql.query(request_id, db, queryString, data);
//       if (result.affectedRows == 1) {
//         resolve();
//       }
//     } catch (e) {
//       reject({ code: 102, message: { message: e.message, stack: e.stack } });
//     }
//   });
// };
