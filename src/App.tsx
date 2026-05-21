import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";

import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";

import Registration from "./pages/Registration";
import VerifyOtp from "./pages/VerifyOtp";
import TeacherRegistration from "./pages/TeacherRegistration";

import LiveClass from "./pages/LiveClass";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import HomeworkUpload from "./pages/HomeworkUpload";
import ExamUpload from "./pages/ExamUpload";
import StudentExam from "./pages/StudentExam";
import Leaderboard from "./pages/Leaderboard";
import Certificate from "./pages/Certificate";

import Courses from "./pages/Courses";
import Demo from "./pages/Demo";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Feedback from "./pages/Feedback";
import Careers from "./pages/Careers";

import ParentPortal from "./pages/ParentPortal";
import Timetable from "./pages/Timetable";
import Analytics from "./pages/Analytics";

import AIAssistant from "./components/AIAssistant";

type UserRole = "admin" | "student" | "teacher";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-indigo-900 font-black">
        <Loader2 className="animate-spin" size={24} />
        Checking access...
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("ag_token");
  const role = localStorage.getItem("ag_user_role");
  const rawUserData = localStorage.getItem("ag_user_data");

  let userData: any = null;

  try {
    userData = rawUserData ? JSON.parse(rawUserData) : null;
  } catch {
    userData = null;
  }

  const isAllowed =
    Boolean(token) &&
    role === allowedRole &&
    Boolean(userData) &&
    (!userData.status || userData.status === "active");

  if (!isAllowed) {
    if (allowedRole === "admin") {
      return <Navigate to="/login/admin" replace />;
    }

    if (allowedRole === "teacher") {
      return <Navigate to="/login/teacher" replace />;
    }

    return <Navigate to="/login/student" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/live-class" element={<LiveClass />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/careers" element={<Careers />} />

            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/teacher" element={<TeacherLogin />} />

            <Route path="/register" element={<Registration />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/register/teacher" element={<TeacherRegistration />} />

            <Route path="/admin/*" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/student/*" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/teacher/*" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />

            <Route path="/student/exams" element={<ProtectedRoute allowedRole="student"><StudentExam /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute allowedRole="student"><Leaderboard /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute allowedRole="student"><Certificate /></ProtectedRoute>} />

            <Route path="/teacher/upload" element={<ProtectedRoute allowedRole="teacher"><HomeworkUpload /></ProtectedRoute>} />
            <Route path="/teacher/exam-upload" element={<ProtectedRoute allowedRole="teacher"><ExamUpload /></ProtectedRoute>} />

            <Route path="/parent" element={<ProtectedRoute allowedRole="student"><ParentPortal /></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute allowedRole="student"><Timetable /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRole="admin"><Analytics /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <AIAssistant />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}
