const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

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
      $or: [
        { email: cleanEmail },
        { mobile: cleanMobile },
        { phone: cleanMobile },
      ],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const safeStudent = student.toObject();
    delete safeStudent.password;

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: safeStudent,
    });
  } catch (error) {
    console.log("REGISTER STUDENT ERROR:", error);

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

    const safeStudent = student.toObject();
    delete safeStudent.password;

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

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: safeStudent,
    });
  } catch (error) {
    console.log("LOGIN STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};