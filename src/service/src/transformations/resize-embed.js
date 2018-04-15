const { logger } = global;

const apply = (query, sharp) => {
  logger.debug('Applying [embed] transformation');

  return {
    sharp: sharp.embed(),
    params: {},
  };
};

module.exports = {
  name: 'embed',
  apply,
};
