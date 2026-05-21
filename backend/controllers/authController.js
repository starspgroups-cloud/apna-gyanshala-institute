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

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const addMinutes = (minutes) => new Date(Date.now() + minutes * 60 * 1000);
const addSeconds = (seconds) => new Date(Date.now() + seconds * 1000);

const isExpired = (date) => !date || new Date(date).getTime() < Date.now();

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();
const normalizeMobile = (mobile) =>
  String(mobile || "").replace(/\D/g, "").trim();

const defaultAttendance = {
  totalPresent: 0,
  totalAbsent: 0,
  lastStatus: "Not marked",
  lastDate: "",
};

const makeSafeStudent = (student) => {
  const safeStudent = student?.toObject
    ? student.toObject()
    : { ...(student || {}) };

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

// ================= BREVO API EMAIL =================

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmailOtp = async ({ email, fullName, otp }) => {
  if (!process.env.BREVO_API_KEY) {
    console.log("⚠️ BREVO_API_KEY missing. Email OTP:", otp);
    return;
  }

  console.log(`📧 Email OTP for ${email}: ${otp}`);

  const mail = {
    sender: {
      name: process.env.SMTP_FROM_NAME || "Apna Gyanshala",
      email: process.env.SMTP_FROM_EMAIL || "starspgroups@gmail.com",
    },
    to: [
      {
        email,
        name: fullName || "Student",
      },
    ],
    subject: "Apna Gyanshala OTP Verification",
    htmlContent: `
      <div style="font-family:Arial;background:#f4f7fb;padding:30px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb">
          <div style="background:#312e81;padding:24px;text-align:center">
            <h1 style="margin:0;color:#fff;font-size:26px">APNA GYANSHALA</h1>
            <p style="margin:8px 0 0;color:#facc15;font-weight:bold">Secure OTP Verification</p>
          </div>

          <div style="padding:34px">
            <h2 style="color:#111827;margin-top:0">Hello ${
              fullName || "Student"
            },</h2>
            <p style="font-size:15px;color:#374151;line-height:1.7">Your verification OTP is:</p>

            <div style="font-size:42px;font-weight:900;letter-spacing:10px;text-align:center;color:#312e81;margin:30px 0">
              ${otp}
            </div>

            <p style="color:#dc2626;font-weight:bold">
              This OTP is valid for ${OTP_EXPIRE_MINUTES} minutes only.
            </p>

            <p style="font-size:13px;color:#6b7280;line-height:1.6">
              Do not share this OTP with anyone.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transactionalEmailApi.sendTransacEmail(mail);

  console.log("✅ BREVO API EMAIL OTP SENT");
};

// ================= OTP ENGINE =================

const sendFreshOtpToStudent = async (student) => {
  const emailOtp = createOtp();

  const otpUpdate = {
    emailOtpHash: hashOtp(emailOtp),
    emailOtpExpiresAt: addMinutes(OTP_EXPIRE_MINUTES),
    emailOtpAttempts: 0,
    emailOtpResendAfter: addSeconds(OTP_RESEND_SECONDS),
    lastOtpSentAt: new Date(),
    otpBlockedUntil: null,
    verificationStatus: "pending",
  };

  await Student.updateOne({ _id: student._id }, { $set: otpUpdate });

  Object.assign(student, otpUpdate);

  await sendEmailOtp({
    email: student.email,
    fullName: student.fullName || student.name,
    otp: emailOtp,
  });
};

const buildStudentQuery = ({ studentId, email, mobile }) => {
  if (studentId) return { _id: studentId };
  if (email) return { email: normalizeEmail(email) };
  if (mobile) return { mobile: normalizeMobile(mobile) };
  return null;
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

    const cleanEmail = normalizeEmail(email);
    const cleanMobile = normalizeMobile(mobile);

    if (
      !fullName ||
      !fatherName ||
      !motherName ||
      !cleanEmail ||
      !cleanMobile ||
      !password ||
      !className ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10 digit mobile number required",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [
        { email: cleanEmail },
        { mobile: cleanMobile },
        { phone: cleanMobile },
      ],
    });

    if (existingStudent) {
      if (!existingStudent.isEmailVerified) {
        await sendFreshOtpToStudent(existingStudent);

        return res.status(200).json({
          success: true,
          message: "Account already pending. Fresh Email OTP sent.",
          studentId: existingStudent._id,
          email: existingStudent.email,
          mobile: existingStudent.mobile || existingStudent.phone,
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

      fullName: String(fullName).trim(),
      name: String(fullName).trim(),

      fatherName: String(fatherName).trim(),
      motherName: String(motherName).trim(),

      email: cleanEmail,

      mobile: cleanMobile,
      phone: cleanMobile,

      parentPhone: normalizeMobile(parentPhone),
      emergencyContact: normalizeMobile(emergencyContact || parentPhone),

      password: hashedPassword,

      className,
      classLevel: className,
      course: course || className,
      subjectStream: subjectStream || "N/A",

      subjects: finalSubjects,
      selectedSubjects: finalSubjects,
      subjectCount: finalSubjects.length,

      address: String(address).trim(),
      dob: dob || "",
      gender: gender || "",

      profileImage: finalPhoto,
      photo: finalPhoto,
      photoUrl: finalPhoto,

      role: "student",

      isEmailVerified: false,
      isMobileVerified: true,
      verificationStatus: "pending",

      attendancePercentage: 0,
      totalClasses: 0,
      attendedClasses: 0,
      attendance: defaultAttendance,

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
      message: "Registration successful. Email OTP sent.",
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

// ================= VERIFY STUDENT OTP =================

exports.verifyStudentOtp = async (req, res) => {
  try {
    const { studentId, email, mobile, emailOtp } = req.body;

    const query = buildStudentQuery({ studentId, email, mobile });

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

    if (!emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Email OTP required",
      });
    }

    if (isExpired(student.emailOtpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please resend OTP.",
      });
    }

    const emailOtpMatched = hashOtp(emailOtp) === student.emailOtpHash;

    if (!emailOtpMatched) {
      const nextEmailAttempts = Number(student.emailOtpAttempts || 0) + 1;

      const blockUntil =
        nextEmailAttempts >= OTP_MAX_ATTEMPTS
          ? addMinutes(OTP_BLOCK_MINUTES)
          : null;

      await Student.updateOne(
        { _id: student._id },
        {
          $set: {
            emailOtpAttempts: nextEmailAttempts,
            otpBlockedUntil: blockUntil,
          },
        }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Email OTP",
      });
    }

    await Student.updateOne(
      { _id: student._id },
      {
        $set: {
          isEmailVerified: true,
          isMobileVerified: true,
          verificationStatus: "verified",
          emailOtpHash: "",
          mobileOtpHash: "",
          emailOtpExpiresAt: null,
          mobileOtpExpiresAt: null,
          emailOtpAttempts: 0,
          mobileOtpAttempts: 0,
          emailOtpResendAfter: null,
          mobileOtpResendAfter: null,
          otpBlockedUntil: null,
        },
      }
    );

    const verifiedStudent = await Student.findById(student._id);

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
      student: makeSafeStudent(verifiedStudent),
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ================= RESEND STUDENT OTP =================

exports.resendStudentOtp = async (req, res) => {
  try {
    const { studentId, email, mobile } = req.body;

    const query = buildStudentQuery({ studentId, email, mobile });

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

    if (student.isEmailVerified) {
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
      message: "Email OTP resent successfully",
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

    const cleanEmail = normalizeEmail(email);

    const student = await Student.findOne({ email: cleanEmail });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password || "", student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!student.isEmailVerified) {
      await sendFreshOtpToStudent(student);

      return res.status(403).json({
        success: false,
        message: "Please verify email OTP before login",
        requiresOtpVerification: true,
        studentId: student._id,
        email: student.email,
        mobile: student.mobile || student.phone,
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