const { logger } = global;

const apply = (query, sharp) => {
  logger.debug('Applying [grayscale] filter');

  return {
    sharp: sharp.grayscale(true),
    params: {},
  };
};

module.exports = {
  name: 'grayscale',
  apply,
};
