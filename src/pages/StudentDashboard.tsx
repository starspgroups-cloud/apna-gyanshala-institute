import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Trophy, Clock, CheckCircle2, 
  MessageSquare, LayoutDashboard, Settings, LogOut,
  ChevronRight, Calendar, User, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function StudentDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login/student');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r-4 border-yellow-500 bg-indigo-900 text-white lg:flex z-50 shadow-2xl">
        <div className="flex h-28 items-center px-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <Logo size={60} />
            <span className="text-lg font-black tracking-tight uppercase">STUDENT<span className="text-yellow-400">HUB</span></span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <a href="#" className="flex items-center gap-3 bg-indigo-800 px-4 py-3 text-sm font-black uppercase tracking-widest text-yellow-400 border-l-4 border-yellow-400">
            <LayoutDashboard size={18} /> OVERVIEW
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <BookOpen size={18} /> COURSES
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <Trophy size={18} /> RESULTS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <Settings size={18} /> PROFILE
          </a>
        </nav>
        <div className="border-t border-indigo-800 p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-300 hover:bg-red-900 hover:text-white transition-all"
          >
            <LogOut size={18} /> DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b-4 border-slate-200 bg-white shadow-sm">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-2 bg-indigo-900"></div>
              <h1 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">
                DASHBOARD / WELCOME, <span className="text-indigo-600">{(profile?.name || 'STUDENT').toUpperCase()}</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{profile?.course || 'GENERAL PROGRAM'}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ENROLLED: {profile?.createdAt?.toDate()?.toLocaleDateString() || 'PREVIEW'}</div>
              </div>
              <div className="h-10 w-10 border-2 border-yellow-500 bg-indigo-900 flex items-center justify-center font-black text-white text-xs">
                {(profile?.name || 'ST').substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8">
          {/* Progress Overview */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 border-t-8 border-indigo-900 bg-white p-10 shadow-xl">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-1.5 h-4 bg-yellow-500"></div>
                <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">Learning Progress</h2>
              </div>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mb-8">Current Batch performance statistics</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between font-black text-indigo-900 uppercase tracking-widest text-xs">
                  <span>Overall Curriculum Completion</span>
                  <span>75%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 border border-slate-200 p-0.5">
                  <div className="h-full w-[75%] bg-indigo-900 shadow-lg"></div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="bg-indigo-900 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-lg active:translate-y-px">
                  RESUME LEARNING
                </button>
                <button className="bg-white text-indigo-900 border-2 border-indigo-900 px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:translate-y-px">
                  VIEW TIMETABLE
                </button>
              </div>
            </div>

            <div className="bg-white border-l-4 border-indigo-600 p-8 shadow-sm">
              <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm mb-6 border-b border-slate-100 pb-2">Academic Notifications</h3>
              <div className="space-y-6">
                {[
                  { icon: Trophy, label: 'Physics Quiz Topper', date: '2 DAYS AGO', color: 'text-yellow-600' },
                  { icon: CheckCircle2, label: 'Optics Module Completed', date: '4 DAYS AGO', color: 'text-indigo-600' },
                  { icon: Clock, label: 'Portal Attendance Streak', date: 'JUST NOW', color: 'text-slate-600' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`${item.color} mt-1`}>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-indigo-900 uppercase tracking-tight">{item.label}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-10 w-full text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4">EXPLORE ALL ACHIEVEMENTS</button>
            </div>
          </div>

          {/* Current Subjects */}
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-1.5 h-6 bg-indigo-900"></div>
              <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">CURRENT ACADEMIC UNIT</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'MATHEMATICS', instructor: 'DR. RAMESH SINGH', progress: 85, lessons: '24/28' },
                { title: 'PHYSICS', instructor: 'PROF. ANJALI DEVI', progress: 62, lessons: '18/30' },
                { title: 'CHEMISTRY', instructor: 'DR. VIVEK VERMA', progress: 45, lessons: '12/28' },
              ].map((course, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer border-t-4 border-t-indigo-600">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="h-10 w-10 bg-indigo-50 flex items-center justify-center text-indigo-900 border border-indigo-100 uppercase font-black text-[10px]">
                      {course.title.substring(0, 3)}
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-all" size={20} />
                  </div>
                  <h3 className="font-black text-indigo-900 uppercase tracking-tight">{course.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{course.instructor}</p>
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-indigo-900 uppercase tracking-widest">
                      <span>MODULES</span>
                      <span>{course.lessons}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100">
                      <div className="h-full bg-indigo-600 shadow-sm" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
