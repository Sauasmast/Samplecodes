const AWS = require('aws-sdk');
const config = require(__base + '/app/config/config');

function initializeAWS_SDK_SES() {
  AWS.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey,
    region: 'us-east-2'
  });

  const ses = new AWS.SES({ apiVersion: '2010-12-01' });
  const params = {
    Destination: {
      ToAddresses: ['sdahal@caldwell.edu'] // Email address/addresses that you want to send your email
    },
    ConfigurationSetName: 'Test1Config',
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: 'UTF-8',
          Data:
            "<html><body><h1>Hello  Charith</h1><p style='color:red'>Sample description</p> <p>Time 1517831318946</p></body></html>"
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'Hello Charith Sample description time 1517831318946'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email'
      }
    },
    Source: 'saugatdahal14@gmail.com'
  };
}

const sendEmail = ses.sendEmail(params).promise();

sendEmail
  .then(data => {
    console.log('email submitted to SES', data);
  })
  .catch(error => {
    console.log(error);
  });
