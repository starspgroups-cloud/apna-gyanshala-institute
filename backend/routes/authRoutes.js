const express = require("express");

const router = express.Router();

const {
  registerStudent,
  loginStudent,
  verifyStudentOtp,
  resendStudentOtp,
} = require("../controllers/authController");

router.post("/register", registerStudent);
router.post("/verify-otp", verifyStudentOtp);
router.post("/resend-otp", resendStudentOtp);
router.post("/login", loginStudent);

module.exports = router;
