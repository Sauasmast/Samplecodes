const mysql = require(__base + '/app/modules/common/mysql');
const db = 'provisioning';

module.exports.checkCodeEmail = (request_id, code, email) => {
  return new Promise(async (resolve, reject) => {
    const queryString =
      'SELECT * from users_referred WHERE code = ? AND email = ?';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        code,
        email
      ]);
      if (result.length == 0) {
        reject({
          status: 103,
          message: 'Make sure the email address and the code matches'
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
