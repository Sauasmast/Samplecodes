'use strict';

const uuidv4 = require('uuid/v4');
const mysql = require(__base + '/app/modules/common/mysql');
const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

const db = 'provisioning';


module.exports.init = (request_id, data) => {
  return new Promise((resolve, reject) => {
    if(typeof data.emails !== 'undefined' || typeof data.user_id !== 'undefined' ) {
      resolve();
    } else {
      reject({ code: 103.2, custom_message: 'Attributes validation incorrect.' });
    }
  });
};

module.exports.validation = (request_id, data) => {
  const { referEmail } = data;
  return new Promise((resolve, reject) => {
    try {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if( re.test(String(referEmail).toLowerCase())) {
        resolve();
      } else {
        let error = {
          email: referEmail,
          message: `${referEmail} Email format incorrect`
        }        
        resolve(error)
      }
    } catch(e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });

    }
  
  });
};


module.exports.checkIfUserExist = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   
    try {
      const { referEmail } = payload;
      let queryString = 'SELECT * from web_users WHERE email =? AND status = ?';
      let results = await mysql.query(request_id, db, queryString, [referEmail, 'active']);
      if(results.length === 0) {
        resolve();
      } else {
        logger.info(`${referEmail} has already registered`)
        let error = {
          email: referEmail,
          message: `${referEmail} has already registered`
        }        
        resolve(error)
      }
    } catch(e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  })
}

module.exports.checkIfAlreadyReferredBySameUser = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    let queryString = 'SELECT * FROM referrals WHERE user_referred_by = ? AND refer_to_email = ?';
    const { user_id, referEmail } = payload;
    try {
      let result = await mysql.query(request_id, db, queryString, [
        user_id,
        referEmail
      ]);
      if (result.length == 0) {
        resolve();
      } else {
        logger.info(`You have already referred ${referEmail}.`)

        let error = {
          email: referEmail,
          message: `You have already referred ${referEmail}.`
        }        
        resolve(error)
      }
    } catch (e) {
      reject({ code: 102, custom_message: 'Internal Server Error' });
    }
  });
};

module.exports.createcode = (request_id, emails) => {
  return new Promise((resolve, reject) => {
    try {
      let code = Math.floor(Math.random() * 900000) + 100000;
      resolve(code);
    } catch (e) {
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  });
};




module.exports.insertIntoReferralTable = (request_id, payload) => {
 return new Promise(async (resolve, reject) => {
  try {
    const queryString = `INSERT INTO referrals SET ?`;
    let queryBody = {
      refer_id: uuidv4(),
      user_referred_by: payload.user_id,
      refer_to_email: payload.referEmail,
      status: 'sent',
      refer_code: payload.refer_code
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

 

 module.exports.insertToDashboardTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
     const queryString = `INSERT INTO dashboard SET ?`;
     let queryBody = {
       refer_id: uuidv4(),
       user_referred_by: payload.user_id,
       refer_to_email: payload.referEmail,
       status: 'pending',
       refer_code: payload.refer_code
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


module.exports.insertIntoReferralTable = (request_id, payload) => {
 return new Promise(async (resolve, reject) => {
  try {
    const queryString = `INSERT INTO referrals SET ?`;
    let queryBody = {
      refer_id: uuidv4(),
      user_referred_by: payload.user_id,
      refer_to_email: payload.referEmail,
      status: 'sent',
      refer_code: payload.refer_code
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

 

 module.exports.updateDashboardTable = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
   try {
    const queryString = `UPDATE dashboard SET total_referred = ?, total_pending = ?, points = ? WHERE user_id = ?`;

    const { total_referred, total_pending, points, user_id } = payload;
    
     let result = await mysql.query(request_id, db, queryString, [total_referred, total_referred, points, user_id]);
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
 




