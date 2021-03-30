const express = require('express');
const userBAL = require('../bal/user');
const router = express.Router();

router.post('/get/details', async (req, res) => {
    if (req.body.username) {
        const result = await userBAL.getUserDetailsByUsername(req.body.username);
        if (result && !result.error) {
            res.send({data: result, success: true})
        } else {
            res.send(result)
        }
    } else {
        const result = await userBAL.getUserDetailsById(req.userId);
        if (result && !result.error) {
            res.send({data: result, success: true})
        } else {
            res.send(result)
        }
    }
});

router.post('/change/details', async (req, res) => {
    const result = await userBAL.changeDetails(req.userId, req.body);

    if (result && !result.error) {
        res.send({success: true})
    } else {
        res.send(result)
    }
});

module.exports = router;
