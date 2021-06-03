const Joi = require('joi');

const schema = Joi.object({
  sku: Joi.string().optional(),
});

module.exports = schema;
