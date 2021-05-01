const Joi = require('joi');

const schema = Joi.object({
  sku: Joi.string().required(),
});

module.exports = schema;
