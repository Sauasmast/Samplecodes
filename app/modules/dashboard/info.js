'use strict';

const uuidv4 = require('uuid/v4');
const axios = require('axios');

const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');
const mysql = require(__base + '/app/modules/common/mysql');

const db = 'provisioning';


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.user_id !== 'undefined') {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  return new Promise( (resolve, reject) => {
    logger.info(request_id, JSON.stringify(data));

    if( data.user_id.length === 36) {
      resolve();
    } else {
      reject({ code: 103.2, message: 'Attributes validation incorrect.', parameters: ['user_id'] });
    }
  });
};


module.exports.getUserDetails = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from web_users WHERE user_id =?';
      const { user_id } = payload;

      let results = await mysql.query(request_id, db, queryString, [user_id]);
      if(results.length === 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.4, custom_message: 'Invalid user id.' });

      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.getDashboardDetails = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from dashboard WHERE user_id =?';
      const { user_id } = payload;

      let results = await mysql.query(request_id, db, queryString, [user_id]);
      if(results.length === 1) {
        resolve(results[0]);
      } else {
        reject({ code: 103.4, custom_message: 'Invalid user id.' });

      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.getReferrals = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from referrals WHERE user_referred_by =?';
      const { user_id } = payload;

      let results = await mysql.query(request_id, db, queryString, [user_id]);
      if(results.length >= 0) {
        resolve(results);
      } else {
        reject({ code: 103.4, custom_message: 'Invalid user id.' });

      }
    } catch(e) {
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}

module.exports.getTotalUsers = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT COUNT(*) as total_users FROM dashboard';

      let results = await mysql.query(request_id, db, queryString);
      resolve(results[0].total_users);
    } catch(e) {
      console.log(e)
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}


module.exports.getUserRanking = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT COUNT(*) as ranking from dashboard where points > ?';
      const { points } = payload;

      let results = await mysql.query(request_id, db, queryString, [points]);
      resolve(results[0].ranking + 1)
    } catch(e) {
      console.log(e)
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })
}