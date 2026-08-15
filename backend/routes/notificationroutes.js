const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authmiddleware");

const {
  getNotifications,
  markNotificationRead,
  getUnreadCount
} = require("../controllers/notificationcontroller");


// ===============================
// GET UNREAD NOTIFICATION COUNT
// ===============================
router.get(
  "/unread-count",
  authenticateToken,
  getUnreadCount
);


// ===============================
// GET MY NOTIFICATIONS
// ===============================
router.get(
  "/",
  authenticateToken,
  getNotifications
);


// ===============================
// MARK NOTIFICATION AS READ
// ===============================
router.put(
  "/:id/read",
  authenticateToken,
  markNotificationRead
);


module.exports = router;