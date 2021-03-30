const express = require('express');
const authBAL = require('../bal/auth');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const result = await authBAL.signUp(req.body.userName, req.body.firstName, req.body.lastName, req.body.email, req.body.password);

    if (result && !result.error) {
        res.send({success: true})
    } else {
        res.send(result)
    }
});

router.post('/signin', async (req, res) => {
    const result = await authBAL.signIn(req.body.userName, req.body.password);

    if (result && !result.error) {
        res.send({success: true, accessToken: result})
    } else {
        res.send(result)
    }
});

router.post('/logout', async (req, res) => {
    const result = await authBAL.logout(req.userId);

    if (result && !result.error) {
        res.send({success: true})
    } else {
        res.send(result)
    }
});

module.exports = router;
