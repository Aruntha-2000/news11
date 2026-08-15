const express = require("express");

const {
  getComments,
  addComment,
  deleteComment
} = require("../controllers/commentcontroller");

const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();


// GET COMMENTS
router.get("/:postId", getComments);


// ADD COMMENT
router.post("/:postId", authenticateToken, addComment);


// DELETE COMMENT
router.delete("/:commentId", authenticateToken, deleteComment);


module.exports = router;