export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div>
        <h1 className="text-3xl font-black text-indigo-900">
          Institute Analytics
        </h1>

        <p className="text-slate-600 mt-2">
          Real-time institute overview and performance summary
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-slate-700">
            Total Students
          </h2>
          <p className="text-4xl font-black text-indigo-700 mt-4">
            1,250
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-slate-700">
            Teachers
          </h2>
          <p className="text-4xl font-black text-green-600 mt-4">
            45
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-slate-700">
            Active Courses
          </h2>
          <p className="text-4xl font-black text-orange-500 mt-4">
            18
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-slate-700">
            Monthly Revenue
          </h2>
          <p className="text-4xl font-black text-emerald-600 mt-4">
            ₹2.4L
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Attendance Overview
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Class 10</span>
                <span className="font-bold text-indigo-700">89%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-indigo-600 h-3 rounded-full w-[89%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Class 12</span>
                <span className="font-bold text-green-600">93%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full w-[93%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Computer Batch</span>
                <span className="font-bold text-orange-500">86%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-orange-400 h-3 rounded-full w-[86%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Fees Collection
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between bg-slate-100 p-4 rounded-xl">
              <span className="font-semibold">Collected</span>
              <span className="font-bold text-green-600">₹2,40,000</span>
            </div>

            <div className="flex justify-between bg-slate-100 p-4 rounded-xl">
              <span className="font-semibold">Pending</span>
              <span className="font-bold text-red-500">₹38,500</span>
            </div>

            <div className="flex justify-between bg-slate-100 p-4 rounded-xl">
              <span className="font-semibold">This Month</span>
              <span className="font-bold text-indigo-700">₹1,15,000</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}