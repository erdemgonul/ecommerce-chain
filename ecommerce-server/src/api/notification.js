const express = require('express');
const firebaseAdmin = require('firebase-admin');

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const {
      title, body, imageUrl, notificationToken
    } = req.body;

    await firebaseAdmin
      .messaging()
      .sendMulticast({
        tokens: [notificationToken],
        notification: {
          title: 'Your order status',
          body: 'Order has been shipped to your address',
          imageUrl,
        },
      })
      .then((e) => console.log(e))
      .catch((err) => console.log(err));
    res.status(200).json({ message: 'Successfully sent notifications!' });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Something went wrong!' });
  }
});

module.exports = router;
