import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Admin Login Successful');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 pt-20">
      <Link to="/" className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors uppercase font-bold tracking-widest text-xs">
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>
      
      <div className="mx-auto w-full max-w-md h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>
        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>
          <div>
            <h1 className="text-xl font-black text-indigo-900 uppercase tracking-tighter leading-none">ADMIN CONTROL</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Apna Gyanshala Management</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN@GYANSHALA.EDU"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all uppercase tracking-widest shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'AUTHENTICATE ADMIN'}
          </button>
        </form>
        
        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Restricted access. All login attempts are logged for security.
          </p>
        </div>
      </div>
    </div>
  );
}
