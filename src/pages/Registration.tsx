import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  BookOpen,
  Loader2,
  Phone,
  Image,
  Home,
  Users,
  IndianRupee,
  Receipt,
  CalendarCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import Logo from "../components/Logo";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    emergencyContact: "",
    address: "",
    photo: "",
    password: "",
    confirmPassword: "",
    course: "",
    classLevel: "",
    subjectStream: "",
    selectedSubjects: [] as string[],
    totalFees: "",
    paidAmount: "",
    paymentMode: "Cash",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const generateReceiptNo = () => {
    return `AGR${Date.now().toString().slice(-8)}`;
  };

  const CLASS_OPTIONS = [
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "UG Part-1",
    "UG Part-2",
    "UG Part-3",
    "UG Part-4",
  ];

  const SCHOOL_SUBJECTS_5_TO_8 = [
    "Hindi",
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Sanskrit",
    "Computer",
    "General Knowledge",
    "Moral Science",
    "Drawing / Art",
  ];

  const SCHOOL_SUBJECTS_9_TO_10 = [
    "Hindi",
    "English",
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Social Science",
    "History",
    "Geography",
    "Civics / Political Science",
    "Economics",
    "Sanskrit",
    "Computer Applications",
    "Information Technology",
    "Artificial Intelligence",
    "Home Science",
    "Physical Education",
  ];

  const STREAM_SUBJECTS: Record<string, string[]> = {
    Science: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "English",
      "Hindi",
      "Computer Science",
      "Informatics Practices",
      "Physical Education",
      "Economics",
      "Psychology",
      "Environmental Science",
    ],
    Commerce: [
      "Accountancy",
      "Business Studies",
      "Economics",
      "English",
      "Hindi",
      "Mathematics",
      "Applied Mathematics",
      "Entrepreneurship",
      "Informatics Practices",
      "Computer Science",
      "Physical Education",
    ],
    Arts: [
      "History",
      "Geography",
      "Political Science",
      "Economics",
      "Sociology",
      "Psychology",
      "Philosophy",
      "Home Science",
      "Hindi",
      "English",
      "Sanskrit",
      "Music",
      "Fine Arts",
      "Physical Education",
    ],
    Vocational: [
      "Information Technology",
      "Retail",
      "Healthcare",
      "Banking",
      "Insurance",
      "Agriculture",
      "Tourism",
      "Beauty and Wellness",
      "Automobile",
      "Electronics",
      "English",
      "Hindi",
    ],
  };

  const UG_SUBJECTS: Record<string, string[]> = {
    "BA Honours / Arts Major": [
      "Hindi Honours",
      "English Honours",
      "Sanskrit Honours",
      "Urdu Honours",
      "Maithili Honours",
      "Bengali Honours",
      "History Honours",
      "Political Science Honours",
      "Geography Honours",
      "Economics Honours",
      "Sociology Honours",
      "Psychology Honours",
      "Philosophy Honours",
      "Home Science Honours",
      "Education Honours",
      "Public Administration Honours",
      "Music Honours",
      "Fine Arts Honours",
      "Ancient History Honours",
      "Rural Development Honours",
      "Social Work Honours",
      "Journalism and Mass Communication Honours",
    ],
    "BSc Honours / Science Major": [
      "Mathematics Honours",
      "Physics Honours",
      "Chemistry Honours",
      "Botany Honours",
      "Zoology Honours",
      "Statistics Honours",
      "Computer Science Honours",
      "Information Technology Honours",
      "Biotechnology Honours",
      "Microbiology Honours",
      "Environmental Science Honours",
      "Geology Honours",
      "Electronics Honours",
      "Agriculture Honours",
      "Food Science Honours",
      "Forensic Science Honours",
      "Data Science Honours",
    ],
    "BCom Honours / Commerce Major": [
      "Accountancy Honours",
      "Commerce Honours",
      "Business Studies Honours",
      "Business Administration Honours",
      "Business Law Honours",
      "Business Mathematics Honours",
      "Economics Honours",
      "Finance Honours",
      "Banking Honours",
      "Taxation Honours",
      "Auditing Honours",
      "Management Honours",
      "Marketing Honours",
      "Entrepreneurship Honours",
      "Computer Applications in Commerce Honours",
    ],
    "Professional UG Courses": [
      "BCA - Bachelor of Computer Applications",
      "BBA - Bachelor of Business Administration",
      "BBM - Bachelor of Business Management",
      "BMS - Bachelor of Management Studies",
      "B.Ed - Bachelor of Education",
      "D.El.Ed",
      "B.Tech Computer Science",
      "B.Tech Civil Engineering",
      "B.Tech Mechanical Engineering",
      "B.Tech Electrical Engineering",
      "B.Tech Electronics Engineering",
      "B.Tech Information Technology",
      "B.Sc Nursing",
      "B.Pharm",
      "D.Pharm",
      "LLB",
      "BA LLB",
      "B.Com LLB",
      "BHM - Hotel Management",
      "B.Des - Design",
      "BFA - Fine Arts",
      "BPT - Physiotherapy",
      "BMLT - Medical Lab Technology",
      "B.Sc Radiology",
      "B.Sc Agriculture",
      "B.Sc Fisheries",
      "B.Sc Forestry",
    ],
  };

  const getSubjectList = () => {
    if (!formData.classLevel) return [];

    if (["Class 5", "Class 6", "Class 7", "Class 8"].includes(formData.classLevel)) {
      return SCHOOL_SUBJECTS_5_TO_8;
    }

    if (["Class 9", "Class 10"].includes(formData.classLevel)) {
      return SCHOOL_SUBJECTS_9_TO_10;
    }

    if (["Class 11", "Class 12"].includes(formData.classLevel)) {
      return formData.subjectStream ? STREAM_SUBJECTS[formData.subjectStream] || [] : [];
    }

    if (formData.classLevel.startsWith("UG")) {
      return formData.subjectStream ? UG_SUBJECTS[formData.subjectStream] || [] : [];
    }

    return [];
  };

  const needsStreamSelection = () => {
    return (
      ["Class 11", "Class 12"].includes(formData.classLevel) ||
      formData.classLevel.startsWith("UG")
    );
  };

  const getStreamOptions = () => {
    if (["Class 11", "Class 12"].includes(formData.classLevel)) {
      return Object.keys(STREAM_SUBJECTS);
    }

    if (formData.classLevel.startsWith("UG")) {
      return Object.keys(UG_SUBJECTS);
    }

    return [];
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedSubjects.includes(subject);

      return {
        ...prev,
        selectedSubjects: alreadySelected
          ? prev.selectedSubjects.filter((item) => item !== subject)
          : [...prev.selectedSubjects, subject],
      };
    });
  };


  const getCourseFees = (classLevel: string) => {
    if (["Class 5", "Class 6", "Class 7", "Class 8"].includes(classLevel)) return 999;
    if (["Class 9", "Class 10", "Class 11", "Class 12"].includes(classLevel)) return 1799;
    if (classLevel.startsWith("UG")) return 2999;
    return 0;
  };

  const handleCourseChange = (classLevel: string) => {
    const fees = getCourseFees(classLevel);

    setFormData({
      ...formData,
      classLevel,
      course: classLevel,
      subjectStream: "",
      selectedSubjects: [],
      totalFees: fees ? String(fees) : "",
      paidAmount: "",
    });
  };

  const handleStreamChange = (subjectStream: string) => {
    setFormData({
      ...formData,
      subjectStream,
      selectedSubjects: [],
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    const sizeKB = file.size / 1024;
    if (sizeKB < 5 || sizeKB > 50) {
      toast.error("Photo size 5KB se 50KB ke beech honi chahiye");
      e.target.value = "";
      return;
    }

    const img = document.createElement("img");

    img.onload = () => {
      if (img.width !== 300 || img.height !== 350) {
        toast.error("Photo exactly 300px × 350px honi chahiye");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));

        toast.success("Photo selected successfully");
      };

      reader.readAsDataURL(file);
    };

    img.src = URL.createObjectURL(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formData.name.trim();
    const cleanDob = formData.dob;
    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanPhone = formData.phone.trim();
    const cleanFatherName = formData.fatherName.trim();
    const cleanMotherName = formData.motherName.trim();
    const cleanParentPhone = formData.parentPhone.trim();
    const cleanEmergencyContact = formData.emergencyContact.trim();
    const cleanAddress = formData.address.trim();

    const registerTotalFees = Number(formData.totalFees || 0);
    const registerPaidAmount = Number(formData.paidAmount || 0);
    const registerDueAmount = Math.max(registerTotalFees - registerPaidAmount, 0);
    const receiptNo = generateReceiptNo();

    if (!cleanName) {
      toast.error("Full name enter karo");
      return;
    }

    if (!cleanDob) {
      toast.error("Date of birth select karo");
      return;
    }

    if (!cleanEmail) {
      toast.error("Email enter karo");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Valid 10 digit mobile number enter karo");
      return;
    }

    if (!cleanFatherName) {
      toast.error("Father name enter karo");
      return;
    }

    if (!cleanMotherName) {
      toast.error("Mother name enter karo");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanParentPhone)) {
      toast.error("Valid parent mobile number enter karo");
      return;
    }

    if (cleanEmergencyContact && !/^[6-9]\d{9}$/.test(cleanEmergencyContact)) {
      toast.error("Valid emergency contact number enter karo");
      return;
    }

    if (!cleanAddress) {
      toast.error("Full address enter karo");
      return;
    }

    if (!formData.classLevel) {
      toast.error("Class / Program select karo");
      return;
    }

    if (needsStreamSelection() && !formData.subjectStream) {
      toast.error("Stream / Honours type select karo");
      return;
    }

    if (formData.selectedSubjects.length === 0) {
      toast.error("Kam se kam ek subject select karo");
      return;
    }

    if (registerTotalFees <= 0) {
      toast.error("Total fees valid nahi hai");
      return;
    }

    if (registerPaidAmount < 0 || registerPaidAmount > registerTotalFees) {
      toast.error("Paid amount total fees se zyada nahi ho sakta");
      return;
    }

    if (!formData.photo) {
      toast.error("Student photo upload karo");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords match nahi kar rahe");
      return;
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(formData.password)) {
      toast.error(
        "Password me uppercase, lowercase, number aur special character hona chahiye"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        fullName: cleanName,
        fatherName: cleanFatherName,
        motherName: cleanMotherName,
        email: cleanEmail,
        mobile: cleanPhone,
        password: formData.password,
        className: formData.classLevel,
        course: formData.course,
        subjectStream: formData.subjectStream || "N/A",
        subjects: formData.selectedSubjects,
        selectedSubjects: formData.selectedSubjects,
        address: cleanAddress,
        dob: cleanDob,
        gender: "",
        parentPhone: cleanParentPhone,
        emergencyContact: cleanEmergencyContact || cleanParentPhone,
        photo: formData.photo,
        photoUrl: formData.photo,
        totalFees: registerTotalFees,
        paidAmount: registerPaidAmount,
        dueAmount: registerDueAmount,
        paymentMode: formData.paymentMode,
        receiptNo,
      });

      const data = response.data;

      if (!data?.success) {
        toast.error(data?.message || "Registration failed");
        return;
      }

      const pendingOtpData = {
        studentId: data.studentId,
        email: data.email || cleanEmail,
        mobile: data.mobile || cleanPhone,
      };

      localStorage.setItem("ag_pending_otp", JSON.stringify(pendingOtpData));

      toast.success(data?.message || "OTP sent successfully ✅");

      navigate("/verify-otp", {
        state: pendingOtpData,
        replace: true,
      });
    } catch (error: any) {
      console.error("Registration Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      if (message.toLowerCase().includes("already")) {
        toast.error("Ye email ya mobile already registered hai");
      } else if (message.toLowerCase().includes("network")) {
        toast.error("Backend server nahi chal raha. Pehle backend me npm run dev karo.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const totalFees = Number(formData.totalFees || 0);
  const paidAmount = Number(formData.paidAmount || 0);
  const dueAmount = Math.max(totalFees - paidAmount, 0);

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/"
        className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors font-bold tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>

      <div className="mx-auto w-full max-w-2xl h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>

        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>

          <div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tighter leading-none">
              GYANSHALA ENROLLMENT
            </h1>

            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
              Student + Parent + Fees Details Required
            </p>
          </div>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Student Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Student full name"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Date of Birth
            </label>

            <div className="relative">
              <CalendarCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: e.target.value,
                  })
                }
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Student Mobile
            </label>

            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="10 digit mobile number"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Student Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                placeholder="student@gyanshala.edu"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-2 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
              Parent / Guardian Details
            </h2>
          </div>

          <InputField
            icon={Users}
            label="Father Name"
            value={formData.fatherName}
            placeholder="Father name"
            onChange={(value) =>
              setFormData({ ...formData, fatherName: value })
            }
          />

          <InputField
            icon={Users}
            label="Mother Name"
            value={formData.motherName}
            placeholder="Mother name"
            onChange={(value) =>
              setFormData({ ...formData, motherName: value })
            }
          />

          <InputField
            icon={Phone}
            label="Parent Mobile"
            value={formData.parentPhone}
            placeholder="Parent mobile number"
            maxLength={10}
            onChange={(value) =>
              setFormData({
                ...formData,
                parentPhone: value.replace(/\D/g, ""),
              })
            }
          />

          <InputField
            icon={Phone}
            label="Emergency Contact"
            value={formData.emergencyContact}
            placeholder="Emergency contact optional"
            maxLength={10}
            required={false}
            onChange={(value) =>
              setFormData({
                ...formData,
                emergencyContact: value.replace(/\D/g, ""),
              })
            }
          />

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Full Address
            </label>

            <div className="relative">
              <Home className="absolute left-3 top-4 text-slate-400" size={16} />

              <textarea
                required
                rows={4}
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                placeholder="Village / Area / City / District / State / PIN"
                className="w-full resize-none border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-2 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
              Academic Details
            </h2>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Class / Graduation Level
            </label>

            <div className="relative">
              <BookOpen
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <select
                required
                value={formData.classLevel}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full appearance-none border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
              >
                <option value="">Select class / graduation level</option>
                {CLASS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                    {["Class 5", "Class 6", "Class 7", "Class 8"].includes(item)
                      ? " ₹999 PA"
                      : ["Class 9", "Class 10", "Class 11", "Class 12"].includes(item)
                      ? " ₹1799 PA"
                      : " ₹2999 PA"}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-2 text-[10px] font-bold text-slate-400">
              Class select karne ke baad subjects / honours automatically show honge.
            </p>
          </div>

          {formData.classLevel && needsStreamSelection() && (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
                Stream / Honours Type
              </label>

              <select
                required
                value={formData.subjectStream}
                onChange={(e) => handleStreamChange(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              >
                <option value="">Select stream / honours type</option>
                {getStreamOptions().map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.classLevel && getSubjectList().length > 0 && (
            <div className="sm:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-[10px] font-black text-slate-500 tracking-widest">
                  Choose Subjects / Honours
                </label>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-900">
                  Selected: {formData.selectedSubjects.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                {getSubjectList().map((subject) => {
                  const checked = formData.selectedSubjects.includes(subject);

                  return (
                    <label
                      key={subject}
                      className={`flex cursor-pointer items-center gap-3 border p-3 text-xs font-black uppercase tracking-wide transition-all ${
                        checked
                          ? "border-indigo-900 bg-indigo-900 text-white"
                          : "border-slate-200 bg-white text-indigo-900 hover:border-indigo-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubject(subject)}
                        className="h-4 w-4 accent-yellow-500"
                      />
                      {subject}
                    </label>
                  );
                })}
              </div>

              <p className="mt-2 text-[10px] font-bold text-slate-400">
                Student apne need ke hisab se subject ya honours choose kar sakta hai.
              </p>
            </div>
          )}

          <div className="sm:col-span-2 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
              One-Time Fees Details
            </h2>
          </div>

          <InputField
            icon={IndianRupee}
            label="Total Fees"
            value={formData.totalFees}
            placeholder="Auto set by program"
            readOnly
            onChange={() => {}}
          />

          <InputField
            icon={IndianRupee}
            label="Paid Amount"
            value={formData.paidAmount}
            placeholder="Enter paid amount"
            required={false}
            onChange={(value) =>
              setFormData({
                ...formData,
                paidAmount: value.replace(/[^\d]/g, ""),
              })
            }
          />

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Payment Mode
            </label>

            <select
              value={formData.paymentMode}
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
              className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Receipt size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Fees Summary
              </p>
            </div>

            <div className="mt-3 space-y-1 text-sm font-black text-indigo-900">
              <p>Total Fees: ₹{totalFees}</p>
              <p>Paid Amount: ₹{paidAmount}</p>
              <p>Due Amount: ₹{dueAmount}</p>
              <p>Status: {dueAmount === 0 ? "Paid" : "Pending"}</p>
            </div>
          </div>

          <div className="sm:col-span-2 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
              Login Details
            </h2>
          </div>

          <InputField
            icon={Lock}
            label="Password"
            type="password"
            value={formData.password}
            placeholder="••••••••"
            onChange={(value) =>
              setFormData({ ...formData, password: value })
            }
          />

          <InputField
            icon={Lock}
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            placeholder="••••••••"
            onChange={(value) =>
              setFormData({ ...formData, confirmPassword: value })
            }
          />

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Student Photo
            </label>

            <div className="relative">
              <Image
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="file"
                accept="image/*"
                required
                onChange={handlePhotoChange}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <p className="mt-2 text-[10px] font-bold text-slate-400">
              Photo exactly 300px × 350px aur size 5KB se 50KB honi chahiye.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sm:col-span-2 flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all tracking-widest shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "CONFIRM ENROLLMENT"
            )}
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest">
            Already have an account?{" "}
            <Link
              to="/login/student"
              className="text-indigo-600 underline underline-offset-4 hover:text-indigo-800"
            >
              Sign in to Hub
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  maxLength,
  required = true,
  readOnly = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
        {label}
      </label>

      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />

        <input
          type={type}
          required={required}
          value={value}
          maxLength={maxLength}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}