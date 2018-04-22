const s3UploadService = require('services/s3Upload.service');
const transformService = require('services/transform.service');
const storage = require('storage');
const sharp = require('sharp');

const { logger } = global;

const cacheImageToS3 = (fileMeta) => {
  const transformObject = sharp();
  let imageInfo;
  return storage.getFileMeta({ fileId: fileMeta.originalId })
    .then((originalFile) => {
      let fileStream = s3UploadService.getFileStream(originalFile.storage.fileId);
      transformService.apply(fileMeta.transformQuery, transformObject);
      transformObject.on('info', (info) => {
        imageInfo = {
          width: info.width,
          height: info.height,
        };
      });

      fileStream = fileStream.pipe(transformObject);
      logger.debug(`Caching file [${fileMeta.name}](id: ${fileMeta._id}) to s3`);

      return s3UploadService.uploadFiles([{
        key: fileMeta.storage.fileId,
        file: fileStream,
      }]);
    })
    .then(() => {
      return storage.updateImageInfo({ _id: fileMeta._id, info: imageInfo });
    })
    .then(() => {
      logger.debug(`Cached file [${fileMeta.name}](id: ${fileMeta._id}) to s3`);
    });
};

module.exports = cacheImageToS3;
