const Joi = require('joi');

const schema = Joi.object({
  sku: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  product_details: Joi.object().required(),
  shipping_details: Joi.object().required(),
  categories: Joi.array().required()
});

module.exports = schema;
