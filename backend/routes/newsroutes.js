const express = require("express");

const {
  getPublishedNews,
  getNewsDetails
} = require("../controllers/newscontroller");

const router = express.Router();

router.get("/", getPublishedNews);

router.get("/:id", getNewsDetails);

module.exports = router;