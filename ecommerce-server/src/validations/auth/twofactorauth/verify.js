const Joi = require('joi');

const schema = Joi.object({
  userName: Joi.string().required(),
  twoFactorCode: Joi.number().min(100000).max(999999).required(),
});

module.exports = schema;
