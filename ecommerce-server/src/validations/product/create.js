const Joi = require('joi');

const schema = Joi.object({
  id: Joi.number().required(),
  image: Joi.string().required(),
  title: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  size: Joi.number().required(),
  color: Joi.string().required()
});

module.exports = schema;
