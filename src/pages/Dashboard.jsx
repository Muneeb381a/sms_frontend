export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-indigo-600">1,245</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 mb-2">Active Classes</h3>
          <p className="text-3xl font-bold text-emerald-600">32</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 mb-2">Today's Attendance</h3>
          <p className="text-3xl font-bold text-amber-600">92%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {/* Activity timeline component */}
      </div>
    </div>
  );
}
