const db = require("../config/database");


// ==========================
// CREATE REPORT
// ==========================

const createReport = async (req, res) => {
  try {

    const userId = req.user.id;
    const postId = req.params.postId;
    const { reason } = req.body;


    // Check reason
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Report reason is required."
      });
    }


    // Check news exists
    const [posts] = await db.promise().query(
      `SELECT id
       FROM posts
       WHERE id = ?`,
      [postId]
    );


    if (posts.length === 0) {
      return res.status(404).json({
        message: "News not found."
      });
    }


    // Check whether user already reported this news
    const [existing] = await db.promise().query(
      `SELECT id
       FROM reports
       WHERE user_id = ?
       AND post_id = ?`,
      [userId, postId]
    );


    if (existing.length > 0) {
      return res.status(400).json({
        message: "You have already reported this news."
      });
    }


    // Create report
    await db.promise().query(
      `INSERT INTO reports
       (user_id, post_id, reason)
       VALUES (?, ?, ?)`,
      [
        userId,
        postId,
        reason.trim()
      ]
    );


    res.status(201).json({
      message: "Report submitted successfully."
    });


  } catch (error) {

    console.error(
      "Create report error:",
      error
    );


    res.status(500).json({
      message: "Server error."
    });

  }
};


// ==========================
// GET ALL REPORTS - ADMIN
// ==========================

const getReports = async (req, res) => {
  try {

    const [reports] = await db.promise().query(
      `SELECT
        reports.id,
        reports.post_id,
        reports.reason,
        reports.status,
        reports.created_at,

        users.id AS user_id,
        users.name AS user_name,

        posts.title AS post_title

       FROM reports

       JOIN users
         ON reports.user_id = users.id

       JOIN posts
         ON reports.post_id = posts.id

       ORDER BY reports.created_at DESC`
    );


    res.json({
      reports
    });


  } catch (error) {

    console.error(
      "Get reports error:",
      error
    );


    res.status(500).json({
      message: "Server error."
    });

  }
};


// ==========================
// UPDATE REPORT STATUS - ADMIN
// ==========================

const updateReportStatus = async (req, res) => {
  try {

    const reportId = req.params.id;
    const { status } = req.body;


    const allowedStatuses = [
      "pending",
      "reviewed",
      "dismissed"
    ];


    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid report status."
      });
    }


    await db.promise().query(
      `UPDATE reports
       SET status = ?
       WHERE id = ?`,
      [
        status,
        reportId
      ]
    );


    res.json({
      message: "Report status updated."
    });


  } catch (error) {

    console.error(
      "Update report error:",
      error
    );


    res.status(500).json({
      message: "Server error."
    });

  }
};


module.exports = {
  createReport,
  getReports,
  updateReportStatus
};