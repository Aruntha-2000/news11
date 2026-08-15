const db = require("../config/database");


// GET MY NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [notifications] = await db.promise().query(
      `SELECT
        id,
        user_id,
        type,
        message,
        post_id,
        is_read,
        created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      notifications
    });

  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};

    const getUnreadCount = async (req, res) => {
      try {
        const userId = req.user.id;

        const [rows] = await db.promise().query(
          `SELECT COUNT(*) AS count
          FROM notifications
          WHERE user_id = ?
          AND is_read = 0`,
          [userId]
        );

        res.json({
          count: rows[0].count
        });

      } catch (error) {
        console.error("Get unread count error:", error);

        res.status(500).json({
          message: "Server error."
        });
      }
    };

// MARK NOTIFICATION AS READ
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    await db.promise().query(
      `UPDATE notifications
       SET is_read = 1
       WHERE id = ?
       AND user_id = ?`,
      [notificationId, userId]
    );

    res.json({
      message: "Notification marked as read."
    });

  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(500).json({
      message: "Server error."
    });
  }
};


module.exports = {
  getNotifications,
  markNotificationRead,
  getUnreadCount
};