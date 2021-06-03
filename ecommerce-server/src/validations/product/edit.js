const Joi = require('joi');

const schema = Joi.object({
  sku: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  quantity: Joi.number().optional(),
  price: Joi.number().optional(),
  product_details: Joi.object().optional(),
  shipping_details: Joi.object().optional(),
  categories: Joi.array().items(Joi.string()).optional()
}).options({ stripUnknown: true });

module.exports = schema;
