const Joi = require('joi');

const schema = Joi.object({
  billingAddress: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  products: Joi.array().items(Joi.object({
    sku: Joi.string().required(),
    quantity: Joi.number().required(),
    title: Joi.string().required()
  })).required()
});

module.exports = schema;
