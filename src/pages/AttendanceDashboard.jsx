import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAttendance,
  deleteAttendanceRecord,
} from "../services/attendanceApi";
import Pagination from "../components/Pagination";
import AttendanceTable from "../components/AttendanceTable";
import Notification from "../components/Notification";

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);

  const limit = 10;

  useEffect(() => {
    loadAttendance();
  }, [currentPage]);

  const loadAttendance = async () => {
    try {
      const data = await fetchAttendance(currentPage, limit);
      setAttendance(data?.records || []); // Add nullish coalescing
    } catch (error) {
      console.error("Error loading attendance:", error);
      setAttendance([]); // Reset to empty array on error
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendanceRecord(id);
      showNotification("success", "Record deleted successfully");
      loadAttendance();
    } catch (error) {
      showNotification("error", "Failed to delete record");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Attendance Management
        </h1>
        <Link
          to="/mark-attendance"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mark Class Attendance
        </Link>
      </div>

      <Notification notification={notification} />

      <AttendanceTable attendance={attendance} onDelete={handleDelete} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalPages / limit)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AttendanceDashboard;
