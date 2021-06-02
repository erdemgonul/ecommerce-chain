const Joi = require('joi');

const schema = Joi.object({
  invoiceId: Joi.string().required(),
});

module.exports = schema;
