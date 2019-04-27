// const AWS = (module.exports.sendemail = AWS.config.update({
//   accessKeyId: config.aws.ses.accessKeyId,
//   secretAccessKey: config.aws.ses.secretAccessKey,
//   region: config.aws.ses.region
// }));

// const params = {
//   Destination: {
//     ToAddresses: ['sdahal@caldwell.edu']
//   },
//   Source: 'saugatdahal14@gmail.com',
//   Template: 'ReferTemplate',
//   TemplateData: '{ "name":"Saugat", "refer_code":"90897834343"}'
// };

// // Create the promise and SES service object
// var sendPromise = new AWS.SES({ apiVersion: config.aws.ses.version })
//   .sendTemplatedEmail(params)
//   .promise();

// sendPromise
//   .then(function(data) {
//     console.log(data.MessageId);
//     console.log('Message send');
//   })
//   .catch(function(err) {
//     console.error(err, err.stack);
//   });
