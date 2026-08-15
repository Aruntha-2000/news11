const db = require("../config/database");


// LIKE A POST
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    // Check whether the news exists
    const [posts] = await db.promise().query(
      `SELECT id
       FROM posts
       WHERE id = ? AND status = 'approved'`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    // Check whether user already liked it
    const [existingLike] = await db.promise().query(
      `SELECT id
       FROM likes
       WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );

    if (existingLike.length > 0) {
      return res.status(400).json({
        message: "You already liked this news"
      });
    }

    // Insert like
    await db.promise().query(
      `INSERT INTO likes (user_id, post_id)
       VALUES (?, ?)`,
      [userId, postId]
    );

    // Get new like count
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) AS likeCount
       FROM likes
       WHERE post_id = ?`,
      [postId]
    );

    res.json({
      message: "News liked successfully",
      likeCount: countResult[0].likeCount
    });

  } catch (error) {
    console.error("Like post error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// UNLIKE A POST
const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await db.promise().query(
      `DELETE FROM likes
       WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );

    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) AS likeCount
       FROM likes
       WHERE post_id = ?`,
      [postId]
    );

    res.json({
      message: "Like removed",
      likeCount: countResult[0].likeCount
    });

  } catch (error) {
    console.error("Unlike post error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET LIKE COUNT
const getLikeInfo = async (req, res) => {
  try {
    const postId = req.params.postId;

    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) AS likeCount
       FROM likes
       WHERE post_id = ?`,
      [postId]
    );

    let liked = false;

    if (req.user) {
      const [userLike] = await db.promise().query(
        `SELECT id
         FROM likes
         WHERE user_id = ? AND post_id = ?`,
        [req.user.id, postId]
      );

      liked = userLike.length > 0;
    }

    res.json({
      likeCount: countResult[0].likeCount,
      liked
    });

  } catch (error) {
    console.error("Get like info error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// GET USERS WHO LIKED A POST
const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId;

    const [likes] = await db.promise().query(
      `SELECT
        likes.id,
        likes.created_at,
        users.id AS user_id,
        users.name AS user_name
       FROM likes
       JOIN users
         ON likes.user_id = users.id
       WHERE likes.post_id = ?
       ORDER BY likes.created_at DESC`,
      [postId]
    );

    res.json({
      likes
    });

  } catch (error) {
    console.error("Get post likes error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikeInfo,
  getPostLikes
};