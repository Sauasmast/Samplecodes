const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');

module.exports.sendemail = (request_id, name, emails, codes) => {
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
          name: ${name},
          refer_code: ${codes[index].toString()}
        }`
      });
    });

    const params = {
      Source: 'saugatdahal14@gmail.com',
      Template: 'ReferTemplate',
      Destinations: destinations,
      DefaultTemplateData: '{ "name":"", "refer_code":"" }'
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
