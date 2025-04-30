// CreateVoucher.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../services/fee-voucher-api";

export default function CreateVoucher() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createVoucher(studentId, dueDate);
      navigate(`/fees/vouchers/${studentId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Create New Fee Voucher
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full p-2 rounded border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
              required
            />
          </div>

          {error && (
            <div
              className={`p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-red-800 text-red-100"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-blue-500 hover:bg-blue-600"
              } ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating..." : "Create Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
