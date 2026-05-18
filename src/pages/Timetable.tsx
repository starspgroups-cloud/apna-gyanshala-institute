export default function Timetable() {

  const timetable = [
    {
      day: "Monday",
      subject: "Mathematics",
      teacher: "Rahul Sir",
      time: "10:00 AM - 11:00 AM",
    },

    {
      day: "Tuesday",
      subject: "Science",
      teacher: "Priya Ma'am",
      time: "11:00 AM - 12:00 PM",
    },

    {
      day: "Wednesday",
      subject: "English",
      teacher: "Ankit Sir",
      time: "12:00 PM - 1:00 PM",
    },

    {
      day: "Thursday",
      subject: "Computer",
      teacher: "Rohit Sir",
      time: "1:00 PM - 2:00 PM",
    },

    {
      day: "Friday",
      subject: "GK + Current Affairs",
      teacher: "Sonia Ma'am",
      time: "2:00 PM - 3:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-black text-indigo-900">
            Student Timetable
          </h1>

          <p className="text-slate-600 mt-2">
            Weekly class schedule and routine
          </p>
        </div>

        <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Download PDF
        </button>

      </div>

      {/* Timetable Cards */}
      <div className="grid gap-5 mt-8">

        {timetable.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {item.subject}
              </h2>

              <p className="text-slate-500 mt-1">
                {item.teacher}
              </p>
            </div>

            <div className="flex flex-col md:items-end">

              <span className="font-bold text-indigo-700 text-lg">
                {item.day}
              </span>

              <span className="text-slate-600 mt-1">
                {item.time}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}