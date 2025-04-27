import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import ClassForm from './ClassForm';
import api from '../services/api';

const AllClasses = () => {
  const { theme } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/v1/classes');
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
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`p-6 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          All Classes
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className={`px-4 py-2 rounded-lg flex items-center ${
            theme === 'dark'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <FiPlus className="mr-2" /> Add Class
        </button>
      </div>

      {showForm && (
        <ClassForm 
          onClose={() => {
            setShowForm(false);
            setSelectedClass(null);
          }}
          onSuccess={fetchClasses}
          initialData={selectedClass}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Class Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Sections</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className="px-6 py-4">{cls.class_name}</td>
                <td className="px-6 py-4">
                  {cls.sections.map((section) => (
                    <span 
                      key={section.id}
                      className={`mr-2 px-2 py-1 rounded-md ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
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
                    className={`p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'text-indigo-400 hover:bg-gray-700' 
                        : 'text-indigo-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteClass(cls.id)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllClasses;