const Joi = require('joi');

const schema = Joi.object({
  orderId: Joi.string().required(),
  campaignId: Joi.string().optional()
});

module.exports = schema;
