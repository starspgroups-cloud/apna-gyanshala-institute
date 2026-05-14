import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import Registration from './pages/Registration';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Courses from './pages/Courses';
import Demo from './pages/Demo';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Feedback from './pages/Feedback';
import Careers from './pages/Careers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/student/*" element={<StudentDashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}
