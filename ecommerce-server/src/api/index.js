const express = require('express');

const auth = require('./auth');
const user = require('./user');
const product = require('./product');
const category = require('./category');
const order = require('./order');
const notification = require('./notification');
const comment = require('./comment');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/product', product);
router.use('/category', category);
router.use('/order', order);
router.use('/notification', notification);
router.use('/comment', comment);

module.exports = router;
