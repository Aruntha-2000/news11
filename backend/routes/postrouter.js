const express = require("express");

const {
  createPost
} = require("../controllers/postController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createPost
);

module.exports = router;