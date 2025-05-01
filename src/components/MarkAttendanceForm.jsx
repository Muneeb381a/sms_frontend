import { useState, useEffect } from "react";
import { useClasses, useStudents } from "../hooks/apiHooks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { markClassAttendance } from "../services/attendanceApi";
import Notification from "./Notification";
import { useTheme } from "../context/ThemeContext";

const MarkAttendanceForm = () => {
  const { theme } = useTheme();
  const [classId, setClassId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [notification, setNotification] = useState(null);
  const {
    classes,
    loading: classesLoading,
    error: classesError,
  } = useClasses();
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudents(classId);

  useEffect(() => {
    if (students.length > 0) {
      const initialRecords = students.reduce(
        (acc, student) => ({
          ...acc,
          [student.id]: "present",
        }),
        {}
      );
      setAttendanceRecords(initialRecords);
    } else {
      setAttendanceRecords({});
    }
  }, [students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || Object.keys(attendanceRecords).length === 0) {
      setNotification({
        type: "error",
        message: "Please select a class and ensure students are loaded",
      });
      return;
    }

    try {
      const formattedRecords = Object.entries(attendanceRecords).map(
        ([student_id, status]) => ({
          student_id: parseInt(student_id),
          status,
        })
      );

      await markClassAttendance({
        class_id: parseInt(classId),
        attendance_date: attendanceDate.toISOString().split("T")[0],
        attendance_records: formattedRecords,
      });

      setNotification({
        type: "success",
        message: "Attendance marked successfully!",
      });
      setTimeout(() => (window.location = "/"), 2000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.error || error.message,
      });
    }
  };

  // Ensure classes is an array
  const classesArray = Array.isArray(classes) ? classes : [];

  return (
    <div
      className={`max-w-4xl mx-auto p-6 rounded-lg shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-6">Mark Class Attendance</h2>
      <Notification notification={notification} />

      {classesLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            <p className="text-sm font-medium">Loading...</p>
          </div>
        </div>
      )}

      {classesError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          {classesError}
        </div>
      )}

      {!classesLoading && !classesError && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                required
                disabled={classesLoading}
              >
                <option value="">Select a class</option>
                {classesArray.length === 0 ? (
                  <option value="" disabled>
                    No classes available
                  </option>
                ) : (
                  classesArray.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.section}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date
              </label>
              <DatePicker
                selected={attendanceDate}
                onChange={(date) => setAttendanceDate(date)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </div>

          {studentsLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div
                className={`flex flex-col items-center space-y-4 p-6 rounded-lg shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                <p className="text-sm font-medium">Loading students...</p>
              </div>
            </div>
          )}

          {studentsError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
              {studentsError}
            </div>
          )}

          {students.length > 0 && !studentsLoading && !studentsError && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Students Attendance</h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {student.first_name} {student.last_name}
                    </span>
                    <select
                      value={attendanceRecords[student.id] || "present"}
                      onChange={(e) =>
                        handleStatusChange(student.id, e.target.value)
                      }
                      className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={
              classesLoading || studentsLoading || students.length === 0
            }
          >
            Submit Attendance
          </button>
        </form>
      )}
    </div>
  );
};

export default MarkAttendanceForm;
