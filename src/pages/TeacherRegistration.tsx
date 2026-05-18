import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Loader2,
  Phone,
  BookOpen,
  GraduationCap,
  Home,
  Image,
  CalendarDays,
  Droplet,
  CreditCard,
  Users,
  PenLine,
  IndianRupee,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import Logo from "../components/Logo";

export default function TeacherRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    alternatePhone: "",
    qualification: "",
    subject: "",
    experience: "",
    address: "",
    aadhaar: "",
    pan: "",
    joiningDate: "",
    salary: "",
    bloodGroup: "",
    photo: "",
    signature: "",
    password: "",
    confirmPassword: "",
  });

  const generateTeacherId = () => {
    return `AGT${Date.now().toString().slice(-6)}`;
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photo" | "signature"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      e.target.value = "";
      return;
    }

    const sizeKB = file.size / 1024;

    if (sizeKB < 5 || sizeKB > 100) {
      toast.error("Image size 5KB se 100KB ke beech honi chahiye");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result as string,
      }));

      toast.success(field === "photo" ? "Photo uploaded ✅" : "Signature uploaded ✅");
    };

    reader.readAsDataURL(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = formData.email.toLowerCase().trim();
    const cleanPhone = formData.phone.trim();
    const cleanAltPhone = formData.alternatePhone.trim();
    const cleanAadhaar = formData.aadhaar.trim();
    const cleanPan = formData.pan.trim().toUpperCase();

    if (!formData.name.trim()) {
      toast.error("Teacher name enter karo");
      return;
    }

    if (!formData.fatherName.trim()) {
      toast.error("Father name enter karo");
      return;
    }

    if (!formData.motherName.trim()) {
      toast.error("Mother name enter karo");
      return;
    }

    if (!formData.dob) {
      toast.error("DOB select karo");
      return;
    }

    if (!formData.gender) {
      toast.error("Gender select karo");
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

    if (cleanAltPhone && !/^[6-9]\d{9}$/.test(cleanAltPhone)) {
      toast.error("Valid alternate mobile number enter karo");
      return;
    }

    if (!formData.qualification.trim()) {
      toast.error("Qualification enter karo");
      return;
    }

    if (!formData.subject.trim()) {
      toast.error("Teaching subject enter karo");
      return;
    }

    if (!formData.experience.trim()) {
      toast.error("Experience enter karo");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address enter karo");
      return;
    }

    if (!/^\d{12}$/.test(cleanAadhaar)) {
      toast.error("Valid 12 digit Aadhaar number enter karo");
      return;
    }

    if (cleanPan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      toast.error("Valid PAN number enter karo");
      return;
    }

    if (!formData.joiningDate) {
      toast.error("Joining date select karo");
      return;
    }

    if (!formData.salary.trim()) {
      toast.error("Salary enter karo");
      return;
    }

    if (!formData.bloodGroup) {
      toast.error("Blood group select karo");
      return;
    }

    if (!formData.photo) {
      toast.error("Teacher photo upload karo");
      return;
    }

    if (!formData.signature) {
      toast.error("Teacher signature upload karo");
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        formData.password
      );

      const user = userCredential.user;
      const teacherId = generateTeacherId();

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        teacherId,

        name: formData.name.trim(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
        dob: formData.dob,
        gender: formData.gender,

        email: cleanEmail,
        phone: cleanPhone,
        alternatePhone: cleanAltPhone,

        qualification: formData.qualification.trim(),
        subject: formData.subject.trim(),
        experience: formData.experience.trim(),
        address: formData.address.trim(),

        aadhaar: cleanAadhaar,
        pan: cleanPan || "N/A",
        joiningDate: formData.joiningDate,
        salary: formData.salary.trim(),
        bloodGroup: formData.bloodGroup,

        photo: formData.photo,
        signature: formData.signature,

        role: "teacher",
        status: "active",

        // OTP verification status: real OTP send/verify ke liye Firebase Functions ya backend lagega.
        emailVerified: false,
        phoneVerified: false,
        verificationStatus: "pending",

        assignedClasses: [],
        assignedStudents: [],
        totalClasses: 0,
        completedClasses: 0,

        attendance: {
          totalPresent: 0,
          totalAbsent: 0,
          lastStatus: "Not marked",
          lastDate: "N/A",
        },

        salaryPaid: false,
        salaryStatus: "Pending",
        salaryPayment: {
          monthlySalary: Number(formData.salary.trim()),
          paidAmount: 0,
          dueAmount: Number(formData.salary.trim()),
          paymentMode: "N/A",
          paymentMonth: "N/A",
          lastUpdated: "N/A",
        },
        salaryHistory: [],

        qrEnabled: true,
        idCardEnabled: true,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Teacher Registration Successful ✅");
      navigate("/login/teacher");
    } catch (error: any) {
      console.error("Teacher Registration Error:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered hai");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password weak hai");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Email valid nahi hai");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/"
        className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors font-bold tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>

      <div className="mx-auto w-full max-w-3xl h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>

        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>

          <div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tighter leading-none">
              TEACHER REGISTRATION
            </h1>

            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
              Faculty Enrollment + ID Card Details
            </p>
          </div>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <SectionTitle title="Personal Details" />

          <InputField
            icon={User}
            label="Teacher Full Name"
            value={formData.name}
            placeholder="Teacher full name"
            onChange={(value) => setFormData({ ...formData, name: value })}
          />

          <InputField
            icon={Users}
            label="Father Name"
            value={formData.fatherName}
            placeholder="Father name"
            onChange={(value) => setFormData({ ...formData, fatherName: value })}
          />

          <InputField
            icon={Users}
            label="Mother Name"
            value={formData.motherName}
            placeholder="Mother name"
            onChange={(value) => setFormData({ ...formData, motherName: value })}
          />

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Date of Birth
            </label>

            <div className="relative">
              <CalendarDays
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Gender
            </label>

            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <InputField
            icon={Phone}
            label="Mobile Number"
            value={formData.phone}
            placeholder="10 digit mobile"
            maxLength={10}
            onChange={(value) =>
              setFormData({
                ...formData,
                phone: value.replace(/\D/g, ""),
              })
            }
          />

          <InputField
            icon={Phone}
            label="Alternate Mobile"
            value={formData.alternatePhone}
            placeholder="Optional alternate number"
            maxLength={10}
            onChange={(value) =>
              setFormData({
                ...formData,
                alternatePhone: value.replace(/\D/g, ""),
              })
            }
          />

          <InputField
            icon={Mail}
            label="Email Address"
            type="email"
            value={formData.email}
            placeholder="teacher@gyanshala.edu"
            onChange={(value) =>
              setFormData({ ...formData, email: value.toLowerCase() })
            }
          />

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Blood Group
            </label>

            <div className="relative">
              <Droplet
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <select
                required
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <SectionTitle title="Academic / Job Details" />

          <InputField
            icon={GraduationCap}
            label="Qualification"
            value={formData.qualification}
            placeholder="B.Ed / M.Sc / MCA etc"
            onChange={(value) =>
              setFormData({ ...formData, qualification: value })
            }
          />

          <InputField
            icon={BookOpen}
            label="Teaching Subject"
            value={formData.subject}
            placeholder="Mathematics / Physics etc"
            onChange={(value) => setFormData({ ...formData, subject: value })}
          />

          <InputField
            icon={CalendarDays}
            label="Experience"
            value={formData.experience}
            placeholder="2 Years / 5 Years"
            onChange={(value) =>
              setFormData({ ...formData, experience: value })
            }
          />

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Joining Date
            </label>

            <input
              type="date"
              required
              value={formData.joiningDate}
              onChange={(e) =>
                setFormData({ ...formData, joiningDate: e.target.value })
              }
              className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <InputField
            icon={IndianRupee}
            label="Salary"
            value={formData.salary}
            placeholder="Monthly salary"
            onChange={(value) =>
              setFormData({
                ...formData,
                salary: value.replace(/[^\d]/g, ""),
              })
            }
          />

          <InputField
            icon={CreditCard}
            label="Aadhaar Number"
            value={formData.aadhaar}
            placeholder="12 digit Aadhaar"
            maxLength={12}
            onChange={(value) =>
              setFormData({
                ...formData,
                aadhaar: value.replace(/\D/g, ""),
              })
            }
          />

          <InputField
            icon={CreditCard}
            label="PAN Number"
            value={formData.pan}
            placeholder="Optional PAN"
            maxLength={10}
            onChange={(value) =>
              setFormData({
                ...formData,
                pan: value.toUpperCase(),
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
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Full address"
                className="w-full resize-none border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <SectionTitle title="Photo / Signature" />

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Teacher Photo
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
                onChange={(e) => handleImageUpload(e, "photo")}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {formData.photo && (
              <img
                src={formData.photo}
                alt="Teacher Preview"
                className="mt-3 h-28 w-24 border-2 border-indigo-900 object-cover"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Signature Photo
            </label>

            <div className="relative">
              <PenLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleImageUpload(e, "signature")}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {formData.signature && (
              <img
                src={formData.signature}
                alt="Signature Preview"
                className="mt-3 h-16 w-40 border-2 border-indigo-900 object-contain bg-white"
              />
            )}
          </div>

          <SectionTitle title="Login Details" />

          <InputField
            icon={Lock}
            label="Password"
            type="password"
            value={formData.password}
            placeholder="••••••••"
            onChange={(value) => setFormData({ ...formData, password: value })}
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

          <button
            type="submit"
            disabled={isLoading}
            className="sm:col-span-2 flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all tracking-widest shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "REGISTER TEACHER"
            )}
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest">
            Already registered?{" "}
            <Link
              to="/login/teacher"
              className="text-indigo-600 underline underline-offset-4 hover:text-indigo-800"
            >
              Teacher Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="sm:col-span-2 border-t border-slate-200 pt-6">
      <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">
        {title}
      </h2>
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
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
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
          required={label !== "PAN Number" && label !== "Alternate Mobile"}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}