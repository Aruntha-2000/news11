const db = require("../config/database");

// FOLLOW USER
const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    // Cannot follow yourself
    if (Number(followerId) === Number(followingId)) {
      return res.status(400).json({
        message: "You cannot follow yourself."
      });
    }

    // Check user exists
    const [users] = await db.promise().query(
      "SELECT id FROM users WHERE id = ?",
      [followingId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // Check already following
    const [existing] = await db.promise().query(
      `SELECT id
       FROM follows
       WHERE follower_id = ?
       AND following_id = ?`,
      [followerId, followingId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Already following this user."
      });
    }

            // Follow
        await db.promise().query(
          `INSERT INTO follows
          (follower_id, following_id)
          VALUES (?, ?)`,
          [followerId, followingId]
        );


        // Get follower name
        const [followerUser] = await db.promise().query(
          `SELECT name
          FROM users
          WHERE id = ?`,
          [followerId]
        );

        const followerName =
          followerUser.length > 0
            ? followerUser[0].name
            : "Someone";

        // Create follow notification
        await db.promise().query(
          `INSERT INTO notifications
          (user_id, type, message)
          VALUES (?, ?, ?)`,
          [
            followingId,
            "follow",
            `${followerName} started following you.`
          ]
        );


        res.status(201).json({
          message: "User followed successfully."
        });
          } catch (error) {
    console.error("Follow error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// UNFOLLOW USER
const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    await db.promise().query(
      `DELETE FROM follows
       WHERE follower_id = ?
       AND following_id = ?`,
      [followerId, followingId]
    );

    res.json({
      message: "User unfollowed successfully."
    });

  } catch (error) {
    console.error("Unfollow error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// GET FOLLOWERS
const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [followers] = await db.promise().query(
      `SELECT
        users.id,
        users.name,
        users.email,
        follows.created_at
       FROM follows
       JOIN users
         ON follows.follower_id = users.id
       WHERE follows.following_id = ?
       ORDER BY follows.created_at DESC`,
      [userId]
    );

    res.json({
      followers
    });

  } catch (error) {
    console.error("Get followers error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// GET FOLLOWING
const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [following] = await db.promise().query(
      `SELECT
        users.id,
        users.name,
        users.email,
        follows.created_at
       FROM follows
       JOIN users
         ON follows.following_id = users.id
       WHERE follows.follower_id = ?
       ORDER BY follows.created_at DESC`,
      [userId]
    );

    res.json({
      following
    });

  } catch (error) {
    console.error("Get following error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// GET FOLLOW STATUS
const getFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const [rows] = await db.promise().query(
      `SELECT id
       FROM follows
       WHERE follower_id = ?
       AND following_id = ?`,
      [followerId, followingId]
    );

    res.json({
      following: rows.length > 0
    });

  } catch (error) {
    console.error("Follow status error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// GET FOLLOW COUNTS
const getFollowCounts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [followers] = await db.promise().query(
      `SELECT COUNT(*) AS count
       FROM follows
       WHERE following_id = ?`,
      [userId]
    );

    const [following] = await db.promise().query(
      `SELECT COUNT(*) AS count
       FROM follows
       WHERE follower_id = ?`,
      [userId]
    );

    res.json({
      followers: followers[0].count,
      following: following[0].count
    });

  } catch (error) {
    console.error("Follow count error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};

const getFollowInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [followers] = await db.promise().query(
      `SELECT COUNT(*) AS count
       FROM follows
       WHERE following_id = ?`,
      [userId]
    );

    const [following] = await db.promise().query(
      `SELECT COUNT(*) AS count
       FROM follows
       WHERE follower_id = ?`,
      [userId]
    );

    res.json({
      followers: followers[0].count,
      following: following[0].count
    });

  } catch (error) {
    console.error("Get follow info error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
  getFollowCounts,
  getFollowInfo
};