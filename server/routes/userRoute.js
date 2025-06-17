// routes/user.js

const express = require("express");
const router = express.Router();

// Controller imports
const {
  signUp,
  login,
  sendOTP,
} = require("../controllers/authController");

// Routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/send-otp", sendOTP);

module.exports = router;
