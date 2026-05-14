import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
           <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Connect With Us</h2>
           <h1 className="text-5xl font-black text-indigo-950 uppercase tracking-tighter">GET IN <span className="text-yellow-500">TOUCH</span></h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="bg-slate-50 p-10 border-t-8 border-indigo-900 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 text-white flex items-center justify-center rounded-full mb-6">
                 <Phone size={28} />
              </div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">CALL US</h3>
              <a href="tel:+919263501825" className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-indigo-900 transition-all">+91 9263501825</a>
              <a href="https://wa.me/917870303163" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-black text-xs uppercase tracking-widest mt-1 block hover:text-emerald-700 transition-all">WA: 7870303163</a>
           </div>
           
           <div className="bg-white p-10 border-t-8 border-yellow-500 shadow-xl flex flex-col items-center text-center ring-1 ring-slate-100">
              <div className="w-16 h-16 bg-yellow-500 text-indigo-950 flex items-center justify-center rounded-full mb-6">
                 <MapPin size={28} />
              </div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">VISIT US</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                 Apna Gyanshala Institute,<br />
                 Star SP Groups Main Campus,<br />
                 Knowledge Park - 1
              </p>
           </div>

           <div className="bg-slate-50 p-10 border-t-8 border-indigo-900 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-900 text-white flex items-center justify-center rounded-full mb-6">
                 <Mail size={28} />
              </div>
              <h3 className="text-lg font-black text-indigo-950 uppercase tracking-tight mb-2">EMAIL US</h3>
              <a href="mailto:starspgroups@gmail.com" className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-indigo-900 transition-colors block">starspgroups@gmail.com</a>
              <a href="mailto:info@apnagyanshala.in" className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-indigo-900 transition-colors block mt-1">info@apnagyanshala.in</a>
           </div>
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
           <div className="bg-indigo-900 p-12 text-white border-l-8 border-yellow-500 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <Clock className="text-yellow-500" />
                 <h3 className="text-xl font-black uppercase tracking-tight">OPERATIONAL HOURS</h3>
              </div>
              <ul className="space-y-4">
                 <li className="flex justify-between border-b border-indigo-700 pb-2">
                    <span className="font-bold text-xs uppercase tracking-widest text-indigo-300">Monday - Friday</span>
                    <span className="font-black text-xs uppercase tracking-widest text-white">08:00 AM - 08:00 PM</span>
                 </li>
                 <li className="flex justify-between border-b border-indigo-700 pb-2">
                    <span className="font-bold text-xs uppercase tracking-widest text-indigo-300">Saturday</span>
                    <span className="font-black text-xs uppercase tracking-widest text-white">09:00 AM - 06:00 PM</span>
                 </li>
                 <li className="flex justify-between">
                    <span className="font-bold text-xs uppercase tracking-widest text-indigo-300">Sunday</span>
                    <span className="font-black text-xs uppercase tracking-widest text-yellow-500">Online Support Only</span>
                 </li>
              </ul>
           </div>

           <div className="p-8 border-2 border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter mb-4">ONLINE PRESENCE</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">Connect with our digital mastery channels for daily notes and updates.</p>
              <div className="flex flex-wrap gap-4">
                 <a href="#" className="bg-white border-2 border-slate-200 px-6 py-3 rounded text-[10px] font-black uppercase tracking-widest hover:border-indigo-900 transition-all">FACEBOOK</a>
                 <a href="#" className="bg-white border-2 border-slate-200 px-6 py-3 rounded text-[10px] font-black uppercase tracking-widest hover:border-indigo-900 transition-all">INSTAGRAM</a>
                 <a href="#" className="bg-white border-2 border-slate-200 px-6 py-3 rounded text-[10px] font-black uppercase tracking-widest hover:border-indigo-900 transition-all">YOUTUBE</a>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
