import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

const vacancies = [
  {
    id: 1,
    title: "Primary Science Teacher",
    department: "Junior Wing",
    location: "Main Campus / Online",
    type: "Full-Time",
    requirements: [
      "Minimum Diploma in Education (D.El.Ed) or equivalent",
      "Exceptional teaching skills with focus on conceptual clarity",
      "Minimum 3 years of teaching experience in a reputed school/institute",
      "Proficiency in digital teaching tools"
    ]
  },
  {
    id: 2,
    title: "English Language Specialist",
    department: "Senior Wing",
    location: "Main Campus / Online",
    type: "Full-Time / Part-Time",
    requirements: [
      "Diploma/Graduation with specialization in English Literature",
      "Proven track record of improving student communication skills",
      "Minimum 3 years of classroom experience",
      "Ability to create engaging PDF notes and study material"
    ]
  },
  {
    id: 3,
    title: "Mathematics Faculty",
    department: "Senior Wing",
    location: "Main Campus / Online",
    type: "Full-Time",
    requirements: [
      "Diploma/Degree in Mathematics with teaching certification",
      "Strong problem-solving skills and mentorship capabilities",
      "Minimum 3 years of experience in board exam preparation",
      "Willingness to conduct extra remedial sessions"
    ]
  },
  {
    id: 4,
    title: "General Studies Mentor",
    department: "Graduation Prep",
    location: "Main Campus / Online",
    type: "Contract",
    requirements: [
      "Diploma or Higher Degree with strong subject knowledge",
      "Dynamic personality with public speaking skills",
      "Minimum 3 years of experience in competitive exam mentoring",
      "Expertise in creating assessment modules"
    ]
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 border-l-8 border-indigo-900 pl-8">
            <h1 className="text-5xl font-black text-indigo-900 uppercase tracking-tighter leading-tight">
              JOIN OUR <span className="text-yellow-500">FACULTY</span>
            </h1>
            <p className="mt-4 text-xl font-medium text-slate-500 uppercase tracking-widest max-w-2xl">
              We are looking for passionate educators to help us redefine the future of knowledge for Classes 5th to Graduation.
            </p>
          </div>

          <div className="grid gap-8">
            {vacancies.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-l-8 border-indigo-600 shadow-sm overflow-hidden p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-indigo-50 text-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded">{job.department}</span>
                       <span className="bg-slate-50 text-slate-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded">{job.type}</span>
                    </div>
                    <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight mb-4">{job.title}</h2>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
                        <MapPin size={16} className="text-indigo-900" /> {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
                        <Clock size={16} className="text-indigo-900" /> Urgent Vacancy
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Requirements:</h3>
                      <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] font-medium text-slate-600">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:pl-8 lg:border-l border-slate-100 flex flex-col items-center justify-center min-w-[200px]">
                    <button className="w-full bg-indigo-900 text-white py-4 px-6 text-xs font-black uppercase tracking-widest shadow-lg hover:bg-indigo-800 transition-all flex items-center justify-center gap-2">
                      APPLY NOW <ArrowRight size={16} />
                    </button>
                    <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center transition-transform hover:scale-105">
                      Send CV to:<br />
                      <a href="mailto:starspgroups@gmail.com" className="text-indigo-900 underline decoration-yellow-400 hover:text-indigo-700 transition-colors">starspgroups@gmail.com</a>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-indigo-950 py-12 px-6 border-t-8 border-yellow-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
             <h4 className="text-white text-xl font-black uppercase tracking-tighter">Ready to educate?</h4>
             <p className="text-indigo-300 text-sm font-medium uppercase tracking-widest">APNA GYANSHALA - A Brand of STAR SP GROUPS</p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-yellow-500 text-xs font-black uppercase tracking-widest">Hiring Support</p>
                <a href="tel:+919263501825" className="text-white font-bold hover:text-yellow-400 transition-colors block tracking-widest">+91 9263501825</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
