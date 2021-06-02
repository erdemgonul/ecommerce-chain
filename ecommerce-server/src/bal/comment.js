const moment = require('moment');

const userLog = require('./userlog');

const productBAL = require('./product')
const invoiceBAL = require('./invoice')
const commentDAL = require('../dal/comment');

const self = {
  async createComment(productId, userId, commentText, rating, shouldLog) {
    const isPurchased = await invoiceBAL.isInvoiceExistForProduct(userId, productId);
    const previousCommentsOfUser = await commentDAL.getCommentsOfUserOnProduct(userId, productId);

    if (isPurchased) {
      let hasRatedComment = false;

      if (!rating)
        return { error: 'For purchased products rating must be given !' };

      for (let comment of previousCommentsOfUser) {
        if (comment.rating) {
          hasRatedComment = true;
          break;
        }
      }

      if (hasRatedComment)
        return { error: 'Rating cannot be given multiple times !' };
    } else {
      if (rating)
        return { error: 'You cant rate purchased products that you didnt purchase!' };

      const previousCommentsOfUser = await commentDAL.getCommentsOfUserOnProduct(userId, productId);

      if (previousCommentsOfUser.length >= 2)
        return { error: 'There can be only 2 non-rated comments per user !' };
    }

    const createdComment = await commentDAL.createComment(productId, userId, commentText, rating, false, isPurchased);

    if (createdComment && createdComment._id) {
      // Add to logs of user
      if (shouldLog) {
        const productCategories = await productBAL.getProductByProductId(productId, null, false, ['categories']);

        const commentLog = {
          productId: productId,
          productCategories: productCategories.categories
        }

        await userLog.createUserLog(userId, userLog.LogType.PRODUCT_COMMENT, commentLog)
      }

      return createdComment;
    }

    return { error: 'Comment creation failed!' };
  },

  async deleteCommentWithId(user, commentId) {
    if (user.role === 'productManager' ) {
      return await commentDAL.deleteCommentWithId(commentId);
    }

    const comment = await commentDAL.getCommentByCommentId(commentId);

    if (comment.userId === user.id) {
      return await commentDAL.deleteCommentWithId(commentId);
    }

    return { error: 'You cant delete other people\'s comments!' };
  },

  async getCommentsOfProduct(sku, approvedOnly, nonApprovedOnly) {
    return await commentDAL.getCommentsOfProduct(sku, approvedOnly, nonApprovedOnly);
  },

  /*
  async getCommentByCommentId(orderId) {
    const orderDetails = await commentDAL.ge(orderId);

    if (orderDetails) {
      orderDetails.id = orderDetails._id;
      delete orderDetails._id;
      delete orderDetails.__v;

      return orderDetails;
    }
    return { error: 'Product not found !' };
  }, */
};

module.exports = self;
