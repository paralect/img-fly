const transformationMap = require('transformations');

const throwInvalidTransformation = (name) => {
  const errorMessage = `Transformation '${name}' is either invalid or not supported`;
  throw new Error(errorMessage);
};

const applyTransformations = (query, originalSharp) => {
  let sharp = originalSharp;
  const transformationParts = query.split('+');
  transformationParts.forEach((transformPart) => {
    const parts = transformPart.split('-');
    const { 0: transformationName } = parts;

    if (!(transformationName in transformationMap)) {
      throwInvalidTransformation(transformationName);
    }

    sharp = transformationMap[transformationName](transformPart, sharp);
  });

  return sharp;
};

module.exports.apply = applyTransformations;