const { logger } = global;

const throwInvalidError = () => {
  const errorMessage = `Extract transformation is invalid. 
    Make sure that transformation query at least convertion format and optional query params: 
    toFormat-jpeg,quality_50,optimiseScans_true.
    Read more at: http://sharp.dimens.io/en/stable/api-output/#toformat
    Full options list: http://sharp.dimens.io/en/stable/api-output/#jpeg`;

  throw new Error(errorMessage);
};

const parseParam = (name, value) => {
  switch (name) {
    case 'quality':
      return parseInt(value, 10);
    case 'chromaSubsampling':
      return value;
    case 'progressive':
    case 'trellisQuantisation':
    case 'optimiseScans':
    case 'force':
      return value === 'true';
    default:
      return value;
  }
};

const parseQuery = (query) => {
  const transformParts = query.split('-');
  if (transformParts.length !== 2) {
    return throwInvalidError();
  }

  const paramsParts = transformParts[1].split(',');
  if (paramsParts.length < 1) {
    return throwInvalidError();
  }

  const format = paramsParts.shift();

  const options = {};
  paramsParts.forEach((param) => {
    const { 0: name, 1: value } = param.split('_');
    if (!name || !value) {
      throwInvalidError();
    }
    options[name] = parseParam(name, value);
  });

  return {
    format,
    options,
  };
};

const apply = (query, sharp) => {
  const { format, options } = parseQuery(query);
  logger.info(`Applying [toFormat]. Converting to ${format} with options: ${JSON.stringify(options)}`);

  return sharp
    .toFormat(format, options);
};

module.exports = {
  name: 'toformat',
  apply,
};
