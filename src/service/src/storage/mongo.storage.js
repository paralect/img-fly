const config = require('config');
const db = require('@paralect/node-mongo').connect(config.storage.connection);
const fileSchema = require('./mongo.file.schema');

const fileService = db.createService(config.storage.collection, fileSchema);
fileService.ensureIndex({ transformHash: 1 }, { unique: true });
fileService.ensureIndex({ _processingStatus: 1, createdOn: 1 }, { unique: true });

module.exports = {
  createFilesMeta: async function createFilesMeta(files) {
    const filesMeta = files.map((file) => {
      const result = {
        _id: file._id,
        name: file.name,
        createdOn: new Date(),
        originalId: file.originalId || null,
        transformHash: file.transformHash || null,
        transformQuery: file.transformQuery || null,
        storage: file.storage,
      };
      if (file.transformHash) {
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
      $set: {
        _id: file._id,
        name: file.name,
        createdOn: new Date(),
        originalId: file.originalId || null,
        transformHash: file.transformHash || null,
        transformQuery: file.transformQuery || null,
        storage: file.storage,
      },
    };

    if (file.transformHash) {
      update.$set._processingStatus = 'new'; // go ahead for the background job
    }

    return fileService.findOneAndUpdate({ transformHash: file.transformHash }, update);
  },

  getFileMeta: ({ fileId }) => {
    const query = {
      _id: fileId,
    };

    return fileService.findOne(query);
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
          _processedOn: Date.now(),
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
          _processedOn: Date.now(),
          _processingStatus: 'processed',
        },
      };

      return fileService.atomic
        .findOneAndUpdate(query, update, { returnNewDocument: true })
        .then(doc => doc._id);
    },
  },
};
