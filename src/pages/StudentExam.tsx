import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function StudentExam() {
  const { user, profile, loading } = useAuth();

  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const studentCourse = profile?.course || "";

  useEffect(() => {
    if (!studentCourse) return;

    const q = query(
      collection(db, "onlineExams"),
      where("course", "==", studentCourse),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setExams(data);
    });

    return () => unsubscribe();
  }, [studentCourse]);

  useEffect(() => {
    if (!selectedExam || result) return;

    if (timeLeft <= 0) {
      handleSubmitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedExam, result]);

  const startExam = (exam: any) => {
    setSelectedExam(exam);
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setTimeLeft(Number(exam.durationMinutes || 30) * 60);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const totalQuestions = selectedExam?.questions?.length || 0;

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitExam = async (autoSubmit = false) => {
    if (!selectedExam || !user) return;

    if (!autoSubmit && answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        "Kuchh questions unanswered hain. Kya aap submit karna chahte hain?"
      );

      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    try {
      let correct = 0;

      selectedExam.questions.forEach((q: any, index: number) => {
        if (answers[index] === q.correctAnswer) {
          correct += 1;
        }
      });

      const score = correct;
      const totalMarks = totalQuestions;
      const percentage =
        totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

      const passStatus =
        percentage >= Number(selectedExam.passingMarks || 40)
          ? "PASS"
          : "FAIL";

      const resultData = {
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        subject: selectedExam.subject,
        course: selectedExam.course,

        studentUid: user.uid,
        studentName: profile?.name || "Student",
        studentId: profile?.studentId || "",
        studentEmail: profile?.email || user.email || "",

        answers,
        correctAnswers: correct,
        totalQuestions,
        score,
        totalMarks,
        percentage,
        passingMarks: Number(selectedExam.passingMarks || 40),
        status: passStatus,
        autoSubmit,
        submittedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "examAttempts"), resultData);

      setResult(resultData);
      toast.success("Exam submitted successfully ✅");
    } catch (error: any) {
      console.error("Exam Submit Error:", error);
      toast.error(error.message || "Exam submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-900" size={32} />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-indigo-900 px-4 py-20">
        <div className="mx-auto max-w-3xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
          <div className="mb-8 flex justify-center">
            <Logo size={90} />
          </div>

          <div className="text-center">
            {result.status === "PASS" ? (
              <Trophy className="mx-auto text-yellow-500" size={70} />
            ) : (
              <XCircle className="mx-auto text-red-600" size={70} />
            )}

            <h1 className="mt-5 text-3xl font-black uppercase text-indigo-900">
              Exam Result
            </h1>

            <p
              className={`mt-3 text-5xl font-black ${
                result.status === "PASS" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {result.status}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <ResultBox label="Score" value={`${result.score}/${result.totalMarks}`} />
            <ResultBox label="Percentage" value={`${result.percentage}%`} />
            <ResultBox label="Correct" value={`${result.correctAnswers}`} />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSelectedExam(null);
                setResult(null);
              }}
              className="bg-indigo-900 px-8 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-800"
            >
              Back to Exams
            </button>

            <Link
              to="/student/dashboard"
              className="border-2 border-indigo-900 px-8 py-3 text-sm font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExam) {
    const question = selectedExam.questions[currentQuestion];

    return (
      <div className="min-h-screen bg-indigo-900 px-4 py-10">
        <div className="mx-auto max-w-5xl bg-white p-8 shadow-2xl border-t-8 border-yellow-500">
          <div className="mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase text-indigo-900">
                {selectedExam.title}
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                {selectedExam.subject} • {selectedExam.course}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-black text-red-600">
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between text-xs font-black uppercase tracking-widest text-indigo-900">
            <span>
              Question {currentQuestion + 1} / {totalQuestions}
            </span>
            <span>
              Answered {answeredCount} / {totalQuestions}
            </span>
          </div>

          <div className="border-l-4 border-indigo-900 bg-slate-50 p-6">
            <h2 className="text-lg font-black text-indigo-900">
              {question.question}
            </h2>

            <div className="mt-6 grid gap-4">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`border p-4 text-left text-sm font-bold transition-all ${
                    answers[currentQuestion] === index
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-indigo-900 hover:border-indigo-400"
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-4">
            <button
              type="button"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="border-2 border-indigo-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-indigo-900 disabled:opacity-40"
            >
              Previous
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="bg-indigo-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitExam(false)}
                className="flex items-center gap-2 bg-emerald-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/student/dashboard"
        className="fixed left-8 top-8 flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-100 hover:text-yellow-400"
      >
        <ArrowLeft size={16} /> STUDENT DASHBOARD
      </Link>

      <div className="mx-auto max-w-5xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={90} />
        </div>

        <div className="mb-8 border-b pb-5">
          <h1 className="text-2xl font-black uppercase text-indigo-900">
            Online Exams
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
            Available exams for {studentCourse || "your course"}
          </p>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <FileQuestion className="mx-auto text-indigo-900" size={50} />
            <h2 className="mt-4 text-xl font-black text-indigo-900">
              No Exam Available
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Teacher exam upload karega to yahan show hoga.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border-l-4 border-indigo-900 bg-slate-50 p-6 shadow-sm"
              >
                <BookOpen className="mb-4 text-indigo-900" size={30} />
                <h2 className="text-xl font-black uppercase text-indigo-900">
                  {exam.title}
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {exam.subject}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <SmallBox label="Questions" value={exam.totalQuestions || 0} />
                  <SmallBox label="Minutes" value={exam.durationMinutes || 0} />
                  <SmallBox label="Pass %" value={exam.passingMarks || 40} />
                </div>

                <button
                  type="button"
                  onClick={() => startExam(exam)}
                  className="mt-6 w-full bg-indigo-900 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                >
                  Start Exam
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmallBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border bg-white p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-indigo-900">{value}</p>
    </div>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border bg-slate-50 p-6 text-center">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-indigo-900">{value}</p>
    </div>
  );
}