import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Shield, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-indigo-950 py-32 relative overflow-hidden border-b-8 border-yellow-500">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/10 skew-x-12 transform translate-x-20"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
             <h2 className="text-yellow-500 text-sm font-black uppercase tracking-[0.4em] mb-4">OUR LEGACY</h2>
             <h1 className="text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                EDUCATING THE <br />
                <span className="text-emerald-400 outline-text">NEW BHARAT</span>
             </h1>
             <p className="text-indigo-100 text-xl font-medium max-w-2xl leading-relaxed uppercase tracking-widest">
                Apna Gyanshala Institute, a flagship brand of STAR SP GROUPS, is committed to bringing top-tier educational resources to every corner of the nation.
             </p>
          </div>
        </section>

        <section className="py-24 px-8 max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="border-l-8 border-indigo-900 pl-10">
                 <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter mb-6">OUR STORY</h2>
                 <p className="text-slate-600 leading-relaxed font-medium text-lg mb-6">
                    Founded in 2026 by Mr. Durgesh Kumar Puri, Apna Gyanshala emerged from a simple observation: students in small towns and villages have immense potential but lack access to structured guidance and daily notes.
                 </p>
                 <p className="text-slate-600 leading-relaxed font-medium">
                    We started as a small offline center and rapidly evolved into a hybrid powerhouse, offering both classroom excellence and digital mastery for Class 5th to Graduation.
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-slate-200">
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&h=400&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="Classroom" referrerPolicy="no-referrer" />
                 </div>
                 <div className="aspect-square bg-indigo-900 flex items-center justify-center p-8">
                    <p className="text-yellow-500 text-4xl font-black uppercase text-center leading-none">25K+ <br /><span className="text-xs text-white tracking-widest">STORY OF SUCCESS</span></p>
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-white py-24 px-8 border-y border-slate-100">
           <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-50 text-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Target size={32} />
                 </div>
                 <h4 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Our Mission</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Knowledge For All</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-50 text-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Users size={32} />
                 </div>
                 <h4 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Community</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growing Together</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-50 text-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Shield size={32} />
                 </div>
                 <h4 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Trust</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Brand of Star SP</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-slate-50 text-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Lightbulb size={32} />
                 </div>
                 <h4 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">Innovation</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Digital Mastery</p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
