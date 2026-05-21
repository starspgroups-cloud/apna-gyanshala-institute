import studentImg from "../assets/student.jpg";
import React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Users,
  Trophy,
  ChevronRight,
  GraduationCap,
  Star,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";

const toppers = [
  {
    name: "Aman Deep",
    rank: "Rank 1",
    exam: "Class 12th Board",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&h=533&fit=crop",
    quote: "Apna Gyanshala's notes and tests were the foundation of my success.",
  },
  {
    name: "Sunita Kumari",
    rank: "Rank 1",
    exam: "Class 10th Board",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&h=533&fit=crop",
    quote: "The personalized attention from Durgesh Sir helped me overcome my fears.",
  },
  {
    name: "Vikram Singh",
    rank: "Rank 5",
    exam: "Graduation Prep",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&h=533&fit=crop",
    quote: "Exceptional offline facilities and daily PDF notes are truly helpful.",
  },
  {
    name: "Neha Sharma",
    rank: "Rank 3",
    exam: "Competitive Exam",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400&h=533&fit=crop",
    quote: "The weekly tests and surprise gifts keep the motivation high!",
  },
];

const stats = [
  { label: "Active Students", value: "25,000+", icon: Users },
  { label: "Expert Mentors", value: "100+", icon: GraduationCap },
  { label: "Success Ratio", value: "99%", icon: Trophy },
  { label: "Daily Notes", value: "PDF", icon: BookOpen },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden bg-white py-20 lg:py-28 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="border-l-8 border-indigo-900 pl-8"
            >
              <h1 className="text-5xl font-black leading-tight tracking-tighter text-indigo-900 sm:text-6xl uppercase">
                APNA <span className="text-yellow-500">GYANSHALA</span>{" "}
                INSTITUTE
              </h1>

              <p className="mt-6 text-xl font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
                Empowering Potential from Class 5th to Graduation.
                <br />
                <span className="text-indigo-600 font-bold">
                  Online & Offline Excellence.
                </span>
              </p>

              <ul className="mt-6 space-y-2 text-sm font-bold text-slate-600 uppercase tracking-tight">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500"></div>
                  Daily Notes PDF & Study Material
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500"></div>
                  Weekly & Monthly Assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500"></div>
                  Exam Winner Surprise Gifts
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
  to="/live-class"
  className="relative overflow-hidden rounded-md bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white transition-all duration-300 hover:bg-red-700"
>
  <span className="relative z-10 flex items-center gap-2">
    
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
      <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
    </span>

    JOIN LIVE CLASSES
  </span>

  <span className="absolute inset-0 animate-pulse bg-red-500 opacity-20"></span>
</Link>

                <Link
                  to="/register"
                  className="bg-indigo-900 text-white px-10 py-5 rounded text-lg font-black uppercase tracking-tight hover:bg-indigo-800 shadow-xl active:translate-y-px transition-all"
                >
                  Student Enroll
                </Link>

                <Link
                  to="/register/teacher"
                  className="bg-yellow-500 text-indigo-950 px-10 py-5 rounded text-lg font-black uppercase tracking-tight hover:bg-yellow-400 shadow-xl active:translate-y-px transition-all"
                >
                  Teacher Register
                </Link>

                <div className="flex flex-col justify-center px-6 border-l border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Established
                  </span>
                  <span className="text-xl font-black text-indigo-900">
                    2026
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square bg-indigo-900 p-2 shadow-2xl skew-x-1">
                <img
                  src={studentImg}
                  alt="Student learning"
                  className="h-full w-full object-cover -skew-x-1"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-900 py-20 border-b-4 border-yellow-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              Portal Access
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-indigo-100">
              Login aur Registration ke liye apna role select karein
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white p-8 border-t-8 border-yellow-500 shadow-2xl">
              <GraduationCap className="text-indigo-900 mb-5" size={36} />
              <h3 className="text-2xl font-black text-indigo-900 uppercase">
                Student Portal
              </h3>
              <p className="mt-3 text-sm font-bold text-slate-500">
                Student login, registration, profile, result, marksheet aur ID card.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login/student"
                  className="bg-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 border-t-8 border-yellow-500 shadow-2xl">
              <UserCheck className="text-indigo-900 mb-5" size={36} />
              <h3 className="text-2xl font-black text-indigo-900 uppercase">
                Teacher Portal
              </h3>
              <p className="mt-3 text-sm font-bold text-slate-500">
                Teacher login, registration, profile, subject aur faculty dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login/teacher"
                  className="bg-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                >
                  Teacher Login
                </Link>
                <Link
                  to="/register/teacher"
                  className="border-2 border-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 border-t-8 border-yellow-500 shadow-2xl">
              <ShieldCheck className="text-indigo-900 mb-5" size={36} />
              <h3 className="text-2xl font-black text-indigo-900 uppercase">
                Admin Portal
              </h3>
              <p className="mt-3 text-sm font-bold text-slate-500">
                Admin dashboard, students, analytics, programs aur ERP management.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login/admin"
                  className="bg-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="toppers" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b-4 border-indigo-900 pb-8 text-left mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Our National Pride
            </h2>
            <p className="mt-2 text-4xl font-black tracking-tighter text-indigo-900 sm:text-5xl uppercase">
              RANK HOLDERS 2025-26
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {toppers.map((topper, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white p-6 border-l-4 border-indigo-600 shadow-sm flex flex-col sm:flex-row lg:flex-col lg:items-start lg:space-x-0 items-center sm:space-x-6 space-y-4 sm:space-y-0 lg:space-y-4"
              >
                <div className="w-24 h-24 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-indigo-100 overflow-hidden">
                  <img
                    src={topper.image}
                    alt={topper.name}
                    className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-indigo-600 font-black text-xl uppercase tracking-tighter">
                    {topper.name}
                  </p>
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                    {topper.rank} ({topper.exam})
                  </p>
                  <p className="text-xs italic text-slate-400 mt-2">
                    "{topper.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="border-r-4 border-yellow-500 pr-12 text-right order-2 lg:order-1">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 text-center lg:text-right">
                Leadership
              </h2>
              <h3 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter leading-none mb-6">
                Mr. Durgesh Kumar Puri
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
                Founder & Managing Director
              </p>
              <blockquote className="text-xl font-medium text-slate-600 italic leading-relaxed">
                "Apna Gyanshala Institute is built on the philosophy of
                Knowledge for All. Our mission is to bridge the gap between
                quality content and student potential through innovative online
                and offline pedagogy."
              </blockquote>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-1.5 h-6 bg-indigo-900"></div>
                <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">
                  About Apna Gyanshala
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Established in 2026, Apna Gyanshala Institute (a brand of STAR
                SP GROUPS) is a pioneering educational center. We cater
                exclusively to students from{" "}
                <span className="text-indigo-900 font-bold underline decoration-yellow-400">
                  Class 5th up to Graduation
                </span>
                .
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 border-t-4 border-indigo-900 shadow-sm">
                  <div className="text-2xl font-black text-indigo-900">
                    OFFLINE
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Classroom Learning
                  </div>
                </div>
                <div className="bg-slate-50 p-6 border-t-4 border-yellow-500 shadow-sm">
                  <div className="text-2xl font-black text-indigo-900">
                    ONLINE
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Digital Mastery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="courses" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-base font-semibold uppercase tracking-wider text-indigo-600">
                Our Programs
              </h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Expert-Led Courses for Your Success
              </p>
              <p className="mt-4 text-lg text-slate-500">
                From foundational school classes to specialized entrance exams,
                find the perfect course to excel in your academic journey.
              </p>
            </div>
            <Link
              to="/register"
              className="flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-500"
            >
              Explore All Courses <ChevronRight size={20} />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Junior Wing (Class 5th - 8th)",
                description:
                  "Comprehensive online and offline coaching focusing on core subjects with daily notes and interactive sessions.",
                students: "5,000+",
                rating: "4.9",
                price: "₹999/- PA",
                tag: "Junior",
              },
              {
                title: "Senior Wing (Class 9th - 12th)",
                description:
                  "Dedicated preparation for board exams and foundation for competitive exams like JEE/NEET.",
                students: "12,000+",
                rating: "4.8",
                price: "₹1799/- PA",
                tag: "Senior",
              },
              {
                title: "Graduation Programs",
                description:
                  "Advanced guidance for undergraduate students across various streams with industrial insights.",
                students: "8,000+",
                rating: "4.7",
                price: "₹2999/- PA",
                tag: "Higher Ed",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="group flex flex-col rounded-2xl border bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-slate-200"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    {course.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={14} fill="currentColor" /> {course.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                <p className="mt-3 flex-1 text-sm text-slate-500 line-clamp-3">
                  {course.description}
                </p>

                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        Students
                      </div>
                      <div className="text-sm font-bold text-slate-700">
                        {course.students}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        Starts From
                      </div>
                      <div className="text-sm font-bold text-indigo-600">
                        {course.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-900 py-20 border-y-4 border-yellow-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white sm:text-5xl uppercase tracking-tighter">
            Ready to join GYANSHALA?
          </h2>
          <p className="mt-4 text-xl font-medium text-indigo-100 uppercase tracking-widest">
            A Brand of STAR SP GROUPS - Creating Future Leaders.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-yellow-500 text-indigo-950 px-12 py-5 rounded text-xl font-black uppercase tracking-wide shadow-2xl hover:bg-yellow-400 transition-all active:translate-y-px"
            >
              Student Registration
            </Link>

            <Link
              to="/register/teacher"
              className="bg-white text-indigo-900 px-12 py-5 rounded text-xl font-black uppercase tracking-wide shadow-2xl hover:bg-slate-100 transition-all active:translate-y-px"
            >
              Teacher Registration
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-100 border-t border-slate-200 py-12 text-[11px] text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center space-x-3">
                <Logo size={48} />
                <span className="text-xl font-bold text-indigo-900 uppercase tracking-tight">
                  APNA <span className="text-yellow-500">GYANSHALA</span>
                </span>
              </div>

              <p className="mt-4 max-w-xs font-medium uppercase tracking-tighter">
                Founder & Managing Director:{" "}
                <span className="text-indigo-900 font-black">
                  Mr. Durgesh Kumar Puri
                </span>
                <br />
                Dedicated to providing quality online & offline education for
                Classes 5th to Graduation.
              </p>

              <div className="mt-6 flex flex-col gap-1 font-bold text-indigo-950">
                <a
                  href="tel:+919263501825"
                  className="hover:text-indigo-600 transition-colors"
                >
                  📞 Phone: +91 9263501825
                </a>
                <a
                  href="https://wa.me/917870303163"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  💬 WhatsApp: +91 7870303163
                </a>
                <a
                  href="mailto:starspgroups@gmail.com"
                  className="hover:text-indigo-600 transition-colors"
                >
                  📧 Email: starspgroups@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-indigo-900 uppercase tracking-widest">
                Explore
              </h3>
              <ul className="space-y-2 uppercase font-bold">
                <li>
                  <Link to="/about" className="hover:text-indigo-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-indigo-600">
                    Our Courses
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-indigo-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-indigo-900 uppercase tracking-widest">
                Portal
              </h3>
              <ul className="space-y-2 uppercase font-bold">
                <li>
                  <Link to="/login/student" className="hover:text-indigo-600">
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link to="/login/teacher" className="hover:text-indigo-600">
                    Teacher Login
                  </Link>
                </li>
                <li>
                  <Link to="/login/admin" className="hover:text-indigo-600">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link to="/register/teacher" className="hover:text-indigo-600">
                    Teacher Registration
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="uppercase tracking-tighter">
              © 2026 APNA GYANSHALA INSTITUTE. A Brand of STAR SP GROUPS.
            </p>

            <div className="flex space-x-6 text-indigo-900 font-black">
              <Star size={16} />
              <Star size={16} />
              <Star size={16} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}