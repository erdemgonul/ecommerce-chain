const express = require('express');
const commentBAL = require('../bal/comment');

const router = express.Router();

router.post('/create', async (req, res) => {
  const result = await commentBAL.createComment(req.body.productId, req.userId, req.body.commentText, req.body.rating, true);

  if (result && !result.error) {
    res.send({ success: true, commentId: result._id });
  } else {
    res.send(result);
  }
});

router.post('/get/all', async (req, res) => {
  const comments = await commentBAL.getCommentsOfProduct(req.body.sku, false);

  if (comments && !comments.error) {
    res.send({ data: comments, success: true });
  } else {
    res.send(comments);
  }
});

router.post('/get/approved/all', async (req, res) => {
  const comments = await commentBAL.getCommentsOfProduct(req.body.sku, true);

  if (comments && !comments.error) {
    res.send({ data: comments, success: true });
  } else {
    res.send(comments);
  }
});

router.post('/get/nonapproved/all', async (req, res) => {
  let comments;

  if (req.body.sku)
    comments = await commentBAL.getCommentsOfProduct(req.body.sku, false, true);
  else
    comments = await commentBAL.getAllNonApprovedComments();

  if (comments && !comments.error) {
    res.send({ data: comments, success: true });
  } else {
    res.send(comments);
  }
});

router.post('/delete', async (req, res) => {
  const deleteResponse = await commentBAL.deleteCommentWithId(req.user, req.body.commentId);

  if (deleteResponse && !deleteResponse.error) {
    res.send({ success: true });
  } else {
    res.send(deleteResponse);
  }
});

router.post('/approve', async (req, res) => {
  const approveResponse = await commentBAL.approveCommentWithId(req.user, req.body.commentId);

  if (approveResponse && !approveResponse.error) {
    res.send({ success: true });
  } else {
    res.send(approveResponse);
  }
});

module.exports = router;
