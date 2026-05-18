import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  GraduationCap,
  IndianRupee,
  CalendarCheck,
} from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      from: "ai",
      text:
        "Namaste 😊 Main Gyanshala AI Assistant hoon. Aap institute, admission, fees, courses, attendance, result, certificate, facilities ya contact ke baare me pooch sakte hain.",
    },
  ]);

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[?.,!]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const hasAny = (q: string, words: string[]) => {
    return words.some((word) => q.includes(word));
  };

  const getReply = (text: string) => {
    const q = normalize(text);

    if (
      hasAny(q, [
        "institute",
        "about",
        "bare",
        "baare",
        "batao",
        "kaisa hai",
        "gyanshala kya hai",
        "apna gyanshala",
        "star sp",
      ])
    ) {
      return (
        "Apna Gyanshala Institute ek modern education institute hai ✅\n\n" +
        "Yahan students ko online aur offline dono tarike se guidance mil sakti hai.\n\n" +
        "Main features:\n" +
        "• Class 5th se Graduation tak support\n" +
        "• Daily notes & study material\n" +
        "• Weekly/monthly assessment\n" +
        "• Online exams\n" +
        "• Attendance tracking\n" +
        "• Parent portal\n" +
        "• Fees management\n" +
        "• Certificate system\n\n" +
        "Iska main goal hai students ki padhai ko easy, digital aur trackable banana."
      );
    }

    if (
      hasAny(q, [
        "facility",
        "facilities",
        "suvidha",
        "kya kya",
        "features",
        "system",
        "erp",
        "available",
        "milta",
        "milega",
      ])
    ) {
      return (
        "Institute aur ERP me ye facilities available hain 🚀\n\n" +
        "• Student Dashboard\n" +
        "• Admin Dashboard\n" +
        "• Teacher Dashboard\n" +
        "• Parent Portal\n" +
        "• QR Attendance\n" +
        "• Fees Management\n" +
        "• UPI / PhonePe Payment\n" +
        "• Online Exams\n" +
        "• Leaderboard\n" +
        "• Certificate System\n" +
        "• Timetable\n" +
        "• AI Assistant\n" +
        "• WhatsApp notification support\n\n" +
        "Ye system institute ko fully digital manage karne ke liye bana hai."
      );
    }

    if (
      hasAny(q, [
        "admission",
        "admisn",
        "enroll",
        "enrol",
        "register",
        "registration",
        "join",
        "dakhila",
        "daakhila",
        "admit",
      ])
    ) {
      return (
        "Admission process simple hai ✅\n\n" +
        "1. Website par Student Enroll button par click karein.\n" +
        "2. Student ka naam, DOB, mobile number, parent details aur address fill karein.\n" +
        "3. Course select karein.\n" +
        "4. Student photo upload karein.\n" +
        "5. Fees/payment details fill karein.\n" +
        "6. Registration submit karein.\n\n" +
        "Registration complete hone ke baad student login karke dashboard access kar sakta hai."
      );
    }

    if (
      hasAny(q, [
        "fees",
        "fee",
        "payment",
        "pay",
        "upi",
        "phonepe",
        "pais",
        "paise",
        "jama",
        "amount",
        "kitna",
      ])
    ) {
      return (
        "Fees course ke according hoti hai 💰\n\n" +
        "Payment methods:\n" +
        "• Cash\n" +
        "• UPI / PhonePe\n" +
        "• Bank Transfer\n" +
        "• Card\n\n" +
        "UPI ID: durgeshpuri951@axl\n\n" +
        "Payment ke baad screenshot institute/admin ko share karna hota hai. Admin verify karke fees status update karta hai."
      );
    }

    if (
      hasAny(q, [
        "course",
        "courses",
        "class",
        "program",
        "padhai",
        "subject",
        "classes",
        "study",
        "padha",
        "padhna",
      ])
    ) {
      return (
        "Available programs 📚\n\n" +
        "• Class 5th to 8th\n" +
        "• Class 9th to 12th\n" +
        "• Graduation Programs\n\n" +
        "Yahan online/offline support, notes, study material, tests aur exam preparation available hai."
      );
    }

    if (
      hasAny(q, [
        "attendance",
        "present",
        "absent",
        "qr",
        "scan",
        "daily attendance",
        "hazri",
        "haazri",
      ])
    ) {
      return (
        "Attendance system smart hai ✅\n\n" +
        "• QR Scanner se attendance mark ho sakti hai.\n" +
        "• Admin manually bhi attendance update kar sakta hai.\n" +
        "• Parent Portal me attendance percentage show hota hai.\n" +
        "• Parent ko WhatsApp update bhi bheja ja sakta hai."
      );
    }

    if (
      hasAny(q, [
        "exam",
        "test",
        "result",
        "marks",
        "grade",
        "leaderboard",
        "performance",
        "rank",
      ])
    ) {
      return (
        "Exam aur result system available hai 📝\n\n" +
        "• Online exams conduct ho sakte hain.\n" +
        "• Marks aur grade upload ho sakte hain.\n" +
        "• Student dashboard me result dikhega.\n" +
        "• Parent portal me performance track ki ja sakti hai.\n" +
        "• Leaderboard se top students highlight hote hain."
      );
    }

    if (
      hasAny(q, [
        "certificate",
        "certificat",
        "completion",
        "award",
        "praman patra",
      ])
    ) {
      return (
        "Certificate system available hai 🎓\n\n" +
        "Student achievement, course completion ya exam performance ke basis par certificate generate kiya ja sakta hai."
      );
    }

    if (
      hasAny(q, [
        "parent",
        "guardian",
        "parents",
        "mummy",
        "papa",
        "monitor",
        "progress",
      ])
    ) {
      return (
        "Parent Portal me parents ko ye details milti hain 👨‍👩‍👧\n\n" +
        "• Attendance\n" +
        "• Fees status\n" +
        "• Exam performance\n" +
        "• Timetable\n" +
        "• Student progress report\n\n" +
        "Isse parents student ki progress easily monitor kar sakte hain."
      );
    }

    if (
      hasAny(q, [
        "contact",
        "mobile",
        "phone",
        "number",
        "email",
        "call",
        "whatsapp",
        "address",
        "location",
      ])
    ) {
      return (
        "Contact Details 📞\n\n" +
        "Phone / WhatsApp: +91 7870303163\n" +
        "Email: starspgroups@gmail.com\n" +
        "Institute: STAR SP GROUPS and APNA GYANSHALA INSTITUTE"
      );
    }

    if (
      hasAny(q, [
        "hello",
        "hi",
        "hey",
        "namaste",
        "namaskar",
        "hii",
      ])
    ) {
      return (
        "Namaste 😊 Aapka swagat hai Apna Gyanshala Institute me.\n\n" +
        "Aap admission, fees, course, attendance, result, parent portal ya contact ke baare me pooch sakte hain."
      );
    }

    return (
      "Main aapka question samajhne ki koshish kar raha hoon 😊\n\n" +
      "Aap is tarah pooch sakte hain:\n" +
      "• Institute ke baare me batao\n" +
      "• Admission kaise hoga?\n" +
      "• Fees kaise pay karni hai?\n" +
      "• Kaun kaun se courses hain?\n" +
      "• Attendance kaise check hogi?\n" +
      "• Parent portal me kya milega?\n" +
      "• Contact number kya hai?"
    );
  };

  const sendMessage = (text?: string) => {
    const finalText = text || message.trim();
    if (!finalText) return;

    setChat((prev) => [
      ...prev,
      { from: "user", text: finalText },
      { from: "ai", text: getReply(finalText) },
    ]);

    setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-900 text-white shadow-2xl hover:bg-indigo-800"
      >
        <Bot size={30} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 p-4 md:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-indigo-900 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-yellow-400 p-2 text-indigo-900">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2 className="font-black">Gyanshala AI Assistant</h2>
                  <p className="text-xs font-bold text-indigo-200">
                    Online Help Desk
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b bg-slate-50 p-4">
              <QuickButton
                icon={GraduationCap}
                text="Admission"
                onClick={() => sendMessage("Admission kaise hoga?")}
              />

              <QuickButton
                icon={IndianRupee}
                text="Fees"
                onClick={() => sendMessage("Fees kaise pay karni hai?")}
              />

              <QuickButton
                icon={CalendarCheck}
                text="Attendance"
                onClick={() => sendMessage("Attendance kaise check hogi?")}
              />

              <QuickButton
                icon={MessageCircle}
                text="Contact"
                onClick={() => sendMessage("Contact number kya hai?")}
              />
            </div>

            <div className="h-80 space-y-3 overflow-y-auto bg-slate-100 p-4">
              {chat.map((item, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl p-3 text-sm font-bold ${
                    item.from === "user"
                      ? "ml-auto bg-indigo-900 text-white"
                      : "bg-white text-slate-800"
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2 border-t bg-white p-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Type your question..."
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={() => sendMessage()}
                className="rounded-2xl bg-indigo-900 px-4 text-white hover:bg-indigo-800"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuickButton({
  icon: Icon,
  text,
  onClick,
}: {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl bg-white p-3 text-xs font-black text-indigo-900 shadow-sm hover:bg-indigo-50"
    >
      <Icon size={16} />
      {text}
    </button>
  );
}