const Joi = require('joi');

const fileSchema = {
  _id: Joi.string(),
  createdOn: Joi.date(),
  lastAccessOn: Joi.date()
    .optional(),
  name: Joi.string(),
  originalId: Joi.string()
    .allow(null),
  // The hash is being calculated from parent fileId + transform query string
  // The hash is used to determine if transformation is needed
  transformHash: Joi.string()
    .allow(null),
  transformQuery: Joi.string()
    .allow(null),
  _processingStatus: Joi.string()
    .optional()
    .valid(['new', 'processed', 'toDetele', 'failed', 'inProgress']),
  _processedOn: Joi.date()
    .allow(null)
    .optional(),
  storage: {
    type: Joi.string().valid(['s3']),
    fileId: Joi.string(),
  },
};

module.exports = obj => Joi.validate(obj, fileSchema, { allowUnknown: false });
