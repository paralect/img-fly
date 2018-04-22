const config = require('config');
const db = require('@paralect/node-mongo').connect(config.storage.connection);
const fileSchema = require('./mongo.file.schema');

const fileService = db.createService(config.storage.collection, fileSchema);
fileService.ensureIndex({ transformHash: 1 });
fileService.ensureIndex({ _processingStatus: 1, createdOn: 1 });

module.exports = {
  createFilesMeta: async function createFilesMeta(files) {
    const filesMeta = files.map((file) => {
      const result = {
        _id: file._id,
        name: file.name,
        createdOn: new Date(),
        originalId: file.originalId || null,
        transformQuery: file.transformQuery || null,
        storage: file.storage,
      };
      if (file.transformHash) {
        result.transformHash = file.transformHash;
        result._processingStatus = 'new'; // go ahead for the background job
      }

      return result;
    });

    return fileService.create(filesMeta);
  },

  trackLastAccess({ fileId }) {
    return fileService.atomic.update({ _id: fileId }, {
      $set: {
        lastAccessOn: new Date(),
      },
    });
  },

  // This method is slower than createFilesMeta
  // but make sures to not create two files with same transformHash
  createOrUpdateFileMeta: async function createOrUpdateFileMeta(file) {
    if (file.transformHash === null) {
      throw new Error('createOrUpdateFileMeta requires transformHash');
    }

    const update = {
      $setOnInsert: {
        _id: file._id,
        name: file.name,
        createdOn: new Date(),
        originalId: file.originalId,
        transformHash: file.transformHash,
        transformQuery: file.transformQuery,
        transformName: file.transformName || null,
        storage: file.storage,
        _processingStatus: 'new', // go ahead for the background job
      },
    };

    return fileService.atomic.findOneAndUpdate({ transformHash: file.transformHash }, update, {
      upsert: true,
      returnNewDocument: true,
    });
  },

  updateImageInfo: function updateImageInfo({ _id, info }) {
    return fileService.atomic.findOneAndUpdate({ _id }, {
      $set: {
        imageInfo: info,
      },
    });
  },

  getFileMeta: ({ fileId }) => {
    const query = {
      _id: fileId,
    };

    return fileService.findOne(query);
  },

  getFileTransfomationsMeta: ({ originalId }) => {
    const query = {
      originalId,
    };

    return fileService.find(query);
  },

  getFileMetaByHash: ({ transformHash }) => {
    const query = {
      transformHash,
    };

    return fileService.findOne(query);
  },

  removeFileMeta: (_id) => {
    return fileService.remove({ _id });
  },

  generateId: () => {
    return fileService.generateId();
  },

  queue: {
    get() {
      const query = {
        _processingStatus: 'new',
      };
      const update = {
        $set: {
          _processingStatus: 'inProgress',
        },
      };
      const sort = { createdOn: 1 };

      return fileService.atomic
        .findOneAndUpdate(query, update, { sort, returnNewDocument: true })
        .then((message) => {
          if (message && message.lastErrorObject) {
            return null;
          }
          return message;
        });
    },

    fail(id) {
      const query = {
        _id: id,
      };
      const update = {
        $set: {
          _processedOn: new Date(),
          _processingStatus: 'failed',
        },
      };

      return fileService.atomic
        .findOneAndUpdate(query, update, { returnNewDocument: true })
        .then(doc => doc._id);
    },

    ack(id) {
      const query = {
        _id: id,
      };
      const update = {
        $set: {
          _processedOn: new Date(),
          _processingStatus: 'processed',
        },
      };

      return fileService.atomic
        .findOneAndUpdate(query, update, { returnNewDocument: true })
        .then(doc => doc._id);
    },
  },
};
