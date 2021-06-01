const Joi = require('joi');

const schema = Joi.object({
  productId: Joi.string().required(),
  commentText: Joi.string().required(),
  rating: Joi.number().min(1).max(5).optional(),
});

module.exports = schema;
