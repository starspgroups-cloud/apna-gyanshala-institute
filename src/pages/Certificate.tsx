import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Download,
  Loader2,
  Printer,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Certificate() {
  const { user, profile, loading } = useAuth();
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const [attempts, setAttempts] = useState<any[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [selectedAttemptId, setSelectedAttemptId] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "examAttempts"),
      where("studentUid", "==", user.uid),
      where("status", "==", "PASS")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a: any, b: any) => {
            const aTime = a.submittedAt?.seconds || 0;
            const bTime = b.submittedAt?.seconds || 0;
            return bTime - aTime;
          });

        setAttempts(data);

        if (!selectedAttemptId && data.length > 0) {
          setSelectedAttemptId(data[0].id);
        }

        setAttemptsLoading(false);
      },
      () => {
        setAttemptsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, selectedAttemptId]);

  const selectedAttempt = useMemo(() => {
    return attempts.find((item) => item.id === selectedAttemptId) || attempts[0];
  }, [attempts, selectedAttemptId]);

  const studentName = profile?.name || selectedAttempt?.studentName || "Student";
  const studentId = profile?.studentId || selectedAttempt?.studentId || "N/A";
  const course = selectedAttempt?.course || profile?.course || "N/A";
  const examTitle = selectedAttempt?.examTitle || "Online Exam";
  const subject = selectedAttempt?.subject || "General";
  const percentage = selectedAttempt?.percentage || 0;
  const score = selectedAttempt?.score || 0;
  const totalMarks = selectedAttempt?.totalMarks || 0;

  const certificateId = selectedAttempt
    ? `AGC-${String(selectedAttempt.id).slice(0, 8).toUpperCase()}`
    : "AGC-PREVIEW";

  const issueDate = selectedAttempt?.submittedAt?.toDate?.()
    ? selectedAttempt.submittedAt.toDate().toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  const qrData = JSON.stringify({
    certificateId,
    studentName,
    studentId,
    examTitle,
    percentage,
    issuedBy: "Apna Gyanshala Institute",
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    qrData
  )}`;

  const handlePrintCertificate = () => {
    if (!selectedAttempt) return;

    const printWindow = window.open("", "_blank", "width=1200,height=850");

    if (!printWindow) {
      alert("Popup blocked hai. Browser me popup allow karo.");
      return;
    }

    const certificateHtml = certificateRef.current?.outerHTML || "";

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              background: white;
              font-family: Arial, sans-serif;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          ${certificateHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current || !selectedAttempt) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificateId}-${studentName}-Certificate.pdf`);
    } catch (error) {
      console.error("Certificate PDF Error:", error);
      alert("PDF generate nahi ho paya");
    }
  };

  if (loading || attemptsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-900" size={36} />
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

      <div className="mx-auto w-full max-w-6xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={90} />
        </div>

        <div className="mb-8 flex flex-col gap-4 border-b-2 border-indigo-900 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase text-indigo-900">
              Certificate Generator
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Passed exams ke liye verified certificates
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-700">
            <ShieldCheck size={16} />
            Verified System
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Award className="mx-auto text-slate-400" size={60} />
            <h2 className="mt-4 text-xl font-black uppercase text-indigo-900">
              No Certificate Available
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Certificate tab generate hoga jab student exam PASS karega.
            </p>
          </div>
        ) : (
          <div className="mb-8 grid gap-6 lg:grid-cols-[320px,1fr]">
            <div className="border bg-slate-50 p-6">
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-indigo-900">
                Select Passed Exam
              </h3>

              <select
                value={selectedAttemptId}
                onChange={(e) => setSelectedAttemptId(e.target.value)}
                className="w-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {attempts.map((attempt) => (
                  <option key={attempt.id} value={attempt.id}>
                    {attempt.examTitle} - {attempt.percentage}%
                  </option>
                ))}
              </select>

              <div className="mt-6 space-y-4">
                <MiniInfo label="Certificate ID" value={certificateId} />
                <MiniInfo label="Student ID" value={studentId} />
                <MiniInfo label="Exam" value={examTitle} />
                <MiniInfo label="Score" value={`${score}/${totalMarks}`} />
                <MiniInfo label="Percentage" value={`${percentage}%`} />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="flex flex-1 items-center justify-center gap-2 bg-indigo-900 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                >
                  <Download size={15} /> PDF
                </button>

                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-indigo-900 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
                >
                  <Printer size={15} /> Print
                </button>
              </div>
            </div>

            <div
              ref={certificateRef}
              className="overflow-hidden border-4 border-indigo-900 bg-white shadow-2xl"
            >
              <div className="border-b-4 border-yellow-500 bg-indigo-900 p-5 text-center text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-300">
                  APNA GYANSHALA INSTITUTE
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-widest">
                  Certificate
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest">
                  of Achievement
                </p>
              </div>

              <div className="relative min-h-[520px] bg-white p-10 text-center">
                <div className="absolute right-8 top-8 flex h-24 w-24 rotate-[-12deg] items-center justify-center rounded-full border-4 border-yellow-500 text-center text-[10px] font-black uppercase text-yellow-700">
                  Verified
                  <br />
                  Certificate
                </div>

                <Trophy className="mx-auto text-yellow-500" size={70} />

                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-slate-500">
                  This certificate is proudly presented to
                </p>

                <h3 className="mx-auto mt-4 inline-block border-b-2 border-yellow-500 px-8 pb-2 text-4xl font-black uppercase text-indigo-900">
                  {studentName}
                </h3>

                <p className="mx-auto mt-8 max-w-2xl text-lg font-bold leading-8 text-slate-600">
                  for successfully completing{" "}
                  <span className="text-indigo-900">{examTitle}</span> in{" "}
                  <span className="text-indigo-900">{subject}</span> under{" "}
                  <span className="text-indigo-900">{course}</span>.
                </p>

                <div className="mt-6 inline-block rounded-xl bg-emerald-50 px-6 py-3 text-xl font-black text-emerald-700">
                  Score: {score}/{totalMarks} • {percentage}%
                </div>

                <div className="absolute bottom-8 left-8 flex items-end gap-4 text-left">
                  <img
                    src={qrUrl}
                    alt="Certificate QR"
                    className="h-24 w-24 border-2 border-indigo-900 bg-white p-1"
                  />

                  <div className="text-xs font-bold leading-6 text-slate-600">
                    Certificate ID: {certificateId}
                    <br />
                    Student ID: {studentId}
                    <br />
                    Issue Date: {issueDate}
                    <br />
                    Status: VERIFIED
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-48 text-center">
                  <div className="h-12 border-b-2 border-indigo-900"></div>
                  <p className="mt-2 text-xs font-black uppercase tracking-widest text-indigo-900">
                    Principal Signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="border bg-white p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-black text-indigo-900">
        {value}
      </p>
    </div>
  );
}