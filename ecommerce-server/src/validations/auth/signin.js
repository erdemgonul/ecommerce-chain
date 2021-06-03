const Joi = require('joi');

const schema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().min(6).required(),
  notificationToken: Joi.string().optional()
});

module.exports = schema;
