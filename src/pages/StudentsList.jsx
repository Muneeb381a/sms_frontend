import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
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
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
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
        console.log("API Response:", response.data);

        if (response.data.status.toLowerCase() === "success") {
          const studentsData = Array.isArray(response.data.data)
            ? response.data.data
            : response.data.data?.students || [];

          console.log("Extracted Students:", studentsData);
          setStudents(studentsData);
          setTotalPages(response.data.totalPages || 1);
        } else {
          throw new Error(
            `API returned unsuccessful status: ${response.data.status}`
          );
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage]);

  const StudentDetailModal = () => (
    <Dialog
      open={!!selectedStudent}
      onClose={() => setSelectedStudent(null)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full max-w-2xl rounded-lg p-6 shadow-lg ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-semibold">
                  Student Details
                </Dialog.Title>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center">
                  <img
                    src={
                      selectedStudent.image_url ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Student"
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                  />
                </div>

                <DetailItem
                  label="Full Name"
                  value={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                />
                <DetailItem
                  label="Date of Birth"
                  value={formatDate(selectedStudent.dob)}
                />
                <DetailItem
                  label="Class"
                  value={`${selectedStudent.class_name || "N/A"} (${
                    selectedStudent.section_name || "N/A"
                  })`}
                />
                <DetailItem
                  label="Admission Date"
                  value={formatDate(selectedStudent.admission_date)}
                />
                <DetailItem
                  label="Guardian"
                  value={`${selectedStudent.guardian_name || "N/A"} (${
                    selectedStudent.guardian_relationship || "N/A"
                  })`}
                />
                <DetailItem
                  label="Contact"
                  value={`${selectedStudent.whatsapp_number || "N/A"} / ${
                    selectedStudent.cell_number || "N/A"
                  }`}
                />
                <div className="col-span-2">
                  <DetailItem
                    label="Address"
                    value={`${selectedStudent.address || "N/A"}, ${
                      selectedStudent.city || "N/A"
                    }, ${selectedStudent.province || "N/A"}`}
                  />
                </div>
                <DetailItem
                  label="Disability"
                  value={selectedStudent.disability ? "Yes" : "No"}
                />
                <DetailItem
                  label="Academic Session"
                  value={selectedStudent.academic_session || "N/A"}
                />
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
      <dt
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`text-sm break-words ${
          theme === "dark" ? "text-gray-200" : "text-gray-900"
        }`}
      >
        {value || "N/A"}
      </dd>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg mx-4 my-8 ${
          theme === "dark"
            ? "bg-red-900 text-red-200"
            : "bg-red-50 text-red-700"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`p-6 max-w-6xl mx-auto ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <StudentDetailModal />

      <h2
        className={`text-2xl font-bold mb-6 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Student Management ({students.length})
      </h2>

      {students.length === 0 ? (
        <div
          className={`p-4 rounded-lg text-center ${
            theme === "dark"
              ? "bg-blue-900 text-blue-200"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          No students found
        </div>
      ) : (
        <>
          <div
            className={`overflow-x-auto rounded-lg border shadow-sm ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <table
              className={`min-w-full divide-y ${
                theme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead
                className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
              >
                <tr>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Class/Section
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Contact
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Admission Date
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  theme === "dark"
                    ? "bg-gray-900 divide-gray-700"
                    : "bg-white divide-gray-200"
                }`}
              >
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-4 py-3 text-sm ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        {student.disability && (
                          <span
                            className="w-2 h-2 bg-red-500 rounded-full mr-2"
                            title="Has disability"
                          />
                        )}
                        {`${student.first_name} ${student.last_name}`}
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {student.class_name || "N/A"}
                      {student.section_name && (
                        <span
                          className={`ml-2 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          ({student.section_name})
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm hidden md:table-cell ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {student.whatsapp_number || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {formatDate(student.admission_date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.student_status.toLowerCase() === "active"
                            ? theme === "dark"
                              ? "bg-green-800 text-green-200"
                              : "bg-green-100 text-green-800"
                            : student.student_status.toLowerCase() ===
                              "inactive"
                            ? theme === "dark"
                              ? "bg-red-800 text-red-200"
                              : "bg-red-100 text-red-800"
                            : theme === "dark"
                            ? "bg-yellow-800 text-yellow-200"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.student_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`mt-6 flex justify-between items-center ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
                  : "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
                  : "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;
