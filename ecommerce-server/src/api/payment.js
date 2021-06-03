const express = require('express');
const paymentBAL = require('../bal/payment');

const router = express.Router();

router.post('/fund', async (req, res) => {
    const fundResponse = await paymentBAL.fund(req.user.cryptoAccountPublicKey, req.body.amount);

    if (fundResponse && !fundResponse.error) {
        res.send({ success: true });
    } else {
        res.send(fundResponse);
    }
});


module.exports = router;
