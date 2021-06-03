const Joi = require('joi');

const schema = Joi.object({
  amount: Joi.number().min(1).required(),
});

module.exports = schema;
