import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import Logo from "../components/Logo";

type PendingOtpData = {
  studentId?: string;
  email?: string;
};

const getPendingOtpData = (state: any): PendingOtpData => {
  if (state?.studentId || state?.email) {
    return {
      studentId: state.studentId,
      email: state.email,
    };
  }

  try {
    const saved = localStorage.getItem("ag_pending_otp");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const pendingData = useMemo(
    () => getPendingOtpData(location.state),
    [location.state]
  );

  const [emailOtp, setEmailOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [counter, setCounter] = useState(60);

  const studentId = pendingData.studentId;
  const email = pendingData.email;

  useEffect(() => {
    if (!studentId && !email) {
      toast.error("Verification data missing. Please register again.");
      navigate("/register", { replace: true });
    }
  }, [studentId, email, navigate]);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = window.setTimeout(() => {
      setCounter((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [counter]);

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId && !email) {
      toast.error("Verification data missing. Please register again.");
      navigate("/register", { replace: true });
      return;
    }

    if (!/^\d{6}$/.test(emailOtp)) {
      toast.error("Email OTP 6 digit hona chahiye");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/verify-otp", {
        studentId,
        email,
        emailOtp,
      });

      if (res.data?.success) {
        localStorage.removeItem("ag_pending_otp");
        toast.success("Account verified successfully ✅");
        navigate("/login/student", { replace: true });
        return;
      }

      toast.error(res.data?.message || "OTP verification failed");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (counter > 0) {
      toast.error(`${counter} seconds wait karo`);
      return;
    }

    setResending(true);

    try {
      const res = await api.post("/api/auth/resend-otp", {
        studentId,
        email,
      });

      if (res.data?.success) {
        toast.success("Fresh OTP sent ✅");
        setEmailOtp("");
        setCounter(Number(res.data?.resendAfterSeconds || 60));
        return;
      }

      toast.error(res.data?.message || "OTP resend failed");
    } catch (error: any) {
      const waitSeconds = Number(error?.response?.data?.waitSeconds || 60);

      if (error?.response?.status === 429) {
        setCounter(waitSeconds);
      }

      toast.error(error?.response?.data?.message || "OTP resend failed");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/register"
        className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors font-bold tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> BACK TO REGISTRATION
      </Link>

      <div className="mx-auto w-full max-w-md h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-900">
            <ShieldCheck size={30} />
          </div>

          <h1 className="text-2xl font-black text-indigo-900 tracking-tight">
            VERIFY YOUR ACCOUNT
          </h1>

          <p className="mt-2 text-xs font-bold text-slate-500">
            Sirf Email OTP verification required hai
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-xs font-bold text-indigo-900">
          <p>Email: {email || "Registered email"}</p>

          <p className="mt-3 text-red-600">
            OTP aapke registered email par bheja gaya hai.
          </p>
        </div>

        <form onSubmit={verifyOtp} className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 tracking-widest">
              EMAIL OTP
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={emailOtp}
                onChange={(e) =>
                  setEmailOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6 digit email OTP"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-900 px-4 py-4 text-sm font-black tracking-widest text-white shadow-xl hover:bg-indigo-800 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : null}

            VERIFY ACCOUNT
          </button>
        </form>

        <button
          onClick={resendOtp}
          disabled={resending || counter > 0}
          className="mt-5 flex w-full items-center justify-center gap-2 border border-indigo-900 px-4 py-3 text-xs font-black tracking-widest text-indigo-900 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <RefreshCw size={16} />
          )}

          {counter > 0
            ? `RESEND OTP IN ${counter}s`
            : "RESEND OTP"}
        </button>
      </div>
    </div>
  );
}