const db = require("../config/database");

// GET REPLIES FOR A COMMENT
const getReplies = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const [replies] = await db.promise().query(
      `SELECT
        comment_replies.id,
        comment_replies.reply,
        comment_replies.created_at,
        users.id AS user_id,
        users.name AS author
       FROM comment_replies
       JOIN users
         ON comment_replies.user_id = users.id
       WHERE comment_replies.comment_id = ?
       ORDER BY comment_replies.created_at ASC`,
      [commentId]
    );

    res.json({
      replies
    });

  } catch (error) {
    console.error("Get replies error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ADD REPLY
const addReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({
        message: "Reply cannot be empty"
      });
    }

    // Find comment + news owner
    const [comments] = await db.promise().query(
      `SELECT
        comments.id,
        posts.user_id AS post_owner_id
       FROM comments
       JOIN posts
         ON comments.post_id = posts.id
       WHERE comments.id = ?`,
      [commentId]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // Only news owner can reply
    if (Number(comments[0].post_owner_id) !== Number(userId)) {
      return res.status(403).json({
        message: "Only the news publisher can reply to this comment"
      });
    }

    // Insert reply
    const [result] = await db.promise().query(
      `INSERT INTO comment_replies
       (comment_id, user_id, reply)
       VALUES (?, ?, ?)`,
      [commentId, userId, reply.trim()]
    );

    // Get created reply
    const [newReply] = await db.promise().query(
      `SELECT
        comment_replies.id,
        comment_replies.reply,
        comment_replies.created_at,
        users.id AS user_id,
        users.name AS author
       FROM comment_replies
       JOIN users
         ON comment_replies.user_id = users.id
       WHERE comment_replies.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply[0]
    });

  } catch (error) {
    console.error("Add reply error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// DELETE REPLY
const deleteReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const replyId = req.params.replyId;

    const [result] = await db.promise().query(
      `DELETE FROM comment_replies
       WHERE id = ? AND user_id = ?`,
      [replyId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Reply not found or not owned by you"
      });
    }

    res.json({
      message: "Reply deleted successfully"
    });

  } catch (error) {
    console.error("Delete reply error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  getReplies,
  addReply,
  deleteReply
};