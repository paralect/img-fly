const { logger } = global;

const throwInvalidError = () => {
  const errorMessage = `Blur transformation is invalid. 
    Make sure that blur does not have parameters or have just one (sigma): 
    blur or blur-sigma_100.
    Read more at: http://sharp.dimens.io/en/stable/api-operation/#blur`;

  throw new Error(errorMessage);
};

const parseQuery = (query) => {
  const transformParts = query.split('-');
  const result = {};

  if (transformParts.length === 2) {
    const paramsParts = transformParts[1].split('_');
    if (paramsParts.length === 2) {
      result.sigma = parseInt(paramsParts[1], 10);
    } else if (paramsParts.length > 1) {
      throwInvalidError();
    }
  }

  return result;
};

const apply = (query, sharp) => {
  const options = parseQuery(query);
  logger.debug(`Applying [blur] with options: ${JSON.stringify(options)}`);

  return {
    sharp: options.sigma
      ? sharp.blur(options.sigma)
      : sharp.blur(),
    params: options,
  };
};

module.exports = {
  name: 'blur',
  apply,
};
