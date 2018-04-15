const path = require('path');
const mime = require('mime-types');
const sharp = require('sharp');
const md5 = require('md5');

const storage = require('storage');
const s3UploadService = require('services/s3Upload.service');
const transformService = require('services/transform.service');
const fileService = require('services/file.service');

const { logger } = global;

async function transformImage({ ctx, transformQuery, storageFileId }) {
  let fileStream = await s3UploadService.getFileStream(storageFileId);
  let transformObject = sharp();
  let transformResult;

  try {
    transformResult = transformService.apply(transformQuery, transformObject);
    transformObject = transformResult.sharp;
    fileStream = fileStream.pipe(transformObject);
  } catch (err) {
    ctx.status = 400;
    ctx.body = err.message;
    return false;
  }

  return {
    fileStream,
    appliedTransformations: transformResult.appliedTransformations,
  };
}

async function createTransformationMeta({
  transformQuery,
  transformHash,
  appliedTransformations,
  originalFileMeta,
}) {
  const fileId = storage.generateId();
  let fileName = originalFileMeta.name;
  let extName = path.extname(fileName);

  const toFormatTransformation = appliedTransformations.toformat;

  // change file extention if toFormat transformation applied
  if (toFormatTransformation) {
    const newExtName = `.${toFormatTransformation.format}`;
    fileName = fileName.replace(extName, newExtName);
    extName = newExtName;
  }

  const fileIdWithExt = `${fileId}${extName}`;

  const file = {
    _id: fileId,
    name: fileName,
    createdOn: new Date(),
    originalId: originalFileMeta._id,
    transformQuery,
    transformHash,
    storage: {
      type: 's3',
      fileId: fileIdWithExt,
    },
  };

  return storage.createFilesMeta([file]);
}

function setFileUrlHeader(ctx, { _id, name }) {
  ctx.set('ImgFly_FileUrl', fileService.getFileUrl(_id, name));
}

function getContentType(fileId) {
  return mime.contentType(fileId) || 'application/octet-stream';
}

function trackLastAccessAsync(fileId) {
  storage.trackLastAccess({ fileId })
    .catch((err) => {
      logger.warn(`Unable to update last acccess date for the file: [${fileId}].`);
    });
}

async function streamS3ToResponse(ctx, fileMeta) {
  setFileUrlHeader(ctx, { _id: fileMeta._id, name: fileMeta.name });
  ctx.type = getContentType(fileMeta.storage.fileId);
  ctx.body = await s3UploadService.getFileStream(fileMeta.storage.fileId);
  trackLastAccessAsync(fileMeta._id);
}

function streamToResponse(ctx, fileMeta, fileStream) {
  setFileUrlHeader(ctx, { _id: fileMeta._id, name: fileMeta.name });
  ctx.type = getContentType(fileMeta.storage.fileId);
  ctx.body = fileStream;
}

exports.getFile = async (ctx, next) => {
  const { id, transform } = ctx.params;
  const fileMeta = await storage.getFileMeta({ fileId: id });
  if (!fileMeta) {
    ctx.status = 404;
    return;
  }

  const isOriginalFile = fileMeta.originalId === null;
  if (isOriginalFile) {
    // return origin right away if no transformation needed
    if (!transform) {
      streamS3ToResponse(ctx, fileMeta);
      return;
    }

    const transformHash = md5(`${fileMeta._id}${transform}`);

    // check file with such transformation already exists
    let transformFileMeta = await storage.getFileMetaByHash({ transformHash });

    // If file proccessed and stored, just stream it to response
    if (transformFileMeta && transformFileMeta._processingStatus === 'processed') {
      streamS3ToResponse(ctx, transformFileMeta);
      return;
    }

    // Transform if file not proccessed yet, or this is new transformation
    const transformResult = await transformImage({
      ctx,
      transformQuery: transform,
      storageFileId: fileMeta.storage.fileId,
    });
    if (!transformResult) {
      return;
    }

    if (transformFileMeta) {
      streamToResponse(ctx, transformFileMeta, transformResult.fileStream);
    } else {
      transformFileMeta = await createTransformationMeta({
        transformQuery: transform,
        transformHash,
        appliedTransformations: transformResult.appliedTransformations,
        originalFileMeta: fileMeta,
      });

      streamToResponse(ctx, transformFileMeta, transformResult.fileStream);
    }

    return;
  }

  // Do not transform already transformed files to avoid
  // large parent->child trees and keep it simpler
  if (transform) {
    ctx.status = 400;
    ctx.body = 'Transformations can be applied only to the original images';
    return;
  }

  // If file already proccessed by background job stream it
  if (fileMeta._processingStatus === 'processed') {
    streamS3ToResponse(ctx, fileMeta);
    return;
  }

  // use transformation params from metadata to transform on the fly, while background job busy
  const originalFileMeta = await storage.getFileMeta({ fileId: fileMeta.originalId });
  const transformResult = await transformImage({
    ctx,
    transformQuery: fileMeta.transformQuery,
    storageFileId: originalFileMeta.storage.fileId,
  });
  if (!transformResult) {
    return;
  }

  streamToResponse(ctx, fileMeta, transformResult.fileStream);
};
