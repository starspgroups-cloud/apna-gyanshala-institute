import {
  Phone,
  Mail,
  CalendarCheck,
  IndianRupee,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function ParentPortal() {
  const student = {
    name: "Student Name",
    studentId: "AGI00001",
    course: "Class 9th to 12th",
    phone: "9876543210",
    parentPhone: "7870303163",
    attendance: 92,
    feesStatus: "Paid",
    feesDue: 0,
    grade: "A+",
    lastExam: "Monthly Test",
  };

  const timetable = [
    { day: "Monday", subject: "Mathematics", time: "10:00 AM - 11:00 AM" },
    { day: "Tuesday", subject: "Science", time: "11:00 AM - 12:00 PM" },
    { day: "Wednesday", subject: "English", time: "12:00 PM - 01:00 PM" },
    { day: "Thursday", subject: "Computer", time: "01:00 PM - 02:00 PM" },
  ];

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Namaste Apna Gyanshala Institute, mujhe parent portal ke regarding help chahiye.`
    );

    window.open(`https://wa.me/917870303163?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-indigo-900 p-6 md:p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Apna Gyanshala Institute
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-black">
                Parent Portal
              </h1>

              <p className="mt-2 text-indigo-100">
                Student progress, attendance, fees, result aur timetable ek jagah.
              </p>
            </div>

            <button
              onClick={openWhatsApp}
              className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black text-indigo-950 hover:bg-yellow-300"
            >
              <MessageCircle size={18} />
              Contact Institute
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-700">Attendance</h2>
              <CalendarCheck className="text-green-600" />
            </div>

            <p className="mt-4 text-4xl font-black text-green-600">
              {student.attendance}%
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              Excellent attendance record
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-700">Fees Status</h2>
              <IndianRupee className="text-indigo-700" />
            </div>

            <p className="mt-4 text-4xl font-black text-indigo-700">
              {student.feesStatus}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              Due Amount: ₹{student.feesDue}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-700">Exam Grade</h2>
              <GraduationCap className="text-orange-500" />
            </div>

            <p className="mt-4 text-4xl font-black text-orange-500">
              {student.grade}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              {student.lastExam}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-700">Security</h2>
              <ShieldCheck className="text-emerald-600" />
            </div>

            <p className="mt-4 text-3xl font-black text-emerald-600">
              Verified
            </p>

            <p className="mt-2 text-sm font-bold text-slate-500">
              Parent access active
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-1">
            <h2 className="text-2xl font-black text-indigo-900">
              Student Details
            </h2>

            <div className="mt-6 space-y-4">
              <Info label="Student Name" value={student.name} />
              <Info label="Student ID" value={student.studentId} />
              <Info label="Course" value={student.course} />
              <Info label="Student Mobile" value={student.phone} />
              <Info label="Parent Mobile" value={student.parentPhone} />
            </div>

            <div className="mt-6 rounded-2xl bg-indigo-50 p-4">
              <p className="text-sm font-bold text-indigo-900">
                Parent portal me student ki attendance, fees, result aur class routine easily monitor kar sakte hain.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-2">
            <h2 className="text-2xl font-black text-indigo-900">
              Academic Progress
            </h2>

            <div className="mt-6 space-y-5">
              <Progress subject="Mathematics" value={88} color="bg-indigo-600" />
              <Progress subject="Science" value={91} color="bg-green-500" />
              <Progress subject="English" value={84} color="bg-orange-400" />
              <Progress subject="Computer" value={95} color="bg-purple-500" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-900" />
            <h2 className="text-2xl font-black text-indigo-900">
              Weekly Timetable
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {timetable.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {item.day}
                    </p>
                    <h3 className="mt-1 text-xl font-black text-indigo-900">
                      {item.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-600">
                    <Clock size={16} />
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-indigo-900 p-6 text-white shadow-xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Phone className="text-yellow-400" />
              <div>
                <p className="text-xs font-black text-indigo-200">
                  Phone / WhatsApp
                </p>
                <p className="font-black">+91 7870303163</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-yellow-400" />
              <div>
                <p className="text-xs font-black text-indigo-200">
                  Email
                </p>
                <p className="font-black">starspgroups@gmail.com</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-indigo-200">
                Institute
              </p>
              <p className="font-black">
                STAR SP GROUPS & APNA GYANSHALA INSTITUTE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-black text-indigo-900">
        {value}
      </p>
    </div>
  );
}

function Progress({
  subject,
  value,
  color,
}: {
  subject: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="font-black text-slate-700">{subject}</span>
        <span className="font-black text-indigo-700">{value}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-slate-200">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}