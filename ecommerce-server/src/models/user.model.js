const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        cryptoAccountPrivateKey: String,
        cryptoAccountPublicKey: String,
        firstName: String,
        lastName: String,
        createdOn: String,
        lastLogoutOn: String,
        role: String,
        twoFactorAuthenticationEnabled: Boolean,
        shippingAddresses: Array,
        billingAddresses: Array,
        lastTwoFactorCode: Number,
        notificationTokens: []
    })
);

module.exports = User;
