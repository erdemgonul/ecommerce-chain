const Joi = require('joi');

const schema = Joi.object({
  orderId: Joi.string().required()
});

module.exports = schema;
