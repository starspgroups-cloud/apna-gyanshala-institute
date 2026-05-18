const express = require("express");

const router = express.Router();

const {
  registerStudent,
  loginStudent,
} = require("../controllers/authController");


// REGISTER
router.post("/register", registerStudent);

// LOGIN
router.post("/login", loginStudent);


module.exports = router;