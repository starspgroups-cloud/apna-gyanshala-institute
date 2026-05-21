const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },

    fullName: { type: String, required: true },
    name: { type: String, default: "" },

    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    mobile: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },

    parentPhone: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },

    password: { type: String, required: true },

    className: { type: String, required: true },
    classLevel: { type: String, default: "" },
    course: { type: String, default: "" },
    subjectStream: { type: String, default: "N/A" },

    subjects: { type: [String], default: [] },
    selectedSubjects: { type: [String], default: [] },
    subjectCount: { type: Number, default: 0 },

    address: { type: String, required: true },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },

    profileImage: { type: String, default: "" },
    photo: { type: String, default: "" },
    photoUrl: { type: String, default: "" },

    role: { type: String, default: "student" },

    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "blocked"],
      default: "pending",
    },

    emailOtpHash: { type: String, default: "" },
    mobileOtpHash: { type: String, default: "" },

    emailOtpExpiresAt: { type: Date, default: null },
    mobileOtpExpiresAt: { type: Date, default: null },

    emailOtpAttempts: { type: Number, default: 0 },
    mobileOtpAttempts: { type: Number, default: 0 },

    emailOtpResendAfter: { type: Date, default: null },
    mobileOtpResendAfter: { type: Date, default: null },

    lastOtpSentAt: { type: Date, default: null },
    otpBlockedUntil: { type: Date, default: null },

    attendancePercentage: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },

    attendance: {
      totalPresent: { type: Number, default: 0 },
      totalAbsent: { type: Number, default: 0 },
      lastStatus: { type: String, default: "Not marked" },
      lastDate: { type: String, default: "" },
    },

    feesPaid: { type: Boolean, default: false },

    fees: {
      total: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, default: "Pending" },
      paymentMode: { type: String, default: "Cash" },
      receiptNo: { type: String, default: "" },
      lastPaymentDate: { type: String, default: "" },
      paymentHistory: { type: Array, default: [] },
    },

    result: {
      exam: { type: String, default: "" },
      marks: { type: String, default: "" },
      total: { type: String, default: "" },
      grade: { type: String, default: "" },
      remarks: { type: String, default: "" },
    },

    isOnline: { type: Boolean, default: false },
    qrEnabled: { type: Boolean, default: true },

    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
