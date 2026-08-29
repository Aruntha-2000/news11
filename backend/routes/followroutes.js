const express = require("express");

const router = express.Router();

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
  getFollowCounts,
  getFollowInfo
} = require("../controllers/followcontroller");

const {
  authenticateToken
} = require("../middleware/authmiddleware");


// FOLLOW
router.post("/:userId", authmiddleware, followUser);

router.get("/:userId", getFollowInfo);


// UNFOLLOW
router.delete("/:userId", authmiddleware, unfollowUser);


// FOLLOW STATUS
router.get(
  "/status/:userId",
  authmiddleware,
  getFollowStatus
);


// FOLLOWERS
router.get(
  "/:userId/followers",
  getFollowers
);


// FOLLOWING
router.get(
  "/:userId/following",
  getFollowing
);


// COUNTS
router.get(
  "/:userId/counts",
  getFollowCounts
);


module.exports = router;