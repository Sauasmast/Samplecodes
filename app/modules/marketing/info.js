'use strict';
const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

const mysql = require(__base + '/app/modules/common/mysql');

const db = 'provisioning';


module.exports.getFacebookEmailList = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT email from marketing WHERE is_facebook_email_sent = ? AND created_at < ? ';
      const { facebook_email_schedule } = payload;

      let results = await mysql.query(request_id, db, queryString, [0, facebook_email_schedule]);
      if(results.length >= 1) {
        resolve(results);
      } else {
        resolve([]);
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })

}

module.exports.getBooksforYouEmaillist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = `SELECT email from marketing 
      WHERE is_intro_email_sent = ? AND account_status =? AND created_at < ?`;

      const { intro_email_schedule } = payload;

      let results = await mysql.query(request_id, db, queryString, [0, 'active', intro_email_schedule]);
      if(results.length >= 1) {
        resolve(results);
      } else {
        resolve([]);
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })

}

module.exports.getReferReminderEmailList = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      let queryString = 'SELECT * from referrals WHERE status != ? AND  is_reminder_email_sent=? AND created_at <= ? ';
      
      const { day_1_reminder_email_schedule } = payload;

      let results = await mysql.query(request_id, db, queryString, [ 'active', 0,  day_1_reminder_email_schedule]);
      if(results.length >= 1) {
        resolve(results);
      } else {
        resolve([]);
      }
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: 'Internal Server Error' });
    }
  })

}