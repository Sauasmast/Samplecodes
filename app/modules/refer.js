'use strict';

const config = require(__base + '/app/config/config');
const uuidv4 = require('uuid/v4');
const db = 'provisioning';
const mysql = require(__base + '/app/modules/common/mysql');
const axios = require('axios');

module.exports.checkuserconfiguration = (request_id, user_id, total_number) => {
  return new Promise(async (resolve, reject) => {
    let queryString = 'SELECT * from users_config WHERE user_id = ? ';
    try {
      let result = await mysql.query(request_id, db, queryString, user_id);
      if (result.length == 0 || result.length > 1) {
        reject({ code: 102, message: 'Internal Server Error' });
      } else {
        let max_count = result[0].max_referral_count;
        let user_referred = result[0].default_count;
        if (max_count < user_referred + total_number) {
          reject({
            code: 103,
            message: `You cannot refer more than ${max_count}`
          });
        } else {
          queryString = `UPDATE users_config SET default_count = ? WHERE user_id = ?`;
          result = await mysql.query(request_id, db, queryString, [
            user_referred + total_number,
            user_id
          ]);
          if (result.affectedRows == 1) {
            resolve();
          } else {
            reject({ code: 102, message: 'Internal Server Error' });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.checkIfUserExist = (request_id, emails) => {
  // Shortcut for the referral service because we are dealing with only one user at a time right now.
  const email = emails[0];

  return new Promise(async (resolve, reject) => {
    let queryString = 'SELECT * FROM users where email = ?';
    try {
      let result = await mysql.query(request_id, db, queryString, email);
      if (result.length == 0) {
        resolve();
      } else {
        reject({ code: 103, custom_message: 'User already exists.' });
      }
    } catch (e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  });
};

module.exports.checkIfAlreadyReferred = (request_id, user_id, emails) => {
  return new Promise(async (resolve, reject) => {
    // Shortcut for the referral service because we are dealing with only one user at a time right now.
    const email = emails[0];
    let queryString =
      'SELECT * FROM users_referred WHERE user_id = ? AND email = ? AND soft_delete = 0';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        user_id,
        email
      ]);
      if (result.length == 0) {
        resolve();
      } else {
        reject({
          code: 103,
          custom_message: 'You have already referred the user'
        });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

module.exports.createcode = (request_id, emails) => {
  return new Promise((resolve, reject) => {
    try {
      var codes = [];
      emails.forEach(email => {
        codes.push(Math.floor(Math.random() * 900000) + 100000);
      });
      resolve(codes);
    } catch (e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  });
};

module.exports.databaseEntry = (request_id, user_id, emails, codes) => {
  return new Promise((resolve, reject) => {
    const queryString = `INSERT INTO users_referred SET ?`;
    emails.forEach(async (email, index) => {
      let data = {
        id: uuidv4(),
        user_id,
        email,
        code: codes[index],
        status: 'pending'
      };
      try {
        let result = await mysql.query(request_id, db, queryString, data);
        if (result.affectedRows != 1) {
          reject({ code: 102, message: 'Internal server error' });
        }
      } catch (e) {
        reject(e);
      }
    });
    resolve();
  });
};

module.exports.updatecount = (request_id, user_id, count) => {
  return new Promise(async (resolve, reject) => {
    let queryString =
      'SELECT id, current_count FROM users_referred_count WHERE user_id = ?';
    try {
      const current_count_user = await mysql.query(
        request_id,
        db,
        queryString,
        user_id
      );
      if (current_count_user.length == 0) {
        const data = {
          id: uuidv4(),
          user_id,
          current_count: count,
          activated_count: 0
        };
        queryString = `INSERT INTO users_referred_count SET ?`;
        let result = await mysql.query(request_id, db, queryString, data);
        if (result.affectedRows == 1) {
          resolve();
        } else {
          reject({ staust: 102, message: 'Internal Server Error' });
        }
      } else if (current_count_user.length == 1) {
        const { id, current_count } = current_count_user[0];
        queryString = `UPDATE users_referred_count SET current_count = ? WHERE id = ?`;
        let result = await mysql.query(request_id, db, queryString, [
          current_count + count,
          id
        ]);
        if (result.affectedRows == 1) {
          resolve();
        } else {
          reject({ staust: 102, message: 'Internal Server Error' });
        }
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};
