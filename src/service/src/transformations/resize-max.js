const { logger } = global;

const apply = (query, sharp) => {
  logger.debug('Applying [max] transformation');

  return {
    sharp: sharp.max(),
    params: {},
  };
};

module.exports = {
  name: 'max',
  apply,
};
