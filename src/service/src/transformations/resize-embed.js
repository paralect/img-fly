const { logger } = global;

const apply = (query, sharp) => {
  logger.info('Applying [embed] transformation');

  return sharp.embed();
};

module.exports = {
  name: 'embed',
  apply,
};
