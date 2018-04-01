const transformationMap = require('transformations');

const throwInvalidTransformation = (name) => {
  const errorMessage = `Transformation '${name}' is either invalid or not supported`;
  throw new Error(errorMessage);
}

const applyTransformations = (query, sharp) => {
  const transformationParts = query.split('+');
  transformationParts.forEach((transformPart) => {
    const parts = transformPart.split('-');
    const transformationName = parts[0];
    
    if (!(transformationName in transformationMap)) {
      return throwInvalidTransformation(transformationName);
    }

    sharp = transformationMap[transformationName](transformPart, sharp)
  });

  return sharp;
}

module.exports.apply = applyTransformations;