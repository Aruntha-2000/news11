const express = require("express");

const {
  getReplies,
  addReply,
  deleteReply
} = require("../controllers/replecontroller");

const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();


// GET REPLIES
router.get(
  "/comment/:commentId",
  getReplies
);


// ADD REPLY
router.post(
  "/comment/:commentId",
  authenticateToken,
  addReply
);


// DELETE REPLY
router.delete(
  "/:replyId",
  authenticateToken,
  deleteReply
);


module.exports = router;