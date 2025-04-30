import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  FiEdit,
  FiTrash,
  FiPlus,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import api from "../services/api";
import Loader from "./Loader";
import ClassForm from "./ClassForm";

const AllClasses = () => {
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // Filter and sort classes based on search term and sort order
    let result = [...classes];
    if (searchTerm) {
      result = result.filter((cls) =>
        cls.class_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
      const nameA = a.class_name.toLowerCase();
      const nameB = b.class_name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setFilteredClasses(result);
  }, [classes, searchTerm, sortOrder]);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/v1/classes");
      setClasses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteClass = async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
      setShowDeleteDialog(false);
      setClassToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const DeleteConfirmationDialog = () => (
    <Transition show={showDeleteDialog}>
      <Dialog
        onClose={() => setShowDeleteDialog(false)}
        className="relative z-50"
      >
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`w-full max-w-md rounded-lg p-6 shadow-xl ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <Dialog.Title className="text-lg font-semibold">
                Confirm Deletion
              </Dialog.Title>
              <p
                className={`mt-2 text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to delete this class? This action cannot
                be undone.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className={`px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteClass(classToDelete)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );

  if (loading) return <Loader />;
  if (error)
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

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              All Classes ({filteredClasses.length})
            </h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="relative">
                <FiSearch
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className={`px-4 py-2 rounded-lg flex items-center bg-gradient-to-r ${
                  theme === "dark"
                    ? "from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white"
                    : "from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white"
                } shadow-md transition-all duration-300`}
              >
                <FiPlus className="mr-2" /> Add Class
              </button>
            </div>
          </div>

          {showForm && (
            <Transition show={showForm}>
              <div
                className="fixed inset-0 bg-black/30 z-40"
                aria-hidden="true"
              />
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                  <ClassForm
                    onClose={() => {
                      setShowForm(false);
                      setSelectedClass(null);
                    }}
                    onSuccess={fetchClasses}
                    initialData={selectedClass}
                    theme={theme}
                  />
                </div>
              </Transition.Child>
            </Transition>
          )}

          <DeleteConfirmationDialog />

          {filteredClasses.length === 0 ? (
            <div
              className={`p-6 text-center rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              No classes found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <button
                        onClick={toggleSortOrder}
                        className="flex items-center"
                      >
                        Class Name
                        {sortOrder === "asc" ? (
                          <FiArrowUp className="ml-2" />
                        ) : (
                          <FiArrowDown className="ml-2" />
                        )}
                      </button>
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Sections
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls.id}
                      className={`border-b transition-all duration-200 ${
                        theme === "dark"
                          ? "border-gray-700 hover:bg-gray-750"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 text-sm ${
                          theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {cls.class_name}
                      </td>
                      <td className="px-6 py-4">
                        {cls.sections.map((section) => (
                          <span
                            key={section.id}
                            className={`inline-block mr-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              theme === "dark"
                                ? "bg-indigo-800 text-indigo-200 hover:bg-indigo-700"
                                : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                            }`}
                          >
                            {section.section_name}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 flex space-x-4">
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setShowForm(true);
                          }}
                          className={`p-2 rounded-full relative group ${
                            theme === "dark"
                              ? "text-indigo-400 hover:bg-gray-700"
                              : "text-indigo-600 hover:bg-indigo-100"
                          }`}
                          title="Edit Class"
                        >
                          <FiEdit />
                          <span
                            className={`absolute hidden group-hover:block text-xs px-2 py-1 rounded-md -top-8 left-1/2 transform -translate-x-1/2 ${
                              theme === "dark"
                                ? "bg-gray-600 text-white"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setClassToDelete(cls.id);
                            setShowDeleteDialog(true);
                          }}
                          className={`p-2 rounded-full relative group ${
                            theme === "dark"
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-red-100"
                          }`}
                          title="Delete Class"
                        >
                          <FiTrash />
                          <span
                            className={`absolute hidden group-hover:block text-xs px-2 py-1 rounded-md -top-8 left-1/2 transform -translate-x-1/2 ${
                              theme === "dark"
                                ? "bg-gray-600 text-white"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllClasses;
