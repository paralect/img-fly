const parse = require('async-busboy');
const s3UploadService = require('services/s3Upload.service');
const fileService = require('services/file.service');
const storage = require('storage');

exports.upload = async (ctx, next) => {
  const { files } = await parse(ctx.req);
  if (!files || files.length === 0) {
    return await next();
  }

  const savedFiles = await s3UploadService.saveFiles(files);
  await storage.createFilesMeta(savedFiles);

  ctx.body = {
    files: savedFiles.map(f => ({
      _id: f.fileId,
      name: f.fileName,
      url: fileService.getFileUrl(f.fileId, f.fileName),
    })),
  };
};
