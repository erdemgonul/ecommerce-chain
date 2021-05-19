const Joi = require('joi');

const schema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  shippingAddresses: Joi.array().items(Joi.string()).optional(),
  newShippingAddress: Joi.bool().optional(),
  billingAddresses: Joi.array().items(Joi.string()).optional(),
  newBillingAddress: Joi.bool().optional(),
  twoFactorAuthenticationEnabled: Joi.bool().optional()
}).options({ stripUnknown: true });

module.exports = schema;
