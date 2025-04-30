import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeeTypes, deleteFeeType } from "../services/Feeapi";
import Loader from "./Loader";
import { useTheme } from "../context/ThemeContext";

export default function AllFee() {
  const { theme } = useTheme();
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      const { data } = await getFeeTypes();
      setFeeTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteFeeType(id);
        setFeeTypes(feeTypes.filter((ft) => ft.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || "Delete failed");
      }
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div
        className={`p-4 mb-4 text-sm ${
          theme === "dark"
            ? "bg-red-800 text-red-100"
            : "bg-red-100 text-red-800"
        } rounded-lg`}
      >
        {error}
      </div>
    );

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Fee Types List</h1>
          <Link
            to="/add"
            className={`px-4 py-2 rounded-lg font-medium ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Create New
          </Link>
        </div>

        <div
          className={`rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="px-6 py-4">
            <div className="grid grid-cols-3 gap-4 font-medium border-b pb-4">
              <div>Name</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>

            {feeTypes.map((ft) => (
              <div
                key={ft.id}
                className={`grid grid-cols-3 gap-4 items-center py-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } transition-colors border-b last:border-b-0`}
              >
                <div className="font-medium">{ft.name}</div>
                <div>{new Date(ft.created_at).toLocaleString()}</div>
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/edit/${ft.id}`}
                    className={`px-3 py-2 text-xs font-medium rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ft.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg ${
                      theme === "dark"
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
