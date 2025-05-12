import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  FiFileText,
  FiDownloadCloud,
  FiX,
  FiChevronsRight,
  FiChevronsLeft,
  FiUser,
  FiCalendar,
  FiBook,
  FiPhone,
  FiUserPlus,
  FiMapPin,
} from "react-icons/fi";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import Loader from "./Loader";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusLoading, setStatusLoading] = useState({}); // Track loading state per student
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return dateString
      ? new Date(dateString).toLocaleDateString(undefined, options)
      : "N/A";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/v1/students", {
          params: { page: currentPage },
        });
        if (response.data.status.toLowerCase() === "success") {
          const studentsData = Array.isArray(response.data.data)
            ? response.data.data
            : response.data.data?.students || [];
          setStudents(studentsData);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [currentPage]);

  const handleStatusChange = async (studentId, newStatus) => {
    console.log("Updating status for student:", studentId, "to:", newStatus); // Debug
    if (
      !window.confirm(
        `Are you sure you want to change the status to "${newStatus}"?`
      )
    ) {
      return;
    }
    setStatusLoading((prev) => ({ ...prev, [studentId]: true }));
    try {
      const response = await api.patch(
        `http://localhost:3500/api/v1/students/${studentId}/status`,
        {
          status: newStatus,
        }
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                student_status: newStatus,
                updated_at: response.data.data.updated_at,
              }
            : student
        )
      );
      setError(null); // Clear previous errors
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Student not found. Please refresh the list."
          : err.response?.status === 400
          ? "Invalid status value. Please select a valid status."
          : `Failed to update status: ${
              err.response?.data?.message || err.message
            }`;
      setError(errorMessage);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const StudentDetailModal = () => (
    <Dialog
      open={!!selectedStudent}
      onClose={() => setSelectedStudent(null)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-lg"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full max-w-3xl rounded-xl p-6 shadow-2xl transition-all ${
            theme === "dark"
              ? "bg-gray-900 border border-gray-800 text-gray-100"
              : "bg-white text-gray-900"
          }`}
        >
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-gray-700">
                <Dialog.Title className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FiUser className="w-6 h-6 text-blue-400" />
                  </div>
                  <span>Student Details</span>
                </Dialog.Title>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className={`p-1.5 rounded-full hover:bg-gray-800 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <div className="relative group group-hover:shadow-lg transition-shadow">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl">
                      <img
                        src={
                          selectedStudent.image_url || "/user-placeholder.svg"
                        }
                        alt="Student"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    {selectedStudent.disability && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">
                        Disability
                      </div>
                    )}
                  </div>

                  {selectedStudent.pdf_url && (
                    <div
                      className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() =>
                        window.open(selectedStudent.pdf_url, "_blank")
                      }
                    >
                      <div className="p-2 rounded-md bg-blue-500/20">
                        <FiFileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">PDF Document</p>
                        <p className="text-sm text-gray-500">
                          Click to view/download
                        </p>
                      </div>
                      <FiDownloadCloud className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem
                      label="Full Name"
                      value={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                      icon={<FiUser className="text-purple-400" />}
                    />
                    <DetailItem
                      label="Date of Birth"
                      value={formatDate(selectedStudent.dob)}
                      icon={<FiCalendar className="text-emerald-400" />}
                    />
                    <DetailItem
                      label="Class Information"
                      value={`${selectedStudent.class_name || "N/A"} • ${
                        selectedStudent.section_name || "N/A"
                      }`}
                      icon={<FiBook className="text-amber-400" />}
                    />
                    <DetailItem
                      label="Admission Date"
                      value={formatDate(selectedStudent.admission_date)}
                      icon={<FiCalendar className="text-cyan-400" />}
                    />
                    <DetailItem
                      label="Contact Information"
                      value={`${selectedStudent.whatsapp_number || "N/A"} / ${
                        selectedStudent.cell_number || "N/A"
                      }`}
                      icon={<FiPhone className="text-blue-400" />}
                    />
                    <DetailItem
                      label="Guardian"
                      value={`${selectedStudent.guardian_name || "N/A"} (${
                        selectedStudent.guardian_relationship || "N/A"
                      })`}
                      icon={<FiUserPlus className="text-pink-400" />}
                    />
                    <div className="md:col-span-2">
                      <DetailItem
                        label="Address"
                        value={`${
                          [
                            selectedStudent.address,
                            selectedStudent.city,
                            selectedStudent.province,
                          ]
                            .filter(Boolean)
                            .join(", ") || "N/A"
                        }`}
                        icon={<FiMapPin className="text-red-400" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const DetailItem = ({ label, value, icon }) => (
    <div
      className={`p-3 rounded-lg flex items-start gap-3 ${
        theme === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div className="p-2 rounded-md bg-opacity-20 backdrop-blur-sm">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div className="flex-1">
        <dt
          className={`text-xs font-semibold ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          } uppercase tracking-wide mb-1`}
        >
          {label}
        </dt>
        <dd
          className={`text-sm ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          } font-medium`}
        >
          {value || "N/A"}
        </dd>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  if (error)
    return (
      <div
        className={`p-4 m-4 rounded-xl ${
          theme === "dark" ? "bg-red-900/50" : "bg-red-50"
        } text-red-500`}
      >
        ⚠️ Error: {error}
      </div>
    );

  return (
    <div
      className={`p-6 max-w-7xl mx-auto ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <StudentDetailModal />

      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Student Management
          <span className="ml-2 text-lg text-blue-500">
            ({students.length})
          </span>
        </h1>
      </div>

      {students.length === 0 ? (
        <div
          className={`p-6 rounded-xl text-center ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <>
          <div
            className={`rounded-xl shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table className="w-full">
              <thead
                className={`border-b ${
                  theme === "dark" ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <tr>
                  {[
                    "Name",
                    "Class/Section",
                    "Contact",
                    "Admission",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className={`px-4 py-3 text-left text-sm font-medium ${
                        theme === "dark" ? "text-purple-400" : "text-gray-500"
                      } sticky top-0 ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b transition-colors ${
                      theme === "dark"
                        ? "border-blue-500 hover:bg-purple-900/50 text-purple-200"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {student.disability && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        <span className="font-medium">
                          {student.first_name} {student.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.class_name}
                      {student.section_name && (
                        <span className="text-blue-500 ml-1">
                          ({student.section_name})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.whatsapp_number || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(student.admission_date)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={student.student_status || "active"}
                        onChange={(e) =>
                          handleStatusChange(student.id, e.target.value)
                        }
                        disabled={statusLoading[student.id]}
                        className={`px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-200 border border-gray-600"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        } ${
                          statusLoading[student.id]
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="left">Left</option>
                        <option value="graduated">Graduated</option>
                        <option value="expelled">Expelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 transition-colors flex items-center gap-2"
                      >
                        <FiChevronsRight className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`mt-6 flex justify-between items-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 disabled:opacity-30"
                  : "hover:bg-gray-100 disabled:opacity-30"
              }`}
            >
              <FiChevronsLeft className="w-5 h-5" />
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700 disabled:opacity-30"
                  : "hover:bg-gray-100 disabled:opacity-30"
              }`}
            >
              Next
              <FiChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
