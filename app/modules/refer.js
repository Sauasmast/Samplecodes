'use strict';

const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');
const uuidv4 = require('uuid/v4');
const db = 'provisioning';
const mysql = require(__base + '/app/modules/common/mysql');

module.exports.createcode = (request_id, emails) => {
  return new Promise((resolve, reject) => {
    var codes = [];
    emails.forEach(email => {
      codes.push(Math.floor(Math.random() * 900000) + 100000);
    });
    resolve(codes);
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
        if (result[1].affectedRows != 1) {
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
      } else if (current_count_user.length == 1) {
        const { id, current_count } = current_count_user[0];
        queryString = `UPDATE users_referred_count SET current_count = ? WHERE id = ?`;
        let result = await mysql.query(request_id, db, queryString, [
          current_count + count,
          id
        ]);
      } else {
        reject({ status: 102, message: 'Internal Server Error' });
      }
      if (result[1].affectedRows == 1) {
        resolve();
      } else {
        reject({ staust: 102, message: 'Internal Server Error' });
      }
    } catch (e) {}
  });
};
