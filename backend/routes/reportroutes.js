const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportcontroller");

const authenticateToken = require("../middleware/authmiddleware");


// CREATE REPORT
// Any logged-in user can report news
router.post(
  "/:postId",
  authenticateToken,
  createReport
);


// GET REPORTS
// Admin only
router.get(
  "/",
  authenticateToken,
  getReports
);


// UPDATE REPORT STATUS
// Admin only
router.put(
  "/:id/status",
  authenticateToken,
  updateReportStatus
);


module.exports = router;