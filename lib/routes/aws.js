const { Router } = require('express');
const { S3 } = require('aws-sdk');
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

module.exports = Router()
  .post('/', (req, res, next) => {
    var params = {
      Body: req,
      Bucket: BUCKET_NAME,
      Key: 'test-recordings',
    };
    s3.upload(params, async(err, data) => {
      if(err)
        console.log(err, data);
      else
        console.log('success');
    })
      .catch(next);
  });
    
