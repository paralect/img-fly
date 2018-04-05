const { logger } = global;
const sharp = require('sharp');

const throwInvalidError = () => {
  const errorMessage = `Crop transformation is invalid. 
    Make sure that transformation query has all params: 
    crop-strategy_attention or crop-gravity_center).
    Read more at: http://sharp.pixelplumbing.com/en/stable/api-resize/#crop`;
  
  throw new Error(errorMessage);
}

const parseQuery = (query) => {
  const transformParts = query.split('-');
  if (transformParts.length !== 2) {
    return throwInvalidError();
  }

  const paramsParts = transformParts[1].split('_');
  if (paramsParts.length !== 2) {
    return throwInvalidError();
  }

  const paramValue = paramsParts[1];
  switch (paramsParts[0]) {
    case 'gravity': {
      if (!sharp.gravity.hasOwnProperty(paramValue)) {
        return throwInvalidError();
      }

      return sharp.gravity[paramValue];
    }
    case 'strategy': {
      if (!sharp.strategy.hasOwnProperty(paramValue)) {
        return throwInvalidError();
      }

      return sharp.strategy[paramValue];
    }
    default:
      return sharp.gravity.center;
     
  }
}

const apply = (query, sharp) => {
  const transformParams = parseQuery(query);
  logger.info(`Applying [crop] transformation with params: ${JSON.stringify(transformParams)}`);

  return sharp.crop(transformParams);
};

module.exports = {
  name: 'crop',
  apply: apply,
}