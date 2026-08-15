const db = require("../config/database");

const getPendingPosts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const [posts] = await db.promise().query(`
      SELECT
        posts.id,
        posts.title,
        posts.content,
        posts.image_url,
        posts.status,
        posts.created_at,
        users.name AS author,
        categories.name AS category
      FROM posts
      JOIN users
        ON posts.user_id = users.id
      JOIN categories
        ON posts.category_id = categories.id
      WHERE posts.status = 'pending'
      ORDER BY posts.created_at DESC
    `);

    res.json({
      posts
    });

  } catch (error) {
    console.error("Get pending posts error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// APPROVE NEWS
const approvePost = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const { id } = req.params;

    const [result] = await db.promise().query(
      `UPDATE posts
       SET status = 'approved'
       WHERE id = ? AND status = 'pending'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Pending news not found"
      });
    }

    res.json({
      message: "News approved successfully"
    });

  } catch (error) {
    console.error("Approve post error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// REJECT NEWS
const rejectPost = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const { id } = req.params;

    const [result] = await db.promise().query(
      `UPDATE posts
       SET status = 'rejected'
       WHERE id = ? AND status = 'pending'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Pending news not found"
      });
    }

    res.json({
      message: "News rejected successfully"
    });

  } catch (error) {
    console.error("Reject post error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  getPendingPosts,
  approvePost,
  rejectPost
};