import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFeeType } from "../services/Feeapi";
import Loader from "./Loader";
import { useTheme } from "../context/ThemeContext";

export default function AddFee() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createFeeType(name);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create Fee Type</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/30"
                }`}
                required
              />
            </div>

            {error && (
              <div
                className={`p-4 text-sm rounded-lg ${
                  theme === "dark"
                    ? "bg-red-800/30 text-red-100"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } ${submitting ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Creating..." : "Create Fee Type"}
            </button>
          </form>
        </div>
      </div>

      {submitting && <Loader />}
    </div>
  );
}
