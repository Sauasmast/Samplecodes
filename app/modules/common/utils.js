'use strict';
const uuid = require('uuid/v4');

const mysql = require(__base + '/app/modules/common/mysql');

const db = 'provisioning';

module.exports.getReferConfig = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `SELECT * FROM refer_config WHERE type = ?`;
     const { user_type } = payload;

     let result = await mysql.query(request_id, db, queryString, [user_type]);
     if (result.length > 0) {
       resolve(result[0]);
     } else {
       reject({ code: 102, custom_message: 'Internal server error while fetching into refer config.' });
     }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };

 module.exports.getReferConfigOfUserReferred = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `SELECT * FROM refer_config WHERE type = ?`;
     const { user_type } = payload;

     let result = await mysql.query(request_id, db, queryString, [user_type]);
     if (result.length > 0) {
       resolve(result[0]);
     } else {
       reject({ code: 102, custom_message: 'Internal server error while fetching into refer config.' });
     }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };

 module.exports.getDashboardHistory = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `SELECT * FROM dashboard WHERE user_id = ?`;
     const { user_id } = payload;

     let result = await mysql.query(request_id, db, queryString, [user_id]);
     if (result.length > 0) {
       resolve(result[0]);
     } else {
       reject({ code: 102, custom_message: 'Internal server error while fetching dashboard history.' });
     }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };

 module.exports.getUserDetails = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `SELECT * FROM web_users WHERE user_id = ?`;
     const { user_id } = payload;

     let result = await mysql.query(request_id, db, queryString, [user_id]);
     if (result.length > 0) {
       resolve(result[0]);
     } else {
       reject({ code: 102, custom_message: 'Internal server error while fetching into user details.' });
     }
   } catch (e) {
     reject({ code: 102, message: { message: e.message, stack: e.stack } });
   }
  })
 };

 module.exports.generateCode = () => {
  return new Promise((resolve, reject) => {
    resolve(
      Math.random()
        .toString(36)
        .slice(-6)
    );
  });
};

module.exports.generatePasswordCode = () => {
  return new Promise((resolve, reject) => {
    resolve(uuid());
  });
};