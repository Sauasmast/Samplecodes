const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');
const sgMail = require('@sendgrid/mail');
const logger = require(__base + '/app/modules/common/logger');

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


module.exports.sendemail = (request_id, user_email, emails, codes) => {
  return new Promise( async (resolve, reject) => {

    try {
      const msg = {
        to: emails[0],
        from: config.email.from,
        templateId: config.sendgrid.email_refer_template_id,
        dynamic_template_data: {
          email: user_email,
          refer_code: codes[0].toString()
        },
      };

      sgMail.setApiKey(config.sendgrid.api_key);
      logger.debug(request_id, JSON.stringify(msg));


      sgMail.send(msg, function(err, data) {
        console.log(err, null)
        if (err) {
          console.log('err',err);
          reject({ code: 400, message: { message: err.message, stack: err.stack } });
        }
        else {
          logger.debug(request_id, JSON.stringify(data));
          resolve();
        }
      });

    } catch(e) {
      reject({ code: 400, message: { message: e.message, stack: e.stack } });
    }
  });
};

