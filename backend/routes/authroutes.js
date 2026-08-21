const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authcontroller");

const router = express.Router();


// REGISTER
router.post(
  "/register",
  register
);


// LOGIN
router.post(
  "/login",
  login
);


// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);


// RESET PASSWORD
router.post(
  "/reset-password/:token",
  resetPassword
);


module.exports = router;