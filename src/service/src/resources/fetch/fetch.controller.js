const parse = require('async-busboy');
const fs = require('fs');
const s3UploadService = require('services/s3Upload.service');
const storage = require('storage');
const mime = require('mime-types');
const transformService = require('services/transform.service');
const sharp = require('sharp');

const getFileId = ({ id, extName}) => `${id}${extName}`;

exports.getFile = async (ctx, next) => {
  const { id, fileName, transform } = ctx.params;
  const fileMeta = await storage.getFileMeta({ fileId: id });
  if (!fileMeta) {
    return ctx.status = 404;
  }
  const fileId = getFileId({ id: fileMeta._id, extName: fileMeta.extName });

  // TODO: cache transformation to S3 in background
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
