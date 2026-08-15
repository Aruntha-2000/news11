const db = require("../config/database");

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const [comments] = await db.promise().query(
      `SELECT
        comments.id,
        comments.comment,
        comments.created_at,
        users.id AS user_id,
        users.name AS author
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = ?
       ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.json({
      comments
    });

  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

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

    const [result] = await db.promise().query(
      `INSERT INTO comments
       (user_id, post_id, comment)
       VALUES (?, ?, ?)`,
      [userId, postId, comment.trim()]
    );

    const [newComment] = await db.promise().query(
      `SELECT
        comments.id,
        comments.comment,
        comments.created_at,
        users.id AS user_id,
        users.name AS author
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment[0]
    });

  } catch (error) {
    console.error("Add comment error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const [result] = await db.promise().query(
      `DELETE FROM comments
       WHERE id = ? AND user_id = ?`,
      [commentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Comment not found or not owned by you"
      });
    }

    res.json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  getComments,
  addComment,
  deleteComment
};