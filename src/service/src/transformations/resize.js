const { logger } = global;

const throwInvalidError = () => {
  const errorMessage = `Resize transformation is invalid. 
    Make sure that transformation query has all params: 
    resize-width_100,height_200 (height or width could be omited for auto-scale).
    Read more at: http://sharp.pixelplumbing.com/en/stable/api-resize/#resize`;
  
  throw new Error(errorMessage);
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

  const result = {};
  if (paramsParts.length === 2) {
    for(const param of paramsParts) {
      const paramParts = param.split('_');
      if (paramParts.length !== 2) {
        return throwInvalidError();
      }

      result[paramParts[0]] = parseInt(paramParts[1], 10);
    }
  } else {
    const paramParts = paramsParts[0].split('_');
    result[paramParts[0]] = parseInt(paramParts[1], 10);

    if (paramParts[0] === 'height') {
      result['width'] = null;
    } else {
      result['height'] = null;
    }
  }

  return result;
}

const apply = (query, sharp) => {
  const transformParams = parseQuery(query);
  logger.info(`Applying [resize] transformation with params: ${JSON.stringify(transformParams)}`);

  return {
    sharp: sharp.resize(transformParams.width, transformParams.height),
    params: transformParams,
  };
};

module.exports = {
  name: 'resize',
  apply,
};
