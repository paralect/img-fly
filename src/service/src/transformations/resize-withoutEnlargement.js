const { logger } = global;

const apply = (query, sharp) => {
  logger.debug('Applying [withoutEnlargement] transformation');

  return {
    sharp: sharp.withoutEnlargement(true),
    params: {},
  };
};

module.exports = {
  name: 'withoutEnlargement',
  apply,
};
