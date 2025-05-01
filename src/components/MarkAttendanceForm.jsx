import { useState, useEffect } from "react";
import { useClasses, useStudents } from "../hooks/apiHooks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { markClassAttendance } from "../services/attendanceApi";
import Notification from "./Notification";

const MarkAttendanceForm = () => {
  const [classId, setClassId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [notification, setNotification] = useState(null);
  const { classes, loading: classesLoading } = useClasses();
  const { students } = useStudents(classId);

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
    }
  }, [students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setNotification({ type: "error", message: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Mark Class Attendance</h2>
      <Notification notification={notification} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              disabled={classesLoading}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <DatePicker
              selected={attendanceDate}
              onChange={(date) => setAttendanceDate(date)}
              className="w-full p-2 border rounded-md"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
        </div>

        {students.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Students Attendance</h3>
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="font-medium">
                    {student.first_name} {student.last_name}
                  </span>
                  <select
                    value={attendanceRecords[student.id] || "present"}
                    onChange={(e) =>
                      handleStatusChange(student.id, e.target.value)
                    }
                    className="px-3 py-1 border rounded-md"
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
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default MarkAttendanceForm;
