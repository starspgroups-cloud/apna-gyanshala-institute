import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Filter, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

const courses = [
  {
    title: "Class 5th - 8th Foundation",
    category: "Junior Wing",
    duration: "1 Year",
    price: "₹999/-",
    rating: 4.9,
    description: "Build a rock-solid foundation in Science, Maths, and English with daily PDF notes.",
    features: ["Offline Classes", "Online Video Support", "Weekly Quiz"]
  },
  {
    title: "Class 9th - 10th Board Power",
    category: "Senior Wing",
    duration: "1 Year",
    price: "₹1499/-",
    rating: 4.8,
    description: "Specialized board series focusing on performance and concept mastery.",
    features: ["Board Mock Tests", "Personalized Mentor", "Surprise Gifts"]
  },
  {
    title: "Class 11th - 12th Board + JEE/NEET",
    category: "Senior Wing",
    duration: "1 Year",
    price: "₹1999/-",
    rating: 4.8,
    description: "Comprehensive coaching for higher secondary boards and competitive entry.",
    features: ["Advanced Modules", "Daily Doubt Solving", "PDF Archive"]
  },
  {
    title: "Post-Graduate Entrance Support",
    category: "Higher Ed",
    duration: "6 Months",
    price: "₹2499/-",
    rating: 4.7,
    description: "Guidance for various university entrance exams and career counseling.",
    features: ["Industry Insights", "Workshop Access", "Career Pathing"]
  },
  {
    title: "Competitive Exam Mastery",
    category: "Higher Ed",
    duration: "1 Year",
    price: "₹2999/-",
    rating: 4.6,
    description: "Intensive training for state and national level competitive examinations.",
    features: ["Mock Series", "Live Lectures", "Specialist Faculty"]
  }
];

export default function Courses() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div className="max-w-2xl border-l-8 border-indigo-900 pl-8">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Academic Catalog</h2>
              <h1 className="text-5xl font-black text-indigo-950 uppercase tracking-tighter leading-none mb-6">
                 ALL <span className="text-yellow-500">PROGRAMS</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg uppercase tracking-widest leading-relaxed">
                 Discover our comprehensive academic roadmap designed for every stage of your learning.
              </p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {courses.map((course, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white border-t-8 border-indigo-900 shadow-sm p-8 flex flex-col hover:shadow-2xl transition-all h-full"
              >
                 <div className="flex items-center justify-between mb-6">
                    <span className="bg-indigo-50 text-indigo-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest">{course.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                       <Star size={14} fill="currentColor" />
                       <span className="text-xs font-bold">{course.rating}</span>
                    </div>
                 </div>
                 <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight mb-4 leading-none">{course.title}</h3>
                 <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{course.description}</p>
                 
                 <div className="space-y-3 mb-8 flex-1">
                    {course.features.map((feat, i) => (
                       <div key={i} className="flex items-center gap-2 text-[11px] font-black text-indigo-900 uppercase tracking-widest">
                          <div className="w-1 h-1 bg-yellow-500 rounded-full"></div> {feat}
                       </div>
                    ))}
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                       <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</span>
                       <span className="text-xl font-black text-indigo-900">{course.price}</span>
                    </div>
                    <Link to="/register" className="bg-yellow-500 text-indigo-950 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
                       ENROLL
                    </Link>
                 </div>
              </motion.div>
           ))}
        </div>
      </main>
    </div>
  );
}
