const Joi = require('joi');

const fileSchema = {
  _id: Joi.string(),
  createdOn: Joi.date(),
  name: Joi.string(),
  extName: Joi.string(),
  originalId: Joi.string()
    .allow(null),
  transformHash: Joi.string()
    .allow(null),
};

module.exports = obj => Joi.validate(obj, fileSchema, { allowUnknown: false });
