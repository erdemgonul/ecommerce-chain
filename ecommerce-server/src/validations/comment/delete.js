const Joi = require('joi');

const schema = Joi.object({
  commentId: Joi.string().required(),
});

module.exports = schema;
