'use strict';

const axios = require('axios');
const config = require(__base + '/app/config/config');
const logger = require(__base + '/app/modules/common/logger');

module.exports.facebookCampaignEmails = (request_id, payload) => {
  return new Promise((resolve, reject) => {
    try {
      const url = config.services.notification + '/api/notification/facebook-campaign';
      console.log(url)
      axios.post(url, payload)
        .then(response => {
            resolve();
        })
        .catch(err => {
          console.log(err);
          reject()
        })
    } catch(e) {
      console.log(e);
      reject({ code: 102, message: { message: e.message, stack: e.stack } });
    }
  })

}