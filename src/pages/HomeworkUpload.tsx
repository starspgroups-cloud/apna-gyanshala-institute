import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import Logo from "../components/Logo";

const CLOUD_NAME = "d qyvugtpd".replace(" ", "");
const UPLOAD_PRESET = "apna_gyanshala";

export default function HomeworkUpload() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Homework");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title enter karo");
    if (!course) return toast.error("Course select karo");
    if (!subject.trim()) return toast.error("Subject enter karo");
    if (!file) return toast.error("PDF/Image file select karo");

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF/Image allowed");
      return;
    }

    setIsLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      uploadData.append("folder", "apna-gyanshala/homework-notes");

      const resourceType = file.type === "application/pdf" ? "raw" : "image";

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error(cloudinaryData);
        throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed");
      }

      await addDoc(collection(db, "studyMaterials"), {
        title: title.trim(),
        type,
        course,
        subject: subject.trim(),
        deadline: type === "Homework" ? deadline : "",
        description: description.trim(),

        fileName: file.name,
        fileType: file.type,
        fileUrl: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        resourceType,

        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success(`${type} uploaded successfully ✅`);

      setTitle("");
      setType("Homework");
      setCourse("");
      setSubject("");
      setDeadline("");
      setDescription("");
      setFile(null);

      const input = document.getElementById("fileUpload") as HTMLInputElement;
      if (input) input.value = "";
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 px-4 py-20">
      <Link
        to="/"
        className="fixed left-8 top-8 flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-100 transition-colors hover:text-yellow-400"
      >
        <ArrowLeft size={16} /> GYANSHALA HOME
      </Link>

      <div className="mx-auto w-full max-w-3xl border-t-8 border-yellow-500 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo size={90} />
        </div>

        <div className="mb-10 flex items-center space-x-3 border-b-2 border-indigo-900 pb-4">
          <div className="h-6 w-2 bg-indigo-900"></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-indigo-900">
              HOMEWORK + NOTES UPLOAD
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400">
              Cloudinary + Firebase Study Material System
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputBox
            icon={FileText}
            label="Title"
            value={title}
            placeholder="Chapter 1 Homework / Math Notes"
            onChange={setTitle}
          />

          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Homework">Homework</option>
              <option value="Notes">Notes PDF</option>
              <option value="Assignment">Assignment</option>
              <option value="Notice">Notice</option>
            </select>
          </div>

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

          {type === "Homework" && (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
                Deadline
              </label>
              <div className="relative">
                <CalendarDays
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Homework / notes ke baare me short details..."
              className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500">
              Upload PDF / Image
            </label>
            <div className="relative">
              <Upload
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {file && (
              <p className="mt-2 text-xs font-bold text-indigo-900">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sm:col-span-2 flex w-full items-center justify-center gap-2 bg-indigo-900 py-4 text-sm font-black tracking-widest text-white shadow-lg transition-all hover:bg-indigo-800 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "UPLOAD MATERIAL"}
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
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
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
          type="text"
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