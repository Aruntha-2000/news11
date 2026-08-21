const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus,
  forgotPassword,
  resetPassword
} = require("../controllers/reportcontroller");

const authenticateToken = require("../middleware/authmiddleware");


// USER: CREATE REPORT
router.post(
  "/:postId",
  authenticateToken,
  createReport
);


// ADMIN: GET REPORTS
router.get(
  "/",
  authenticateToken,
    getReports
);


// ADMIN: UPDATE REPORT
router.put(
  "/:id/status",
  authenticateToken,
    updateReportStatus
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);


// RESET PASSWORD
router.post(
  "/reset-password/:token",
  resetPassword
);
module.exports = router;