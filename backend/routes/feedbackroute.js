const express = require("express");

const router = express.Router();

const {
  createFeedback,
  getFeedback,
  updateFeedbackStatus
} = require("../controllers/feedbackcontroller");

const {
  authenticateToken
} = require("../middleware/authmiddleware");



// USER: SUBMIT FEEDBACK
router.post(
  "/",
  authenticateToken,
  createFeedback
);


// ADMIN: GET ALL FEEDBACK
router.get(
  "/",
  authenticateToken,
  getFeedback
);


// ADMIN: UPDATE FEEDBACK STATUS
router.put(
  "/:id/status",
  authenticateToken,
   updateFeedbackStatus
);


module.exports = router;