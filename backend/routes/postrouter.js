const express = require("express");

const {
  createPost
} = require("../controllers/postcontroller");

const {
  authenticateToken
} = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createPost
);

module.exports = router;