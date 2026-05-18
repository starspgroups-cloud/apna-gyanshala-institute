import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Loader2,
  Medal,
  Search,
  Trophy,
  User,
} from "lucide-react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Leaderboard() {
  const { profile } = useAuth();

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "examAttempts"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setAttempts(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const courses = useMemo(() => {
    const unique = Array.from(
      new Set(attempts.map((item) => item.course).filter(Boolean))
    );

    return ["All", ...unique];
  }, [attempts]);

  const leaderboard = useMemo(() => {
    const bestMap = new Map<string, any>();

    attempts.forEach((attempt) => {
      const key =
        attempt.studentUid ||
        attempt.studentId ||
        attempt.studentEmail ||
        attempt.studentName;

      if (!key) return;

      const existing = bestMap.get(key);

      if (!existing || Number(attempt.percentage || 0) > Number(existing.percentage || 0)) {
        bestMap.set(key, attempt);
      }
    });

    return Array.from(bestMap.values())
      .filter((item) => {
        const matchCourse =
          courseFilter === "All" || item.course === courseFilter;

        const value = `${item.studentName || ""} ${item.studentId || ""} ${
          item.examTitle || ""
        } ${item.subject || ""}`.toLowerCase();

        const matchSearch = value.includes(searchTerm.toLowerCase());

        return matchCourse && matchSearch;
      })
      .sort((a, b) => {
        const scoreDiff = Number(b.percentage || 0) - Number(a.percentage || 0);

        if (scoreDiff !== 0) return scoreDiff;

        return Number(b.score || 0) - Number(a.score || 0);
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [attempts, courseFilter, searchTerm]);

  const currentStudentRank = leaderboard.find(
    (item) =>
      item.studentUid === profile?.uid ||
      item.studentId === profile?.studentId ||
      item.studentEmail === profile?.email
  );

  return (
    <div className="min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/student/dashboard"
        className="fixed left-8 top-8 flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-100 hover:text-yellow-400"
      >
        <ArrowLeft size={16} /> STUDENT DASHBOARD
      </Link>

      <div className="mx-auto w-full max-w-6xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={90} />
        </div>

        <div className="mb-8 flex flex-col gap-4 border-b-2 border-indigo-900 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase text-indigo-900">
              Leaderboard + Rank System
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Exam score ke basis par automatic ranking
            </p>
          </div>

          <div className="rounded-xl bg-yellow-100 px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-700">
            Total Ranked: {leaderboard.length}
          </div>
        </div>

        {currentStudentRank && (
          <div className="mb-8 rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="text-yellow-500" size={42} />
                <div>
                  <h2 className="text-xl font-black uppercase text-indigo-900">
                    Your Current Rank
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Best score ke basis par rank calculate ho raha hai.
                  </p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-4xl font-black text-yellow-600">
                  #{currentStudentRank.rank}
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-900">
                  {currentStudentRank.percentage}% Score
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={Trophy}
            label="Top Score"
            value={
              leaderboard.length > 0
                ? `${leaderboard[0]?.percentage || 0}%`
                : "0%"
            }
          />
          <StatCard
            icon={Award}
            label="Passed Students"
            value={String(
              leaderboard.filter((item) => item.status === "PASS").length
            )}
          />
          <StatCard
            icon={BookOpen}
            label="Total Attempts"
            value={String(attempts.length)}
          />
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student / exam / subject..."
              className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <Loader2 className="animate-spin text-indigo-900" size={34} />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Medal className="mx-auto text-slate-400" size={50} />
            <h2 className="mt-4 text-xl font-black uppercase text-indigo-900">
              No Ranking Available
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Students jab exam attempt karenge tab leaderboard show hoga.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-indigo-900 text-[10px] font-black uppercase tracking-widest text-white">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Exam</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-600">
                {leaderboard.map((item) => (
                  <tr
                    key={`${item.id}-${item.rank}`}
                    className={
                      item.rank <= 3 ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {item.rank === 1 && (
                          <Trophy className="text-yellow-500" size={22} />
                        )}
                        {item.rank === 2 && (
                          <Medal className="text-slate-500" size={22} />
                        )}
                        {item.rank === 3 && (
                          <Award className="text-orange-500" size={22} />
                        )}
                        <span className="text-lg font-black text-indigo-900">
                          #{item.rank}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-900">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-black text-indigo-900">
                            {item.studentName || "Student"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.studentId || item.studentEmail || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">{item.course || "N/A"}</td>
                    <td className="px-6 py-5">{item.examTitle || "N/A"}</td>
                    <td className="px-6 py-5">{item.subject || "N/A"}</td>

                    <td className="px-6 py-5">
                      <p className="text-lg font-black text-indigo-900">
                        {item.percentage || 0}%
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.score || 0}/{item.totalMarks || 0}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          item.status === "PASS"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="border-l-4 border-indigo-900 bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-indigo-900">
        <Icon size={22} />
        <p className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-3xl font-black text-indigo-900">{value}</p>
    </div>
  );
}