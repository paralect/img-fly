const extract = require('transformations/extract');
const resize = require('transformations/resize');

const transformations = [extract, resize];

const map = {};
transformations.forEach((transform) => {
  map[transform.name] = transform.apply;
})

module.exports = map;