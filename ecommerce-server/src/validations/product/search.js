const Joi = require('joi');

const schema = Joi.object({
  query: Joi.string().required(),
  fullData: Joi.bool().optional(),
});

module.exports = schema;
