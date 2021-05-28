const Joi = require('joi');

const schema = Joi.object({
  userName: Joi.string().required(),
  twoFactorCode: Joi.number().min(6).max(6).required(),
});

module.exports = schema;
