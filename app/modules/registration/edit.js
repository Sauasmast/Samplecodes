'use strict';
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const config = require(__base + '/app/config/config');
const db = 'provisioning';
const mysql = require(__base + '/app/modules/common/mysql');

const logger = require(__base + '/app/modules/common/logger');

const salt_rounds = 10;


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.email !== 'undefined' || typeof data.password !== 'undefined' || typeof data.password !== 'undefined' || typeof data.signup_token !== 'undefined' ) {
      if(data.signup_token)
        resolve();
      else 
      reject({ code: 103.2, custom_message: 'Invalid request. Please try to reset password.' });
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.authorizeSignupToken = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE email =? AND signup_token = ? ';
      const { email, signup_token } = payload;

      let results = await mysql.query(request_id, db, queryString, [email, signup_token]);
      if(results.length === 1) {
        resolve();
      } else {
        reject({ code: 103.1, custom_message: 'Invalid request. Please reset password.' });
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.checkIfWebUserExist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE email =? AND user_id =? ';
      const { email, user_id } = payload;

      let results = await mysql.query(request_id, db, queryString, [email, user_id]);
      if(results.length === 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.1, custom_message: 'User has not registered yet. Please register the account' });
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}


// Hash Password during registration
module.exports.hashPassword = (request_id, payload) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.genSalt(15, (err, salt) => {
        if (err) reject({ status: 102, message: 'Internal Server error' });
        bcrypt.hash(payload.password, salt, (err, hash) => {
          if (err) reject({ status: 102, message: 'Internal Server error' });
          resolve(hash);
        });
      });
    } catch(err) {
      reject({ code: 102, custom_message: 'Issue while hashing password.' });
    }

  });
};


module.exports.updateUsersTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const queryString = 'UPDATE web_users SET password = ?, status = ?, signup_token =? WHERE user_id = ? AND status = ?';

    try {
      const { email, password, user_id } = payload;
      const status = 'active';

      let result = await mysql.query(request_id, db, queryString, [password, status, null, user_id, 'pending']);
      if (result.affectedRows === 1) {
        resolve();
      } else {
        reject({ code: 102, message: 'Internal server error while inserting users.' });
      }
    } catch (e) {
      console.log(e);
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

module.exports.verifyifUserReferredByExists = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE  user_id =? ';
      const { user_referred_by } = payload;

      let results = await mysql.query(request_id, db, queryString, [user_referred_by]);
      if(results.length === 1) {
        resolve();
      } else {
        reject({ code: 103.1, custom_message: 'Invalid refer user.' });
      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.updateReferralTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
    const queryString = 'UPDATE referrals SET status = ? WHERE refer_to_email = ?';
    const { email } = payload;
    let result = await mysql.query(request_id, db, queryString, ['active', email]);
    if (result.affectedRows === 1) {
      resolve();
    } else {
      reject({ code: 102, message: 'Internal server error while updating referral table.' });
    }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };