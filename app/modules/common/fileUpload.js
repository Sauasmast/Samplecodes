const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const aws = require('aws-sdk');

const s3 = require(__base + '/app/init/aws').getS3();
const config = require(__base + '/app/config/config');
const sharp = require('sharp');

let fileName = '';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.s3.postImageBucket,
    ACL: 'public-read',
    metadata:  (req, file, cb) => {
      console.log('file', file)

      cb(null, {fieldName: file.fieldname});
    },
    shouldTransform: function (req, file, cb) {
      console.log('file', file)

      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [{
      id: 'original',
      key: function (req, file, cb) {
        console.log('file', file)

        const fileType = file.mimetype.split('/')[1];
        cb(null, `ocr/${req.temp.post_id}.${fileType}`)

        // cb(null, `ocr/${req.authInfo.user_id}/${req.temp.post_id}.${fileType}`)
      },
      transform: function (req, file, cb) {
        console.log('file', file)

        cb(null, sharp().resize(1200, 1200).jpeg())
        // cb(null, sharp().jpeg())
      }
    }, 
  ],
    key:  (req, file, cb) =>  {
      console.log('file', file)

      //fileName = `${Date.now().toString()}-${file.originalname}`;
       cb(null, `ocr/${req.authInfo.user_id}/${req.temp.post_id}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    console.log('file', file)

    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
      req.temp.file_extension = file.mimetype.split('/')[1];
      cb(null, true);
    } else {      
      req.temp.fileValidationError = 'Something wrong with file format';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
  }
})



module.exports = upload;


