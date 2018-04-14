const parse = require('async-busboy');
const fs = require('fs');
const s3UploadService = require('services/s3Upload.service');
const storage = require('storage');
const mime = require('mime-types');
const transformService = require('services/transform.service');
const sharp = require('sharp');

const getFileId = ({ id, extName }) => `${id}${extName}`;

exports.getFile = async (ctx, next) => {
  const { id, fileName, transform } = ctx.params;
  const fileMeta = await storage.getFileMeta({ fileId: id });
  if (!fileMeta) {
    ctx.status = 404;
    return;
  }
  const fileId = getFileId({ id: fileMeta._id, extName: fileMeta.extName });

  // TODO: cache transformation to S3 in background
  // 1. Create a task to generate file after response being sent
  // 2. Create a md5 hash from transformation query + original fileId
  // 3. Generate unique fileId and send unique url without transform params to the client
  // 4. Verify upload identity using by validating md5 hash of (resourceId + imgFly secret key)
  let fileStream = await s3UploadService.getFileStream(fileId);
  if (transform) {
    let transformObject = sharp();
    try {
      transformObject = transformService.apply(transform, transformObject);
    } catch (err) {
      ctx.status = 404;
      ctx.body = err.message;
      return;
    }

    fileStream = fileStream.pipe(transformObject);
  }

  ctx.type = mime.contentType(fileId) || 'application/octet-stream';
  ctx.body = fileStream;
};
