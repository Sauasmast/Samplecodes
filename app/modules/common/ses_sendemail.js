const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');

module.exports.sendemail = (request_id, user_email, emails, codes) => {
  console.log('Sending email to ' + user_email);
  return new Promise(async (resolve, reject) => {
    let destinations = [];

    AWS.config.update({
      accessKeyId: config.aws.ses.accessKeyId,
      secretAccessKey: config.aws.ses.secretAccessKey,
      region: config.aws.ses.region
    });

    emails.forEach((email, index) => {
      destinations.push({
        Destination: {
          ToAddresses: [email]
        },
        ReplacementTemplateData: `{
          email: ${user_email},
          refer_code: ${codes[index].toString()}
        }`
      });
    });

    const params = {
      Source: 'rashul1996@gmail.com',
      Template: 'ReferTemplate',
      Destinations: destinations,
      DefaultTemplateData: '{ "email":"", "refer_code":"" }'
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({
      apiVersion: config.aws.ses.version
    })
      .sendBulkTemplatedEmail(params)
      .promise();

    sendPromise
      .then(function(data) {
        resolve(data);
      })
      .catch(function(err) {
        console.error(err);
        reject({ status: 102, custom_message: 'Internal Server Error' });
      });
  });
};
