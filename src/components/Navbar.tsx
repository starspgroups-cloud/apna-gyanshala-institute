import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COURSES', path: '/courses' },
    { name: 'DEMO', path: '/demo' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
    { name: 'FEEDBACK', path: '/feedback' },
    { name: 'CAREER', path: '/careers' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-indigo-900 border-b-4 border-yellow-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <Logo size={60} className="hover:rotate-6 transition-transform duration-300" />
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white leading-none tracking-tighter">
                APNA <span className="text-yellow-400">GYANSHALA</span>
              </h1>
              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-[0.2em] mt-1">STAR SP GROUPS BRAND</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:text-yellow-400 ${
                  isActive(link.path) 
                    ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' 
                    : 'text-indigo-100 pb-1 border-b-2 border-transparent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 border-l border-indigo-700 pl-6 ml-2">
              <Link to="/login/student" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-yellow-400 transition-colors">
                LOGIN
              </Link>
              <Link to="/login/admin" className="bg-yellow-500 text-indigo-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg active:scale-95">
                ADMIN
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/login/student" className="text-[10px] font-black text-white uppercase tracking-widest">
              LOGIN
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-indigo-950 border-t border-indigo-800"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 text-sm font-black uppercase tracking-widest rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-yellow-500 text-indigo-950'
                      : 'text-indigo-100 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-4 text-sm font-black uppercase tracking-widest rounded bg-indigo-800 text-yellow-400 border border-indigo-700 mt-4"
              >
                ADMIN ACCESS
              </Link>
              <div className="pt-4 mt-4 border-t border-indigo-800 grid grid-cols-2 gap-4">
                 <a href="tel:+919263501825" className="text-center p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-indigo-300 font-black mb-1 italic">ENQUIRY</p>
                    <p className="text-white font-bold text-xs">9263501825</p>
                 </a>
                 <a href="https://wa.me/917870303163" target="_blank" rel="noopener noreferrer" className="text-center p-3 bg-white/5 rounded hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-emerald-400 font-black mb-1 italic">WHATSAPP</p>
                    <p className="text-white font-bold text-xs">7870303163</p>
                 </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
