const AWS = require('aws-sdk');
const { S3 } = require('aws-sdk');
const s3Stream = require('s3-streams');
const config = require('config');

const mapSettingsToAwsConfig = (awsSettings) => {
  const awsConfig = {
    accessKeyId: awsSettings.accessKey,
    secretAccessKey: awsSettings.secretKey,
    region: awsSettings.region,
    params: { Bucket: awsSettings.bucket },
  };

  return awsConfig;
};

const awsConfig = mapSettingsToAwsConfig(config.aws);
const s3bucket = new AWS.S3(awsConfig);

const uploadToS3Bucket = (bucket, params) => new Promise((resolve, reject) => {
  bucket.upload(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

const deleteObjectsFromS3 = (bucket, params) => new Promise((resolve, reject) => {
  bucket.deleteObjects(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

const getObjectFromS3 = (s3, params) => new Promise((resolve, reject) => {
  s3.getObject(params, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

module.exports.deleteFiles = async function deleteFiles(fileIds) {
  const keysS3 = fileIds.map(key => ({ Key: key }));
  const params = {
    Bucket: awsConfig.params.Bucket,
    Delete: {
      Objects: keysS3,
    },
  };

  await deleteObjectsFromS3(s3bucket, params);
};

module.exports.uploadFiles = async function uploadFiles(fileUploads) {
  const s3Uploads = [];
  fileUploads.forEach((fileData) => {
    s3Uploads.push(uploadToS3Bucket(s3bucket, {
      Key: fileData.key,
      Body: fileData.file,
    }));
  });

  return Promise.all(s3Uploads);
};

module.exports.getFileStream = function getFileStream(fileKey) {
  return s3Stream.ReadStream(new S3(awsConfig), {
    Bucket: awsConfig.params.Bucket,
    Key: fileKey,
  });
};

module.exports.getFileSizeInBytes = (fileKey) => {
  return getObjectFromS3(s3bucket, {
    Bucket: awsConfig.params.Bucket,
    Key: fileKey,
  }).then(data => +data.ContentLength);
};
