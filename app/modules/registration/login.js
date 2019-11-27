const mysql = require(__base + '/app/modules/common/mysql');
const bcrypt = require('bcryptjs');

const db = 'provisioning';

module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if (data.email && data.password) {
      resolve();
    } else {
      reject({ code: 103.1, custom_message: 'Missing parent attribute.' });
    }
  });
};

module.exports.checkUserExistAndIsActive = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM web_users WHERE email = ? AND status = ?';
    const { email } = payload
    try {
      let result = await mysql.query(request_id, db, querystring, [email, 'active']);
      if (result.length !== 1) {
        reject({ code: 101, custom_message: 'User does not exist.' });
      } else {
        resolve(result[0]);
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.comparePassword = (request_id, payload) => {
  return new Promise((resolve, reject) => {
    try {
      const { password, userPassword } = payload;
      bcrypt.compare(password, userPassword, (err, matched) => {
        if (err) {
          reject({ status: 102, message: 'Internal Server error' });
        } else if (matched) {
          resolve();
        } else {
          reject({
            code: 101,
            custom_message: 'Invalid email or password.'
          });
        }
      });
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};
