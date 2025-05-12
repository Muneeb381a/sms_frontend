import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  FiUsers,
  FiBook,
  FiCheckCircle,
  FiActivity,
  FiCalendar,
  FiBarChart2,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import axios from "axios";
import Loader from "./Loader";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChart, setSelectedChart] = useState("students");

  const studentGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Student Growth",
        data: [65, 78, 66, 89, 96, 115],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const classDistributionData = {
    labels: ["Math", "Science", "History", "English", "Arts"],
    datasets: [
      {
        label: "Students per Class",
        data: [45, 38, 32, 28, 22],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const [studentsRes, classesRes, attendanceRes] = await Promise.all([
          axios.get("https://sms-backend-five.vercel.app/api/v1/students"),
          axios.get("https://sms-backend-five.vercel.app/api/v1/classes"),
          axios.get("https://sms-backend-five.vercel.app/api/v1/attendance/today"),
        ]);

        // Fetch total students for class_id: 1 separately if not in students response
        const totalStudentsRes = await axios.get(
          "https://sms-backend-five.vercel.app/api/v1/students",
        );

        setStats([
          {
            title: "Total Students",
            value: studentsRes.data.data.length,
            change: "+12%", // TODO: Replace with dynamic data
            icon: <FiUsers className="w-6 h-6" />,
            color: "indigo",
            trend: "up",
          },
          {
            title: "Active Classes",
            value: classesRes.data.data.length,
            change: "+3 new", // TODO: Replace with dynamic data
            icon: <FiBook className="w-6 h-6" />,
            color: "emerald",
            trend: "up",
          },
          {
            title: "Today's Attendance",
            value: `${attendanceRes.data.percentage.toFixed(2)}%`,
            change: `${
              attendanceRes.data.data.filter(
                (record) => record.status === "present"
              ).length
            }/${totalStudentsRes.data.data.length} present`,
            icon: <FiCheckCircle className="w-6 h-6" />,
            color: "amber",
            trend: attendanceRes.data.percentage >= 50 ? "up" : "down",
          },
        ]);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
        setError(
          `Failed to load dashboard data: ${
            err.response?.data?.error || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "2023-08-25",
      time: "14:00",
    },
    { id: 2, title: "Science Fair", date: "2023-09-01", time: "10:00" },
    { id: 3, title: "Sports Day", date: "2023-09-05", time: "09:00" },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Dashboard Overview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedChart("students")}
              className={`px-4 py-2 rounded-lg ${
                selectedChart === "students"
                  ? theme === "dark"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-600"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setSelectedChart("classes")}
              className={`px-4 py-2 rounded-lg ${
                selectedChart === "classes"
                  ? theme === "dark"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 text-emerald-600"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-600"
              }`}
            >
              Classes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all duration-300 hover:shadow-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
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
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
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
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-100"
                  }`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className={`p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {selectedChart === "students"
                ? "Student Growth"
                : "Class Distribution"}
            </h3>
            <div className="h-64">
              {selectedChart === "students" ? (
                <Line
                  data={studentGrowthData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        grid: {
                          color: theme === "dark" ? "#374151" : "#e5e7eb",
                        },
                      },
                      y: {
                        grid: {
                          color: theme === "dark" ? "#374151" : "#e5e7eb",
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Bar
                  data={classDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        grid: {
                          color: theme === "dark" ? "#374151" : "#e5e7eb",
                        },
                      },
                      y: {
                        grid: {
                          color: theme === "dark" ? "#374151" : "#e5e7eb",
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          <div
            className={`p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiCalendar
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Upcoming Events
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {event.title}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(event.date).toLocaleDateString()} •{" "}
                        {event.time}
                      </p>
                    </div>
                    <FiStar
                      className={`w-5 h-5 ${
                        theme === "dark" ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`lg:col-span-2 p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-4">
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
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
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
                  <FiClock
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiBarChart2
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-amber-400" : "text-amber-600"
                }`}
              />
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Quick Stats
              </h3>
            </div>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Avg. Daily Attendance
                </p>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  89%
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Pending Assignments
                </p>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  24
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Staff Members
                </p>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  42
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
