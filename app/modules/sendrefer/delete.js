const mysql = require(__base + '/app/modules/common/mysql');
const db = 'provisioning';

module.exports.checkIfReferred = (request_id, user_id, email) => {
  return new Promise(async (resolve, reject) => {
    let queryString =
      'SELECT * FROM users_referred WHERE user_id = ? AND email = ? AND soft_delete = 0';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        user_id,
        email
      ]);
      if (result.length == 0 || result.length > 1) {
        reject({
          code: 103,
          custom_message: 'You have not referred the user'
        });
      } else {
        resolve(result[0]);
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

module.exports.updateSoftDelete = (request_id, id) => {
  return new Promise(async (resolve, reject) => {
    let queryString = 'UPDATE users_referred SET soft_delete = 1 WHERE id = ?';
    try {
      let result = await mysql.query(request_id, db, queryString, id);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ code: 102, custom_message: 'Internal Server Error' });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

module.exports.updateCount = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let queryString =
      'UPDATE users_referred_count SET current_count = current_count -1 WHERE user_id = ?';
    try {
      const result = await mysql.query(request_id, db, queryString, user_id);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ staust: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.updateUserConfig = (request_id, user_id) => {
  return new Promise(async (resolve, reject) => {
    let queryString =
      'UPDATE users_config SET default_count = default_count -1 WHERE user_id = ?';
    try {
      const result = await mysql.query(request_id, db, queryString, user_id);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ staust: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};
