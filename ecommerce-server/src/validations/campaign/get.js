const Joi = require('joi');

const schema = Joi.object({
  campaignId: Joi.string().required(),
});

module.exports = schema;
