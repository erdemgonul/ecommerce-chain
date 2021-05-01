const Joi = require('joi');

const schema = Joi.object({
  sku: Joi.string().required(),
  deleteFromElasticSearch: Joi.bool().optional(),
});

module.exports = schema;
