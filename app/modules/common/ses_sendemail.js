const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');
const sgMail = require('@sendgrid/mail');
const logger = require(__base + '/app/modules/common/logger');
const bot = require(__base + '/app/modules/common/telegramBot');

// module.exports.sendemail = (request_id, user_email, emails, codes) => {
//   console.log('Sending email to ' + user_email);
//   return new Promise(async (resolve, reject) => {
//     let destinations = [];

//     AWS.config.update({
//       accessKeyId: config.aws.ses.accessKeyId,
//       secretAccessKey: config.aws.ses.secretAccessKey,
//       region: config.aws.ses.region
//     });

//     emails.forEach((email, index) => {
//       destinations.push({
//         Destination: {
//           ToAddresses: [email]
//         },
//         ReplacementTemplateData: `{
//           email: ${user_email},
//           refer_code: ${codes[index].toString()}
//         }`
//       });
//     });

//     const params = {
//       Source: 'rashul1996@gmail.com',
//       Template: 'ReferTemplate',
//       Destinations: destinations,
//       DefaultTemplateData: '{ "email":"", "refer_code":"" }'
//     };

//     // Create the promise and SES service object
//     var sendPromise = new AWS.SES({
//       apiVersion: config.aws.ses.version
//     })
//       .sendBulkTemplatedEmail(params)
//       .promise();

//     sendPromise
//       .then(function(data) {
//         console.log('----sent email---');
//         resolve(data);
//       })
//       .catch(function(err) {
//         console.error(err);
//         reject({ status: 102, custom_message: 'Internal Server Error' });
//       });
//   });
// };

module.exports.sendemail = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    logger.info('Sending a website referral email');
    try {
      const msg = {
        to: payload.emails,
        from: config.email.from,
        templateId: config.sendgrid.email_refer_template_id,
        dynamic_template_data: {
          email: payload.email,
          link: `www.gethazelnut.com/${payload.refer_code}`
        }
      };
      console.log(msg);
      
      sgMail.setApiKey(config.sendgrid.api_key);
      logger.debug(request_id, JSON.stringify(msg));

      sgMail.sendMultiple(msg, function(err, data) {
        console.log(err, null);
        if (err) {
          console.log('err', err);
          reject({
            code: 400,
            message: { message: err.message, stack: err.stack }
          });
        } else {
          logger.debug(request_id, JSON.stringify(data));
          bot.send(request_id, `Refer email sent - ${request_id}`);

          resolve();
        }
      });
    } catch (e) {
      reject({ code: 400, message: { message: e.message, stack: e.stack } });
    }
  });
};


module.exports.sendHelloEmail = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    logger.info('Sending welcome email');
    try {
      const msg = {
        to: payload.email,
        from: config.email.from,
        templateId: config.sendgrid.hello_email_template_id,
        dynamic_template_data: {
          email: payload.email,
          password_link: `https://hazelnut-web.herokuapp.com/signup`,
          dashboard_link: 'https://hazelnut-web.herokuapp.com/dashboard'
        }
      };
      sgMail.setApiKey(config.sendgrid.api_key);
      logger.debug(request_id, JSON.stringify(msg));

      sgMail.sendMultiple(msg, function(err, data) {
        console.log(err, null);
        if (err) {
          console.log('err', err);
          reject({
            code: 400,
            message: { message: err.message, stack: err.stack }
          });
        } else {
          logger.debug(request_id, JSON.stringify(data));

          resolve();
        }
      });
    } catch (e) {
      reject({ code: 400, message: { message: e.message, stack: e.stack } });
    }
  });
}


module.exports.sendWelcomeEmail = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    logger.info('Sending welcome email');
    try {
      const msg = {
        to: payload.email,
        from: config.email.from,
        templateId: config.sendgrid.welcome_email_template_id,
        dynamic_template_data: {
          email: payload.email,
          refer_link: `https://hazelnut-web.herokuapp.com/${payload.refer_code}`,
          dashboard_link: 'https://hazelnut-web.herokuapp.com/dashboard'
        }
      };
      sgMail.setApiKey(config.sendgrid.api_key);
      logger.debug(request_id, JSON.stringify(msg));

      sgMail.sendMultiple(msg, function(err, data) {
        console.log(err, null);
        if (err) {
          console.log('err', err);
          reject({
            code: 400,
            message: { message: err.message, stack: err.stack }
          });
        } else {
          logger.debug(request_id, JSON.stringify(data));

          resolve();
        }
      });
    } catch (e) {
      reject({ code: 400, message: { message: e.message, stack: e.stack } });
    }
  });
}


module.exports.sendResetPasswordEmail = (request_id, payload) => {
  return new Promise(async (resolve, reject) => {
    logger.info('Sending welcome email');
    try {
      const msg = {
        to: payload.email,
        from: config.email.from,
        templateId: config.sendgrid.forgot_password_email_template_id,
        dynamic_template_data: {
          name: payload.name ? payload.name : '',
          reset_password_link: `https://hazelnut-web.herokuapp.com/password/reset/${payload.new_code}`
        }
      };
      sgMail.setApiKey(config.sendgrid.api_key);
      logger.debug(request_id, JSON.stringify(msg));

      sgMail.sendMultiple(msg, function(err, data) {
        console.log(err, null);
        if (err) {
          console.log('err', err);
          reject({
            code: 400,
            message: { message: err.message, stack: err.stack }
          });
        } else {
          logger.debug(request_id, JSON.stringify(data));

          resolve();
        }
      });
    } catch (e) {
      reject({ code: 400, message: { message: e.message, stack: e.stack } });
    }
  });
}