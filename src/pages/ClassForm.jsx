import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const ClassForm = ({ onClose, onSuccess, initialData }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    class_name: initialData?.class_name || '',
    sections: initialData?.sections?.map(s => s.section_name) || ['A'],
    sections_to_delete: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        class_name: formData.class_name,
        sections: formData.sections
      };

      if (initialData) {
        payload.sections_to_delete = formData.sections_to_delete;
        await api.put(`/v1/classes/${initialData.id}`, payload);
      } else {
        await api.post('/v1/classes', payload);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, '']
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
      sections_to_delete: [...prev.sections_to_delete, prev.sections[index]]
    }));
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
      <div className={`p-6 rounded-lg w-full max-w-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {initialData ? 'Edit Class' : 'Add New Class'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Class Name
            </label>
            <input
              type="text"
              value={formData.class_name}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              className={`w-full p-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } border`}
              required
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sections
            </label>
            {formData.sections.map((section, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={section}
                  onChange={(e) => {
                    const newSections = [...formData.sections];
                    newSections[index] = e.target.value;
                    setFormData({ ...formData, sections: newSections });
                  }}
                  className={`flex-1 p-2 rounded-lg mr-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-800 border-gray-300'
                  } border`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' 
                      ? 'text-red-400 hover:bg-gray-700' 
                      : 'text-red-600 hover:bg-gray-100'
                  }`}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSection}
              className={`mt-2 px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Add Section
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading 
                  ? 'bg-indigo-400' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;