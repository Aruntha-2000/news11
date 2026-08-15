const db = require("../config/database");


// CREATE FEEDBACK
const createFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Feedback cannot be empty."
      });
    }

    await db.promise().query(
      `INSERT INTO feedback
       (user_id, message)
       VALUES (?, ?)`,
      [userId, message.trim()]
    );

    // Create notification for admins
    const [admins] = await db.promise().query(
      `SELECT id
       FROM users
       WHERE role = 'admin'`
    );

    for (const admin of admins) {
      await db.promise().query(
        `INSERT INTO notifications
         (user_id, type, message)
         VALUES (?, ?, ?)`,
        [
          admin.id,
          "feedback",
          "A new feedback has been submitted."
        ]
      );
    }

    res.status(201).json({
      message: "Feedback submitted successfully."
    });

  } catch (error) {
    console.error("Create feedback error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// GET ALL FEEDBACK
const getFeedback = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required."
      });
    }

    const [feedback] = await db.promise().query(
      `SELECT
        feedback.id,
        feedback.user_id,
        feedback.message,
        feedback.status,
        feedback.created_at,
        users.name AS user_name,
        users.email
       FROM feedback
       JOIN users
         ON feedback.user_id = users.id
       ORDER BY feedback.created_at DESC`
    );

    res.json({
      feedback
    });

  } catch (error) {
    console.error("Get feedback error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


// UPDATE FEEDBACK STATUS
const updateFeedbackStatus = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required."
      });
    }

    const feedbackId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid feedback status."
      });
    }

    const [result] = await db.promise().query(
      `UPDATE feedback
       SET status = ?
       WHERE id = ?`,
      [status, feedbackId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Feedback not found."
      });
    }

    res.json({
      message: "Feedback status updated successfully."
    });

  } catch (error) {
    console.error(
      "Update feedback status error:",
      error
    );

    res.status(500).json({
      message: "Server error."
    });
  }
};


module.exports = {
  createFeedback,
  getFeedback,
  updateFeedbackStatus
};