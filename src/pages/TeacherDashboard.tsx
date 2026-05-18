import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  Link as LinkIcon,
  Loader2,
  LogOut,
  MessageCircle,
  Plus,
  Radio,
  Trash2,
  User,
  Video,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const CLASS_OPTIONS = [
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 11 - Arts/Humanities",
  "Class 12 - Science",
  "Class 12 - Commerce",
  "Class 12 - Arts/Humanities",
  "UG Part-1",
  "UG Part-2",
  "UG Part-3",
  "UG Part-4",
  "UG Semester 1",
  "UG Semester 2",
  "UG Semester 3",
  "UG Semester 4",
  "UG Semester 5",
  "UG Semester 6",
  "UG Semester 7",
  "UG Semester 8",
];

export default function TeacherDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [savingLive, setSavingLive] = useState(false);

  const [materialForm, setMaterialForm] = useState({
    title: "",
    subject: profile?.subject || "",
    course: "",
    type: "Notes",
    description: "",
    fileUrl: "",
    fileName: "",
    deadline: "",
  });

  const [liveForm, setLiveForm] = useState({
    title: "",
    subject: profile?.subject || "",
    course: "",
    liveUrl: "",
    startDate: "",
    startTime: "",
    description: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login/teacher");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading || !user) return;

    const materialsQuery = query(collection(db, "studyMaterials"), where("teacherUid", "==", user.uid));
    const unsubMaterials = onSnapshot(materialsQuery, (snapshot) => {
      const rows = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMaterials(rows);
    });

    const liveQuery = query(collection(db, "liveClasses"), where("teacherUid", "==", user.uid));
    const unsubLive = onSnapshot(liveQuery, (snapshot) => {
      const rows = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLiveClasses(rows);
    });

    return () => {
      unsubMaterials();
      unsubLive();
    };
  }, [loading, user]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("ag_token");
      localStorage.removeItem("ag_user_role");
      localStorage.removeItem("ag_user_uid");
      localStorage.removeItem("ag_user_email");
      localStorage.removeItem("ag_user_data");
      try {
        await signOut(auth);
      } catch {}
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const addMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!materialForm.title.trim()) return toast.error("Title enter karo");
    if (!materialForm.course) return toast.error("Class / course select karo");
    if (!materialForm.subject.trim()) return toast.error("Subject enter karo");
    if (!materialForm.fileUrl.trim()) return toast.error("PDF/notes file URL paste karo");

    setSavingMaterial(true);
    try {
      await addDoc(collection(db, "studyMaterials"), {
        title: materialForm.title.trim(),
        subject: materialForm.subject.trim(),
        course: materialForm.course,
        type: materialForm.type,
        description: materialForm.description.trim(),
        fileUrl: materialForm.fileUrl.trim(),
        fileName: materialForm.fileName.trim() || `${materialForm.title.trim()}.pdf`,
        deadline: materialForm.deadline,
        status: "active",
        teacherUid: user.uid,
        teacherName: profile?.name || "Teacher",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMaterialForm({
        title: "",
        subject: profile?.subject || "",
        course: "",
        type: "Notes",
        description: "",
        fileUrl: "",
        fileName: "",
        deadline: "",
      });
      toast.success("Notes/Homework uploaded ✅");
    } catch (error) {
      console.error(error);
      toast.error("Upload save nahi hua");
    } finally {
      setSavingMaterial(false);
    }
  };

  const addLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!liveForm.title.trim()) return toast.error("Live class title enter karo");
    if (!liveForm.course) return toast.error("Class / course select karo");
    if (!liveForm.subject.trim()) return toast.error("Subject enter karo");
    if (!liveForm.liveUrl.trim()) return toast.error("Google Meet/Zoom/YouTube live link paste karo");
    if (!liveForm.startDate || !liveForm.startTime) return toast.error("Date aur time select karo");

    setSavingLive(true);
    try {
      await addDoc(collection(db, "liveClasses"), {
        title: liveForm.title.trim(),
        subject: liveForm.subject.trim(),
        course: liveForm.course,
        liveUrl: liveForm.liveUrl.trim(),
        startDate: liveForm.startDate,
        startTime: liveForm.startTime,
        description: liveForm.description.trim(),
        status: "scheduled",
        teacherUid: user.uid,
        teacherName: profile?.name || "Teacher",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setLiveForm({
        title: "",
        subject: profile?.subject || "",
        course: "",
        liveUrl: "",
        startDate: "",
        startTime: "",
        description: "",
      });
      toast.success("Live class scheduled ✅");
    } catch (error) {
      console.error(error);
      toast.error("Live class save nahi hua");
    } finally {
      setSavingLive(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "studyMaterials", id));
      toast.success("Material deleted ✅");
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteLiveClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, "liveClasses", id));
      toast.success("Live class deleted ✅");
    } catch {
      toast.error("Delete failed");
    }
  };


  const teacherName = profile?.name || "Teacher";
  const teacherId = profile?.teacherId || user?.uid?.slice(0, 8)?.toUpperCase() || "AGT";
  const teacherSubject = profile?.subject || "N/A";
  const teacherPhone = profile?.phone || "N/A";
  const teacherEmail = profile?.email || user?.email || "N/A";
  const teacherPhoto = profile?.photo || "";
  const teacherJoiningDate = profile?.joiningDate || "N/A";
  const teacherQrValue = JSON.stringify({ uid: user?.uid || "", teacherId, name: teacherName, role: "teacher" });
  const teacherQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(teacherQrValue)}`;

  const handleDownloadTeacherIdCard = async () => {
    const loadingToast = toast.loading("Teacher professional HD ID card ban raha hai...");

    try {
      const mmToPx = (mm: number) => Math.round((mm / 25.4) * 300);
      const canvas = document.createElement("canvas");
      const width = mmToPx(85.6);
      const height = mmToPx(54);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
      };

      const drawContain = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
        const scale = Math.min(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      };

      const drawCover = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
        const ratio = Math.max(w / img.width, h / img.height);
        const sw = w / ratio;
        const sh = h / ratio;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
      };

      const fitText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        font: string,
        color = "#111827"
      ) => {
        ctx.font = font;
        ctx.fillStyle = color;
        let finalText = String(text || "N/A").replace(/\s+/g, " ").trim();
        while (ctx.measureText(finalText).width > maxWidth && finalText.length > 4) {
          finalText = finalText.slice(0, -2);
        }
        if (finalText !== String(text || "N/A").replace(/\s+/g, " ").trim()) {
          finalText += "…";
        }
        ctx.fillText(finalText, x, y);
      };

      const wrapText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        maxLines: number,
        font = "800 14px Arial",
        color = "#111827"
      ) => {
        ctx.font = font;
        ctx.fillStyle = color;

        const words = String(text || "N/A").replace(/\s+/g, " ").trim().split(" ");
        let line = "";
        let lines: string[] = [];

        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          if (ctx.measureText(testLine).width > maxWidth && line) {
            lines.push(line);
            line = word;
            if (lines.length === maxLines - 1) break;
          } else {
            line = testLine;
          }
        }

        if (line) lines.push(line);
        lines = lines.slice(0, maxLines);

        lines.forEach((item, index) => {
          let finalLine = item;
          if (index === maxLines - 1 && words.join(" ").length > lines.join(" ").length) {
            while (ctx.measureText(`${finalLine}…`).width > maxWidth && finalLine.length > 3) {
              finalLine = finalLine.slice(0, -2);
            }
            finalLine += "…";
          }
          ctx.fillText(finalLine, x, y + index * lineHeight);
        });
      };

      const [photoImg, qrImg, logoImg] = await Promise.all([
        loadImage(teacherPhoto),
        loadImage(teacherQrImageUrl),
        loadImage("/apna-gyanshala-logo-transparent.png"),
      ]);

      // Card base
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#ffffff");
      bgGradient.addColorStop(1, "#f8fafc");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Premium header
      const headerGradient = ctx.createLinearGradient(0, 0, width, 0);
      headerGradient.addColorStop(0, "#21146f");
      headerGradient.addColorStop(0.62, "#312e81");
      headerGradient.addColorStop(1, "#4f46e5");
      ctx.fillStyle = headerGradient;
      ctx.fillRect(0, 0, width, 178);

      // Decorative shapes
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(width - 70, -10, 135, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(width - 300, 100, 135, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Border
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#312e81";
      ctx.strokeRect(6, 6, width - 12, height - 12);

      ctx.lineWidth = 4;
      ctx.strokeStyle = "#facc15";
      ctx.strokeRect(22, 22, width - 44, height - 44);

      // Logo
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(92, 88, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#facc15";
      ctx.stroke();
      ctx.clip();
      if (logoImg) {
        drawContain(logoImg, 42, 38, 100, 100);
      } else {
        ctx.fillStyle = "#312e81";
        ctx.font = "900 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("AG", 92, 92);
        ctx.font = "800 9px Arial";
        ctx.fillText("INSTITUTE", 92, 110);
      }
      ctx.restore();

      ctx.textAlign = "left";

      // Header text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 34px Arial";
      ctx.fillText("APNA GYANSHALA INSTITUTE", 165, 76);

      ctx.fillStyle = "#facc15";
      ctx.font = "900 17px Arial";
      ctx.fillText("TEACHER IDENTITY CARD", 168, 112);

      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "800 10px Arial";
      // removed subtitle

      // Watermark
      if (logoImg) {
        ctx.save();
        ctx.globalAlpha = 0.02;
        drawContain(logoImg, 392, 198, 320, 320);
        ctx.restore();
      }

      // Photo block
      const photoX = 54;
      const photoY = 240;
      const photoW = 174;
      const photoH = 226;

      ctx.save();
      roundRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16, 18);
      ctx.fillStyle = "#eef2ff";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#312e81";
      ctx.stroke();

      roundRect(photoX, photoY, photoW, photoH, 12);
      ctx.clip();
      ctx.fillStyle = "#e0e7ff";
      ctx.fillRect(photoX, photoY, photoW, photoH);

      if (photoImg) {
        drawCover(photoImg, photoX, photoY, photoW, photoH);
      } else {
        ctx.fillStyle = "#312e81";
        ctx.font = "900 58px Arial";
        ctx.textAlign = "center";
        ctx.fillText((teacherName || "S").charAt(0).toUpperCase(), photoX + photoW / 2, photoY + photoH / 2 + 20);
        ctx.textAlign = "left";
      }
      ctx.restore();

      // Name + basic details
      fitText(teacherName.toUpperCase(), 258, 258, 435, "900 33px Arial", "#312e81");
      fitText(`ID: ${teacherId}`, 258, 297, 350, "900 21px Arial", "#b45309");

      const detailsX = 258;
      const labelX = detailsX;
      const valueX = 342;
      let detailY = 340;
      const detailGap = 28;

      const detail = (label: string, value: string) => {
        ctx.font = "900 14px Arial";
        ctx.fillStyle = "#64748b";
        ctx.fillText(label, labelX, detailY);
        fitText(value, valueX, detailY, 330, "800 15px Arial", "#111827");
        detailY += detailGap;
      };

      detail("SUBJECT", teacherSubject);
      detail("JOINED", teacherJoiningDate);
      detail("PHONE", teacherPhone);

      ctx.font = "900 14px Arial";
      ctx.fillStyle = "#64748b";
      ctx.fillText("EMAIL", labelX, detailY);
      wrapText(teacherEmail, valueX, detailY, 345, 18, 2, "800 14px Arial", "#111827");

      // QR block
      const qrBoxX = width - 230;
      const qrBoxY = 252;
      const qrBoxSize = 170;

      ctx.save();
      roundRect(qrBoxX - 15, qrBoxY - 15, qrBoxSize + 30, qrBoxSize + 55, 20);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(15,23,42,0.22)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.restore();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#e2e8f0";
      roundRect(qrBoxX - 15, qrBoxY - 15, qrBoxSize + 30, qrBoxSize + 55, 20);
      ctx.stroke();

      if (qrImg) {
        drawContain(qrImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      } else {
        ctx.fillStyle = "#312e81";
        ctx.font = "900 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("QR", qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize / 2);
        ctx.textAlign = "left";
      }

      ctx.fillStyle = "#312e81";
      ctx.font = "900 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SCAN FOR VERIFICATION", qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 29);
      ctx.textAlign = "left";

      // Footer
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(24, height - 72, width - 48, 48);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(42, height - 72);
      ctx.lineTo(width - 42, height - 72);
      ctx.stroke();

      ctx.fillStyle = "#475569";
      ctx.font = "800 12px Arial";
      ctx.fillText("Valid for institute use only", 54, height - 42);

      ctx.fillStyle = "#312e81";
      ctx.font = "900 12px Arial";
      ctx.fillText("Authorized Sign", width - 190, height - 42);

      const link = document.createElement("a");
      link.download = `${teacherId}-Teacher-Professional-ID-Card-PVC-85.6x54mm.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Teacher professional HD ID card download ho gaya ✅", { id: loadingToast });
    } catch (error) {
      console.error("Teacher ID Card Error:", error);
      toast.error("ID card download failed. Page reload karke phir try karo.", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
          <p className="text-sm font-black uppercase tracking-widest text-indigo-900">Loading Teacher Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="border-b-4 border-yellow-500 bg-indigo-900 text-white shadow-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={54} />
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Teacher Hub</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">{profile?.name || "Teacher"} • {profile?.teacherId || "AGT"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="grid gap-6 md:grid-cols-4">
          <StatCard icon={User} label="Teacher" value={teacherName} />
          <StatCard icon={BookOpen} label="Subject" value={teacherSubject} />
          <StatCard icon={FileText} label="Materials" value={String(materials.length)} />
          <StatCard icon={Radio} label="Live Classes" value={String(liveClasses.length)} />
        </section>

        <section className="border-t-8 border-yellow-500 bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black uppercase text-indigo-900">Teacher ID Card</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Standard PVC/ATM size: 85.6mm × 54mm</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTeacherIdCard}
              className="inline-flex items-center justify-center gap-2 bg-indigo-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-800"
            >
              <Download size={15} /> Download ID
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-start">
            <div
              id="teacher-id-card-print"
              className="relative overflow-hidden bg-white text-indigo-950 shadow-2xl"
              style={{ width: "85.6mm", height: "54mm" }}
            >
              <div className="absolute inset-x-0 top-0 h-[15mm] bg-indigo-900"></div>
              <div className="absolute right-[-10mm] top-[-12mm] h-[36mm] w-[36mm] rounded-full bg-yellow-400 opacity-90"></div>
              <div className="absolute inset-0 border-[1.5mm] border-indigo-900"></div>

              <div className="relative z-10 flex h-[15mm] items-center gap-2 px-[3mm] text-white">
                <div data-id-logo className="flex h-[10mm] w-[10mm] items-center justify-center rounded-full bg-white p-[1mm]">
                  <Logo size={30} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black leading-none tracking-wide">APNA GYANSHALA INSTITUTE</p>
                  
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-[22mm,1fr,17mm] gap-[2mm] px-[3mm] pt-[3mm]">
                <div>
                  {teacherPhoto ? (
                    <img src={teacherPhoto} alt="Teacher" className="h-[25mm] w-[20mm] border-2 border-indigo-900 object-cover" />
                  ) : (
                    <div className="flex h-[25mm] w-[20mm] items-center justify-center border-2 border-indigo-900 bg-indigo-100 text-lg font-black">
                      {teacherName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 pt-[1mm]">
                  <p className="truncate text-[9px] font-black uppercase leading-tight text-indigo-900">{teacherName}</p>
                  <p className="mt-[1mm] text-[6px] font-black uppercase text-yellow-700">ID: {teacherId}</p>
                  <div className="mt-[2mm] space-y-[0.7mm] text-[5.8px] font-bold leading-tight text-slate-700">
                    <p><b>Subject:</b> {teacherSubject}</p>
                    <p><b>Phone:</b> {teacherPhone}</p>
                    <p><b>Father:</b> {profile?.fatherName || "N/A"}</p>
                    <p><b>Mother:</b> {profile?.motherName || "N/A"}</p>
                    <p><b>Email:</b> {teacherEmail}</p>
                    <p><b>Joining:</b> {teacherJoiningDate}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-[1mm]">
                  <img crossOrigin="anonymous" src={teacherQrImageUrl} alt="Teacher QR" className="h-[15mm] w-[15mm] bg-white p-[1mm]" />
                  <p className="mt-[1mm] text-center text-[4.8px] font-black uppercase text-indigo-900">Scan QR</p>
                </div>
              </div>

              <div className="absolute bottom-[2mm] left-[3mm] right-[3mm] flex items-end justify-between border-t border-slate-300 pt-[1mm]">
                <p className="text-[5px] font-bold text-slate-600">Valid for institute use only</p>
                <p className="text-[5px] font-black text-indigo-900">Authorized Sign</p>
              </div>
            </div>

            <div className="grid w-full flex-1 gap-4 md:grid-cols-2">
              <StatCard icon={User} label="Teacher ID" value={teacherId} />
              <StatCard icon={BookOpen} label="Subject" value={teacherSubject} />
              <StatCard icon={CalendarDays} label="Joining" value={teacherJoiningDate} />
              <StatCard icon={Radio} label="Live Classes" value={String(liveClasses.length)} />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="border-t-8 border-indigo-900 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3 border-b pb-4">
              <FileText className="text-indigo-900" />
              <div>
                <h2 className="text-xl font-black uppercase text-indigo-900">Upload PDF Notes / Homework</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Student dashboard me automatically show hoga</p>
              </div>
            </div>

            <form onSubmit={addMaterial} className="space-y-4">
              <Input label="Title" value={materialForm.title} onChange={(v) => setMaterialForm({ ...materialForm, title: v })} placeholder="Chapter 1 Notes" />
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Class / Course" value={materialForm.course} onChange={(v) => setMaterialForm({ ...materialForm, course: v })} options={CLASS_OPTIONS} />
                <Input label="Subject" value={materialForm.subject} onChange={(v) => setMaterialForm({ ...materialForm, subject: v })} placeholder="Mathematics" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Type" value={materialForm.type} onChange={(v) => setMaterialForm({ ...materialForm, type: v })} options={["Notes", "Homework", "Assignment", "Syllabus", "Question Paper"]} />
                <Input label="Deadline" type="date" value={materialForm.deadline} onChange={(v) => setMaterialForm({ ...materialForm, deadline: v })} />
              </div>
              <Input label="PDF / File URL" value={materialForm.fileUrl} onChange={(v) => setMaterialForm({ ...materialForm, fileUrl: v })} placeholder="Google Drive / Firebase / PDF link" />
              <Input label="File Name" value={materialForm.fileName} onChange={(v) => setMaterialForm({ ...materialForm, fileName: v })} placeholder="notes.pdf" />
              <Textarea label="Description" value={materialForm.description} onChange={(v) => setMaterialForm({ ...materialForm, description: v })} placeholder="Short details" />
              <button disabled={savingMaterial} className="flex w-full items-center justify-center gap-2 bg-indigo-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800 disabled:opacity-60">
                {savingMaterial ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />} Save Material
              </button>
            </form>
          </div>

          <div className="border-t-8 border-yellow-500 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3 border-b pb-4">
              <Video className="text-indigo-900" />
              <div>
                <h2 className="text-xl font-black uppercase text-indigo-900">Schedule Live Class</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Meet/Zoom/YouTube link save karein</p>
              </div>
            </div>

            <form onSubmit={addLiveClass} className="space-y-4">
              <Input label="Live Class Title" value={liveForm.title} onChange={(v) => setLiveForm({ ...liveForm, title: v })} placeholder="Physics Live Class" />
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Class / Course" value={liveForm.course} onChange={(v) => setLiveForm({ ...liveForm, course: v })} options={CLASS_OPTIONS} />
                <Input label="Subject" value={liveForm.subject} onChange={(v) => setLiveForm({ ...liveForm, subject: v })} placeholder="Physics" />
              </div>
              <Input label="Live Class Link" value={liveForm.liveUrl} onChange={(v) => setLiveForm({ ...liveForm, liveUrl: v })} placeholder="Google Meet / Zoom / YouTube link" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Date" type="date" value={liveForm.startDate} onChange={(v) => setLiveForm({ ...liveForm, startDate: v })} />
                <Input label="Time" type="time" value={liveForm.startTime} onChange={(v) => setLiveForm({ ...liveForm, startTime: v })} />
              </div>
              <Textarea label="Description" value={liveForm.description} onChange={(v) => setLiveForm({ ...liveForm, description: v })} placeholder="Class topic / instructions" />
              <button disabled={savingLive} className="flex w-full items-center justify-center gap-2 bg-yellow-500 px-6 py-4 text-xs font-black uppercase tracking-widest text-indigo-950 hover:bg-yellow-400 disabled:opacity-60">
                {savingLive ? <Loader2 className="animate-spin" size={17} /> : <Radio size={17} />} Schedule Live Class
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <ListPanel title="Uploaded Materials" empty="Abhi koi notes/homework upload nahi hai">
            {materials.map((item) => (
              <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black uppercase text-indigo-900">{item.title}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{item.course} • {item.subject} • {item.type}</p>
                  </div>
                  <button onClick={() => deleteMaterial(item.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-indigo-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"><LinkIcon size={14} /> Open</a>
                  {item.deadline && <span className="flex items-center gap-2 rounded-xl bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-yellow-700"><CalendarDays size={14} /> {item.deadline}</span>}
                </div>
              </div>
            ))}
          </ListPanel>

          <ListPanel title="Scheduled Live Classes" empty="Abhi koi live class scheduled nahi hai">
            {liveClasses.map((item) => (
              <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black uppercase text-indigo-900">{item.title}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{item.course} • {item.subject}</p>
                  </div>
                  <button onClick={() => deleteLiveClass(item.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-indigo-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"><Video size={14} /> Join / Start</a>
                  <span className="flex items-center gap-2 rounded-xl bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-yellow-700"><CalendarDays size={14} /> {item.startDate} {item.startTime}</span>
                </div>
              </div>
            ))}
          </ListPanel>
        </section>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm font-bold text-indigo-900">
          <MessageCircle className="mr-2 inline" size={18} /> Note: Direct PDF file upload ke liye Firebase Storage setup karna padega. Abhi is ready file me Google Drive/Firebase public PDF link paste karke notes/homework students ko show ho jayega.
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="border-t-4 border-indigo-900 bg-white p-5 shadow-sm">
      <Icon className="text-indigo-900" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <h3 className="mt-1 break-all text-lg font-black text-indigo-900">{value}</h3>
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500" />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500">
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function ListPanel({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className="border-t-8 border-indigo-900 bg-white p-6 shadow-xl">
      <h2 className="mb-5 text-xl font-black uppercase text-indigo-900">{title}</h2>
      <div className="space-y-4">
        {hasChildren ? children : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">{empty}</div>}
      </div>
    </div>
  );
}
