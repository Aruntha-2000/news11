const express = require("express");

const {
  likePost,
  unlikePost,
  getLikeInfo,
  getPostLikes
} = require("../controllers/likescontroller");

const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();


// Like
router.post(
  "/:postId",
  authenticateToken,
  likePost
);


// Unlike
router.delete(
  "/:postId",
  authenticateToken,
  unlikePost
);


// Like information
router.get(
  "/:postId",
  getLikeInfo
);


router.get(
  "/:postId/users",
  getPostLikes
);

module.exports = router;