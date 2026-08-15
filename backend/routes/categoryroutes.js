const express = require("express");

const {
  getCategories
} = require("../controllers/categorycontroller");

const router = express.Router();

router.get("/", getCategories);

module.exports = router;