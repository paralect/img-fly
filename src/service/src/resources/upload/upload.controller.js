const parse = require('async-busboy');
const path = require('path');
const s3UploadService = require('services/s3Upload.service');
const fileService = require('services/file.service');
const storage = require('storage');
const sharp = require('sharp');

const { logger } = global;

const updateFileImageInfo = async (fileMeta) => {
  const fileMetaResult = fileMeta;
  return sharp(fileMeta.path)
    .metadata()
    .then((metadata) => {
      fileMetaResult.imageInfo = {
        width: metadata.width,
        height: metadata.height,
      };
    });
};

const updateFilesImageInfo = async (filesMeta) => {
  return Promise.all(filesMeta.map(fileMeta => updateFileImageInfo(fileMeta)));
};

exports.upload = async (ctx, next) => {
  const { files } = await parse(ctx.req);
  if (!files || files.length === 0) {
    next();
    return;
  }

  const filesMeta = [];
  const fileUploads = [];
  files.forEach((file) => {
    const fileName = file.filename;
    const extName = path.extname(fileName);
    const fileId = storage.generateId();
    const fileIdWithExt = `${fileId}${extName}`;
    fileUploads.push({
      key: fileIdWithExt,
      file,
    });
    filesMeta.push({
      _id: fileId,
      path: file.path,
      name: fileName,
      storage: {
        type: 's3',
        fileId: fileIdWithExt,
      },
    });
  });


  await updateFilesImageInfo(filesMeta);
  let resultFiles = await storage.createFilesMeta(filesMeta);
  // service returns object if array consist one file and array if two or more
  if (typeof resultFiles === 'object') {
    resultFiles = [resultFiles];
  }
  await s3UploadService.uploadFiles(fileUploads);

  const result = {
    files: resultFiles.map((file) => {
      return {
        _id: file._id,
        name: file.name,
        url: fileService.getFileUrl(file._id, file.name),
        imageInfo: file.imageInfo,
      };
    }),
  };

  const urls = result.files.map(f => f.url).join(',');
  logger.debug(`Uploaded ${resultFiles.length === 1 ? 'file' : 'files'}: ${urls}`);

  ctx.body = result;
};
