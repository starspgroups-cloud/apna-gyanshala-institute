import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
   BarChart3, Users, BookOpen, Settings, LogOut, 
  Search, Plus, MoreVertical, LayoutDashboard,
  UserPlus, GraduationCap, X, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function AdminDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const { isAdmin, user, loading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    if (!loading && isAdmin) {
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate()?.toLocaleDateString() || 'N/A'
        }));
        setStudents(studentsData);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      });

      return () => unsubscribe();
    }
  }, [isAdmin, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const course = formData.get('course') as string;

    try {
      // For demo purposes, we generate a unique ID. 
      // In real apps, we'd use custom claims or Firebase Functions.
      const tempId = `temp_${Math.random().toString(36).substr(2, 9)}`;
      await setDoc(doc(db, 'users', tempId), {
        uid: tempId,
        name,
        email,
        course,
        role: 'student',
        status: 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddModalOpen(false);
      toast.success('Student record created successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setDeleteConfirmation(null);
      toast.success('Student record deleted successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r-4 border-yellow-500 bg-indigo-900 text-white lg:flex z-50 shadow-2xl">
        <div className="flex h-28 items-center px-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <Logo size={60} />
            <span className="text-lg font-black tracking-tight uppercase">ADMIN<span className="text-yellow-400">HUB</span></span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <a href="#" className="flex items-center gap-3 bg-indigo-800 px-4 py-3 text-sm font-black uppercase tracking-widest text-yellow-400 border-l-4 border-yellow-400">
            <LayoutDashboard size={18} /> DASHBOARD
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <Users size={18} /> STUDENTS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <BookOpen size={18} /> PROGRAMS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <BarChart3 size={18} /> ANALYTICS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-100 hover:bg-indigo-800 hover:text-white transition-all">
            <Settings size={18} /> SYSTEM
          </a>
        </nav>
        <div className="border-t border-indigo-800 p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-indigo-300 hover:bg-red-900 hover:text-white transition-all"
          >
            <LogOut size={18} /> TERMINATE
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
                OVERVIEW / SYSTEM STATUS
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors border-2 border-transparent hover:border-indigo-600">
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                <Users size={20} />
              </button>
              <div className="h-10 w-10 border-2 border-yellow-500 bg-indigo-900 flex items-center justify-center font-black text-white text-xs">
                {(profile?.name || 'AD').substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Enrolled', value: '12,450', change: '+12%', icon: Users, color: 'text-indigo-900', border: 'border-l-4 border-indigo-900' },
              { label: 'Growth/Month', value: '840', change: '+5%', icon: UserPlus, color: 'text-indigo-600', border: 'border-l-4 border-indigo-600' },
              { label: 'Active Curriculums', value: '156', change: '+2', icon: BookOpen, color: 'text-yellow-600', border: 'border-l-4 border-yellow-600' },
              { label: 'Capital Flow', value: '₹4.2M', change: '+18%', icon: BarChart3, color: 'text-emerald-600', border: 'border-l-4 border-emerald-600' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white p-6 shadow-sm ${stat.border}`}>
                <div className="flex items-center justify-between">
                  <div className={`p-2 bg-slate-50 border border-slate-100 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{stat.change}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                  <p className="text-2xl font-black text-indigo-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Table */}
          <div className="bg-white border-t-8 border-indigo-900 shadow-xl overflow-hidden">
            <div className="flex flex-col items-start justify-between border-b border-slate-100 p-8 sm:flex-row sm:items-center gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-4 bg-yellow-500"></div>
                  <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">Student Registry</h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Full database interaction portal</p>
              </div>
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="SCAN DATABASE..."
                    className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-800 shadow-lg active:translate-y-px transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> ADD STUDENT
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5">Entity Name</th>
                    <th className="px-8 py-5">Curriculum</th>
                    <th className="px-8 py-5">Registry Date</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[11px] font-bold text-slate-600">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 border border-slate-200 bg-white flex items-center justify-center font-black text-indigo-900 uppercase text-xs">
                            {student.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-black text-indigo-900 uppercase tracking-tight">{student.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 uppercase font-black text-indigo-600">{student.course}</td>
                      <td className="px-8 py-5 text-slate-400">{student.date}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-block border px-3 py-1 font-black uppercase tracking-widest text-[9px] ${
                          student.status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setDeleteConfirmation({ id: student.id, name: student.name })}
                            className="text-slate-300 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="text-slate-300 hover:text-indigo-900 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-950/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md border-t-8 border-yellow-500 bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-1.5 bg-indigo-900"></div>
                <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tighter">Add Student Entity</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-indigo-900 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-6">
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="ENTITY NAME"
                  className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Identification Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="EMAIL@VIDYALAYA.EDU"
                  className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-500 uppercase tracking-widest">Curriculum Assignment</label>
                <select
                  name="course"
                  required
                  className="w-full border border-slate-200 bg-slate-50 py-3 px-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="Class 5th - 8th">CLASS 5TH - 8TH</option>
                  <option value="Class 9th - 12th">CLASS 9TH - 12TH</option>
                  <option value="Graduation Programs">GRADUATION PROGRAMS</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border-2 border-indigo-900 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50 transition-all"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-900 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-800 shadow-lg transition-all"
                >
                  CONFIRM ENTRY
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-950/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm border-t-8 border-red-600 bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tighter">Confirm Deletion</h3>
              <p className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Are you sure you want to permanently erase the student entity <span className="text-red-600 font-black">"{deleteConfirmation.name}"</span> from the database? This action is irreversible.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 border-2 border-slate-200 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all font-sans"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirmation.id)}
                className="flex-1 bg-red-600 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 shadow-lg transition-all font-sans"
              >
                DELETE ENTITY
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
