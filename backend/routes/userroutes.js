const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authmiddleware");

const db = require("../config/database");

// =========================
// GET LOGGED-IN USER PROFILE
// =========================

router.get(
  "/profile",
  authenticateToken,
  (req, res) => {
    res.json({
      message: "You accessed a protected route!",
      user: req.user
    });
  }
);


// =========================
// GET USER BY ID
// =========================

router.get("/:id", (req, res) => {

  const userId = req.params.id;

  const sql = `
    SELECT id, name, email, role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      console.error("Get user error:", err);

      return res.status(500).json({
        message: "Database error."
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    res.json({
      user: results[0]
    });

  });

});


module.exports = router;