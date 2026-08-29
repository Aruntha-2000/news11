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


// =========================
// FOLLOW
// =========================

router.post(
  "/:userId",
  authenticateToken,
  followUser
);


// =========================
// FOLLOW INFO
// =========================

router.get(
  "/:userId",
  getFollowInfo
);


// =========================
// UNFOLLOW
// =========================

router.delete(
  "/:userId",
  authenticateToken,
  unfollowUser
);


// =========================
// FOLLOW STATUS
// =========================

router.get(
  "/status/:userId",
  authenticateToken,
  getFollowStatus
);


// =========================
// FOLLOWERS
// =========================

router.get(
  "/:userId/followers",
  getFollowers
);


// =========================
// FOLLOWING
// =========================

router.get(
  "/:userId/following",
  getFollowing
);


// =========================
// FOLLOW COUNTS
// =========================

router.get(
  "/:userId/counts",
  getFollowCounts
);


module.exports = router;

