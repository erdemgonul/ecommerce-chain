const Joi = require('joi');

const schema = Joi.object({
    category: Joi.string().required()
});

module.exports = schema;
