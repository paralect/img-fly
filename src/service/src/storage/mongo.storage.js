const config = require('config');
const db = require('@paralect/node-mongo').connect(config.storage.connection);
const fileSchema = require('./mongo.file.schema');

const fileService = db.createService(config.storage.collection, fileSchema);

module.exports = {
  createFilesMeta: async function(files) {
    const filesMeta = files.map((file) => {
      return {
        _id: file.fileId,
        name: file.fileName,
        extName: file.extName,
        createdOn: new Date(),
        originalId: null,
        transformHash: null,
      };
    });

    return await fileService.create(filesMeta);
  },

  getFileMeta: ({ fileId, transofrmHash }) => {
    const query = {
      $or: [{ _id: fileId }]
    };
    if (transofrmHash) {
      query.$or.push({ transformHash });
    }

    return fileService.findOne(query);
  },

  removeFileMeta: (_id) => {
    return fileService.remove({ _id });
  },

  generateId: () => {
    return fileService.generateId();
  }
};
