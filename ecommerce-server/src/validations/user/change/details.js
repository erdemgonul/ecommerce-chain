const Joi = require('joi');

const schema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
}).options({ stripUnknown : true });

module.exports = schema;