const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportcontroller");

const {
  authenticateToken,
  adminOnly
} = require("../middleware/authmiddleware");


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
   adminOnly,
  getReports
);


// UPDATE REPORT STATUS
// Admin only
router.put(
  "/:id/status",
  authenticateToken,
   adminOnly,
  updateReportStatus
);


module.exports = router;