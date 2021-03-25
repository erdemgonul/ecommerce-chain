const express = require('express');

const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);


module.exports = router;
