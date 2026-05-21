const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");

// ================= CONFIG =================

const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES) || 5;
const OTP_RESEND_SECONDS = Number(process.env.OTP_RESEND_SECONDS) || 60;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
const OTP_BLOCK_MINUTES = Number(process.env.OTP_BLOCK_MINUTES) || 15;

// ================= HELPERS =================

const createOtp = () =>
  otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

const generateStudentId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `AGI${random}`;
};

const createToken = (studentId) => {
  return jwt.sign(
    { id: studentId },
    process.env.JWT_SECRET || "apna_gyanshala_secret",
    { expiresIn: "7d" }
  );
};

const makeSafeStudent = (student) => {
  return {
    _id: student._id,
    fullName: student.fullName,
    email: student.email,
    studentId: student.studentId,
    phone: student.phone,
    isVerified: student.isVerified,
  };
};

// ================= BREVO API =================

const brevoClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = brevoClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi =
  new SibApiV3Sdk.TransactionalEmailsApi();

// ================= SEND EMAIL OTP =================

const sendEmailOtp = async ({ email, fullName, otp }) => {
  try {
    console.log(`📩 Sending OTP to ${email}`);

    const mail = {
      sender: {
        name: process.env.SMTP_FROM_NAME || "Apna Gyanshala",
        email:
          process.env.SMTP_FROM_EMAIL ||
          "starspgroups@gmail.com",
      },

      to: [
        {
          email: email,
          name: fullName,
        },
      ],

      subject: "Your Apna Gyanshala OTP Code",

      htmlContent: `
      <div style="font-family:Arial;padding:20px">
        <h2>Apna Gyanshala</h2>

        <p>Hello ${fullName},</p>

        <p>Your OTP code is:</p>

        <h1 style="letter-spacing:5px;color:#4f46e5">
          ${otp}
        </h1>

        <p>
          This OTP will expire in ${OTP_EXPIRE_MINUTES} minutes.
        </p>

        <br>

        <p>
          If you did not request this OTP, ignore this email.
        </p>
      </div>
      `,
    };

    const response =
      await transactionalEmailApi.sendTransacEmail(mail);

    console.log("✅ OTP EMAIL SENT");
    console.log(response);

    return true;
  } catch (error) {
    console.log("❌ BREVO EMAIL ERROR");
    console.log(error);

    return false;
  }
};

// ================= REGISTER =================

exports.registerStudent = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = createOtp();

    const student = await Student.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      studentId: generateStudentId(),
      otp,
      otpExpire: Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000,
      isVerified: false,
    });

    await sendEmailOtp({
      email,
      fullName,
      otp,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      student: makeSafeStudent(student),
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================

exports.verifyStudentOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (student.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    student.isVerified = true;
    student.otp = null;
    student.otpExpire = null;

    await student.save();

    const token = createToken(student._id);

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      token,
      student: makeSafeStudent(student),
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RESEND OTP =================

exports.resendStudentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const otp = createOtp();

    student.otp = otp;
    student.otpExpire =
      Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000;

    await student.save();

    await sendEmailOtp({
      email,
      fullName: student.fullName,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(student._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: makeSafeStudent(student),
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};