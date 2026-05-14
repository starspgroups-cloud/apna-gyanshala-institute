import React from 'react';
import { motion } from 'motion/react';
import { Play, Laptop, FileText, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

export default function Demo() {
  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-4xl w-full text-center mb-16">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
           >
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                 EXPERIENCE <br />
                 <span className="text-yellow-500">DIGITAL MASTERY</span>
              </h1>
              <p className="text-indigo-200 text-xl font-medium uppercase tracking-widest leading-relaxed">
                 A brand of STAR SP GROUPS - Leading the revolution in quality education.
              </p>
           </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
           <div className="bg-white p-10 border-t-8 border-yellow-500 shadow-2xl skew-y-1">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-indigo-900 text-white rounded flex items-center justify-center">
                    <Play size={24} />
                 </div>
                 <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight">DEMO LECTURE</h3>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Watch how our faculty delivers concepts with clarity and precision.</p>
              <button className="w-full bg-indigo-900 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-800 transition-all">WATCH NOW</button>
           </div>

           <div className="bg-white p-10 border-t-8 border-white shadow-2xl -translate-y-4">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-yellow-500 text-indigo-900 rounded flex items-center justify-center">
                    <FileText size={24} />
                 </div>
                 <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight">SAMPLE NOTES</h3>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Get a glimpse of our detailed PDF notes available for all classes.</p>
              <button className="w-full bg-yellow-500 text-indigo-950 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">DOWNLOAD PDF</button>
           </div>

           <div className="bg-white p-10 border-t-8 border-yellow-500 shadow-2xl -skew-y-1">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-indigo-900 text-white rounded flex items-center justify-center">
                    <Laptop size={24} />
                 </div>
                 <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight">PORTAL TOUR</h3>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Explore the student dashboard where you track progress and assessments.</p>
              <button className="w-full bg-indigo-900 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-800 transition-all">EXPLORE</button>
           </div>
        </div>

        <div className="mt-20 text-center">
           <Link to="/register" className="inline-flex items-center gap-4 text-white text-xl font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">
              READY TO COMMIT TO EXCELLENCE? <ArrowRight size={24} className="text-yellow-500" />
           </Link>
        </div>
      </main>
    </div>
  );
}
