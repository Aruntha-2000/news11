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
  adminOnly,
  getReports
);


// ADMIN: UPDATE REPORT STATUS
router.put(
  "/:id/status",
  authenticateToken,
  adminOnly,
  updateReportStatus
);


module.exports = router;