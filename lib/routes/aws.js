const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const { S3 } = require('aws-sdk');
const upload = multer({ dest: 'upload/', limits: { fileSize: 200000 } });
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

module.exports = Router()
  .post('/', upload.single('recording'), (req, res, next) => {
    const params = {
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
        console.log(data);
        res.send(data);
      }
    });

  })
  .delete('/', (req, res, next) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: req.body.filename,
    };
    s3.deleteObject(params, function(err, data) {
      if(err) {
        next(err);
        console.log(err, data);
      } 
      else res.send(data);
    });
  });
  
