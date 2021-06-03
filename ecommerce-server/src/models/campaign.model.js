const mongoose = require('mongoose');

const Campaign = mongoose.model(
    'Campaign',
    new mongoose.Schema({
        campaignType: String,
        createdOn: Date,
        validUntil: Date,
        discountAmount: Number,
        isActive: Boolean
    })
);

module.exports = Campaign;
