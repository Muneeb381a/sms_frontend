// src/pages/FeeVouchers.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Loader from "./Loader";
import PaymentModal from "../components/PaymentModal";
import FeeItemModal from "../components/FeeItemModal";
import api from "../services/fee-voucher-api";
import axios from "axios";

export default function FeeVouchers() {
  const { theme } = useTheme();
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeeItemModal, setShowFeeItemModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVouchers = async (page = 1) => {
    try {
      const { data } = await api.getStudentVouchers(studentId, page);
      setVouchers(data.data);
      setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
      setCurrentPage(data.pagination.page);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [studentId]);

  const handleDelete = async (voucherId) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await api.delete(`/fees/${voucherId}`);
        setVouchers(vouchers.filter((v) => v.id !== voucherId));
      } catch (err) {
        setError(err.response?.data?.error || "Delete failed");
      }
    }
  };

  const handlePayment = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPaymentModal(true);
  };

  const handleAddFeeItem = (voucher) => {
    setSelectedVoucher(voucher);
    setShowFeeItemModal(true);
  };

  const generatePDF = async (voucherId) => {
    try {
      const response = await api.get(`/fees/${voucherId}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `voucher-${voucherId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError("Failed to generate PDF");
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Fee Vouchers
          </h1>
          <Link
            to={`/fees/vouchers/new/${studentId}`}
            className={`px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Create New Voucher
          </Link>
        </div>

        {error && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              theme === "dark"
                ? "bg-red-800 text-red-100"
                : "bg-red-100 text-red-800"
            }`}
          >
            {error}
          </div>
        )}

        <div
          className={`rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6">
            <div
              className={`grid grid-cols-6 gap-4 font-medium border-b pb-4 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div>Due Date</div>
              <div>Total Amount</div>
              <div>Paid Amount</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className={`grid grid-cols-6 gap-4 items-center py-4 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } border-b last:border-b-0`}
              >
                <div>{new Date(voucher.due_date).toLocaleDateString()}</div>
                <div>${voucher.total_amount}</div>
                <div>${voucher.paid_amount}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      voucher.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : voucher.status === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {voucher.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/vouchers/${voucher.id}`)}
                    className={`px-3 py-1 rounded ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => generatePDF(voucher.id)}
                    className={`px-3 py-1 rounded ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(voucher.id)}
                    className={`px-3 py-1 rounded ${
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

            <div
              className={`pt-4 flex justify-between items-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <button
                onClick={() => fetchVouchers(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchVouchers(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {showPaymentModal && (
          <PaymentModal
            voucher={selectedVoucher}
            onClose={() => setShowPaymentModal(false)}
            theme={theme}
          />
        )}

        {showFeeItemModal && (
          <FeeItemModal
            voucher={selectedVoucher}
            onClose={() => setShowFeeItemModal(false)}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
