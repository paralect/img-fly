const { logger } = global;

const apply = (query, sharp) => {
  logger.info('Applying [max] transformation');

  return sharp.max();
};

module.exports = {
  name: 'max',
  apply: apply,
}