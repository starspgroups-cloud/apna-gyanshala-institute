import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Video, Users, PlayCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "../components/Logo";

export default function LiveClass() {
  const [className, setClassName] = useState("Apna Gyanshala Live Class");
  const [roomStarted, setRoomStarted] = useState(false);

  const roomId = useMemo(() => {
    return `apna-gyanshala-${className
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;
  }, [className]);

  const meetingUrl = `https://meet.jit.si/${roomId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(meetingUrl);
    toast.success("Live class link copied ✅");
  };

  return (
    <div className="min-h-screen bg-indigo-950 px-4 py-8 text-white">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-black tracking-widest text-yellow-300"
      >
        <ArrowLeft size={16} /> BACK
      </Link>

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <Logo size={80} />
          <div>
            <h1 className="text-3xl font-black">LIVE CLASSROOM</h1>
            <p className="text-sm text-indigo-200">
              Apna Gyanshala Institute live class system
            </p>
          </div>
        </div>

        {!roomStarted ? (
          <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
              <Video className="text-indigo-900" />
              <h2 className="text-xl font-black text-indigo-900">
                Start / Join Live Class
              </h2>
            </div>

            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">
              Class Title
            </label>

            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Example: Class 10 Science Live"
            />

            <div className="mb-5 rounded-xl bg-yellow-50 p-4 text-sm font-bold text-indigo-900">
              Live Link: {meetingUrl}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setRoomStarted(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-900 px-5 py-4 text-sm font-black tracking-widest text-white hover:bg-indigo-800"
              >
                <PlayCircle size={20} /> START / JOIN CLASS
              </button>

              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-indigo-900 px-5 py-4 text-sm font-black tracking-widest text-indigo-900 hover:bg-indigo-50"
              >
                <Copy size={20} /> COPY CLASS LINK
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-xs font-bold text-slate-600">
              Teacher is link ko students ke saath share kar sakta hai. Students
              website/app se same room join kar sakte hain.
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="flex items-center justify-between bg-indigo-900 px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-black">
                <Users size={18} /> {className}
              </div>

              <button
                onClick={copyLink}
                className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-black text-indigo-950"
              >
                
                COPY LINK
              </button>
              
              <button
                onClick={() => setRoomStarted(false)}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white"
            >
                END CLASS
              </button>
            </div>

            <iframe
              src={meetingUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="h-[78vh] w-full border-0"
              title="Apna Gyanshala Live Class"
            />
          </div>
        )}
      </div>
    </div>
  );
}