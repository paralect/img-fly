const transformationMap = require('transformations');

const throwInvalidTransformation = (name) => {
  const errorMessage = `Transformation '${name}' is either invalid or not supported`;
  throw new Error(errorMessage);
};

const applyTransformations = (transformQuery, originalSharp) => {
  let sharp = originalSharp;
  const transformationParts = transformQuery.split('+');
  const appliedTransformations = {};
  transformationParts.forEach((transformPart) => {
    const parts = transformPart.split('-');
    let { 0: transformationName } = parts;
    transformationName = transformationName.toLowerCase();

    if (!(transformationName in transformationMap)) {
      throwInvalidTransformation(transformationName);
    }

    const transformResult =
      transformationMap[transformationName](transformPart, sharp);
    sharp = transformResult.sharp;
    appliedTransformations[transformationName] = transformResult.params;
  });

  return {
    sharp,
    appliedTransformations,
  };
};

module.exports.apply = applyTransformations;
