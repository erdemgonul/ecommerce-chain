const Joi = require('joi');

const schema = Joi.object({
  query: Joi.string().allow('').required(),
  fullData: Joi.bool().optional(),
  filter: Joi.object().optional()
});

module.exports = schema;
