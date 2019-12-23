const axios = require('axios');
const moment = require('moment');

const mysql = require(__base + '/app/modules/common/mysql.js');
const db = 'provisioning';
const config = require(__base + '/app/config/config');
const uuid = require('uuid/v4');


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.email !== 'undefined' || typeof data.password !== 'undefined' || typeof data.old_password !== 'undefined') {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.initDirect = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.password !== 'undefined' || typeof data.old_password !== 'undefined') {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};


module.exports.validate = (request_id, data) => {
  return new Promise((resolve, reject) => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email_regex.test(String(data.email).toLowerCase())) {
      if(data.password.length < 5) {
        reject({ code: 103.2, custom_message: 'Length of password is less than 5 characters.' });
      } else {
        resolve();
      }
    } else {
      reject({ code: 103.2, message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.checkIfWebUserExistById = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE user_id = ?';
      const { user_id } = payload;

      let results = await mysql.query(request_id, db, queryString, [user_id]);
      if(results.length === 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.1, custom_message: 'Invalid user or token provided.' });
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}


module.exports.checkIfWebUserExist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE email = ?';
      const { email } = payload;

      let results = await mysql.query(request_id, db, queryString, [email]);
      if(results.length === 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.1, custom_message: 'Invalid email or token provided.' });
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}


module.exports.changePassword = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    let queryString = 'UPDATE web_users SET password=? WHERE email=?';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        payload.password,
        payload.email
      ]);
      
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