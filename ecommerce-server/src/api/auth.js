const express = require('express');
const authBAL = require('../bal/auth');
const router = express.Router();
const Joi = require('joi');

const authBal = new authBAL ();

router.post('/signup', signUpSchema, async (req, res) => {
    const result = await authBal.signUp(req.body.userName, req.body.firstName, req.body.lastName, req.body.email, req.body.password);

    if (result && !result.error) {
        res.send({success: true})
    } else {
        res.send(result)
    }
});

router.post('/signin', signInSchema, async (req, res) => {
    const result = await authBal.signIn(req.body.userName, req.body.password);

    if (result && !result.error) {
        res.send({success: true, accessToken: result})
    } else {
        res.send(result)
    }
});

function signUpSchema(req, res, next) {
    const schema = Joi.object({
        userName: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, next, schema);
}

function signInSchema(req, res, next) {
    const schema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, next, schema);
}

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);

    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}

module.exports = router;
