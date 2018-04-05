const { logger } = global;

const throwInvalidError = () => {
  const errorMessage = `Extract transformation is invalid. 
    Make sure that transformation query has all params: 
    extract-left_10,top_0,width_100,height_200.
    Read more at: http://sharp.pixelplumbing.com/en/stable/api-operation/#extract`;
  
  throw new Error(errorMessage);
}

const parseQuery = (query) => {
  const transformParts = query.split('-');
  if (transformParts.length !== 2) {
    return throwInvalidError();
  }

  const paramsParts = transformParts[1].split(',');
  if (paramsParts.length !== 4) {
    return throwInvalidError();
  }

  const result = {};
  for(const param of paramsParts) {
    const paramParts = param.split('_');
    if (paramParts.length !== 2) {
      return throwInvalidError();
    }
    result[paramParts[0]] = parseInt(paramParts[1], 10);
  }

  return result;
}

const apply = (query, sharp) => {
  const transformParams = parseQuery(query);
  logger.info(`Applying [extract] transformation with params: ${JSON.stringify(transformParams)}`);

  return sharp.extract(transformParams);
};

module.exports = {
  name: 'extract',
  apply: apply,
}