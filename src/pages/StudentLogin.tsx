import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import Logo from "../components/Logo";
import { api, saveAuthData } from "../lib/api";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      toast.error("Email aur password enter karo");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: cleanEmail,
        password,
      });

      const data = response.data;

      if (!data?.success) {
        toast.error(data?.message || "Login failed");
        return;
      }

      const student = data.student;

      if (!student) {
        toast.error("Student profile nahi mila");
        return;
      }

      if (student.role !== "student") {
        toast.error("Student access denied");
        return;
      }

      if (student.status && student.status !== "active") {
        toast.error("Aapka account active nahi hai");
        return;
      }

      saveAuthData(data.token, student, "student");
      window.dispatchEvent(new Event("ag-auth-updated"));

      toast.success("Login Successful! Welcome back.");

      navigate("/student/dashboard");
    } catch (error: any) {
      console.error("Student Login Error:", error);

      const data = error?.response?.data;

      if (data?.requiresOtpVerification) {
        const pendingOtpData = {
          studentId: data.studentId,
          email: data.email || cleanEmail,
          mobile: data.mobile || "",
        };

        localStorage.setItem("ag_pending_otp", JSON.stringify(pendingOtpData));

        toast.error("Pehle OTP verify karo");
        navigate("/verify-otp", {
          state: pendingOtpData,
          replace: true,
        });
        return;
      }

      const message =
        data?.message ||
        error?.message ||
        "Login failed";

      if (message === "Student not found") {
        toast.error("Student account nahi mila");
      } else if (
        message === "Invalid credentials" ||
        message.toLowerCase().includes("invalid")
      ) {
        toast.error("Email ya password galat hai");
      } else if (message.toLowerCase().includes("network")) {
        toast.error("Backend server nahi chal raha. Pehle backend me npm run dev karo.");
      } else {
        toast.error(message);
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
          <div className="h-2 w-6 bg-indigo-900"></div>

          <div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tighter leading-none">
              STUDENT LOGIN
            </h1>

            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
              MongoDB Secure Access
            </p>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.toLowerCase())
                }
                placeholder="student@gyanshala.edu"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              Portal Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
                autoCapitalize="none"
                spellCheck={false}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all tracking-widest shadow-lg active:translate-y-px"
          >
            {isLoading ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              "LOGIN TO HUB"
            )}
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 underline underline-offset-4 hover:text-indigo-800"
            >
              Register as Student
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
