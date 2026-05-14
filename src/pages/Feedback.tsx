import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageSquare, User, Mail, Phone, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Enquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your ' + formData.type + ' has been submitted.');
    setFormData({ name: '', email: '', phone: '', type: 'Enquiry', message: '' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 lg:grid lg:grid-cols-2">
        <div className="bg-indigo-950 p-12 lg:p-24 flex flex-col justify-center border-r-8 border-yellow-500">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
              VOICE YOUR <br />
              <span className="text-yellow-500">FEEDBACK</span>
            </h1>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed uppercase tracking-widest mb-12">
              Whether it's an enquiry about our 2026 batch or feedback on our digital mastery tools, we value your input.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-yellow-500 shrink-0">
                   <MessageSquare size={24} />
                </div>
                <div>
                   <h3 className="text-white font-black uppercase text-sm tracking-widest">Enquiry Desk</h3>
                   <a href="tel:+919263501825" className="text-indigo-300 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">+91 9263501825</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-yellow-500 shrink-0">
                   <Info size={24} />
                </div>
                <div>
                   <h3 className="text-white font-black uppercase text-sm tracking-widest">Support Office</h3>
                   <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">A Brand of STAR SP GROUPS</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-12 lg:p-24 bg-white flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'Enquiry'})}
                className={`py-6 border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.type === 'Enquiry' ? 'border-indigo-900 bg-indigo-900 text-white' : 'border-slate-200 text-slate-400'}`}
              >
                ENQUIRY
              </button>
              <button 
                 type="button"
                 onClick={() => setFormData({...formData, type: 'Feedback'})}
                 className={`py-6 border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.type === 'Feedback' ? 'border-indigo-900 bg-indigo-900 text-white' : 'border-slate-200 text-slate-400'}`}
              >
                FEEDBACK
              </button>
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="text"
                placeholder="FULL NAME"
                className="w-full border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-indigo-900 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
               <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-indigo-900 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="tel"
                  placeholder="PHONE NUMBER"
                  className="w-full border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-indigo-900 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="relative">
              <textarea 
                required
                rows={5}
                placeholder={`YOUR ${formData.type.toUpperCase()} MESSAGE`}
                className="w-full border-2 border-slate-100 bg-slate-50 p-4 text-xs font-black uppercase tracking-widest focus:border-indigo-900 outline-none resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-900 text-white py-6 text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              SUBMIT {formData.type} <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
