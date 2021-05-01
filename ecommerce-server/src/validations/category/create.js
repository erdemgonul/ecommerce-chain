const Joi = require('joi');

const schema = Joi.object({
  title: Joi.string().required(),
  parent: Joi.string().required(),
  path: Joi.string().required(),
});

module.exports = schema;
