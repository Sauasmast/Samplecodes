'use strict';

const config = require(__base + '/app/config/config');
const uuidv4 = require('uuid/v4');
const db = 'provisioning';
const mysql = require(__base + '/app/modules/common/mysql');
const axios = require('axios');


module.exports.init = (request_id, data) => {
  console.log('data', data);
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


module.exports.insertintoReferConfigTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `INSERT INTO refer_config SET ?`;

    try {
      let queryBody = {
        config_id: uuidv4(),
        user_id: payload.user_id,
        accepted_points: config.referConfig.accepted_points,
        pending_points: config.referConfig.pending_points
      };
      let result = await mysql.query(request_id, db, queryString, queryBody);
      if (result.affectedRows === 1) {
        resolve(queryBody);
      } else {
        reject({ code: 102, message: 'Internal server error while inserting users.' });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};




module.exports.insertIntoUsersTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `INSERT INTO web_users SET ?`;
   
    try {
      let queryBody = {
        user_id: uuidv4(),
        email: payload.email,
        status: 'pending',
        password: null,
        refer_code: payload.refer_code,
        signup_token: uuidv4()
      };
      let result = await mysql.query(request_id, db, queryString, queryBody);
      
      if (result.affectedRows === 1) {
        resolve(queryBody);
      } else {
        reject({ code: 102, message: 'User with that email already exists.' });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};


module.exports.insertIntoMarketingTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    const queryString = `INSERT INTO marketing SET ?`;
   
    try {
      let queryBody = {
        user_id: payload.user_id,
        account_status: 'pending',
        is_facebook_email_sent: 0,
        is_intro_email_sent: 0,
        is_reminder_email_sent: 0,
        email: payload.email
      };
      let result = await mysql.query(request_id, db, queryString, queryBody);
      
      if (result.affectedRows === 1) {
        resolve(queryBody);
      } else {
        reject({ code: 102, message: 'User with that email already exists.' });
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};



module.exports.insertIntoDashboardTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `INSERT INTO dashboard SET ?`;
     const { user_id } = payload;
     let queryBody = {
       dashboard_id: uuidv4(),
       user_id,
       total_referred : 0,
       total_pending: 0,
       points: 0,
       total_activated: 0
     };
     let result = await mysql.query(request_id, db, queryString, queryBody);
     if (result.affectedRows === 1) {
       resolve();
     } else {
       reject({ code: 102, message: 'Internal server error while inserting into referral.' });
     }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };