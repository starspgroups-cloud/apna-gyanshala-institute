import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileQuestion,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import Logo from "../components/Logo";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function ExamUpload() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("30");
  const [passingMarks, setPassingMarks] = useState("40");
  const [isLoading, setIsLoading] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error("Kam se kam 1 question required hai");
      return;
    }

    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optionIndex;
    setQuestions(updated);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Exam title enter karo");
    if (!course) return toast.error("Course select karo");
    if (!subject.trim()) return toast.error("Subject enter karo");

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`Question ${i + 1} empty hai`);
        return;
      }

      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          toast.error(`Question ${i + 1} ka option ${j + 1} empty hai`);
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "onlineExams"), {
        title: title.trim(),
        course,
        subject: subject.trim(),
        durationMinutes: Number(duration),
        passingMarks: Number(passingMarks),
        totalQuestions: questions.length,
        totalMarks: questions.length,
        status: "active",
        questions: questions.map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer,
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Online exam saved successfully ✅");

      setTitle("");
      setCourse("");
      setSubject("");
      setDuration("30");
      setPassingMarks("40");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ]);
    } catch (error: any) {
      console.error("Exam Save Error:", error);
      toast.error(error.message || "Exam save failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/teacher/dashboard"
        className="fixed left-8 top-8 flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-100 transition-colors hover:text-yellow-400"
      >
        <ArrowLeft size={16} /> TEACHER DASHBOARD
      </Link>

      <div className="mx-auto w-full max-w-5xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={90} />
        </div>

        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-indigo-900">
              ONLINE EXAM CREATOR
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400">
              Teacher MCQ Exam Upload Panel
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveExam} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputBox
              icon={FileQuestion}
              label="Exam Title"
              value={title}
              placeholder="Math Test Chapter 1"
              onChange={setTitle}
            />

            <div>
              <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
                Course / Class
              </label>
              <div className="relative">
                <BookOpen
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select course</option>
                  <option value="Class 5th to 8th">Class 5th to 8th</option>
                  <option value="Class 9th to 12th">Class 9th to 12th</option>
                  <option value="Graduation Programs">Graduation Programs</option>
                </select>
              </div>
            </div>

            <InputBox
              icon={BookOpen}
              label="Subject"
              value={subject}
              placeholder="Mathematics / Science / English"
              onChange={setSubject}
            />

            <InputBox
              icon={Clock}
              label="Duration Minutes"
              type="number"
              value={duration}
              placeholder="30"
              onChange={setDuration}
            />

            <InputBox
              icon={FileQuestion}
              label="Passing Marks %"
              type="number"
              value={passingMarks}
              placeholder="40"
              onChange={setPassingMarks}
            />

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">
                Exam Summary
              </p>
              <div className="mt-3 space-y-1 text-sm font-black text-indigo-900">
                <p>Total Questions: {questions.length}</p>
                <p>Total Marks: {questions.length}</p>
                <p>Duration: {duration || 0} minutes</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest text-indigo-900">
                  MCQ Questions
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  Har question me 4 options aur correct answer select karein.
                </p>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center justify-center gap-2 bg-yellow-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-indigo-950 hover:bg-yellow-400"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="border-l-4 border-indigo-900 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-900">
                      Question {qIndex + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={q.question}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    placeholder="Question likho..."
                    className="mb-5 w-full resize-none border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    {q.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`border p-4 ${
                          q.correctAnswer === optionIndex
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Option {optionIndex + 1}
                          </label>

                          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctAnswer === optionIndex}
                              onChange={() =>
                                updateCorrectAnswer(qIndex, optionIndex)
                              }
                            />
                            Correct
                          </label>
                        </div>

                        <input
                          type="text"
                          required
                          value={option}
                          onChange={(e) =>
                            updateOption(qIndex, optionIndex, e.target.value)
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="w-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-800 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} /> SAVE ONLINE EXAM
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputBox({
  icon: Icon,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
        {label}
      </label>

      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />

        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}