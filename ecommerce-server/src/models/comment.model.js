const mongoose = require('mongoose');

const Comment = mongoose.model(
  'Comment',
  new mongoose.Schema({
    productId: String,
    userId: String,
    commentText: String,
    rating: Number,
    isApproved: Boolean,
    isPurchased: Boolean,
    createdOn: Date,
  })
);

module.exports = Comment;
