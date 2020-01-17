'use strict';

const uuid = require('uuid/v4');
const response = require(__base + '/app/modules/common/response');
const demoAddModule = require(__base + '/app/modules/demo/add');


module.exports.uploadImageToS3 = async (req, res) => {
  try {
    // const user_id = req.authInfo.user_id;
    const post_id = uuid();
   
    const payload = {post_id}

    req.temp = { post_id };
    await demoAddModule.insertImageIntoS3Bucket(req.request_id, req, res);
    const ext = req.temp.file_extension;
    payload.file_ext = ext;
    const image_url_for_ocr = `https://hazelnut-images.s3.us-east-2.amazonaws.com/ocr/${post_id}.${ext}`;


    delete req.temp; //remove any temp value set {post_id, fileValidationError}

    // bot.send(req.request_id, `Someone added an image post. - ${req.request_id}`);
    response.success(req.request_id, {image_url:  image_url_for_ocr }, res);
 
  } catch (e) {
    response.failure(req.request_id, e, res);
  } 
}


module.exports.ocrDemo = async (req, res) => {
  try {
    // const user_id = req.authInfo.user_id;
    const post_id = uuid();
   
    // const payload = {user_id, post_id}

    req.temp = { post_id };
    // await demoAddModule.insertImageIntoS3Bucket(req.request_id, req, res);
    // const ext = req.temp.file_extension;
    // payload.file_ext = ext;
    // const image_url_for_ocr = `https://hazelnut-images.s3.us-east-2.amazonaws.com/ocr/${post_id}.${ext}`;
    // const ocrPayload = {
    //   imagePath: image_url_for_ocr,
    //   highlightType: "NO_HIGHLIGHT"
    // }

    const ocrPayload = {
      imagePath: req.body.image_url,
      highlightType: "NO_HIGHLIGHT"
    }
    const ocrResponse = await demoAddModule.callOCRservice(req.request_id, ocrPayload);
    // demoAddModule.deleteImageFromS3Bucket(req.request_id, {user_id, post_id, ext});

    delete req.temp; //remove any temp value set {post_id, fileValidationError}

    // bot.send(req.request_id, `Someone added an image post. - ${req.request_id}`);
    response.success(req.request_id, {ocrResponse}, res);
 
  } catch (e) {
    response.failure(req.request_id, e, res);
  }
};
