const storage = require('storage');
const path = require('path');
const AWS = require('aws-sdk');
const S3 = require('aws-sdk').S3;
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

module.exports.deleteFiles = async function (fileIds) {
  const keysS3 = fileIds.map(key => ({ Key: key }));
  const params = {
    Bucket: awsSettings.bucket,
    Delete: {
      Objects: keysS3,
    },
  };

  await deleteObjectsFromS3(s3bucket, params);
};

module.exports.saveFiles = async function (files) {
  const savedFiles = [];

  for (const file of files) {
    const fileName = file.filename;
    const extName = path.extname(fileName);
    const fileId = storage.generateId();
    const uniqueFileName = `${fileId}${extName}`;

    await uploadToS3Bucket(s3bucket, {
      Key: uniqueFileName,
      Body: file,
    });

    savedFiles.push({
      fileId,
      extName,
      fileName,
      mimeType: file.mimeType,
    });
  }

  return savedFiles;
};

module.exports.getFileStream = function (fileKey) {
  return s3Stream.ReadStream(new S3(awsConfig), { // eslint-disable-line
    Bucket: awsConfig.params.Bucket,
    Key: fileKey,
  });
};

module.exports.getFileSizeInBytes = (attachmentId) => {
  const fileKey = attachmentId;
  return getObjectFromS3(s3bucket, {
    Bucket: awsSettings.bucket,
    Key: fileKey,
  }).then(data => +data.ContentLength);
};
