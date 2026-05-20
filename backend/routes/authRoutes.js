const express = require("express");

const router = express.Router();

const {
  registerStudent,
  loginStudent,
  verifyStudentOtp,
  resendStudentOtp,
} = require("../controllers/authController");

// REGISTER
router.post("/register", registerStudent);

// VERIFY OTP
router.post("/verify-otp", verifyStudentOtp);

// RESEND OTP
router.post("/resend-otp", resendStudentOtp);

// LOGIN
router.post("/login", loginStudent);

module.exports = router;