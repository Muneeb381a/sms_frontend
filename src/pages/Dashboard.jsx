import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FiUsers, FiBook, FiCheckCircle, FiActivity } from "react-icons/fi";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import axios from "axios";
import Loader from './Loader';

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students and classes data
        const [studentsRes, classesRes] = await Promise.all([
          axios.get('http://localhost:3500/api/v1/students'),
          axios.get('http://localhost:3500/api/v1/classes')
        ]);

        setStats([
          {
            title: "Total Students",
            value: studentsRes.data.data.length,
            change: "+12%", // You can calculate real change if you have historical data
            icon: <FiUsers className="w-6 h-6" />,
            color: "indigo",
            trend: "up",
          },
          {
            title: "Active Classes",
            value: classesRes.data.data.length,
            change: "+3 new", // Update with real data if available
            icon: <FiBook className="w-6 h-6" />,
            color: "emerald",
            trend: "up",
          },
          {
            title: "Attendance",
            value: "92%",
            change: "+2%",
            icon: <FiCheckCircle className="w-6 h-6" />,
            color: "amber",
            trend: "up",
          },
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const activities = [
    { id: 1, title: "New student enrolled", time: "10m ago", type: "student" },
    {
      id: 2,
      title: "Math assignment submitted",
      time: "1h ago",
      type: "assignment",
    },
    {
      id: 3,
      title: "Class schedule updated",
      time: "2h ago",
      type: "schedule",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-8 ${
          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            } shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    theme === "dark"
                      ? `text-${stat.color}-400`
                      : `text-${stat.color}-600`
                  }`}
                >
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <RiArrowUpSFill
                      className={`text-${stat.color}-500 w-5 h-5`}
                    />
                  ) : (
                    <RiArrowDownSFill
                      className={`text-${stat.color}-500 w-5 h-5`}
                    />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      theme === "dark"
                        ? `text-${stat.color}-400`
                        : `text-${stat.color}-600`
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark"
                    ? `bg-${stat.color}-900/30 text-${stat.color}-400`
                    : `bg-${stat.color}-100 text-${stat.color}-600`
                }`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className={`rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <FiActivity
              className={`w-6 h-6 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Recent Activity
            </h3>
          </div>
        </div>

        <div className="p-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  activity.type === "student"
                    ? "bg-indigo-500"
                    : activity.type === "assignment"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {activity.title}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
          <button
            className={`w-full mt-4 text-sm font-medium ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            } transition-colors`}
          >
            View all activity →
          </button>
        </div>
      </div>
    </div>
  );
}
