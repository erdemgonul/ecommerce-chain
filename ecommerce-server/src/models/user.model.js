const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        accountkey: String,
        firstName: String,
        lastName: String,
        createdOn: String,
        lastLogoutOn: String,
        role: String,
        twoFactorAuthenticationEnabled: Boolean,
        shippingAddresses: Array,
        billingAddresses: Array,
        lastTwoFactorCode: Number
    })
);

module.exports = User;
