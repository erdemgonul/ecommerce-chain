const Joi = require('joi');

const schema = Joi.object({
  status: Joi.string().optional(),
  shippingAddress:Joi.string().optional(),
  billingAddress: Joi.string().optional(),
  orderId: Joi.string().required()
}).options({ stripUnknown: true });

module.exports = schema;
