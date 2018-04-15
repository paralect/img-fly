const cacheToS3job = require('./jobs/cacheToS3');

const { logger } = global;
const READ_TIMEOUT = 50;

class Consumer {
  constructor(storage) {
    this.queue = storage.queue;
  }

  run() {
    this.queue.get()
      .then((file) => {
        if (!file) {
          throw new Error('empty_queue');
        }

        return cacheToS3job(file)
          .then(() => this.queue.ack(file._id))
          .catch((err) => {
            logger.error(err);
            logger.warn(`Unable to process file [${file.name}], id: [${file._id}].`);
            return this.queue.fail(file._id);
          });
      })
      .then(() => this.run())
      .catch((err) => {
        if (err.message !== 'empty_queue') {
          logger.error(`MongoQueue: Error reading queue: ${err}`);
        }

        return new Promise(resolve => setTimeout(resolve, READ_TIMEOUT))
          .then(() => {
            this.run();
          });
      });
  }
}

module.exports = Consumer;
