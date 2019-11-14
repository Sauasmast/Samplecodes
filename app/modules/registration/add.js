'use strict';

const config = require(__base + '/app/config/config');
const uuidv4 = require('uuid/v4');
const db = 'provisioning';
const mysql = require(__base + '/app/modules/common/mysql');
const axios = require('axios');


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.email !== 'undefined') {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  const { email } = data;
  return new Promise((resolve, reject) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( re.test(String(email).toLowerCase())) {
      resolve();
    } else {
      reject({ code: 103.2, message: 'Email format incorrect.' });
    }
  });
};

module.exports.checkIfWebUserExist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE email =?';
      const { email } = payload;

      let results = await mysql.query(request_id, db, queryString, [email]);
      if(results.length >= 1) {
        reject({ code: 103.1, custom_message: 'User has already registered. Please verify the account.' });
      } else {
        resolve();
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.sendWebReferral = (request_id, data) => {
  return new Promise((resolve, reject) => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email_regex.test(String(data).toLowerCase())) {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Invalid email format.' });
    }
  });
};

module.exports.checkIfWebUserExist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   
    try {
      let queryString = 'SELECT * from web_users WHERE email =?';
      const { email } = payload;
      let results = await mysql.query(request_id, db, queryString, [email]);
      if(results.length > 1) {
        reject({ code: 103.1, custom_message: 'User has already registered. Please verify the account.' });
      } else {
        resolve();
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}


module.exports.insertIntoUsersTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `INSERT INTO web_users SET ?`;
   
    try {
      let queryBody = {
        user_id: uuidv4(),
        email: payload.email,
        status: 'pending',
        password: null
      };
      let result = await mysql.query(request_id, db, queryString, queryBody);
      if (result.affectedRows === 1) {
        resolve();
      } else {
        reject({ code: 102, message: 'Internal server error while inserting users.' });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

