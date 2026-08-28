const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportcontroller");

const {
  authenticateToken,
  requireAdmin
} = require("../middleware/authmiddleware");


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
  requireAdmin,
  getReports
);


router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  updateReportStatus
);


module.exports = router;