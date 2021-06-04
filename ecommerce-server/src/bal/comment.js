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
                return {error: 'For purchased products rating must be given !'};

            for (let comment of previousCommentsOfUser) {
                if (comment.rating) {
                    hasRatedComment = true;
                    break;
                }
            }

            if (hasRatedComment)
                return {error: 'Rating cannot be given multiple times !'};
        } else {
            if (rating)
                return {error: 'You cant rate purchased products that you didnt purchase!'};

            const previousCommentsOfUser = await commentDAL.getCommentsOfUserOnProduct(userId, productId);

            if (previousCommentsOfUser.length >= 2)
                return {error: 'There can be only 2 non-rated comments per user !'};
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

        return {error: 'Comment creation failed!'};
    },

    async deleteCommentWithId(user, commentId) {
        if (user.role === 'productManager' || user.role === 'salesManager') {
            return await commentDAL.deleteCommentWithId(commentId);
        }

        const comment = await commentDAL.getCommentByCommentId(commentId);

        if (comment.userId === user.id) {
            return await commentDAL.deleteCommentWithId(commentId);
        }

        return {error: 'You cant delete other people\'s comments!'};
    },

    async getCommentsOfProduct(sku, approvedOnly, nonApprovedOnly) {
        return await commentDAL.getCommentsOfProduct(sku, approvedOnly, nonApprovedOnly);
    },

    async getAllNonApprovedComments() {
        return await commentDAL.getAllNonApprovedComments();
    },

    async getCommentByCommentId(commentId) {
        const commentDetails = await commentDAL.getCommentByCommentId(commentId);

        if (commentDetails && commentDetails._id) {
            commentDetails.id = commentDetails._id;
            delete commentDetails._id;
            delete commentDetails.__v;

            return commentDetails;
        }

        return {error: 'Comment not found !'};
    },

    async approveCommentWithId(user, commentId) {
        const comment = await self.getCommentByCommentId(commentId)

        if (comment && comment.id) {
          if (comment.isApproved)
            return {error: 'Comment is already approved!'};

          return await commentDAL.setCommentWithIdApproved(commentId);
        }

        return comment;
    }
};

module.exports = self;
