const express = require("express");

const {
  createPost
} = require("../controllers/postcontroller");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createPost
);

module.exports = router;