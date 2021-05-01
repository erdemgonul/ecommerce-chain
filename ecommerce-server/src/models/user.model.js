const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        createdOn: String,
        lastLogoutOn: String,
        role: String,
        twoFactorAuthEnabled: Boolean,
        shippingAddresses: Array,
        billingAddresses: Array,
    })
);

module.exports = User;
