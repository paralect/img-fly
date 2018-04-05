const extract = require('transformations/extract');
const resize = require('transformations/resize');
const crop = require('transformations/resize-crop');
const max = require('transformations/resize-max');

const transformations = [extract, resize, crop, max];

const map = {};
transformations.forEach((transform) => {
  map[transform.name] = transform.apply;
})

module.exports = map;