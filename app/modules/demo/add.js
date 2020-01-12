'use strict';

const uuid = require('uuid/v4');
const axios = require('axios');

// const mysql = require(__base + '/app/modules/common/mysql');
const logger = require(__base + '/app/modules/common/logger');
const upload = require(__base + '/app/modules/common/fileUpload');
const config = require(__base + '/app/config/config');
const s3 = require(__base + '/app/init/aws').getS3();

//create single image upload instance for multer
const singleUpload = upload.single('image');

const db = 'provisioning';

module.exports.insertImageIntoS3Bucket = (request_id, req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
   
      singleUpload(req, res, async (err, some) => {
      
        if (err) {
          logger.error(err);
          reject({ code: 103.3, message: 'Failure to insert photo.' });
        } else if (req.temp.fileValidationError) {
          reject({ code: 103.3, custom_message: 'Incorrect file format.' });
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject({ code: 103, message: { message: e.message, stack: e.stack } });
    }
  });
};

module.exports.deleteImageFromS3Bucket = (request_id, payload) => {
  const { user_id, post_id } = payload;
  console.log('key', `ocr/${payload.user_id}/${payload.post_id}`);
  return new Promise((resolve, reject) => {
    s3.deleteObject({
      Bucket: config.aws.s3.postImageBucket,
      Key: `ocr/${payload.post_id}.${payload.ext}`,
    },function (err,data){
      if(err) {
        reject();
      } else {
        resolve();
      }
     
    })
  })
}

module.exports.callOCRservice = (request_id, data) => {
  const { ocr } = config.services;
  return new Promise((resolve, reject) => {
    axios.post(ocr, data)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject();
      })
  })
}