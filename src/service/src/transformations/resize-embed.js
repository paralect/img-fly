const { logger } = global;

const apply = (query, sharp) => {
  logger.info('Applying [embed] transformation');

  return {
    sharp: sharp.embed(),
    params: {},
  };
};

module.exports = {
  name: 'embed',
  apply,
};
