import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Trophy,
  Award,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  QrCode,
  User,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  MessageCircle,
  Download,
  FileText,
  Edit3,
  Save,
  X,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function StudentDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [examAttempts, setExamAttempts] = useState<any[]>([]);
  const [examHistoryLoading, setExamHistoryLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    parentPhone: "",
    emergencyContact: "",
    address: "",
    course: "",
    dob: "",
    fatherName: "",
    motherName: "",
    photo: "",
  });

  useEffect(() => {
    if (!profile) return;

    setProfileForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      parentPhone: profile?.parentPhone || "",
      emergencyContact: profile?.emergencyContact || "",
      address: profile?.address || "",
      course: profile?.course || "General Program",
      dob: profile?.dob || "",
      fatherName: profile?.fatherName || "",
      motherName: profile?.motherName || "",
      photo: profile?.photo || "",
    });
  }, [profile]);

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image file allowed");
      e.target.value = "";
      return;
    }

    const sizeKB = file.size / 1024;

    if (sizeKB < 5 || sizeKB > 100) {
      toast.error("Photo size 5KB se 100KB ke beech honi chahiye");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileForm((prev) => ({
        ...prev,
        photo: reader.result as string,
      }));

      toast.success("Photo updated in form ✅");
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) {
      toast.error("User login nahi mila");
      return;
    }

    const cleanPhone = profileForm.phone.trim();
    const cleanParentPhone = profileForm.parentPhone.trim();
    const cleanEmergency = profileForm.emergencyContact.trim();

    if (!profileForm.name.trim()) {
      toast.error("Name enter karo");
      return;
    }

    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Valid student mobile number enter karo");
      return;
    }

    if (cleanParentPhone && !/^[6-9]\d{9}$/.test(cleanParentPhone)) {
      toast.error("Valid parent mobile number enter karo");
      return;
    }

    if (cleanEmergency && !/^[6-9]\d{9}$/.test(cleanEmergency)) {
      toast.error("Valid emergency contact enter karo");
      return;
    }

    setProfileSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: profileForm.name.trim(),
        phone: cleanPhone || "N/A",
        parentPhone: cleanParentPhone || "N/A",
        emergencyContact: cleanEmergency || "N/A",
        address: profileForm.address.trim() || "N/A",
        course: profileForm.course.trim() || "General Program",
        dob: profileForm.dob || "N/A",
        fatherName: profileForm.fatherName.trim() || "N/A",
        motherName: profileForm.motherName.trim() || "N/A",
        photo: profileForm.photo || "",
        updatedAt: serverTimestamp(),
        profileUpdatedBy: "student",
      });

      toast.success("Profile updated successfully ✅");
      setIsEditingProfile(false);
    } catch (error: any) {
      console.error("Student Profile Update Error:", error);
      toast.error(error.message || "Profile update failed");
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/student");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (loading || !user) return;

    const currentCourse = profile?.course || "General Program";

    setMaterialsLoading(true);

    const materialsQuery = query(
      collection(db, "studyMaterials"),
      where("course", "==", currentCourse),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(
      materialsQuery,
      (snapshot) => {
        const materialsData = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a: any, b: any) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
          });

        setStudyMaterials(materialsData);
        setMaterialsLoading(false);
      },
      (error) => {
        console.error("Study Materials Error:", error);
        toast.error("Study materials load nahi ho paaya");
        setMaterialsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [loading, user, profile?.course]);

  useEffect(() => {
    if (loading || !user) return;

    setExamHistoryLoading(true);

    const attemptsQuery = query(
      collection(db, "examAttempts"),
      where("studentUid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      attemptsQuery,
      (snapshot) => {
        const attemptsData = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a: any, b: any) => {
            const aTime = a.submittedAt?.seconds || 0;
            const bTime = b.submittedAt?.seconds || 0;
            return bTime - aTime;
          });

        setExamAttempts(attemptsData);
        setExamHistoryLoading(false);
      },
      (error) => {
        console.error("Exam History Error:", error);
        toast.error("Exam history load nahi ho paaya");
        setExamHistoryLoading(false);
      }
    );

    return () => unsubscribe();
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
      console.error("Logout Error:", error);
      toast.error("Logout failed");
    }
  };

  const resultSubjects = [
    { subject: "Mathematics", marks: 92, grade: "A+", status: "PASS" },
    { subject: "Physics", marks: 88, grade: "A", status: "PASS" },
    { subject: "Chemistry", marks: 81, grade: "A", status: "PASS" },
    { subject: "English", marks: 90, grade: "A+", status: "PASS" },
    { subject: "Computer", marks: 95, grade: "A+", status: "PASS" },
  ];

  const getMarksheetHtml = () => {
    const rows = resultSubjects
      .map(
        (item) => `
          <tr>
            <td>${item.subject}</td>
            <td>${item.marks}</td>
            <td>${item.grade}</td>
            <td>${item.status}</td>
          </tr>
        `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Marksheet - ${studentName}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 30px; color: #1e1b4b; }
            .marksheet { max-width: 900px; margin: auto; border: 4px solid #312e81; padding: 25px; }
            .header { text-align: center; border-bottom: 3px solid #312e81; padding-bottom: 16px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 30px; color: #312e81; }
            .header p { margin: 6px 0 0; font-weight: bold; color: #64748b; }
            .info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
            .box { border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #312e81; color: white; padding: 12px; text-align: left; }
            td { border: 1px solid #cbd5e1; padding: 12px; font-weight: bold; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; }
            .summary div { border: 1px solid #cbd5e1; padding: 15px; text-align: center; font-weight: bold; }
            .footer { display: flex; justify-content: space-between; margin-top: 60px; font-weight: bold; }
            @media print { body { padding: 0; } .marksheet { border: 4px solid #312e81; } }
          </style>
        </head>
        <body>
          <div class="marksheet">
            <div class="header">
              <h1>APNA GYANSHALA INSTITUTE</h1>
              <p>Official Academic Marksheet - Session 2026</p>
            </div>

            <div style="display: flex; gap: 20px; align-items: flex-start; margin: 20px 0;">
              <div style="width: 130px; text-align: center;">
                ${studentPhoto ? `<img src="${studentPhoto}" style="width:120px;height:140px;object-fit:cover;border:3px solid #312e81;" />` : `<div style="width:120px;height:140px;border:3px solid #312e81;display:flex;align-items:center;justify-content:center;font-weight:bold;">PHOTO</div>`}
              </div>

              <div style="flex: 1;">
                <div class="info">
              <div class="box">Student Name: ${studentName}</div>
              <div class="box">Student ID: ${studentId}</div>
              <div class="box">Date of Birth: ${studentDOB}</div>
              <div class="box">Father Name: ${fatherName}</div>
              <div class="box">Mother Name: ${motherName}</div>
              <div class="box">Course: ${studentCourse}</div>
              <div class="box">Parent Mobile: ${parentPhone}</div>
              <div class="box">Student Mobile: ${studentPhone}</div>
              <div class="box">Email: ${studentEmail}</div>
              <div class="box" style="grid-column: 1 / -1;">Address: ${studentAddress}</div>
            </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <div class="summary">
              <div>Total Percentage<br><span style="font-size: 28px;">89%</span></div>
              <div>Result Status<br><span style="font-size: 28px; color: #16a34a;">PASS</span></div>
              <div>Rank<br><span style="font-size: 28px; color: #eab308;">#03</span></div>
            </div>

            <div class="footer">
              <div>Class Teacher Signature</div>
              <div>Principal Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintResult = () => {
    const printWindow = window.open("", "_blank", "width=1000,height=800");

    if (!printWindow) {
      toast.error("Popup blocked hai. Browser me popup allow karo.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(getMarksheetHtml());
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };


  const handleDownloadStudentIdCard = async () => {
    const loadingToast = toast.loading("Professional HD ID card ban raha hai...");

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
        loadImage(studentPhoto),
        loadImage(qrImageUrl),
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
      ctx.arc(width - 95, -22, 172, 0, Math.PI * 2);
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
      ctx.fillText("STUDENT IDENTITY CARD", 168, 112);

            // Watermark
      if (logoImg) {
        ctx.save();
        ctx.globalAlpha = 0.018;
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
        ctx.fillText((studentName || "S").charAt(0).toUpperCase(), photoX + photoW / 2, photoY + photoH / 2 + 20);
        ctx.textAlign = "left";
      }
      ctx.restore();

      // Clean premium details block - draw this BEFORE text so text never becomes faded
      ctx.save();
      ctx.globalAlpha = 0.88;
      roundRect(244, 214, 470, 270, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      // Name + basic details - always full opacity and dark
      ctx.globalAlpha = 1;
      fitText(studentName.toUpperCase(), 258, 258, 435, "900 33px Arial", "#312e81");
      fitText(`ID: ${studentId}`, 258, 297, 350, "900 21px Arial", "#b45309");

      const detailsX = 258;
      const labelX = detailsX;
      const valueX = 342;
      let detailY = 326;
      const detailGap = 22;

      const detail = (label: string, value: string) => {
        ctx.globalAlpha = 1;
        ctx.font = "900 13px Arial";
        ctx.fillStyle = "#475569";
        ctx.fillText(label, labelX, detailY);

        fitText(value, valueX, detailY, 322, "900 13px Arial", "#111827");
        detailY += detailGap;
      };

      detail("COURSE", studentCourse);
      detail("DOB", studentDOB);
      detail("PHONE", studentPhone);
      detail("FATHER", fatherName);
      detail("MOTHER", motherName);

      ctx.font = "900 13px Arial";
      ctx.fillStyle = "#8A94A6";
      ctx.fillText("ADDRESS", labelX, detailY);

      const cleanAddressForCard = String(studentAddress || "N/A")
        .replace(/\s+/g, " ")
        .replace(/,\s*/g, ", ")
        .trim();

      wrapText(cleanAddressForCard, valueX, detailY, 332, 16, 2, "800 12.5px Arial", "#111827");

      // QR block
      const qrBoxX = width - 230;
      const qrBoxY = 252;
      const qrBoxSize = 170;

      ctx.save();
      roundRect(qrBoxX - 15, qrBoxY - 15, qrBoxSize + 30, qrBoxSize + 55, 20);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(15,23,42,0.22)";
      ctx.shadowBlur = 9;
      ctx.shadowOffsetY = 5;
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
      link.download = `${studentId}-Professional-ID-Card-PVC-85.6x54mm.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Professional HD ID card download ho gaya ✅", { id: loadingToast });
    } catch (error) {
      console.error("Student ID Card Error:", error);
      toast.error("ID card download failed. Page reload karke phir try karo.", { id: loadingToast });
    }
  };

  const handleDownloadMarksheet = () => {
    const htmlContent = getMarksheetHtml();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${studentId}-Marksheet.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Marksheet downloaded ✅");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
          <p className="text-sm font-black uppercase tracking-widest text-indigo-900">
            Loading Student Hub...
          </p>
        </div>
      </div>
    );
  }

  const currentPath = window.location.pathname;
  const isProfilePage = currentPath === "/profile";
  const isResultsPage = currentPath === "/results";
  const isMaterialsPage = currentPath === "/student/materials";

  const studentName = profile?.name || "Student";
  const studentEmail = profile?.email || user?.email || "N/A";
  const studentPhone = profile?.phone || "N/A";
  const fatherName = profile?.fatherName || "N/A";
  const motherName = profile?.motherName || "N/A";
  const parentPhone = profile?.parentPhone || "N/A";
  const emergencyContact = profile?.emergencyContact || "N/A";
  const studentAddress = profile?.address || "N/A";
  const studentCourse = profile?.course || "General Program";
  const studentPhoto = profile?.photo || "";
  const studentDOB = profile?.dob || "N/A";
  const studentId =
    profile?.studentId ||
    `AGI${profile?.uid?.slice(0, 6)?.toUpperCase() || user?.uid?.slice(0, 6)?.toUpperCase() || "2026"}`;

  const totalClasses = Number(profile?.totalClasses || 0);
  const attendedClasses = Number(profile?.attendedClasses || 0);
  const attendancePercentage =
    Number(profile?.attendancePercentage) ||
    (totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0);

  const joinedDate = profile?.createdAt?.toDate?.()
    ? profile.createdAt.toDate().toLocaleDateString("en-IN")
    : "Preview";

  const qrValue = JSON.stringify({
    uid: user?.uid || profile?.uid || "",
    studentId,
    name: studentName,
    role: "student",
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    qrValue
  )}`;

  const navItems = [
    {
      label: "OVERVIEW",
      icon: LayoutDashboard,
      path: "/student/dashboard",
      active: !isProfilePage && !isResultsPage && !isMaterialsPage,
    },
    {
      label: "COURSES",
      icon: BookOpen,
      path: "/courses",
      active: false,
    },
    {
      label: "ONLINE EXAMS",
      icon: Trophy,
      path: "/student/exams",
      active: false,
    },
    {
  label: "LEADERBOARD",
  icon: Trophy,
  path: "/leaderboard",
  active: false,
},
{
  label: "CERTIFICATE",
  icon: Award,
  path: "/certificate",
  active: false,
},
    {
      label: "RESULTS",
      icon: Trophy,
      path: "/results",
      active: isResultsPage,
    },
    {
      label: "MATERIALS",
      icon: FileText,
      path: "/student/materials",
      active: isMaterialsPage,
    },
    {
      label: "PROFILE",
      icon: Settings,
      path: "/profile",
      active: isProfilePage,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r-4 border-yellow-500 bg-indigo-900 text-white lg:flex z-50 shadow-2xl">
        <div className="flex h-28 items-center px-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <Logo size={54} />
            <span className="text-lg font-black tracking-tight uppercase">
              STUDENT<span className="text-yellow-400">HUB</span>
            </span>
          </div>
        </div>

        <div className="px-4 pt-5">
          <div className="rounded-xl border border-indigo-700 bg-indigo-950/40 p-4">
            <div className="flex items-center gap-3">
              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt="Student"
                  className="h-12 w-12 rounded-full border-2 border-yellow-500 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-500 bg-indigo-800 text-lg font-black">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-widest text-white">
                  {studentName}
                </p>
                <p className="truncate text-[10px] font-bold text-yellow-300">
                  {studentId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-black uppercase tracking-widest transition-all ${
                item.active
                  ? "border-l-4 border-yellow-400 bg-indigo-800 text-yellow-400"
                  : "text-indigo-100 hover:bg-indigo-800 hover:text-white"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
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

      <main className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 border-b-4 border-slate-200 bg-white shadow-sm">
          <div className="flex min-h-20 flex-col gap-4 px-6 py-4 lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-0">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-2 bg-indigo-900"></div>
              <h1 className="text-lg font-black text-indigo-900 uppercase tracking-tighter lg:text-xl">
                DASHBOARD / WELCOME, {" "}
                <span className="text-indigo-600">
                  {studentName.toUpperCase()}
                </span>
              </h1>
            </div>

            <div className="flex items-center justify-between gap-6 lg:justify-end">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  {studentCourse}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  ENROLLED: {joinedDate}
                </div>
              </div>

              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt="Student"
                  className="h-10 w-10 rounded-full object-cover border-2 border-yellow-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border-2 border-yellow-500 bg-indigo-900 flex items-center justify-center text-white font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8">
          {isProfilePage && (
            <div className="space-y-8">
              <div className="bg-white border-t-8 border-indigo-900 shadow-xl p-8 rounded-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  {studentPhoto ? (
                    <img
                      src={studentPhoto}
                      alt="Student"
                      className="w-32 h-32 rounded-full border-4 border-yellow-500 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-yellow-500 bg-indigo-900 text-white flex items-center justify-center text-5xl font-black">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <h2 className="text-3xl font-black text-indigo-900 uppercase">
                    {studentName}
                  </h2>

                  <p className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-yellow-700">
                    {studentId}
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>

                  <div className="grid md:grid-cols-2 gap-6 w-full mt-6">
                    <InfoCard icon={Mail} label="Email" value={studentEmail} />
                    <InfoCard icon={Phone} label="Student Phone" value={studentPhone} />
                    <InfoCard icon={User} label="Father Name" value={fatherName} />
                    <InfoCard icon={User} label="Mother Name" value={motherName} />
                    <InfoCard icon={Phone} label="Parent Mobile" value={parentPhone} />
                    <InfoCard icon={Phone} label="Emergency Contact" value={emergencyContact} />
                    <InfoCard icon={GraduationCap} label="Course" value={studentCourse} />
                    <InfoCard icon={CalendarDays} label="Date of Birth" value={studentDOB} />
                    <InfoCard icon={User} label="Address" value={studentAddress} />
                    <InfoCard icon={ShieldCheck} label="Status" value={profile?.status || "active"} />
                    <InfoCard icon={CalendarDays} label="Joined" value={joinedDate} />
                    <InfoCard icon={User} label="Role" value={profile?.role || "student"} />
                  </div>
                </div>
              </div>

              {isEditingProfile && (
                <div className="bg-white border-t-8 border-green-600 shadow-xl p-8">
                  <div className="mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-indigo-900 uppercase">
                        Edit My Profile
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Mobile, address, guardian details aur photo update karein
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center gap-2 border-2 border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                    >
                      <X size={16} /> Close
                    </button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <EditInput
                      label="Student Name"
                      value={profileForm.name}
                      onChange={(value) => setProfileForm({ ...profileForm, name: value })}
                    />

                    <EditInput
                      label="Student Mobile"
                      value={profileForm.phone}
                      maxLength={10}
                      onChange={(value) =>
                        setProfileForm({ ...profileForm, phone: value.replace(/\D/g, "") })
                      }
                    />

                    <EditInput
                      label="Father Name"
                      value={profileForm.fatherName}
                      onChange={(value) => setProfileForm({ ...profileForm, fatherName: value })}
                    />

                    <EditInput
                      label="Mother Name"
                      value={profileForm.motherName}
                      onChange={(value) => setProfileForm({ ...profileForm, motherName: value })}
                    />

                    <EditInput
                      label="Parent Mobile"
                      value={profileForm.parentPhone}
                      maxLength={10}
                      onChange={(value) =>
                        setProfileForm({ ...profileForm, parentPhone: value.replace(/\D/g, "") })
                      }
                    />

                    <EditInput
                      label="Emergency Contact"
                      value={profileForm.emergencyContact}
                      maxLength={10}
                      onChange={(value) =>
                        setProfileForm({ ...profileForm, emergencyContact: value.replace(/\D/g, "") })
                      }
                    />

                    <EditInput
                      label="Course"
                      value={profileForm.course}
                      onChange={(value) => setProfileForm({ ...profileForm, course: value })}
                    />

                    <div>
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileForm.dob === "N/A" ? "" : profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                        className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Address
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Full address"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Update Photo
                      </label>

                      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
                        {profileForm.photo ? (
                          <img
                            src={profileForm.photo}
                            alt="Profile Preview"
                            className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-500 bg-indigo-900 text-3xl font-black text-white">
                            {profileForm.name.charAt(0).toUpperCase() || "S"}
                          </div>
                        )}

                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 bg-indigo-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800">
                          <Camera size={16} /> Choose Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        <p className="text-xs font-bold text-slate-500">
                          Photo size 5KB - 100KB rakhein.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      className="inline-flex items-center gap-2 bg-green-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} /> {profileSaving ? "Saving..." : "Save Profile"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="border-2 border-indigo-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border-t-8 border-yellow-500 shadow-xl p-8">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-indigo-900 uppercase">
                      Digital ID Card
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Standard PVC/ATM size: 85.6mm × 54mm
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadStudentIdCard}
                    className="inline-flex items-center gap-2 bg-indigo-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                  >
                    <Download size={15} /> Download ID
                  </button>
                </div>

                <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-start">
                  <div
                    id="student-id-card-print"
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
                        {studentPhoto ? (
                          <img src={studentPhoto} alt="Student" className="h-[25mm] w-[20mm] border-2 border-indigo-900 object-cover" />
                        ) : (
                          <div className="flex h-[25mm] w-[20mm] items-center justify-center border-2 border-indigo-900 bg-indigo-100 text-lg font-black">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 pt-[1mm]">
                        <p className="truncate text-[9px] font-black uppercase leading-tight text-indigo-900">{studentName}</p>
                        <p className="mt-[1mm] text-[6px] font-black uppercase text-yellow-700">ID: {studentId}</p>
                        <div className="mt-[2mm] space-y-[0.7mm] text-[5.8px] font-bold leading-tight text-slate-700">
                          <p><b>Course:</b> {studentCourse}</p>
                          <p><b>DOB:</b> {studentDOB}</p>
                          <p><b>Phone:</b> {studentPhone}</p>
                          <p><b>Father:</b> {fatherName}</p>
                          <p><b>Mother:</b> {motherName}</p>
                          <p className="line-clamp-2"><b>Address:</b> {studentAddress}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center pt-[1mm]">
                        <img crossOrigin="anonymous" src={qrImageUrl} alt="Student QR" className="h-[15mm] w-[15mm] bg-white p-[1mm]" />
                        <p className="mt-[1mm] text-center text-[4.8px] font-black uppercase text-indigo-900">Scan QR</p>
                      </div>
                    </div>

                    <div className="absolute bottom-[2mm] left-[3mm] right-[3mm] flex items-end justify-between border-t border-slate-300 pt-[1mm]">
                      <p className="text-[5px] font-bold text-slate-600">Valid for institute use only</p>
                      <p className="text-[5px] font-black text-indigo-900">Authorized Sign</p>
                    </div>
                  </div>

                  <div className="grid w-full flex-1 gap-4 md:grid-cols-2">
                    <InfoCard icon={User} label="Father Name" value={fatherName} />
                    <InfoCard icon={User} label="Mother Name" value={motherName} />
                    <InfoCard icon={Phone} label="Parent Mobile" value={parentPhone} />
                    <InfoCard icon={GraduationCap} label="Course" value={studentCourse} />
                    <InfoCard icon={CalendarDays} label="Date of Birth" value={studentDOB} />
                    <InfoCard icon={User} label="Address" value={studentAddress} />
                    <InfoCard icon={ShieldCheck} label="Status" value={profile?.status || "active"} />
                  </div>
                </div>
              </div>

                <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-white border-t-8 border-yellow-500 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <QrCode className="text-indigo-900" size={28} />
                    <div>
                      <h3 className="text-2xl font-black text-indigo-900 uppercase">
                        QR Attendance
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Show this QR to mark attendance
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
                    <img
                      src={qrImageUrl}
                      alt="Student QR Code"
                      className="h-56 w-56 rounded-xl bg-white p-3 shadow"
                    />
                    <p className="mt-4 text-sm font-black text-indigo-900">
                      {studentId}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      QR Enabled: {profile?.qrEnabled === false ? "No" : "Yes"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border-t-8 border-indigo-900 shadow-xl p-8">
                  <h3 className="text-2xl font-black text-indigo-900 uppercase mb-6">
                    Attendance Analytics
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-indigo-900">
                        <span>Attendance</span>
                        <span>{attendancePercentage}%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 border border-slate-200 p-0.5">
                        <div
                          className="h-full bg-indigo-900 shadow-lg"
                          style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <StatBox label="Total Classes" value={String(totalClasses)} />
                      <StatBox label="Attended" value={String(attendedClasses)} />
                    </div>

                    <div className="rounded-xl bg-indigo-50 p-5 text-sm font-bold text-indigo-900">
                      Attendance data admin QR scanner ke through automatically update hoga.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isMaterialsPage && (
            <div className="space-y-8">
              <div className="bg-white border-t-8 border-indigo-900 shadow-xl p-8">
                <div className="flex flex-col gap-4 border-b pb-6 mb-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-indigo-900 uppercase">
                      Homework + Notes
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                      Teacher uploaded study materials for {studentCourse}
                    </p>
                  </div>

                  <div className="rounded-xl bg-yellow-100 px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-700">
                    Total Materials: {studyMaterials.length}
                  </div>
                </div>

                {materialsLoading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
                    <p className="text-sm font-black uppercase tracking-widest text-indigo-900">
                      Loading Materials...
                    </p>
                  </div>
                ) : studyMaterials.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                    <FileText className="mx-auto text-slate-400" size={46} />
                    <h3 className="mt-4 text-xl font-black uppercase text-indigo-900">
                      No Materials Yet
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      Teacher jab homework ya notes upload karenge, yahan automatically show hoga.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {studyMaterials.map((material: any) => {
                      const isHomework = material.type === "Homework";
                      const deadlineText = material.deadline || "No deadline";
                      const uploadedDate = material.createdAt?.toDate?.()
                        ? material.createdAt.toDate().toLocaleDateString("en-IN")
                        : "Recently";

                      return (
                        <div
                          key={material.id}
                          className={`border bg-white p-6 shadow-sm transition-all hover:shadow-xl ${
                            isHomework ? "border-t-4 border-t-yellow-500" : "border-t-4 border-t-indigo-900"
                          }`}
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900">
                              <FileText size={24} />
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                isHomework
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {material.type || "Material"}
                            </span>
                          </div>

                          <h3 className="text-lg font-black uppercase text-indigo-900">
                            {material.title || "Untitled Material"}
                          </h3>

                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                            {material.subject || "General"}
                          </p>

                          {material.description && (
                            <p className="mt-4 text-sm font-bold leading-6 text-slate-500">
                              {material.description}
                            </p>
                          )}

                          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                            <div className="flex justify-between gap-3">
                              <span>Uploaded</span>
                              <span className="text-indigo-900">{uploadedDate}</span>
                            </div>

                            {isHomework && (
                              <div className="flex justify-between gap-3">
                                <span>Deadline</span>
                                <span className="text-red-600">{deadlineText}</span>
                              </div>
                            )}

                            <div className="flex justify-between gap-3">
                              <span>File</span>
                              <span className="max-w-[150px] truncate text-indigo-900">
                                {material.fileName || "Download file"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-2 bg-indigo-900 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                            >
                              <BookOpen size={15} /> Open
                            </a>

                            <a
                              href={material.fileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-2 border-2 border-indigo-900 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-900 hover:bg-slate-50"
                            >
                              <Download size={15} /> Download
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {isResultsPage && (
            <div className="bg-white border-t-8 border-indigo-900 shadow-xl p-8">
              <div className="flex flex-col gap-4 border-b pb-6 mb-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-indigo-900 uppercase">
                    Academic Result
                  </h2>

                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                    Session 2026
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="text-sm font-black text-indigo-900">
                    {studentName}
                  </p>

                  <p className="text-xs font-bold text-slate-400">
                    {studentId}
                  </p>

                  <p className="text-xs font-bold text-slate-500 mt-1">
                    Father: {fatherName}
                  </p>

                  <p className="text-xs font-bold text-slate-500">
                    Mother: {motherName}
                  </p>

                  <p className="text-xs font-bold text-slate-500">
                    Course: {studentCourse}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-slate-200">
                  <thead className="bg-indigo-900 text-white uppercase text-sm">
                    <tr>
                      <th className="p-4 text-left">Subject</th>
                      <th className="p-4 text-center">Marks</th>
                      <th className="p-4 text-center">Grade</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody className="text-indigo-900 font-bold">
                    {[
                      {
                        subject: "Mathematics",
                        marks: 92,
                        grade: "A+",
                        status: "PASS",
                      },
                      {
                        subject: "Physics",
                        marks: 88,
                        grade: "A",
                        status: "PASS",
                      },
                      {
                        subject: "Chemistry",
                        marks: 81,
                        grade: "A",
                        status: "PASS",
                      },
                      {
                        subject: "English",
                        marks: 90,
                        grade: "A+",
                        status: "PASS",
                      },
                      {
                        subject: "Computer",
                        marks: 95,
                        grade: "A+",
                        status: "PASS",
                      },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="p-4">{item.subject}</td>
                        <td className="p-4 text-center">{item.marks}</td>
                        <td className="p-4 text-center">{item.grade}</td>
                        <td className="p-4 text-center">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <ResultBox label="Total Percentage" value="89%" />
                <ResultBox label="Result Status" value="PASS" green />
                <ResultBox label="Rank" value="#03" yellow />
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleDownloadMarksheet}
                  className="bg-indigo-900 text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-indigo-800"
                >
                  Download Marksheet
                </button>

                <button
                  type="button"
                  onClick={handlePrintResult}
                  className="border-2 border-indigo-900 text-indigo-900 px-8 py-3 font-black uppercase tracking-widest hover:bg-slate-50"
                >
                  Print Result
                </button>
              </div>
            </div>
          )}

          {!isProfilePage && !isResultsPage && !isMaterialsPage && (
            <>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 border-t-8 border-indigo-900 bg-white p-10 shadow-xl">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-1.5 h-4 bg-yellow-500"></div>
                    <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">
                      Learning Progress
                    </h2>
                  </div>

                  <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mb-8">
                    Current batch performance statistics
                  </p>

                  <div className="grid gap-5 md:grid-cols-3 mb-8">
                    <StatBox label="Attendance" value={`${attendancePercentage}%`} />
                    <StatBox label="Student ID" value={studentId} />
                    <StatBox label="Fees" value={profile?.feesPaid ? "Paid" : "Pending"} />
                  </div>

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
                    <button className="bg-indigo-900 text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-lg">
                      RESUME LEARNING
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/student/materials")}
                      className="bg-white text-indigo-900 border-2 border-indigo-900 px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      HOMEWORK / NOTES
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/student/exams")}
                      className="bg-yellow-500 text-indigo-950 px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg"
                    >
                      ONLINE EXAMS
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white border-l-4 border-indigo-600 p-8 shadow-sm">
                    <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm mb-6 border-b border-slate-100 pb-2">
                      Academic Notifications
                    </h3>

                    <div className="space-y-6">
                      {[
                        {
                          icon: Trophy,
                          label: "Physics Quiz Topper",
                          date: "2 DAYS AGO",
                          color: "text-yellow-600",
                        },
                        {
                          icon: CheckCircle2,
                          label: "Optics Module Completed",
                          date: "4 DAYS AGO",
                          color: "text-indigo-600",
                        },
                        {
                          icon: Clock,
                          label: "Portal Attendance Streak",
                          date: "JUST NOW",
                          color: "text-slate-600",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className={`${item.color} mt-1`}>
                            <item.icon size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-black text-indigo-900 uppercase tracking-tight">
                              {item.label}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {item.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="mt-10 w-full text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4">
                      EXPLORE ALL ACHIEVEMENTS
                    </button>
                  </div>

                  <div className="bg-white border-l-4 border-yellow-500 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="text-indigo-900" size={20} />
                      <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm">
                        Live Chat
                      </h3>
                    </div>
                    <p className="text-xs font-bold leading-6 text-slate-500">
                      Admin support chat next step me Firebase real-time messages ke saath connect hoga.
                    </p>
                    <button className="mt-5 w-full bg-indigo-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border-t-8 border-yellow-500 shadow-xl p-8">
                <div className="flex flex-col gap-4 border-b pb-5 mb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-indigo-900 uppercase">
                      Online Exam History
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Aapke attempted exams aur instant results
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/student/exams")}
                    className="bg-indigo-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-800"
                  >
                    Start Online Exam
                  </button>
                </div>

                {examHistoryLoading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
                    <p className="text-sm font-black uppercase tracking-widest text-indigo-900">
                      Loading Exam History...
                    </p>
                  </div>
                ) : examAttempts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Trophy className="mx-auto text-slate-400" size={44} />
                    <h3 className="mt-4 text-xl font-black uppercase text-indigo-900">
                      No Exam Attempt Yet
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      Online exam attempt karne ke baad result history yahan show hogi.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-slate-200 text-left">
                      <thead className="bg-indigo-900 text-[10px] font-black uppercase tracking-widest text-white">
                        <tr>
                          <th className="p-4">Exam</th>
                          <th className="p-4">Subject</th>
                          <th className="p-4">Score</th>
                          <th className="p-4">Percentage</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>

                      <tbody className="text-sm font-bold text-indigo-900">
                        {examAttempts.map((attempt: any) => {
                          const submittedDate = attempt.submittedAt?.toDate?.()
                            ? attempt.submittedAt.toDate().toLocaleString("en-IN")
                            : "Recently";

                          return (
                            <tr key={attempt.id} className="border-b hover:bg-slate-50">
                              <td className="p-4">{attempt.examTitle || "Online Exam"}</td>
                              <td className="p-4">{attempt.subject || "N/A"}</td>
                              <td className="p-4">{attempt.score || 0}/{attempt.totalMarks || 0}</td>
                              <td className="p-4">{attempt.percentage || 0}%</td>
                              <td className="p-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-black ${
                                    attempt.status === "PASS"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {attempt.status || "N/A"}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-slate-500">{submittedDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-1.5 h-6 bg-indigo-900"></div>
                  <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">
                    CURRENT ACADEMIC UNIT
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "MATHEMATICS",
                      instructor: "DR. RAMESH SINGH",
                      progress: 85,
                      lessons: "24/28",
                    },
                    {
                      title: "PHYSICS",
                      instructor: "PROF. ANJALI DEVI",
                      progress: 62,
                      lessons: "18/30",
                    },
                    {
                      title: "CHEMISTRY",
                      instructor: "DR. VIVEK VERMA",
                      progress: 45,
                      lessons: "12/28",
                    },
                  ].map((course, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer border-t-4 border-t-indigo-600"
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-4">
                        <div className="h-10 w-10 bg-indigo-50 flex items-center justify-center text-indigo-900 border border-indigo-100 uppercase font-black text-[10px]">
                          {course.title.substring(0, 3)}
                        </div>
                        <ChevronRight
                          className="text-slate-300 group-hover:text-indigo-600 transition-all"
                          size={20}
                        />
                      </div>

                      <h3 className="font-black text-indigo-900 uppercase tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {course.instructor}
                      </p>

                      <div className="mt-8 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-indigo-900 uppercase tracking-widest">
                          <span>MODULES</span>
                          <span>{course.lessons}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100">
                          <div
                            className="h-full bg-indigo-600 shadow-sm"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 border p-4 text-left">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon size={16} />
        <p className="text-xs uppercase font-bold">{label}</p>
      </div>
      <p className="break-all text-lg font-bold text-indigo-900">{value}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border p-5 text-center">
      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
        {label}
      </p>
      <h3 className="mt-2 text-xl font-black text-indigo-900 break-all">
        {value}
      </h3>
    </div>
  );
}

function ResultBox({
  label,
  value,
  green,
  yellow,
}: {
  label: string;
  value: string;
  green?: boolean;
  yellow?: boolean;
}) {
  return (
    <div className="bg-slate-50 border p-6 text-center">
      <p className="text-xs uppercase font-bold text-slate-500">{label}</p>
      <h3
        className={`mt-2 text-3xl font-black ${
          green ? "text-green-600" : yellow ? "text-yellow-500" : "text-indigo-900"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}
