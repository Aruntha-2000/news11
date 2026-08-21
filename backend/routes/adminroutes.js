const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus
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


module.exports = router;