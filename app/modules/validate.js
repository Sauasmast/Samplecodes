const mysql = require(__base + '/app/modules/common/mysql');
const uuid = require('uuid/v4');
const db = 'provisioning';

module.exports.init = (request_id, code) => {
  return new Promise(async (resolve, reject) => {
    if (code.toString().trim().length == 6) {
      resolve();
    } else {
      reject({ code: 103, custom_message: 'You entered the wrong code.' });
    }
  });
};

module.exports.checkCodeEmail = (request_id, code, email) => {
  return new Promise(async (resolve, reject) => {
    const queryString =
      'SELECT * from users_referred WHERE code = ? AND email = ? AND soft_delete = 0';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        code,
        email
      ]);
      if (result.length == 0) {
        reject({
          code: 103,
          custom_message: 'Make sure the email address and the code matches.'
        });
      } else if (result.length == 1) {
        resolve(result[0]);
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.activeUser = (request_id, id) => {
  return new Promise(async (resolve, reject) => {
    let queryString = `UPDATE users_referred SET status='active' WHERE id = ?`;
    try {
      let result = await mysql.query(request_id, db, queryString, id);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.updateActivateCount = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let queryString = `UPDATE users_referred_count SET activated_count= activated_count + 1 WHERE user_id = ?`;
    try {
      let result = await mysql.query(request_id, db, queryString, user_id);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.makeUserConfig = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    data = {
      user_id,
      type: 'standard',
      max_referral_count: 25,
      default_count: 0,
      increase_count_by: 0
    };
    let queryString = `INSERT INTO users_config SET ?`;
    try {
      let result = await mysql.query(request_id, db, queryString, data);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};
