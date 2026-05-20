const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");

const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES) || 5;
const OTP_RESEND_SECONDS = Number(process.env.OTP_RESEND_SECONDS) || 60;
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;

const createOtp = () =>
  otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const addMinutes = (minutes) => new Date(Date.now() + minutes * 60 * 1000);
const addSeconds = (seconds) => new Date(Date.now() + seconds * 1000);

const isExpired = (date) => !date || new Date(date).getTime() < Date.now();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailOtp = async ({ email, fullName, otp }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ EMAIL_USER / EMAIL_PASS missing. Email OTP:", otp);
    return;
  }

  await transporter.sendMail({
    from: `"Apna Gyanshala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Apna Gyanshala OTP Verification",
    html: `
      <div style="font-family:Arial;background:#f4f7fb;padding:30px">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:18px;overflow:hidden">
          <div style="background:#312e81;padding:24px;text-align:center">
            <h1 style="margin:0;color:#fff">APNA GYANSHALA</h1>
            <p style="margin:8px 0 0;color:#facc15;font-weight:bold">Secure Verification OTP</p>
          </div>
          <div style="padding:34px">
            <h2 style="color:#111827">Hello ${fullName},</h2>
            <p>Your verification OTP is:</p>
            <div style="font-size:42px;font-weight:900;letter-spacing:10px;text-align:center;color:#312e81;margin:30px 0">
              ${otp}
            </div>
            <p style="color:#dc2626;font-weight:bold">Valid for ${OTP_EXPIRE_MINUTES} minutes only.</p>
          </div>
        </div>
      </div>
    `,
  });
};

const sendMobileOtp = async ({ mobile, otp }) => {
  console.log(`📱 Mobile OTP for ${mobile}: ${otp}`);
};

const makeSafeStudent = (student) => {
  const safeStudent = student.toObject ? student.toObject() : { ...student };

  delete safeStudent.password;
  delete safeStudent.emailOtpHash;
  delete safeStudent.mobileOtpHash;

  safeStudent.id = safeStudent._id;
  safeStudent.uid = safeStudent._id;
  safeStudent.name = safeStudent.name || safeStudent.fullName;
  safeStudent.fullName = safeStudent.fullName || safeStudent.name;
  safeStudent.phone = safeStudent.phone || safeStudent.mobile;
  safeStudent.mobile = safeStudent.mobile || safeStudent.phone;
  safeStudent.course =
    safeStudent.course || safeStudent.className || safeStudent.classLevel;
  safeStudent.classLevel =
    safeStudent.classLevel || safeStudent.className || safeStudent.course;
  safeStudent.photo =
    safeStudent.photo || safeStudent.photoUrl || safeStudent.profileImage;
  safeStudent.photoUrl =
    safeStudent.photoUrl || safeStudent.photo || safeStudent.profileImage;
  safeStudent.profileImage =
    safeStudent.profileImage || safeStudent.photo || safeStudent.photoUrl;

  return safeStudent;
};

const sendFreshOtpToStudent = async (student) => {
  const emailOtp = createOtp();
  const mobileOtp = createOtp();

  student.emailOtpHash = hashOtp(emailOtp);
  student.mobileOtpHash = hashOtp(mobileOtp);
  student.emailOtpExpiresAt = addMinutes(OTP_EXPIRE_MINUTES);
  student.mobileOtpExpiresAt = addMinutes(OTP_EXPIRE_MINUTES);
  student.emailOtpAttempts = 0;
  student.mobileOtpAttempts = 0;
  student.emailOtpResendAfter = addSeconds(OTP_RESEND_SECONDS);
  student.mobileOtpResendAfter = addSeconds(OTP_RESEND_SECONDS);
  student.lastOtpSentAt = new Date();
  student.otpBlockedUntil = null;
  student.verificationStatus = "pending";

  await student.save();

  await sendEmailOtp({
    email: student.email,
    fullName: student.fullName,
    otp: emailOtp,
  });

  await sendMobileOtp({
    mobile: student.mobile,
    otp: mobileOtp,
  });
};

// ================= REGISTER STUDENT =================

exports.registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      motherName,
      email,
      mobile,
      password,
      className,
      course,
      subjectStream,
      subjects,
      selectedSubjects,
      address,
      dob,
      gender,
      parentPhone,
      emergencyContact,
      photo,
      photoUrl,
      totalFees,
      paidAmount,
      dueAmount,
      paymentMode,
      receiptNo,
    } = req.body;

    if (
      !fullName ||
      !fatherName ||
      !motherName ||
      !email ||
      !mobile ||
      !password ||
      !className ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanMobile = String(mobile).trim();

    const existingStudent = await Student.findOne({
      $or: [{ email: cleanEmail }, { mobile: cleanMobile }, { phone: cleanMobile }],
    });

    if (existingStudent) {
      if (!existingStudent.isEmailVerified || !existingStudent.isMobileVerified) {
        await sendFreshOtpToStudent(existingStudent);

        return res.status(200).json({
          success: true,
          message: "Account already pending. Fresh OTP sent.",
          studentId: existingStudent._id,
          email: existingStudent.email,
          mobile: existingStudent.mobile,
          requiresOtpVerification: true,
          resendAfterSeconds: OTP_RESEND_SECONDS,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Ye email ya mobile already registered hai",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const studentCount = await Student.countDocuments();
    const studentId = `AGI${String(100001 + studentCount).padStart(6, "0")}`;

    const finalSubjects = Array.isArray(subjects)
      ? subjects
      : Array.isArray(selectedSubjects)
      ? selectedSubjects
      : [];

    const finalTotalFees = Number(totalFees || 0);
    const finalPaidAmount = Number(paidAmount || 0);
    const finalDueAmount =
      dueAmount !== undefined
        ? Number(dueAmount || 0)
        : Math.max(finalTotalFees - finalPaidAmount, 0);

    const finalPhoto = photo || photoUrl || "";

    const student = await Student.create({
      studentId,
      fullName,
      name: fullName,
      fatherName,
      motherName,
      email: cleanEmail,
      mobile: cleanMobile,
      phone: cleanMobile,
      parentPhone: parentPhone || "",
      emergencyContact: emergencyContact || parentPhone || "",
      password: hashedPassword,
      className,
      classLevel: className,
      course: course || className,
      subjectStream: subjectStream || "N/A",
      subjects: finalSubjects,
      selectedSubjects: finalSubjects,
      subjectCount: finalSubjects.length,
      address,
      dob: dob || "",
      gender: gender || "",
      profileImage: finalPhoto,
      photo: finalPhoto,
      photoUrl: finalPhoto,
      role: "student",

      isEmailVerified: false,
      isMobileVerified: false,
      verificationStatus: "pending",

      feesPaid: finalDueAmount === 0,

      fees: {
        total: finalTotalFees,
        paid: finalPaidAmount,
        due: finalDueAmount,
        status: finalDueAmount === 0 ? "Paid" : "Pending",
        paymentMode: paymentMode || "Cash",
        receiptNo: receiptNo || "",
        lastPaymentDate:
          finalPaidAmount > 0 ? new Date().toLocaleDateString() : "",
        paymentHistory:
          finalPaidAmount > 0
            ? [
                {
                  receiptNo: receiptNo || "",
                  amount: finalPaidAmount,
                  mode: paymentMode || "Cash",
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                },
              ]
            : [],
      },

      attendancePercentage: 0,
      totalClasses: 0,
      attendedClasses: 0,
      attendance: {
        totalPresent: 0,
        totalAbsent: 0,
        lastStatus: "Not marked",
        lastDate: "",
      },
      result: {
        exam: "",
        marks: "",
        total: "",
        grade: "",
        remarks: "",
      },
      qrEnabled: true,
      isOnline: false,
      status: "active",
    });

    await sendFreshOtpToStudent(student);

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent.",
      studentId: student._id,
      email: cleanEmail,
      mobile: cleanMobile,
      requiresOtpVerification: true,
      resendAfterSeconds: OTP_RESEND_SECONDS,
    });
  } catch (error) {
    console.log("REGISTER STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= VERIFY OTP =================

exports.verifyStudentOtp = async (req, res) => {
  try {
    const { studentId, email, mobile, emailOtp, mobileOtp } = req.body;

    const query = studentId
      ? { _id: studentId }
      : email
      ? { email: String(email).toLowerCase().trim() }
      : mobile
      ? { mobile: String(mobile).trim() }
      : null;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Student ID, email or mobile required",
      });
    }

    const student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (
      student.otpBlockedUntil &&
      new Date(student.otpBlockedUntil).getTime() > Date.now()
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Please try again later.",
      });
    }

    if (!emailOtp || !mobileOtp) {
      return res.status(400).json({
        success: false,
        message: "Email OTP and Mobile OTP both are required",
      });
    }

    if (isExpired(student.emailOtpExpiresAt) || isExpired(student.mobileOtpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please resend OTP.",
      });
    }

    const emailOtpMatched = hashOtp(emailOtp) === student.emailOtpHash;
    const mobileOtpMatched = hashOtp(mobileOtp) === student.mobileOtpHash;

    if (!emailOtpMatched || !mobileOtpMatched) {
      student.emailOtpAttempts += emailOtpMatched ? 0 : 1;
      student.mobileOtpAttempts += mobileOtpMatched ? 0 : 1;

      if (
        student.emailOtpAttempts >= OTP_MAX_ATTEMPTS ||
        student.mobileOtpAttempts >= OTP_MAX_ATTEMPTS
      ) {
        student.otpBlockedUntil = addMinutes(15);
      }

      await student.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    student.isEmailVerified = true;
    student.isMobileVerified = true;
    student.verificationStatus = "verified";

    student.emailOtpHash = "";
    student.mobileOtpHash = "";
    student.emailOtpExpiresAt = null;
    student.mobileOtpExpiresAt = null;
    student.emailOtpAttempts = 0;
    student.mobileOtpAttempts = 0;
    student.emailOtpResendAfter = null;
    student.mobileOtpResendAfter = null;
    student.otpBlockedUntil = null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Account activated.",
      student: makeSafeStudent(student),
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= RESEND OTP =================

exports.resendStudentOtp = async (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;

    const query = studentId
      ? { _id: studentId }
      : email
      ? { email: String(email).toLowerCase().trim() }
      : mobile
      ? { mobile: String(mobile).trim() }
      : null;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Student ID, email or mobile required",
      });
    }

    const student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.isEmailVerified && student.isMobileVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    if (
      student.emailOtpResendAfter &&
      new Date(student.emailOtpResendAfter).getTime() > Date.now()
    ) {
      const waitSeconds = Math.ceil(
        (new Date(student.emailOtpResendAfter).getTime() - Date.now()) / 1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} seconds before resending OTP`,
        waitSeconds,
      });
    }

    await sendFreshOtpToStudent(student);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      resendAfterSeconds: OTP_RESEND_SECONDS,
    });
  } catch (error) {
    console.log("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= LOGIN STUDENT =================

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email || "").toLowerCase().trim();

    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!student.isEmailVerified || !student.isMobileVerified) {
      await sendFreshOtpToStudent(student);

      return res.status(403).json({
        success: false,
        message: "Please verify email and mobile OTP before login",
        requiresOtpVerification: true,
        studentId: student._id,
        email: student.email,
        mobile: student.mobile,
      });
    }

    if (student.verificationStatus === "blocked" || student.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked or inactive. Please contact admin.",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: student.role,
      },
      process.env.JWT_SECRET || "apnagyanshala_secret_key",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: makeSafeStudent(student),
    });
  } catch (error) {
    console.log("LOGIN STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};