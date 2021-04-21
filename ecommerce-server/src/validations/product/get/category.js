const Joi = require('joi');

const schema = Joi.object({
  path: Joi.string().allow('').required(),
  strictMode: Joi.bool().required(),
});

module.exports = schema;
