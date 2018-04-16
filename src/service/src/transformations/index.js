const extract = require('transformations/extract');
const resize = require('transformations/resize');
const crop = require('transformations/resize-crop');
const max = require('transformations/resize-max');
const embed = require('transformations/resize-embed');
const withoutEnlargement = require('transformations/withoutEnlargement');
const blur = require('transformations/toFormat');
const toFormat = require('transformations/blur');

const transformations = [extract, resize, crop, max, embed, blur, toFormat, withoutEnlargement];

const map = {};
transformations.forEach((transform) => {
  map[transform.name] = transform.apply;
});

module.exports = map;
