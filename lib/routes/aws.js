const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const { S3 } = require('aws-sdk');
const upload = multer({ dest: 'upload/' });
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

module.exports = Router()
  .post('/', upload.single('recording'), (req, res, next) => {
    var params = {
      Body: fs.createReadStream(req.file.path),
      Bucket: BUCKET_NAME,
      Key: `${req.file.filename}.webm`,
    };
    s3.upload(params, async(err, data) => {
      if(err) {
        next(err);
        console.log(err, data);
      }
      else {
        res.send('Recording Saved to Bucket');
      }
    });

  });
  
