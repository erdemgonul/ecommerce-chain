const Joi = require('joi');

const schema = Joi.object({
  campaignType: Joi.string().required(),
  validUntil: Joi.string().required(),
  isActive: Joi.bool().required(),
  discountAmount: Joi.number().min(1).required(),
  notificationDetails: Joi.object().optional()
});

module.exports = schema;
