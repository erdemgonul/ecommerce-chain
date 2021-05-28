const Joi = require('joi');

const schema = Joi.object({
  path: Joi.string().required()
});

module.exports = schema;
