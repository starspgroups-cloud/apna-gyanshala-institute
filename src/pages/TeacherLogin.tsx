import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Loader2, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import Logo from "../components/Logo";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const saveTeacherSession = (user: any, userData: any, cleanEmail: string) => {
    const profile = {
      id: user?.uid || "teacher",
      uid: user?.uid || "teacher",
      ...userData,
      name: userData?.name || userData?.fullName || "Teacher",
      email: user?.email || cleanEmail,
      role: "teacher",
      status: userData?.status || "active",
      phone: userData?.phone || userData?.mobile || "N/A",
      photo: userData?.photo || userData?.photoUrl || userData?.profileImage || "",
      subject: userData?.subject || userData?.mainSubject || "N/A",
    };

    localStorage.setItem("ag_token", user?.uid || `teacher-${Date.now()}`);
    localStorage.setItem("ag_user_role", "teacher");
    localStorage.setItem("ag_user_uid", profile.uid);
    localStorage.setItem("ag_user_email", profile.email);
    localStorage.setItem("ag_user_data", JSON.stringify(profile));
    window.dispatchEvent(new Event("ag-auth-updated"));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      toast.error("Email aur password enter karo");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        toast.error("Teacher profile nahi mila");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== "teacher") {
        await signOut(auth);
        toast.error("Teacher access denied");
        return;
      }

      if (userData.status && userData.status !== "active") {
        await signOut(auth);
        toast.error("Teacher account active nahi hai");
        return;
      }

      saveTeacherSession(user, userData, cleanEmail);

      toast.success("Teacher Login Successful ✅");
      navigate("/teacher/dashboard");
    } catch (error: any) {
      console.error("Teacher Login Error:", error);

      if (error.code === "auth/user-not-found") {
        toast.error("Teacher account nahi mila");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Password galat hai");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Email ya password galat hai");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 pt-20">
      <Link
        to="/"
        className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors font-bold tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>

      <div className="mx-auto w-full max-w-md h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>

        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>

          <div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tighter leading-none">
              TEACHER LOGIN
            </h1>

            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
              Apna Gyanshala Faculty Access
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Teacher Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="teacher@gyanshala.edu"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full normal-case border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full normal-case border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all tracking-widest shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <GraduationCap size={18} />
                LOGIN TEACHER
              </>
            )}
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest">
            New teacher?{" "}
            <Link
              to="/register/teacher"
              className="text-indigo-600 underline underline-offset-4 hover:text-indigo-800"
            >
              Register as Teacher
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
