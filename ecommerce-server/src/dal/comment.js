const moment = require('moment');
const db = require('../models');

const Comment = db.comment;

const self = {
    createComment: async (productId, userId, commentText, rating, isApproved, isPurchased) => {
        const createdOn = moment.utc().toDate();

        const comment = new Comment({
            productId, userId, commentText, rating, isApproved, isPurchased, createdOn
        });

        try {
            const createdComment = await comment.save();

            if (createdComment) {
                const commentObj = createdComment.toObject();

                delete commentObj.__v;

                return createdComment.toObject();
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    getCommentsOfUserOnProduct: async (userId, sku, approvedOnly, nonApprovedOnly) => {
        try {
            const result = [];

            const filter = {
                productId: sku,
                userId: userId
            };

            if (approvedOnly) {
                filter.isApproved = true
            }

            if (nonApprovedOnly) {
                filter.isApproved = false
            }

            const comments = await Comment.find(filter).sort({createdOn: -1}).exec();

            for (const comment of comments) {
                const commentObj = comment.toObject();
                commentObj.id = commentObj._id;

                delete commentObj._id;
                delete commentObj.__v;
                result.push(commentObj);
            }

            return result;
        } catch (err) {
            return err;
        }
    },

    getCommentsOfProduct: async (sku, approvedOnly, nonApprovedOnly) => {
        try {
            const result = [];
            const filter = {
                productId: sku
            };

            if (approvedOnly) {
                filter.isApproved = true
            }

            if (nonApprovedOnly) {
                filter.isApproved = false
            }

            const comments = await Comment.find(filter).sort({createdOn: -1}).exec();

            for (const comment of comments) {
                const commentObj = comment.toObject();
                commentObj.id = commentObj._id;

                delete commentObj._id;
                delete commentObj.__v;
                result.push(commentObj);
            }

            return result;
        } catch (err) {
            return err;
        }
    },

    deleteCommentWithId: async (commentId) => {
        try {
            const comment = await Comment.findOne({
                _id: commentId
            }).exec();

            if (comment) {
                const removedComment = await comment.remove();

                return true;
            }

            return false;
        } catch (err) {
            return err;
        }
    },

    getCommentByCommentId: async (commentId) => {
        try {
            const filter = {
                _id: commentId
            }

            const comment = await Comment.findOne(filter).exec();

            if (comment) {
                return comment.toObject();
            }
        } catch (err) {
            return err;
        }
    },

    setCommentWithIdApproved: async (commentId) => {
      try {
        const comment = await Comment.findOne({
          _id: commentId
        }).exec();

        if (comment) {
          comment.isApproved = true;
          const updatedComment = await comment.save();

          return true;
        }

        return false;
      } catch (err) {
        return err;
      }
    }
};

module.exports = self;
