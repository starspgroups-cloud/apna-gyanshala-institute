import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Mail, Lock, User, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import Logo from '../components/Logo';

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const path = `users/${user.uid}`;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          course: formData.course,
          role: 'student',
          status: 'Active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success('Registration Successful! Please login to continue.');
        navigate('/login/student');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-900 px-4 py-20">
      <Link to="/" className="fixed left-8 top-8 flex items-center gap-2 text-indigo-100 hover:text-yellow-400 transition-colors uppercase font-bold tracking-widest text-xs">
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>
      
      <div className="mx-auto w-full max-w-lg h-fit border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={100} />
        </div>
        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>
          <div>
            <h1 className="text-xl font-black text-indigo-900 uppercase tracking-tighter leading-none">GYANSHALA ENROLLMENT</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Batch of 2026 Registration</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="YOUR FULL NAME"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="NAME@GYANSHALA.EDU"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Program</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                required
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full appearance-none border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase font-bold"
              >
                <option value="">Select your program</option>
                <option value="class-5-8">Class 5th to 8th (₹999 PA)</option>
                <option value="class-9-12">Class 9th to 12th (₹1799 PA)</option>
                <option value="graduation">Graduation Programs (₹2999 PA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sm:col-span-2 flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black text-white hover:bg-indigo-800 disabled:opacity-70 transition-all uppercase tracking-widest shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'CONFIRM ENROLLMENT'}
          </button>
        </form>
        
        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already have an account? <Link to="/login/student" className="text-indigo-600 underline underline-offset-4 hover:text-indigo-800">Sign in to Hub</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
