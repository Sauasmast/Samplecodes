const axios = require('axios');
const moment = require('moment');

const mysql = require(__base + '/app/modules/common/mysql.js');
const db = 'provisioning';
const config = require(__base + '/app/config/config');
const uuid = require('uuid/v4');


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.email !== 'undefined' || typeof data.user_id !== undefined) {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  return new Promise((resolve, reject) => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email_regex.test(String(data.email).toLowerCase())) {
      resolve();
    } else {
      reject({ code: 103.2, message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.checkIfUserExists = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    let querystring = 'SELECT * FROM web_users WHERE email = ? AND user_id = ?';
    try {
      let result = await mysql.query(request_id, db, querystring, [payload.email, payload.user_id]);
      if (result.length !== 1) {
        reject({ code: 101, custom_message: 'Email does not exist.' });
      } else {
        resolve(result[0]);
      }
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};



module.exports.sendEmail = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    payload.referral_code = payload.new_code
    try {
      await axios
        .post(config.services.notification + '/api/notification/password', payload)
        .then(response => {
          resolve();
        })
        .catch(error => {
          let { code, message } = error.response.data.error;
          reject({ code, message });
        });
    } catch (e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  });
};

module.exports.updateUserTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    let queryString = 'UPDATE users SET password=? WHERE email=?';
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

module.exports.insertIntoRecoveryPassword = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const { email, new_code} = payload
    let queryString = 'INSERT INTO recover_password SET ?';
    let data = {
      id: uuid(),
      email,
      code : new_code
    };
    try {
      let result = await mysql.query(request_id, db, queryString, data);
      if (result.affectedRows == 1) {
        resolve();
      } else {
        reject({ code: 102, custom_message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.validateCode = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    if (payload.code.length === 6) {
      resolve();
    } else {
      reject({
        code: 103,
        custom_message: 'Email and password validation code does not match.'
      });
    }
  });
};

module.exports.checkIfAnyCodeExists = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const { email } = payload;
    let queryString =
      'select * from recover_password where email = ? AND soft_deleted = 0';
    try {
      let result = await mysql.query(request_id, db, queryString, [email]);
      if (result.length >= 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};


module.exports.checkIfCodeExists = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const { email, code } = payload;
    let queryString =
      'Select * from recover_password Where email = ? AND code = ? AND soft_deleted = 0';
    try {
      let result = await mysql.query(request_id, db, queryString, [
        email,
        code
      ]);
      if (result.length == 1) {
        resolve(result[0]);
      } else {
        reject({
          code: 103,
          custom_message: 'Email and password validation code does not match.'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.checkExpiry = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const created_date = moment(payload.created_at);
    const current_date = moment(new Date());
    const diff = current_date.diff(created_date, 'minutes');    

    if (diff > 60) {
      try {
        let queryString =
          'UPDATE recover_password SET soft_deleted = 1 Where id = ? ';
        let result = await mysql.query(request_id, db, queryString, payload.id);
        if (result.affectedRows == 1) {
          reject({ code: 103, custom_message: 'Your code has expired' });
        } else {
          reject({ code: 102, custom_message: 'Internal Server Error' });
        }
      } catch (e) {
        reject(e);
      }
    } else {
      resolve();
    }
  });
};

module.exports.softDelete = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString =
        'UPDATE recover_password SET soft_deleted = 1 where email = ?';
      let result = await mysql.query(request_id, db, queryString, payload.email);
      if (result) {
        resolve();
      } else {
        reject({ code: 102, custom_message: 'Internal Server Error' });
      }
    } catch (e) {
      reject(e);
    }
  });
};
